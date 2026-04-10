import { getTranslations } from "next-intl/server";

import { MetricCard } from "@/components/shared/metric-card";
import { PageIntro } from "@/components/shared/page-intro";
import { InvoiceCollectionsPanel } from "@/features/invoices/invoice-collections-panel";
import { InvoicesTable } from "@/features/invoices/invoices-table";
import type { AppLocale } from "@/lib/constants/site";
import { formatCurrency } from "@/lib/formatting";
import { fabricLogService } from "@/server/services/fabriclog-service";
import type { InvoiceOverviewRow } from "@/types/domain";

type InvoicesPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function InvoicesPage({ params }: InvoicesPageProps) {
  const { locale } = await params;
  const appLocale = locale as AppLocale;
  const t = await getTranslations({ locale, namespace: "Invoices" });
  const tCommon = await getTranslations({ locale, namespace: "Common" });

  const overview = fabricLogService.getInvoicesOverview();

  const badgeLabels: Record<InvoiceOverviewRow["badgeStatus"], string> = {
    paid: t("badges.paid"),
    unpaid: t("badges.unpaid"),
    pending: t("badges.pending"),
    overdue: t("badges.overdue"),
  };

  return (
    <div className="page-grid">
      <PageIntro
        badge={tCommon("demoBadge")}
        title={t("title")}
        description={t("description")}
      />

      <div className="page-metrics-grid">
        <MetricCard
          label={t("cards.totalInvoices")}
          value={`${overview.summary.totalInvoices}`}
          hint={t("cards.totalInvoicesHint")}
          trend={6}
          tone="neutral"
        />
        <MetricCard
          label={t("cards.openInvoiceValue")}
          value={formatCurrency(overview.summary.openInvoiceValue, appLocale)}
          hint={t("cards.openInvoiceValueHint")}
          trend={-2}
          tone="warning"
        />
        <MetricCard
          label={t("cards.overdueExposure")}
          value={formatCurrency(overview.summary.overdueExposure, appLocale)}
          hint={t("cards.overdueExposureHint")}
          trend={-5}
          tone="critical"
        />
        <MetricCard
          label={t("cards.paidInFull")}
          value={`${overview.summary.paidInFullCount}`}
          hint={t("cards.paidInFullHint")}
          trend={9}
          tone="success"
        />
      </div>

      <div className="page-rail-grid">
        <InvoicesTable data={overview.rows} locale={appLocale} />
        <InvoiceCollectionsPanel
          featuredInvoice={overview.featuredInvoice}
          locale={appLocale}
          summary={overview.summary}
          translations={{
            title: t("panel.title"),
            description: t("panel.description"),
            featuredLabel: t("panel.featuredLabel"),
            featuredDescription: t("panel.featuredDescription", {
              customer: overview.featuredInvoice.customerName,
            }),
            summaryCards: {
              unpaid: t("panel.cards.unpaid"),
              unpaidHint: t("panel.cards.unpaidHint"),
              pending: t("panel.cards.pending"),
              pendingHint: t("panel.cards.pendingHint"),
              overdue: t("panel.cards.overdue"),
              overdueHint: t("panel.cards.overdueHint"),
            },
            meta: {
              customer: t("panel.meta.customer"),
              issueDate: t("panel.meta.issueDate"),
              dueDate: t("panel.meta.dueDate"),
              paymentStatus: t("panel.meta.paymentStatus"),
              amount: t("panel.meta.amount"),
              paidAmount: t("panel.meta.paidAmount"),
              outstandingAmount: t("panel.meta.outstandingAmount"),
              orderReference: t("panel.meta.orderReference"),
            },
            badgeLabels,
            orderCueFallback: t("table.orderCueFallback"),
          }}
        />
      </div>
    </div>
  );
}
