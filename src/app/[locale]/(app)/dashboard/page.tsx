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
import { formatCurrency, formatDate, formatPercent } from "@/lib/formatting";
import { cn } from "@/lib/utils";
import { fabricLogService } from "@/server/services/fabriclog-service";
import type { RecentActivity } from "@/types/domain";

type DashboardPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function DashboardPage({ params }: DashboardPageProps) {
  const { locale } = await params;
  const appLocale = locale as AppLocale;
  const t = await getTranslations({ locale, namespace: "Dashboard" });
  const tActivity = await getTranslations({ locale, namespace: "Dashboard.activity" });
  const tCommon = await getTranslations({ locale, namespace: "Common" });
  const tInsights = await getTranslations({ locale, namespace: "Insights" });
  const tStatuses = await getTranslations({ locale, namespace: "Statuses.order" });

  const summary = fabricLogService.getDashboardSummary();
  const orders = fabricLogService.getOrders().slice(0, 4);
  const customers = fabricLogService.getCustomers();

  const activityToneMap: Record<RecentActivity["type"], string> = {
    payment_received: "bg-emerald-500",
    invoice_partial_paid: "bg-amber-500",
    invoice_overdue: "bg-rose-500",
    order_in_production: "bg-sky-500",
    order_ready: "bg-indigo-500",
    order_dispatched: "bg-violet-500",
    inventory_low: "bg-orange-500",
    invoice_issued: "bg-stone-500",
  };

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
          hint={t("metrics.revenueHint")}
          trend={14}
          tone="success"
        />
        <MetricCard
          label={t("metrics.customers")}
          value={`${summary.activeCustomers}`}
          hint={t("metrics.customersHint")}
          trend={8}
          tone="neutral"
        />
        <MetricCard
          label={t("metrics.invoices")}
          value={`${summary.openInvoices}`}
          hint={t("metrics.invoicesHint")}
          trend={-3}
          tone="warning"
        />
        <MetricCard
          label={t("metrics.collections")}
          value={formatPercent(summary.collectionRate, appLocale)}
          hint={t("metrics.collectionsHint")}
          trend={6}
          tone="success"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.85fr_0.85fr]">
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

        <Card>
          <CardHeader>
            <CardTitle>{t("charts.pipelineTitle")}</CardTitle>
          </CardHeader>
          <CardContent>
            <DashboardPipelineChart data={summary.orderPipeline} />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_1.05fr_0.95fr]">
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
            <CardTitle>{tActivity("title")}</CardTitle>
            <p className="body-copy text-sm text-muted-foreground">
              {tActivity("description")}
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {summary.recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="panel-secondary flex gap-4 px-4 py-3"
              >
                <span
                  className={cn(
                    "mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full",
                    activityToneMap[activity.type]
                  )}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <p className="font-medium">
                      {tActivity(`types.${activity.type}.title`)}
                    </p>
                    <p className="subtle-label text-muted-foreground">
                      {formatDate(activity.occurredAt, appLocale)}
                    </p>
                  </div>
                  <p className="body-copy mt-1 text-sm text-muted-foreground">
                    {tActivity(`types.${activity.type}.description`, {
                      amount: activity.amount
                        ? formatCurrency(activity.amount, appLocale)
                        : formatCurrency(0, appLocale),
                      customerName: activity.customerName ?? tCommon("unknown"),
                      invoiceId: activity.invoiceId ?? tCommon("unknown"),
                      orderCode: activity.orderCode ?? tCommon("unknown"),
                      productName: activity.productName ?? tCommon("unknown"),
                    })}
                  </p>
                </div>
              </div>
            ))}
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
