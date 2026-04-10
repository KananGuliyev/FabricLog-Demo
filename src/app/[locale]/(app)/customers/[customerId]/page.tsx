import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { DetailActivityPanel } from "@/components/shared/detail-activity-panel";
import { DetailMetaGrid } from "@/components/shared/detail-meta-grid";
import { DetailPreviewList } from "@/components/shared/detail-preview-list";
import { FeaturePanel } from "@/components/shared/feature-panel";
import { MetricCard } from "@/components/shared/metric-card";
import { PageIntro } from "@/components/shared/page-intro";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import type { AppLocale } from "@/lib/constants/site";
import { formatCurrency, formatDate } from "@/lib/formatting";
import { Link } from "@/lib/i18n/navigation";
import { fabricLogService } from "@/server/services/fabriclog-service";
import type { RecentActivity } from "@/types/domain";

type CustomerDetailPageProps = {
  params: Promise<{ customerId: string; locale: string }>;
};

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

export default async function CustomerDetailPage({
  params,
}: CustomerDetailPageProps) {
  const { customerId, locale } = await params;
  const appLocale = locale as AppLocale;
  const t = await getTranslations({ locale, namespace: "CustomerDetail" });
  const tCommon = await getTranslations({ locale, namespace: "Common" });
  const tActivity = await getTranslations({
    locale,
    namespace: "Dashboard.activity",
  });
  const tOrderStatuses = await getTranslations({
    locale,
    namespace: "Statuses.order",
  });
  const tPaymentStatuses = await getTranslations({
    locale,
    namespace: "Statuses.payment",
  });
  const tTiers = await getTranslations({ locale, namespace: "Statuses.tiers" });

  const detail = fabricLogService.getCustomerDetail(customerId);

  if (!detail) {
    notFound();
  }

  return (
    <div className="page-grid">
      <PageIntro
        badge={tCommon("demoBadge")}
        title={detail.profile.company}
        description={t("description", {
          contact: detail.profile.name,
          region: detail.profile.region,
        })}
        action={
          <Button asChild variant="outline">
            <Link href="/customers">{t("backAction")}</Link>
          </Button>
        }
      />

      <div className="panel-secondary flex flex-col gap-4 px-5 py-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-2">
          <p className="text-lg font-semibold text-foreground">
            {detail.profile.name}
          </p>
          <p className="body-copy max-w-2xl text-sm text-muted-foreground">
            {t("hero.description", {
              collection: detail.profile.preferredCollection,
            })}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusBadge
            status={detail.profile.tier}
            label={tTiers(detail.profile.tier)}
          />
          <StatusBadge
            status={detail.profile.paymentHealth}
            label={tPaymentStatuses(detail.profile.paymentHealth)}
          />
        </div>
      </div>

      <div className="page-metrics-grid">
        <MetricCard
          label={t("cards.totalOrders")}
          value={`${detail.profile.totalOrders}`}
          hint={t("cards.totalOrdersHint")}
          tone="neutral"
        />
        <MetricCard
          label={t("cards.totalInvoiced")}
          value={formatCurrency(detail.profile.totalInvoicedValue, appLocale)}
          hint={t("cards.totalInvoicedHint")}
          tone="success"
        />
        <MetricCard
          label={t("cards.outstandingBalance")}
          value={formatCurrency(detail.profile.outstandingBalance, appLocale)}
          hint={t("cards.outstandingBalanceHint")}
          tone="warning"
        />
        <MetricCard
          label={t("cards.lastActivity")}
          value={formatDate(detail.profile.lastActivityDate, appLocale)}
          hint={t("cards.lastActivityHint")}
          tone="neutral"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] xl:items-start">
        <div className="section-stack">
          <FeaturePanel
            title={t("profile.title")}
            description={t("profile.description")}
          >
            <div className="section-stack">
              <div className="panel-highlight">
                <p className="subtle-label text-primary-foreground/72">
                  {t("profile.relationshipLabel")}
                </p>
                <p className="mt-2 text-xl font-semibold">
                  {detail.profile.preferredCollection}
                </p>
                <p className="mt-3 text-sm leading-6 text-primary-foreground/86">
                  {t("profile.relationshipDescription", {
                    openInvoices: detail.profile.openInvoicesCount,
                    paidInvoices: detail.profile.paidInvoicesCount,
                  })}
                </p>
              </div>

              <DetailMetaGrid
                items={[
                  {
                    label: t("profile.fields.contact"),
                    value: detail.profile.name,
                  },
                  {
                    label: t("profile.fields.email"),
                    value: detail.profile.email,
                  },
                  {
                    label: t("profile.fields.region"),
                    value: detail.profile.region,
                  },
                  {
                    label: t("profile.fields.collection"),
                    value: detail.profile.preferredCollection,
                  },
                ]}
              />
            </div>
          </FeaturePanel>

          <DetailPreviewList
            title={t("recentOrders.title")}
            description={t("recentOrders.description")}
            emptyTitle={t("recentOrders.emptyTitle")}
            emptyDescription={t("recentOrders.emptyDescription")}
            items={detail.recentOrders.map((order) => ({
              id: order.id,
              title: (
                <Link
                  href={`/orders/${order.id}`}
                  className="transition-colors hover:text-primary"
                >
                  {order.referenceCode}
                </Link>
              ),
              subtitle: t("recentOrders.subtitle", {
                date: formatDate(order.orderDate, appLocale),
                item: order.itemSummary,
              }),
              trailing: (
                <p className="text-sm font-semibold text-foreground">
                  {formatCurrency(order.totalAmount, appLocale)}
                </p>
              ),
              meta: (
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge
                    status={order.status}
                    label={tOrderStatuses(order.status)}
                  />
                  <StatusBadge
                    status={order.paymentStatus}
                    label={tPaymentStatuses(order.paymentStatus)}
                  />
                </div>
              ),
            }))}
          />
        </div>

        <div className="section-stack">
          <DetailPreviewList
            title={t("recentInvoices.title")}
            description={t("recentInvoices.description")}
            emptyTitle={t("recentInvoices.emptyTitle")}
            emptyDescription={t("recentInvoices.emptyDescription")}
            items={detail.recentInvoices.map((invoice) => ({
              id: invoice.id,
              title: (
                <Link
                  href={`/invoices/${invoice.id}`}
                  className="transition-colors hover:text-primary"
                >
                  {invoice.id}
                </Link>
              ),
              subtitle: t("recentInvoices.subtitle", {
                issueDate: formatDate(invoice.issueDate, appLocale),
                dueDate: formatDate(invoice.dueDate, appLocale),
              }),
              trailing: (
                <div className="text-right">
                  <p className="text-sm font-semibold text-foreground">
                    {formatCurrency(invoice.amount, appLocale)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {t("recentInvoices.trailing", {
                      amount: formatCurrency(invoice.outstandingAmount, appLocale),
                    })}
                  </p>
                </div>
              ),
              meta: (
                <StatusBadge
                  status={invoice.badgeStatus}
                  label={t(`invoiceBadges.${invoice.badgeStatus}`)}
                />
              ),
            }))}
          />

          <DetailActivityPanel
            title={t("activity.title")}
            description={t("activity.description")}
            emptyTitle={t("activity.emptyTitle")}
            emptyDescription={t("activity.emptyDescription")}
            items={detail.recentActivity.map((activity) => ({
              id: activity.id,
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
              toneClassName: activityToneMap[activity.type],
            }))}
          />
        </div>
      </div>
    </div>
  );
}
