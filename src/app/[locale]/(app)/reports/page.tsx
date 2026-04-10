import { getTranslations } from "next-intl/server";

import { FeaturePanel } from "@/components/shared/feature-panel";
import { PageIntro } from "@/components/shared/page-intro";
import { StatusBadge } from "@/components/shared/status-badge";
import { Badge } from "@/components/ui/badge";
import { DashboardKpiGrid } from "@/features/dashboard/dashboard-kpi-grid";
import { ReportsBreakdownCard } from "@/features/reports/reports-breakdown-card";
import { ReportsHighlightsCard } from "@/features/reports/reports-highlights-card";
import { ReportsRevenueChart } from "@/features/reports/reports-revenue-chart";
import type { AppLocale } from "@/lib/constants/site";
import { formatCurrency, formatPercent } from "@/lib/formatting";
import { fabricLogService } from "@/server/services/fabriclog-service";

type ReportsPageProps = {
  params: Promise<{ locale: string }>;
};

const paymentToneMap = {
  paid: "bg-emerald-500",
  partial: "bg-amber-500",
  pending: "bg-slate-500",
  overdue: "bg-rose-500",
} as const;

const orderToneMap = {
  new: "bg-slate-500",
  sampling: "bg-amber-500",
  production: "bg-sky-500",
  ready: "bg-emerald-500",
  dispatched: "bg-violet-500",
} as const;

