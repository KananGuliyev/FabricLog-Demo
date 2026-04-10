import { MetricCard } from "@/components/shared/metric-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AppLocale } from "@/lib/constants/site";
import { formatCurrency, formatDate } from "@/lib/formatting";
import type {
  CustomerOverviewRow,
  CustomersOverviewSummary,
} from "@/types/domain";

type CustomerHealthPanelProps = {
  featuredCustomer: CustomerOverviewRow;
  locale: AppLocale;
  summary: CustomersOverviewSummary;
  translations: {
    featured: string;
    featuredDescription: string;
    statsDescription: string;
    statsTitle: string;
    summaryCards: {
      growthCustomers: string;
      growthCustomersHint: string;
      overdueCustomers: string;
      overdueCustomersHint: string;
      followUpCustomers: string;
      followUpCustomersHint: string;
    };
    featuredMeta: {
      collection: string;
      contact: string;
      exposure: string;
      paymentHealth: string;
      lastActivity: string;
    };
    paymentStatuses: Record<CustomerOverviewRow["paymentHealth"], string>;
  };
};

export function CustomerHealthPanel({
  featuredCustomer,
  locale,
  summary,
  translations,
}: CustomerHealthPanelProps) {
  return (
    <div className="section-stack">
      <div className="metric-rail-grid">
        <MetricCard
          label={translations.summaryCards.growthCustomers}
          value={`${summary.growthCustomers}`}
          hint={translations.summaryCards.growthCustomersHint}
          trend={5}
          tone="neutral"
        />
        <MetricCard
          label={translations.summaryCards.overdueCustomers}
          value={`${summary.overdueCustomers}`}
          hint={translations.summaryCards.overdueCustomersHint}
          trend={-1}
          tone="critical"
        />
        <MetricCard
          label={translations.summaryCards.followUpCustomers}
          value={`${summary.followUpCustomers}`}
          hint={translations.summaryCards.followUpCustomersHint}
          trend={7}
          tone="warning"
        />
      </div>

      <Card size="sm">
        <CardHeader>
          <CardTitle>{translations.statsTitle}</CardTitle>
          <p className="body-copy text-sm text-muted-foreground">
            {translations.statsDescription}
          </p>
        </CardHeader>
        <CardContent className="space-y-4 pt-0">
          <div className="panel-highlight">
            <p className="subtle-label text-primary-foreground/72">
              {translations.featured}
            </p>
            <p className="mt-2 text-2xl font-semibold">
              {featuredCustomer.company}
            </p>
            <p className="mt-2 text-sm leading-6 text-primary-foreground/86">
              {translations.featuredDescription}
            </p>
          </div>

          <div className="panel-secondary space-y-4 px-5 py-5">
            <div className="flex items-center justify-between gap-3">
              <p className="subtle-label text-muted-foreground">
                {translations.featuredMeta.paymentHealth}
              </p>
              <StatusBadge
                status={featuredCustomer.paymentHealth}
                label={
                  translations.paymentStatuses[featuredCustomer.paymentHealth]
                }
              />
            </div>

            <div className="panel-meta-grid">
              <div>
                <p className="subtle-label text-muted-foreground">
                  {translations.featuredMeta.collection}
                </p>
                <p className="mt-1 text-sm font-medium">
                  {featuredCustomer.preferredCollection}
                </p>
              </div>
              <div>
                <p className="subtle-label text-muted-foreground">
                  {translations.featuredMeta.contact}
                </p>
                <p className="mt-1 text-sm font-medium">
                  {featuredCustomer.email}
                </p>
              </div>
              <div className="flex items-center justify-between gap-4 rounded-2xl border border-border/70 bg-background/90 px-4 py-3">
                <div>
                  <p className="subtle-label text-muted-foreground">
                    {translations.featuredMeta.lastActivity}
                  </p>
                  <p className="mt-1 text-sm font-medium">
                    {formatDate(featuredCustomer.lastActivityDate, locale)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="subtle-label text-muted-foreground">
                    {translations.featuredMeta.exposure}
                  </p>
                  <p className="mt-1 text-sm font-semibold">
                    {formatCurrency(featuredCustomer.outstandingBalance, locale)}
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
