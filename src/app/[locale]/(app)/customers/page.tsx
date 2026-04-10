import { getTranslations } from "next-intl/server";

import { CustomersTable } from "@/features/customers/customers-table";
import { MetricCard } from "@/components/shared/metric-card";
import { PageIntro } from "@/components/shared/page-intro";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AppLocale } from "@/lib/constants/site";
import { formatCurrency, formatDate } from "@/lib/formatting";
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
    <div className="page-grid">
      <PageIntro
        badge={tCommon("demoBadge")}
        title={t("title")}
        description={t("description")}
      />

      <div className="grid gap-4 lg:grid-cols-[1.4fr_0.8fr_0.8fr]">
        <MetricCard
          label={t("cards.totalAccounts")}
          value={`${customers.length}`}
          hint={t("cards.totalAccountsHint")}
          trend={9}
        />
        <MetricCard
          label={t("cards.signatureCustomers")}
          value={`${signatureCustomers}`}
          hint={t("cards.signatureCustomersHint")}
          trend={6}
          tone="success"
        />
        <MetricCard
          label={t("cards.outstandingBalance")}
          value={formatCurrency(totalOutstanding, appLocale)}
          hint={t("cards.outstandingBalanceHint")}
          trend={-4}
          tone="warning"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.45fr_0.55fr]">
        <CustomersTable data={customers} locale={appLocale} />

        <Card>
          <CardHeader>
            <CardTitle>{t("featured")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-[1.75rem] bg-primary px-5 py-5 text-primary-foreground shadow-sm shadow-primary/15">
              <p className="subtle-label text-primary-foreground/72">
                {t("cards.signatureAccount")}
              </p>
              <p className="mt-2 text-2xl font-semibold">
                {featuredCustomer.company}
              </p>
              <p className="mt-2 text-sm leading-6 text-primary-foreground/86">
                {t("featuredDescription", {
                  name: featuredCustomer.name,
                  collection: featuredCustomer.preferredCollection,
                })}
              </p>
            </div>
            <div className="panel-secondary px-5 py-5">
              <p className="subtle-label text-muted-foreground">{t("cards.exposure")}</p>
              <p className="mt-1 text-3xl font-semibold">
                {formatCurrency(featuredCustomer.outstandingBalance, appLocale)}
              </p>
              <p className="body-copy mt-2 text-sm text-muted-foreground">
                {t("cards.lastOrderPrefix")}{" "}
                {formatDate(featuredCustomer.lastOrderDate, appLocale)}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