export default async function ReportsPage({ params }: ReportsPageProps) {
  const { locale } = await params;
  const appLocale = locale as AppLocale;
  const t = await getTranslations({ locale, namespace: "Reports" });
  const tCommon = await getTranslations({ locale, namespace: "Common" });
  const tOrderStatuses = await getTranslations({
    locale,
    namespace: "Statuses.order",
  });
  const tPaymentStatuses = await getTranslations({
    locale,
    namespace: "Statuses.payment",
  });
  const tTiers = await getTranslations({ locale, namespace: "Statuses.tiers" });

  const overview = fabricLogService.getReportsOverview();

  const maxPaymentValue = Math.max(
    ...overview.paymentBreakdown.map((item) =>
      item.status === "paid" ? item.totalAmount : item.openAmount
    ),
    1
  );
  const maxOrderCount = Math.max(
    ...overview.orderStatusOverview.map((item) => item.count),
    1
  );

  return (
    <div className="page-grid">
      <PageIntro
        badge={tCommon("demoBadge")}
        title={t("title")}
        description={t("description")}
      />

      <DashboardKpiGrid
        className="xl:grid-cols-4"
        metrics={[
          {
            label: t("cards.totalRevenue"),
            value: formatCurrency(overview.summary.totalRevenue, appLocale),
            hint: t("cards.totalRevenueHint"),
            trend: 12,
            tone: "success",
          },
          {
            label: t("cards.collectionRate"),
            value: formatPercent(overview.summary.collectionRate, appLocale),
            hint: t("cards.collectionRateHint"),
            trend: 5,
            tone: "neutral",
          },
          {
            label: t("cards.overdueExposure"),
            value: formatCurrency(overview.summary.overdueExposure, appLocale),
            hint: t("cards.overdueExposureHint"),
            trend: -4,
            tone: "critical",
          },
          {
            label: t("cards.activeOrders"),
            value: `${overview.summary.activeOrders}`,
            hint: t("cards.activeOrdersHint"),
            trend: 7,
            tone: "warning",
          },
        ]}
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.38fr)_minmax(320px,0.92fr)] xl:items-start">
        <FeaturePanel
          title={t("revenue.title")}
          description={t("revenue.description")}
        >
          <ReportsRevenueChart
            data={overview.revenueTrend}
            locale={appLocale}
          />
        </FeaturePanel>

        <div className="section-stack">
          <ReportsBreakdownCard
            title={t("breakdowns.paymentsTitle")}
            description={t("breakdowns.paymentsDescription")}
            items={overview.paymentBreakdown.map((item) => ({
              id: item.status,
              label: tPaymentStatuses(item.status),
              countLabel: t("breakdowns.invoiceCount", { count: item.count }),
              toneClassName: paymentToneMap[item.status],
              valueLabel: formatCurrency(
                item.status === "paid" ? item.totalAmount : item.openAmount,
                appLocale
              ),
              width:
                ((item.status === "paid" ? item.totalAmount : item.openAmount) /
                  maxPaymentValue) *
                100,
            }))}
          />

          <ReportsBreakdownCard
            title={t("breakdowns.ordersTitle")}
            description={t("breakdowns.ordersDescription")}
            items={overview.orderStatusOverview.map((item) => ({
              id: item.status,
              label: tOrderStatuses(item.status),
              countLabel: t("breakdowns.orderCount", { count: item.count }),
              toneClassName: orderToneMap[item.status],
              valueLabel: formatCurrency(item.totalAmount, appLocale),
              width: (item.count / maxOrderCount) * 100,
            }))}
          />
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(300px,0.95fr)] xl:items-start">
        <ReportsHighlightsCard
          title={t("highlights.customersTitle")}
          description={t("highlights.customersDescription")}
          items={overview.customerHighlights.map((item) => ({
            id: item.id,
            title: item.customerName,
            subtitle: t("highlights.customerOrders", { count: item.orderCount }),
            metric: formatCurrency(item.invoiceValue, appLocale),
            detail: (
              <div className="flex items-center justify-between gap-3">
                <StatusBadge status={item.tier} label={tTiers(item.tier)} />
                <p className="text-xs text-muted-foreground">
                  {t("highlights.outstandingCue", {
                    amount: formatCurrency(item.outstandingAmount, appLocale),
                  })}
                </p>
              </div>
            ),
          }))}
        />

        <ReportsHighlightsCard
          title={t("highlights.ordersTitle")}
          description={t("highlights.ordersDescription")}
          items={overview.orderHighlights.map((item) => ({
            id: item.id,
            title: item.referenceCode,
            subtitle: `${item.customerName} / ${item.itemSummary}`,
            metric: formatCurrency(item.amount, appLocale),
            detail: (
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge
                  status={item.status}
                  label={tOrderStatuses(item.status)}
                />
                <StatusBadge
                  status={item.paymentStatus}
                  label={tPaymentStatuses(item.paymentStatus)}
                />
              </div>
            ),
          }))}
        />

        <FeaturePanel
          title={t("notes.title")}
          description={t("notes.description")}
          action={
            <Badge className="bg-primary/10 text-primary hover:bg-primary/10">
              {t("badges.demoReady")}
            </Badge>
          }
        >
          <div className="section-stack">
            <div className="grid gap-3">
              <div className="panel-secondary px-4 py-4">
                <p className="subtle-label text-muted-foreground">
                  {t("notes.metrics.activeCustomers")}
                </p>
                <p className="mt-2 text-xl font-semibold">
                  {overview.summary.activeCustomers}
                </p>
              </div>
              <div className="panel-secondary px-4 py-4">
                <p className="subtle-label text-muted-foreground">
                  {t("notes.metrics.pendingInvoices")}
                </p>
                <p className="mt-2 text-xl font-semibold">
                  {overview.summary.pendingInvoices}
                </p>
              </div>
              <div className="panel-secondary px-4 py-4">
                <p className="subtle-label text-muted-foreground">
                  {t("notes.metrics.lowStockReferences")}
                </p>
                <p className="mt-2 text-xl font-semibold">
                  {overview.summary.lowStockReferences}
                </p>
              </div>
            </div>

            <div className="panel-inset border-dashed px-5 py-5">
              <p className="text-sm font-semibold">{t("notes.panelTitle")}</p>
              <p className="body-copy mt-2 text-sm text-muted-foreground">
                {t("notes.panelDescription")}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Badge variant="outline">{t("notes.items.profitability")}</Badge>
                <Badge variant="outline">{t("notes.items.regional")}</Badge>
                <Badge variant="outline">{t("notes.items.inventory")}</Badge>
              </div>
            </div>
          </div>
        </FeaturePanel>
      </div>
    </div>
  );
}
