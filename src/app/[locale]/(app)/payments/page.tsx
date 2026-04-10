import { getTranslations } from "next-intl/server";

import { MetricCard } from "@/components/shared/metric-card";
import { PageIntro } from "@/components/shared/page-intro";
import { PaymentsCollectionsPanel } from "@/features/payments/payments-collections-panel";
import { PaymentsTable } from "@/features/payments/payments-table";
import type { AppLocale } from "@/lib/constants/site";
import { formatCurrency } from "@/lib/formatting";
import { fabricLogService } from "@/server/services/fabriclog-service";

type PaymentsPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function PaymentsPage({ params }: PaymentsPageProps) {
  const { locale } = await params;
  const appLocale = locale as AppLocale;
  const t = await getTranslations({ locale, namespace: "Payments" });
  const tCommon = await getTranslations({ locale, namespace: "Common" });
  const tStatuses = await getTranslations({
    locale,
    namespace: "Statuses.payment",
  });

  const overview = fabricLogService.getPaymentsOverview();

  return (
    <div className="page-grid">
      <PageIntro
        badge={tCommon("demoBadge")}
        title={t("title")}
        description={t("description")}
      />

      <div className="page-metrics-grid">
        <MetricCard
          label={t("cards.totalPayments")}
          value={`${overview.summary.totalPayments}`}
          hint={t("cards.totalPaymentsHint")}
          trend={5}
        />
        <MetricCard
          label={t("cards.collectedPayments")}
          value={formatCurrency(overview.summary.collectedValue, appLocale)}
          hint={t("cards.collectedPaymentsHint")}
          trend={12}
          tone="success"
        />
        <MetricCard
          label={t("cards.bankTransfers")}
          value={`${overview.summary.bankTransferCount}`}
          hint={t("cards.bankTransfersHint")}
          trend={4}
        />
        <MetricCard
          label={t("cards.partialReceipts")}
          value={`${overview.summary.partialReceiptsCount}`}
          hint={t("cards.partialReceiptsHint")}
          trend={-1}
          tone="warning"
        />
      </div>

      <div className="page-rail-grid">
        <PaymentsTable data={overview.rows} locale={appLocale} />

        <PaymentsCollectionsPanel
          featuredPayment={overview.featuredPayment}
          locale={appLocale}
          summary={overview.summary}
          translations={{
            title: t("panel.title"),
            description: t("panel.description"),
            featuredLabel: t("panel.featuredLabel"),
            featuredDescription: t("panel.featuredDescription", {
              customer: overview.featuredPayment.customerName,
              invoiceId: overview.featuredPayment.invoiceId,
            }),
            summaryCards: {
              cardSettlements: t("panel.cards.cardSettlements"),
              cardSettlementsHint: t("panel.cards.cardSettlementsHint"),
              wireTransfers: t("panel.cards.wireTransfers"),
              wireTransfersHint: t("panel.cards.wireTransfersHint"),
              settledPayments: t("panel.cards.settledPayments"),
              settledPaymentsHint: t("panel.cards.settledPaymentsHint"),
            },
            meta: {
              customer: t("panel.meta.customer"),
              invoice: t("panel.meta.invoice"),
              date: t("panel.meta.date"),
              method: t("panel.meta.method"),
              amount: t("panel.meta.amount"),
              outstanding: t("panel.meta.outstanding"),
              status: t("panel.meta.status"),
              dueDate: t("panel.meta.dueDate"),
            },
            statusLabels: {
              paid: tStatuses("paid"),
              partial: tStatuses("partial"),
              pending: tStatuses("pending"),
              overdue: tStatuses("overdue"),
            },
            methodLabels: {
              bankTransfer: t("methods.bankTransfer"),
              cardSettlement: t("methods.cardSettlement"),
              wireTransfer: t("methods.wireTransfer"),
            },
          }}
        />
      </div>
    </div>
  );
}
