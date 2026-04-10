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
import { formatCurrency, formatDate, formatNumber, formatPercent } from "@/lib/formatting";
import { Link } from "@/lib/i18n/navigation";
import { fabricLogService } from "@/server/services/fabriclog-service";
import type { RecentActivity } from "@/types/domain";

type ProductDetailPageProps = {
  params: Promise<{ locale: string; productId: string }>;
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

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { locale, productId } = await params;
  const appLocale = locale as AppLocale;
  const t = await getTranslations({ locale, namespace: "ProductDetail" });
  const tCommon = await getTranslations({ locale, namespace: "Common" });
  const tStatuses = await getTranslations({
    locale,
    namespace: "Statuses.fabric",
  });
  const tOrderStatuses = await getTranslations({
    locale,
    namespace: "Statuses.order",
  });
  const tPaymentStatuses = await getTranslations({
    locale,
    namespace: "Statuses.payment",
  });
  const tActivity = await getTranslations({
    locale,
    namespace: "Dashboard.activity",
  });

  const detail = fabricLogService.getProductDetail(productId);

  if (!detail) {
    notFound();
  }

  return (
    <div className="page-grid">
      <PageIntro
        badge={tCommon("demoBadge")}
        title={detail.product.name}
        description={t("description", {
          category: detail.product.category,
          colorway: detail.product.colorway,
        })}
        action={
          <Button asChild variant="outline">
            <Link href="/products">{t("backAction")}</Link>
          </Button>
        }
      />

      <div className="panel-secondary flex flex-col gap-4 px-5 py-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-2">
          <p className="text-lg font-semibold text-foreground">
            {detail.product.sku}
          </p>
          <p className="body-copy max-w-2xl text-sm text-muted-foreground">
            {t("hero.description", {
              composition: detail.product.composition,
            })}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusBadge
            status={detail.product.status}
            label={tStatuses(detail.product.status)}
          />
        </div>
      </div>

      <div className="page-metrics-grid">
        <MetricCard
          label={t("cards.stock")}
          value={`${formatNumber(detail.product.stockMeters, appLocale)} m`}
          hint={t("cards.stockHint")}
          tone="neutral"
        />
        <MetricCard
          label={t("cards.reserved")}
          value={`${formatNumber(detail.product.reservedMeters, appLocale)} m`}
          hint={t("cards.reservedHint")}
          tone="warning"
        />
        <MetricCard
          label={t("cards.available")}
          value={`${formatNumber(detail.product.availableMeters, appLocale)} m`}
          hint={t("cards.availableHint")}
          tone="success"
        />
        <MetricCard
          label={t("cards.unitPrice")}
          value={formatCurrency(detail.product.unitPrice, appLocale)}
          hint={t("cards.unitPriceHint")}
          tone="neutral"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] xl:items-start">
        <div className="section-stack">
          <FeaturePanel
            title={t("specifications.title")}
            description={t("specifications.description")}
          >
            <div className="section-stack">
              <div className="panel-highlight">
                <p className="subtle-label text-primary-foreground/72">
                  {t("specifications.highlightLabel")}
                </p>
                <p className="mt-2 text-xl font-semibold">
                  {detail.product.colorway}
                </p>
                <p className="mt-3 text-sm leading-6 text-primary-foreground/86">
                  {t("specifications.highlightDescription")}
                </p>
              </div>

              <DetailMetaGrid
                items={[
                  {
                    label: t("specifications.fields.category"),
                    value: detail.product.category,
                  },
                  {
                    label: t("specifications.fields.composition"),
                    value: detail.product.composition,
                  },
                  {
                    label: t("specifications.fields.width"),
                    value: `${detail.product.widthCm} cm`,
                  },
                  {
                    label: t("specifications.fields.weight"),
                    value: `${detail.product.weightGsm} gsm`,
                  },
                ]}
              />
            </div>
          </FeaturePanel>

          <DetailPreviewList
            title={t("relatedOrders.title")}
            description={t("relatedOrders.description")}
            emptyTitle={t("relatedOrders.emptyTitle")}
            emptyDescription={t("relatedOrders.emptyDescription")}
            items={detail.relatedOrders.map((order) => ({
              id: order.id,
              title: (
                <Link
                  href={`/orders/${order.id}`}
                  className="transition-colors hover:text-primary"
                >
                  {order.referenceCode}
                </Link>
              ),
              subtitle: t("relatedOrders.subtitle", {
                customer: order.customerName,
                date: formatDate(order.deliveryDate, appLocale),
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
          <FeaturePanel
            title={t("inventory.title")}
            description={t("inventory.description")}
          >
            <div className="section-stack">
              <div className="panel-secondary px-5 py-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="subtle-label text-muted-foreground">
                      {t("inventory.utilization")}
                    </p>
                    <p className="mt-2 text-2xl font-semibold text-foreground">
                      {formatPercent(detail.product.reservationRate, appLocale)}
                    </p>
                  </div>
                  <StatusBadge
                    status={detail.product.status}
                    label={tStatuses(detail.product.status)}
                  />
                </div>
              </div>

              <DetailMetaGrid
                items={[
                  {
                    label: t("inventory.fields.activeOrders"),
                    value: detail.activeOrdersCount,
                  },
                  {
                    label: t("inventory.fields.linkedCustomers"),
                    value: detail.linkedCustomersCount,
                  },
                  {
                    label: t("inventory.fields.totalDemand"),
                    value: `${formatNumber(detail.totalOrderedMeters, appLocale)} m`,
                  },
                  {
                    label: t("inventory.fields.available"),
                    value: `${formatNumber(detail.product.availableMeters, appLocale)} m`,
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
