import { MetricCard } from "@/components/shared/metric-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AppLocale } from "@/lib/constants/site";
import { formatCurrency, formatDate } from "@/lib/formatting";
import type {
  InvoiceOverviewRow,
  InvoicesOverviewSummary,
} from "@/types/domain";

type InvoiceCollectionsPanelProps = {
  featuredInvoice: InvoiceOverviewRow;
  locale: AppLocale;
  summary: InvoicesOverviewSummary;
  translations: {
    title: string;
    description: string;
    featuredLabel: string;
    featuredDescription: string;
    summaryCards: {
      unpaid: string;
      unpaidHint: string;
      pending: string;
      pendingHint: string;
      overdue: string;
      overdueHint: string;
    };
    meta: {
      customer: string;
      issueDate: string;
      dueDate: string;
      paymentStatus: string;
      amount: string;
      paidAmount: string;
      outstandingAmount: string;
      orderReference: string;
    };
    badgeLabels: Record<InvoiceOverviewRow["badgeStatus"], string>;
    orderCueFallback: string;
  };
};

export function InvoiceCollectionsPanel({
  featuredInvoice,
  locale,
  summary,
  translations,
}: InvoiceCollectionsPanelProps) {
  return (
    <div className="section-stack">
      <div className="metric-rail-grid">
        <MetricCard
          label={translations.summaryCards.unpaid}
          value={`${summary.unpaidCount}`}
          hint={translations.summaryCards.unpaidHint}
          trend={-1}
          tone="warning"
        />
        <MetricCard
          label={translations.summaryCards.pending}
          value={`${summary.pendingCount}`}
          hint={translations.summaryCards.pendingHint}
          trend={1}
          tone="neutral"
        />
        <MetricCard
          label={translations.summaryCards.overdue}
          value={formatCurrency(summary.overdueExposure, locale)}
          hint={translations.summaryCards.overdueHint}
          trend={-3}
          tone="critical"
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
            <p className="mt-2 text-2xl font-semibold">{featuredInvoice.id}</p>
            <p className="mt-1 text-sm text-primary-foreground/74">
              {featuredInvoice.customerName}
            </p>
            <p className="mt-3 text-sm leading-6 text-primary-foreground/86">
              {translations.featuredDescription}
            </p>
          </div>

          <div className="panel-secondary space-y-4 px-5 py-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="subtle-label text-muted-foreground">
                  {translations.meta.paymentStatus}
                </p>
                <p className="mt-2">
                  <StatusBadge
                    status={featuredInvoice.badgeStatus}
                    label={translations.badgeLabels[featuredInvoice.badgeStatus]}
                  />
                </p>
              </div>
              <div className="text-right">
                <p className="subtle-label text-muted-foreground">
                  {translations.meta.outstandingAmount}
                </p>
                <p className="mt-2 text-sm font-semibold">
                  {formatCurrency(featuredInvoice.outstandingAmount, locale)}
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
                    {featuredInvoice.customerName}
                  </p>
                </div>
                <div>
                  <p className="subtle-label text-muted-foreground">
                    {translations.meta.amount}
                  </p>
                  <p className="mt-1 text-sm font-medium">
                    {formatCurrency(featuredInvoice.amount, locale)}
                  </p>
                </div>
              </div>

              <div className="panel-meta-row">
                <div>
                  <p className="subtle-label text-muted-foreground">
                    {translations.meta.issueDate}
                  </p>
                  <p className="mt-1 text-sm font-medium">
                    {formatDate(featuredInvoice.issueDate, locale)}
                  </p>
                </div>
                <div>
                  <p className="subtle-label text-muted-foreground">
                    {translations.meta.dueDate}
                  </p>
                  <p className="mt-1 text-sm font-medium">
                    {formatDate(featuredInvoice.dueDate, locale)}
                  </p>
                </div>
              </div>

              <div className="panel-meta-row">
                <div>
                  <p className="subtle-label text-muted-foreground">
                    {translations.meta.paidAmount}
                  </p>
                  <p className="mt-1 text-sm font-medium">
                    {formatCurrency(featuredInvoice.paidAmount, locale)}
                  </p>
                </div>
                <div>
                  <p className="subtle-label text-muted-foreground">
                    {translations.meta.orderReference}
                  </p>
                  <p className="mt-1 text-sm font-medium">
                    {featuredInvoice.orderReference ??
                      translations.orderCueFallback}
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
