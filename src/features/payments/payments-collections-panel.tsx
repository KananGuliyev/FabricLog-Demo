import { MetricCard } from "@/components/shared/metric-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AppLocale } from "@/lib/constants/site";
import { formatCurrency, formatDate } from "@/lib/formatting";
import type {
  PaymentOverviewRow,
  PaymentsOverviewSummary,
} from "@/types/domain";

type PaymentsCollectionsPanelProps = {
  featuredPayment: PaymentOverviewRow;
  locale: AppLocale;
  summary: PaymentsOverviewSummary;
  translations: {
    title: string;
    description: string;
    featuredLabel: string;
    featuredDescription: string;
    summaryCards: {
      cardSettlements: string;
      cardSettlementsHint: string;
      wireTransfers: string;
      wireTransfersHint: string;
      settledPayments: string;
      settledPaymentsHint: string;
    };
    meta: {
      customer: string;
      invoice: string;
      date: string;
      method: string;
      amount: string;
      outstanding: string;
      status: string;
      dueDate: string;
    };
    statusLabels: Record<PaymentOverviewRow["status"], string>;
    methodLabels: {
      bankTransfer: string;
      cardSettlement: string;
      wireTransfer: string;
    };
  };
};

function getMethodLabel(
  method: PaymentOverviewRow["method"],
  labels: PaymentsCollectionsPanelProps["translations"]["methodLabels"]
) {
  if (method === "Bank transfer") {
    return labels.bankTransfer;
  }

  if (method === "Card settlement") {
    return labels.cardSettlement;
  }

  return labels.wireTransfer;
}

export function PaymentsCollectionsPanel({
  featuredPayment,
  locale,
  summary,
  translations,
}: PaymentsCollectionsPanelProps) {
  return (
    <div className="section-stack">
      <div className="metric-rail-grid">
        <MetricCard
          label={translations.summaryCards.cardSettlements}
          value={`${summary.cardSettlementCount}`}
          hint={translations.summaryCards.cardSettlementsHint}
          trend={3}
          tone="neutral"
        />
        <MetricCard
          label={translations.summaryCards.wireTransfers}
          value={`${summary.wireTransferCount}`}
          hint={translations.summaryCards.wireTransfersHint}
          trend={1}
          tone="success"
        />
        <MetricCard
          label={translations.summaryCards.settledPayments}
          value={`${summary.settledPaymentsCount}`}
          hint={translations.summaryCards.settledPaymentsHint}
          trend={2}
          tone="success"
        />
      </div>

      <Card size="sm">
        <CardHeader>
          <CardTitle>{translations.title}</CardTitle>
          <p className="body-copy text-sm text-muted-foreground">
            {translations.description}
          </p>
        </CardHeader>
        <CardContent className="space-y-4 pt-0">
          <div className="panel-highlight">
            <p className="subtle-label text-primary-foreground/72">
              {translations.featuredLabel}
            </p>
            <p className="mt-2 text-2xl font-semibold">{featuredPayment.id}</p>
            <p className="mt-1 text-sm text-primary-foreground/74">
              {featuredPayment.customerName}
            </p>
            <p className="mt-3 text-sm leading-6 text-primary-foreground/86">
              {translations.featuredDescription}
            </p>
          </div>

          <div className="panel-secondary space-y-4 px-5 py-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="subtle-label text-muted-foreground">
                  {translations.meta.status}
                </p>
                <p className="mt-2">
                  <StatusBadge
                    status={featuredPayment.status}
                    label={translations.statusLabels[featuredPayment.status]}
                  />
                </p>
              </div>
              <div className="text-right">
                <p className="subtle-label text-muted-foreground">
                  {translations.meta.amount}
                </p>
                <p className="mt-2 text-sm font-semibold">
                  {formatCurrency(featuredPayment.amount, locale)}
                </p>
              </div>
            </div>

            <div className="panel-meta-grid">
              <div className="panel-meta-row">
                <div>
                  <p className="subtle-label text-muted-foreground">
                    {translations.meta.customer}
                  </p>
                  <p className="mt-1 text-sm font-medium">
                    {featuredPayment.customerName}
                  </p>
                </div>
                <div>
                  <p className="subtle-label text-muted-foreground">
                    {translations.meta.invoice}
                  </p>
                  <p className="mt-1 text-sm font-medium">
                    {featuredPayment.invoiceId}
                  </p>
                </div>
              </div>

              <div className="panel-meta-row">
                <div>
                  <p className="subtle-label text-muted-foreground">
                    {translations.meta.date}
                  </p>
                  <p className="mt-1 text-sm font-medium">
                    {formatDate(featuredPayment.paidAt, locale)}
                  </p>
                </div>
                <div>
                  <p className="subtle-label text-muted-foreground">
                    {translations.meta.dueDate}
                  </p>
                  <p className="mt-1 text-sm font-medium">
                    {formatDate(featuredPayment.dueDate, locale)}
                  </p>
                </div>
              </div>

              <div className="panel-meta-row">
                <div>
                  <p className="subtle-label text-muted-foreground">
                    {translations.meta.method}
                  </p>
                  <p className="mt-1 text-sm font-medium">
                    {getMethodLabel(featuredPayment.method, translations.methodLabels)}
                  </p>
                </div>
                <div>
                  <p className="subtle-label text-muted-foreground">
                    {translations.meta.outstanding}
                  </p>
                  <p className="mt-1 text-sm font-medium">
                    {formatCurrency(featuredPayment.outstandingAmount, locale)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
