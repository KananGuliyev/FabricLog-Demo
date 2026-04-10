import { getTranslations } from "next-intl/server";

import { PageIntro } from "@/components/shared/page-intro";
import { StatusBadge } from "@/components/shared/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardRevenueChart } from "@/features/dashboard/dashboard-charts";
import { DashboardActivityFeed } from "@/features/dashboard/dashboard-activity-feed";
import { DashboardKpiGrid } from "@/features/dashboard/dashboard-kpi-grid";
import { DashboardPreviewTable } from "@/features/dashboard/dashboard-preview-table";
import { DashboardStatusIndicators } from "@/features/dashboard/dashboard-status-indicators";
import type { AppLocale } from "@/lib/constants/site";
import { formatCurrency, formatDate, formatPercent } from "@/lib/formatting";
import { Link } from "@/lib/i18n/navigation";
import { fabricLogService } from "@/server/services/fabriclog-service";
import type { DashboardStatusIndicatorKey, RecentActivity } from "@/types/domain";

type DashboardPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function DashboardPage({ params }: DashboardPageProps) {
  const { locale } = await params;
  const appLocale = locale as AppLocale;
  const t = await getTranslations({ locale, namespace: "Dashboard" });
  const tActivity = await getTranslations({ locale, namespace: "Dashboard.activity" });
  const tCommon = await getTranslations({ locale, namespace: "Common" });
  const tOrderStatuses = await getTranslations({ locale, namespace: "Statuses.order" });
  const tPaymentStatuses = await getTranslations({
    locale,
    namespace: "Statuses.payment",
  });

  const summary = fabricLogService.getDashboardSummary();

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
  const indicatorLabelMap: Record<DashboardStatusIndicatorKey, string> = {
    low_stock: t("statusIndicators.items.lowStock"),
    overdue_invoices: t("statusIndicators.items.overdueInvoices"),
    pending_invoices: t("statusIndicators.items.pendingInvoices"),
    production_orders: t("statusIndicators.items.productionOrders"),
  };
  const indicatorToneMap: Record<
    DashboardStatusIndicatorKey,
    "critical" | "neutral" | "success" | "warning"
  > = {
    low_stock: "warning",
    overdue_invoices: "critical",
    pending_invoices: "neutral",
    production_orders: "success",
  };

  return (
    <div className="page-grid">
      <PageIntro
        badge={tCommon("demoBadge")}
        title={t("title")}
        description={t("description")}
      />

      <DashboardKpiGrid
        metrics={[
          {
            label: t("metrics.customers"),
            value: `${summary.totalCustomers}`,
            hint: t("metrics.customersHint"),
            trend: 8,
            tone: "neutral",
          },
          {
            label: t("metrics.orders"),
            value: `${summary.totalOrders}`,
            hint: t("metrics.ordersHint"),
            trend: 11,
            tone: "success",
          },
          {
            label: t("metrics.invoices"),
            value: `${summary.totalInvoices}`,
            hint: t("metrics.invoicesHint"),
            trend: 4,
            tone: "neutral",
          },
          {
            label: t("metrics.revenue"),
            value: formatCurrency(summary.totalRevenue, appLocale),
            hint: t("metrics.revenueHint"),
            trend: 14,
            tone: "success",
          },
          {
            label: t("metrics.unpaidInvoices"),
            value: `${summary.unpaidInvoicesCount}`,
            hint: t("metrics.unpaidInvoicesHint"),
            trend: -2,
            tone: "warning",
          },
        ]}
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.95fr)] xl:items-start">
        <Card size="sm">
          <CardHeader>
            <CardTitle>{t("visualSummary.title")}</CardTitle>
            <p className="body-copy text-sm text-muted-foreground">
              {t("visualSummary.description")}
            </p>
          </CardHeader>
          <CardContent className="space-y-6 pt-0">
            <DashboardRevenueChart
              data={summary.monthlyRevenue}
              locale={appLocale}
            />
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="panel-secondary px-4 py-3">
                <p className="subtle-label text-muted-foreground">
                  {t("visualSummary.items.collectionRate")}
                </p>
                <p className="mt-2 text-xl font-semibold">
                  {formatPercent(summary.collectionRate, appLocale)}
                </p>
              </div>
              <div className="panel-secondary px-4 py-3">
                <p className="subtle-label text-muted-foreground">
                  {t("visualSummary.items.pendingFollowUp")}
                </p>
                <p className="mt-2 text-xl font-semibold">
                  {summary.pendingPayments}
                </p>
              </div>
              <div className="panel-secondary px-4 py-3">
                <p className="subtle-label text-muted-foreground">
                  {t("visualSummary.items.lowStock")}
                </p>
                <p className="mt-2 text-xl font-semibold">
                  {summary.lowStockCount}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <DashboardStatusIndicators
          title={t("statusIndicators.title")}
          description={t("statusIndicators.description")}
          items={summary.statusIndicators.map((item) => ({
            count: item.count,
            label: indicatorLabelMap[item.key],
            tone: indicatorToneMap[item.key],
          }))}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(300px,0.92fr)] xl:items-start">
        <DashboardPreviewTable
          title={t("recentOrders.title")}
          description={t("recentOrders.description")}
          rows={summary.recentOrders}
          columns={[
            {
              key: "referenceCode",
              header: t("recentOrders.table.reference"),
              render: (row) => (
                <Link
                  href={`/orders/${row.id}`}
                  className="font-medium text-foreground transition-colors hover:text-primary"
                >
                  {row.referenceCode}
                </Link>
              ),
            },
            {
              key: "customerName",
              header: t("recentOrders.table.customer"),
            },
            {
              key: "deliveryDate",
              header: t("recentOrders.table.delivery"),
              render: (row) => formatDate(row.deliveryDate, appLocale),
            },
            {
              key: "amount",
              header: t("recentOrders.table.amount"),
              align: "right",
              render: (row) => formatCurrency(row.amount, appLocale),
            },
            {
              key: "status",
              header: t("recentOrders.table.status"),
              align: "right",
              render: (row) => (
                <StatusBadge
                  status={row.status}
                  label={tOrderStatuses(row.status)}
                />
              ),
            },
          ]}
        />

        <DashboardPreviewTable
          title={t("recentInvoices.title")}
          description={t("recentInvoices.description")}
          rows={summary.recentInvoices}
          columns={[
            {
              key: "id",
              header: t("recentInvoices.table.invoice"),
              render: (row) => (
                <Link
                  href={`/invoices/${row.id}`}
                  className="font-medium text-foreground transition-colors hover:text-primary"
                >
                  {row.id}
                </Link>
              ),
            },
            {
              key: "customerName",
              header: t("recentInvoices.table.customer"),
            },
            {
              key: "dueAt",
              header: t("recentInvoices.table.due"),
              render: (row) => formatDate(row.dueAt, appLocale),
            },
            {
              key: "amount",
              header: t("recentInvoices.table.billing"),
              align: "right",
              render: (row) => (
                <div className="space-y-1 text-right">
                  <p className="font-medium">
                    {formatCurrency(row.amount, appLocale)}
                  </p>
                  <p className="body-copy text-xs text-muted-foreground">
                    {t("recentInvoices.table.paidLabel", {
                      amount: formatCurrency(row.paidAmount, appLocale),
                    })}
                  </p>
                </div>
              ),
            },
            {
              key: "status",
              header: t("recentInvoices.table.status"),
              align: "right",
              render: (row) => (
                <StatusBadge
                  status={row.status}
                  label={tPaymentStatuses(row.status)}
                />
              ),
            },
          ]}
        />

        <DashboardActivityFeed
          title={tActivity("title")}
          description={tActivity("description")}
          items={summary.recentActivity.map((activity) => ({
            id: activity.id,
            colorClassName: activityToneMap[activity.type],
            dateLabel: formatDate(activity.occurredAt, appLocale),
            title: tActivity(`types.${activity.type}.title`),
            description: tActivity(`types.${activity.type}.description`, {
              amount: activity.amount
                ? formatCurrency(activity.amount, appLocale)
                : formatCurrency(0, appLocale),
              customerName: activity.customerName ?? tCommon("unknown"),
              invoiceId: activity.invoiceId ?? tCommon("unknown"),
              orderCode: activity.orderCode ?? tCommon("unknown"),
              productName: activity.productName ?? tCommon("unknown"),
            }),
          }))}
        />
      </div>
    </div>
  );
}
