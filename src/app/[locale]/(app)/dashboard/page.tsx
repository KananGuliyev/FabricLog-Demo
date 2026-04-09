import { getTranslations } from "next-intl/server";

import { MetricCard } from "@/components/shared/metric-card";
import { PageIntro } from "@/components/shared/page-intro";
import { StatusBadge } from "@/components/shared/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DashboardPaymentChart,
  DashboardPipelineChart,
  DashboardRevenueChart,
} from "@/features/dashboard/dashboard-charts";
import type { AppLocale } from "@/lib/constants/site";
import { formatCurrency, formatPercent } from "@/lib/formatting";
import { fabricLogService } from "@/server/services/fabriclog-service";

type DashboardPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function DashboardPage({ params }: DashboardPageProps) {
  const { locale } = await params;
  const appLocale = locale as AppLocale;
  const t = await getTranslations({ locale, namespace: "Dashboard" });
  const tCommon = await getTranslations({ locale, namespace: "Common" });
  const tInsights = await getTranslations({ locale, namespace: "Insights" });
  const tStatuses = await getTranslations({ locale, namespace: "Statuses.order" });

  const summary = fabricLogService.getDashboardSummary();
  const orders = fabricLogService.getOrders().slice(0, 4);
  const customers = fabricLogService.getCustomers();

  return (
    <div className="page-grid">
      <PageIntro
        badge={tCommon("demoBadge")}
        title={t("title")}
        description={t("description")}
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label={t("metrics.revenue")}
          value={formatCurrency(summary.totalRevenue, appLocale)}
          hint="Booked across the current seeded invoice portfolio"
          trend={14}
          tone="success"
        />
        <MetricCard
          label={t("metrics.customers")}
          value={`${summary.activeCustomers}`}
          hint="Active fictional accounts across atelier, hospitality, and tailoring segments"
          trend={8}
          tone="neutral"
        />
        <MetricCard
          label={t("metrics.invoices")}
          value={`${summary.openInvoices}`}
          hint="Invoices still requiring collection follow-up"
          trend={-3}
          tone="warning"
        />
        <MetricCard
          label={t("metrics.collections")}
          value={formatPercent(summary.collectionRate, appLocale)}
          hint="Collected value against total invoiced exposure"
          trend={6}
          tone="success"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.5fr_0.9fr]">
        <Card>
          <CardHeader>
            <CardTitle>{t("charts.revenueTitle")}</CardTitle>
            <p className="body-copy text-sm text-muted-foreground">
              {t("charts.revenueDescription")}
            </p>
          </CardHeader>
          <CardContent>
            <DashboardRevenueChart
              data={summary.monthlyRevenue}
              locale={appLocale}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("charts.paymentsTitle")}</CardTitle>
            <p className="body-copy text-sm text-muted-foreground">
              {t("charts.paymentsDescription")}
            </p>
          </CardHeader>
          <CardContent>
            <DashboardPaymentChart
              data={summary.paymentBreakdown}
              locale={appLocale}
            />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr_0.9fr]">
        <Card>
          <CardHeader>
            <CardTitle>{t("recentOrders")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {orders.map((order) => {
              const customer = customers.find(
                (entry) => entry.id === order.customerId
              );

              return (
                <div
                  key={order.id}
                  className="panel-secondary flex items-center justify-between gap-4 px-4 py-3"
                >
                  <div>
                    <p className="font-medium">{order.referenceCode}</p>
                    <p className="body-copy text-sm text-muted-foreground">
                      {customer?.company}
                    </p>
                  </div>
                  <StatusBadge
                    status={order.status}
                    label={tStatuses(order.status)}
                  />
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("charts.pipelineTitle")}</CardTitle>
          </CardHeader>
          <CardContent>
            <DashboardPipelineChart data={summary.orderPipeline} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("insightsTitle")}</CardTitle>
            <p className="body-copy text-sm text-muted-foreground">
              {t("insightsDescription")}
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-[1.75rem] bg-primary px-5 py-5 text-primary-foreground shadow-sm shadow-primary/15">
              <p className="text-sm font-semibold">
                {tInsights("primary.title")}
              </p>
              <p className="mt-2 text-sm leading-6 text-primary-foreground/86">
                {tInsights("primary.description")}
              </p>
            </div>
            <div className="panel-inset px-5 py-5">
              <p className="text-sm font-semibold">
                {tInsights("secondary.title")}
              </p>
              <p className="body-copy mt-2 text-sm text-muted-foreground">
                {tInsights("secondary.description")}
              </p>
            </div>
            <div className="panel-secondary px-5 py-5">
              <p className="subtle-label text-muted-foreground">
                {t("lowStockExposure")}
              </p>
              <p className="mt-2 text-3xl font-semibold">
                {summary.lowStockCount}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
