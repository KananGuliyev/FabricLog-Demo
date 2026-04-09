import { getTranslations } from "next-intl/server";

import { CustomersTable } from "@/features/customers/customers-table";
import { MetricCard } from "@/components/shared/metric-card";
import { PageIntro } from "@/components/shared/page-intro";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AppLocale } from "@/lib/constants/site";
import { formatCurrency } from "@/lib/formatting";
import { fabricLogService } from "@/server/services/fabriclog-service";

type CustomersPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function CustomersPage({ params }: CustomersPageProps) {
  const { locale } = await params;
  const appLocale = locale as AppLocale;
  const t = await getTranslations({ locale, namespace: "Customers" });
  const tCommon = await getTranslations({ locale, namespace: "Common" });

  const customers = fabricLogService.getCustomers();
  const signatureCustomers = customers.filter(
    (customer) => customer.tier === "signature"
  ).length;
  const totalOutstanding = customers.reduce(
    (sum, customer) => sum + customer.outstandingBalance,
    0
  );
  const featuredCustomer = customers[0]!;

  return (
    <div className="space-y-8">
      <PageIntro
        badge={tCommon("demoBadge")}
        title={t("title")}
        description={t("description")}
      />

      <div className="grid gap-4 lg:grid-cols-[1.4fr_0.8fr_0.8fr]">
        <MetricCard
          label={t("cards.totalAccounts")}
          value={`${customers.length}`}
          hint="Balanced between signature hospitality, tailoring, and studio buyers"
          trend={9}
        />
        <MetricCard
          label={t("cards.signatureCustomers")}
          value={`${signatureCustomers}`}
          hint="Highest-value accounts with multi-order relationships"
          trend={6}
          tone="success"
        />
        <MetricCard
          label={t("cards.outstandingBalance")}
          value={formatCurrency(totalOutstanding, appLocale)}
          hint="Portfolio exposure still awaiting collection"
          trend={-4}
          tone="warning"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.45fr_0.55fr]">
        <CustomersTable data={customers} locale={appLocale} />

        <Card className="surface-panel border-0">
          <CardHeader>
            <CardTitle>{t("featured")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-3xl bg-primary px-5 py-5 text-primary-foreground">
              <p className="text-xs uppercase tracking-[0.22em] text-primary-foreground/72">
                {t("cards.signatureAccount")}
              </p>
              <p className="mt-2 text-2xl font-semibold">
                {featuredCustomer.company}
              </p>
              <p className="mt-2 text-sm leading-6 text-primary-foreground/86">
                {featuredCustomer.name} oversees a recurring demand mix focused on{" "}
                {featuredCustomer.preferredCollection}.
              </p>
            </div>
            <div className="rounded-3xl border border-border/70 bg-card px-5 py-5">
              <p className="text-sm text-muted-foreground">{t("cards.exposure")}</p>
              <p className="mt-1 text-3xl font-semibold">
                {formatCurrency(featuredCustomer.outstandingBalance, appLocale)}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                {t("cards.lastOrderPrefix")} {featuredCustomer.lastOrderDate}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
