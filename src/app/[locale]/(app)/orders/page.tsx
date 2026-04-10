import { getTranslations } from "next-intl/server";

import { MetricCard } from "@/components/shared/metric-card";
import { PageIntro } from "@/components/shared/page-intro";
import { OrderOperationsPanel } from "@/features/orders/order-operations-panel";
import { OrdersTable } from "@/features/orders/orders-table";
import type { AppLocale } from "@/lib/constants/site";
import { formatCurrency } from "@/lib/formatting";
import { fabricLogService } from "@/server/services/fabriclog-service";

type OrdersPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function OrdersPage({ params }: OrdersPageProps) {
  const { locale } = await params;
  const appLocale = locale as AppLocale;
  const t = await getTranslations({ locale, namespace: "Orders" });
  const tCommon = await getTranslations({ locale, namespace: "Common" });
  const tOrderStatuses = await getTranslations({
    locale,
    namespace: "Statuses.order",
  });
  const tPaymentStatuses = await getTranslations({
    locale,
    namespace: "Statuses.payment",
  });

  const overview = fabricLogService.getOrdersOverview();

  return (
    <div className="page-grid">
      <PageIntro
        badge={tCommon("demoBadge")}
        title={t("title")}
        description={t("description")}
      />

      <div className="page-metrics-grid">
        <MetricCard
          label={t("cards.totalOrders")}
          value={`${overview.summary.totalOrders}`}
          hint={t("cards.totalOrdersHint")}
          trend={8}
        />
        <MetricCard
          label={t("cards.liveOrderValue")}
          value={formatCurrency(overview.summary.liveOrderValue, appLocale)}
          hint={t("cards.liveOrderValueHint")}
          trend={16}
          tone="success"
        />
        <MetricCard
          label={t("cards.inProduction")}
          value={`${overview.summary.inProductionCount}`}
          hint={t("cards.inProductionHint")}
          trend={5}
          tone="critical"
        />
        <MetricCard
          label={t("cards.billingFollowUp")}
          value={`${overview.summary.billingFollowUpCount}`}
          hint={t("cards.billingFollowUpHint")}
          trend={-2}
          tone="warning"
        />
      </div>

      <div className="page-rail-grid">
        <OrdersTable data={overview.rows} locale={appLocale} />

        <OrderOperationsPanel
          featuredOrder={overview.featuredOrder}
          locale={appLocale}
          summary={overview.summary}
          translations={{
            title: t("panel.title"),
            description: t("panel.description"),
            featuredLabel: t("panel.featuredLabel"),
            featuredDescription: t("panel.featuredDescription", {
              reference: overview.featuredOrder.referenceCode,
              customer: overview.featuredOrder.customerName,
            }),
            summaryCards: {
              inProduction: t("panel.cards.inProduction"),
              inProductionHint: t("panel.cards.inProductionHint"),
              readyToDispatch: t("panel.cards.readyToDispatch"),
              readyToDispatchHint: t("panel.cards.readyToDispatchHint"),
              billingFollowUp: t("panel.cards.billingFollowUp"),
              billingFollowUpHint: t("panel.cards.billingFollowUpHint"),
            },
            meta: {
              customer: t("panel.meta.customer"),
              orderDate: t("panel.meta.orderDate"),
              deliveryDate: t("panel.meta.deliveryDate"),
              itemSummary: t("panel.meta.itemSummary"),
              invoice: t("panel.meta.invoice"),
              paymentStatus: t("panel.meta.paymentStatus"),
              orderStatus: t("panel.meta.orderStatus"),
              totalAmount: t("panel.meta.totalAmount"),
            },
            orderStatuses: {
              new: tOrderStatuses("new"),
              sampling: tOrderStatuses("sampling"),
              production: tOrderStatuses("production"),
              ready: tOrderStatuses("ready"),
              dispatched: tOrderStatuses("dispatched"),
            },
            paymentStatuses: {
              none: tPaymentStatuses("none"),
              paid: tPaymentStatuses("paid"),
              partial: tPaymentStatuses("partial"),
              pending: tPaymentStatuses("pending"),
              overdue: tPaymentStatuses("overdue"),
            },
            awaitingInvoice: t("table.awaitingInvoice"),
          }}
        />
      </div>
    </div>
  );
}
