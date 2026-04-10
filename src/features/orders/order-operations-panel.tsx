import { MetricCard } from "@/components/shared/metric-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AppLocale } from "@/lib/constants/site";
import { formatCurrency, formatDate } from "@/lib/formatting";
import type { OrderOverviewRow, OrdersOverviewSummary } from "@/types/domain";

type OrderOperationsPanelProps = {
  featuredOrder: OrderOverviewRow;
  locale: AppLocale;
  summary: OrdersOverviewSummary;
  translations: {
    title: string;
    description: string;
    featuredLabel: string;
    featuredDescription: string;
    summaryCards: {
      inProduction: string;
      inProductionHint: string;
      readyToDispatch: string;
      readyToDispatchHint: string;
      billingFollowUp: string;
      billingFollowUpHint: string;
    };
    meta: {
      customer: string;
      orderDate: string;
      deliveryDate: string;
      itemSummary: string;
      invoice: string;
      paymentStatus: string;
      orderStatus: string;
      totalAmount: string;
    };
    orderStatuses: Record<OrderOverviewRow["status"], string>;
    paymentStatuses: Record<OrderOverviewRow["paymentStatus"], string>;
    awaitingInvoice: string;
  };
};

export function OrderOperationsPanel({
  featuredOrder,
  locale,
  summary,
  translations,
}: OrderOperationsPanelProps) {
  return (
    <div className="section-stack">
      <div className="metric-rail-grid">
        <MetricCard
          label={translations.summaryCards.inProduction}
          value={`${summary.inProductionCount}`}
          hint={translations.summaryCards.inProductionHint}
          trend={5}
          tone="critical"
        />
        <MetricCard
          label={translations.summaryCards.readyToDispatch}
          value={`${summary.readyToDispatchCount}`}
          hint={translations.summaryCards.readyToDispatchHint}
          trend={4}
          tone="success"
        />
        <MetricCard
          label={translations.summaryCards.billingFollowUp}
          value={`${summary.billingFollowUpCount}`}
          hint={translations.summaryCards.billingFollowUpHint}
          trend={-2}
          tone="warning"
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
            <p className="mt-2 text-2xl font-semibold">
              {featuredOrder.referenceCode}
            </p>
            <p className="mt-1 text-sm text-primary-foreground/74">
              {featuredOrder.customerName}
            </p>
            <p className="mt-3 text-sm leading-6 text-primary-foreground/86">
              {translations.featuredDescription}
            </p>
          </div>

          <div className="panel-secondary space-y-4 px-5 py-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="subtle-label text-muted-foreground">
                  {translations.meta.orderStatus}
                </p>
                <p className="mt-2">
                  <StatusBadge
                    status={featuredOrder.status}
                    label={translations.orderStatuses[featuredOrder.status]}
                  />
                </p>
              </div>
              <div className="text-right">
                <p className="subtle-label text-muted-foreground">
                  {translations.meta.paymentStatus}
                </p>
                <p className="mt-2">
                  <StatusBadge
                    status={featuredOrder.paymentStatus}
                    label={
                      translations.paymentStatuses[featuredOrder.paymentStatus]
                    }
                  />
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
                    {featuredOrder.customerName}
                  </p>
                </div>
                <div>
                  <p className="subtle-label text-muted-foreground">
                    {translations.meta.totalAmount}
                  </p>
                  <p className="mt-1 text-sm font-semibold">
                    {formatCurrency(featuredOrder.totalAmount, locale)}
                  </p>
                </div>
              </div>

              <div className="panel-meta-row">
                <div>
                  <p className="subtle-label text-muted-foreground">
                    {translations.meta.orderDate}
                  </p>
                  <p className="mt-1 text-sm font-medium">
                    {formatDate(featuredOrder.orderDate, locale)}
                  </p>
                </div>
                <div>
                  <p className="subtle-label text-muted-foreground">
                    {translations.meta.deliveryDate}
                  </p>
                  <p className="mt-1 text-sm font-medium">
                    {formatDate(featuredOrder.deliveryDate, locale)}
                  </p>
                </div>
              </div>

              <div>
                <p className="subtle-label text-muted-foreground">
                  {translations.meta.itemSummary}
                </p>
                <p className="mt-1 text-sm font-medium">
                  {featuredOrder.itemSummary}
                </p>
              </div>

              <div>
                <p className="subtle-label text-muted-foreground">
                  {translations.meta.invoice}
                </p>
                <p className="mt-1 text-sm font-medium">
                  {featuredOrder.invoiceId ?? translations.awaitingInvoice}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
