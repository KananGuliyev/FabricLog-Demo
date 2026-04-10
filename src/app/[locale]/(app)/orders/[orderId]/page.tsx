import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { DetailActivityPanel } from "@/components/shared/detail-activity-panel";
import { DetailMetaGrid } from "@/components/shared/detail-meta-grid";
import { EmptyState } from "@/components/shared/empty-state";
import { FeaturePanel } from "@/components/shared/feature-panel";
import { MetricCard } from "@/components/shared/metric-card";
import { PageIntro } from "@/components/shared/page-intro";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import type { AppLocale } from "@/lib/constants/site";
import { formatCurrency, formatDate, formatNumber } from "@/lib/formatting";
import { Link } from "@/lib/i18n/navigation";
import { fabricLogService } from "@/server/services/fabriclog-service";
import type { RecentActivity } from "@/types/domain";

type OrderDetailPageProps = {
  params: Promise<{ locale: string; orderId: string }>;
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

export default async function OrderDetailPage({
  params,
}: OrderDetailPageProps) {
  const { locale, orderId } = await params;
  const appLocale = locale as AppLocale;
  const t = await getTranslations({ locale, namespace: "OrderDetail" });
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

  const detail = fabricLogService.getOrderDetail(orderId);

  if (!detail) {
    notFound();
  }

  return (
    <div className="page-grid">
      <PageIntro
        badge={tCommon("demoBadge")}
        title={detail.order.referenceCode}
        description={t("description", { customer: detail.order.customerName })}
        action={
          <Button asChild variant="outline">
            <Link href="/orders">{t("backAction")}</Link>
          </Button>
        }
      />

      <div className="panel-secondary flex flex-col gap-4 px-5 py-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-2">
          <p className="text-lg font-semibold text-foreground">
            {detail.order.customerName}
          </p>
          <p className="body-copy max-w-2xl text-sm text-muted-foreground">
            {t("hero.description", { item: detail.order.itemSummary })}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusBadge
            status={detail.order.status}
            label={tOrderStatuses(detail.order.status)}
          />
          <StatusBadge
            status={detail.order.paymentStatus}
            label={tPaymentStatuses(detail.order.paymentStatus)}
          />
        </div>
      </div>

      <div className="page-metrics-grid">
        <MetricCard
          label={t("cards.quantity")}
          value={`${formatNumber(detail.order.quantityMeters, appLocale)} m`}
          hint={t("cards.quantityHint")}
          tone="neutral"
        />
        <MetricCard
          label={t("cards.totalAmount")}
          value={formatCurrency(detail.order.totalAmount, appLocale)}
          hint={t("cards.totalAmountHint")}
          tone="success"
        />
        <MetricCard
          label={t("cards.orderDate")}
          value={formatDate(detail.order.orderDate, appLocale)}
          hint={t("cards.orderDateHint")}
          tone="neutral"
        />
        <MetricCard
          label={t("cards.deliveryDate")}
          value={formatDate(detail.order.deliveryDate, appLocale)}
          hint={t("cards.deliveryDateHint")}
          tone="warning"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] xl:items-start">
        <div className="section-stack">
          <FeaturePanel
            title={t("summary.title")}
            description={t("summary.description")}
          >
            <div className="section-stack">
              <div className="panel-highlight">
                <p className="subtle-label text-primary-foreground/72">
                  {t("summary.highlightLabel")}
                </p>
                <p className="mt-2 text-xl font-semibold">
                  <Link
                    href={`/products/${detail.product.id}`}
                    className="transition-colors hover:text-primary-foreground/88"
                  >
                    {detail.product.name}
                  </Link>
                </p>
                <p className="mt-3 text-sm leading-6 text-primary-foreground/86">
                  {t("summary.highlightDescription")}
                </p>
              </div>

              <DetailMetaGrid
                items={[
                  {
                    label: t("summary.fields.customer"),
                    value: (
                      <Link
                        href={`/customers/${detail.customer.id}`}
                        className="transition-colors hover:text-primary"
                      >
                        {detail.customer.company}
                      </Link>
                    ),
                  },
                  {
                    label: t("summary.fields.customerTier"),
                    value: (
                      <StatusBadge
                        status={detail.customer.tier}
                        label={tTiers(detail.customer.tier)}
                      />
                    ),
                  },
                  {
                    label: t("summary.fields.product"),
                    value: (
                      <Link
                        href={`/products/${detail.product.id}`}
                        className="transition-colors hover:text-primary"
                      >
                        {detail.product.name}
                      </Link>
                    ),
                  },
                  {
                    label: t("summary.fields.invoice"),
                    value: detail.invoice ? (
                      <Link
                        href={`/invoices/${detail.invoice.id}`}
                        className="transition-colors hover:text-primary"
                      >
                        {detail.invoice.id}
                      </Link>
                    ) : (
                      t("summary.awaitingInvoice")
                    ),
                  },
                ]}
              />
            </div>
          </FeaturePanel>

          <FeaturePanel
            title={t("billing.title")}
            description={t("billing.description")}
          >
            {detail.invoice ? (
              <div className="section-stack">
                <DetailMetaGrid
                  items={[
                    {
                      label: t("billing.fields.status"),
                      value: (
                        <StatusBadge
                          status={detail.invoice.badgeStatus}
                          label={t(`invoiceBadges.${detail.invoice.badgeStatus}`)}
                        />
                      ),
                    },
                    {
                      label: t("billing.fields.invoiceAmount"),
                      value: formatCurrency(detail.invoice.amount, appLocale),
                    },
                    {
                      label: t("billing.fields.paidAmount"),
                      value: formatCurrency(detail.invoice.paidAmount, appLocale),
                    },
                    {
                      label: t("billing.fields.outstandingAmount"),
                      value: formatCurrency(
                        detail.invoice.outstandingAmount,
                        appLocale
                      ),
                    },
                  ]}
                />

                <div className="space-y-3">
                  <div>
                    <p className="subtle-label text-muted-foreground">
                      {t("billing.paymentsTitle")}
                    </p>
                  </div>
                  {detail.payments.length ? (
                    detail.payments.map((payment) => (
                      <div
                        key={payment.id}
                        className="panel-secondary flex items-start justify-between gap-4 px-4 py-4"
                      >
                        <div className="space-y-1.5">
                          <p className="text-sm font-semibold text-foreground">
                            {payment.method}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(payment.paidAt, appLocale)}
                          </p>
                        </div>
                        <div className="space-y-2 text-right">
                          <p className="text-sm font-semibold text-foreground">
                            {formatCurrency(payment.amount, appLocale)}
                          </p>
                          <StatusBadge
                            status={payment.status}
                            label={tPaymentStatuses(payment.status)}
                          />
                        </div>
                      </div>
                    ))
                  ) : (
                    <EmptyState
                      title={t("billing.emptyPaymentsTitle")}
                      description={t("billing.emptyPaymentsDescription")}
                    />
                  )}
                </div>
              </div>
            ) : (
              <EmptyState
                title={t("billing.emptyTitle")}
                description={t("billing.emptyDescription")}
              />
            )}
          </FeaturePanel>
        </div>

        <div className="section-stack">
          <FeaturePanel
            title={t("fulfillment.title")}
            description={t("fulfillment.description")}
          >
            <div className="section-stack">
              <div className="panel-secondary px-5 py-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="subtle-label text-muted-foreground">
                      {t("fulfillment.statusLabel")}
                    </p>
                    <p className="mt-2">
                      <StatusBadge
                        status={detail.order.status}
                        label={tOrderStatuses(detail.order.status)}
                      />
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="subtle-label text-muted-foreground">
                      {t("fulfillment.deliveryLabel")}
                    </p>
                    <p className="mt-2 text-sm font-semibold text-foreground">
                      {formatDate(detail.order.deliveryDate, appLocale)}
                    </p>
                  </div>
                </div>
              </div>

              <DetailMetaGrid
                items={[
                  {
                    label: t("fulfillment.fields.quantity"),
                    value: `${formatNumber(detail.order.quantityMeters, appLocale)} m`,
                  },
                  {
                    label: t("fulfillment.fields.customerContact"),
                    value: detail.customer.email,
                  },
                  {
                    label: t("fulfillment.fields.collection"),
                    value: detail.customer.preferredCollection,
                  },
                  {
                    label: t("fulfillment.fields.variant"),
                    value: detail.product.colorway,
                  },
                ]}
              />
            </div>
          </FeaturePanel>

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
