import { getTranslations } from "next-intl/server";

import { CustomerHealthPanel } from "@/features/customers/customer-health-panel";
import { CustomersTable } from "@/features/customers/customers-table";
import { MetricCard } from "@/components/shared/metric-card";
import { PageIntro } from "@/components/shared/page-intro";
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
  const tPaymentStatuses = await getTranslations({
    locale,
    namespace: "Statuses.payment",
  });

  const overview = fabricLogService.getCustomersOverview();

  return (
    <div className="page-grid">
      <PageIntro
        badge={tCommon("demoBadge")}
        title={t("title")}
        description={t("description")}
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label={t("cards.totalAccounts")}
          value={`${overview.summary.totalCustomers}`}
          hint={t("cards.totalAccountsHint")}
          trend={9}
        />
        <MetricCard
          label={t("cards.signatureCustomers")}
          value={`${overview.summary.signatureCustomers}`}
          hint={t("cards.signatureCustomersHint")}
          trend={6}
          tone="success"
        />
        <MetricCard
          label={t("cards.followUpCustomers")}
          value={`${overview.summary.followUpCustomers}`}
          hint={t("cards.followUpCustomersHint")}
          trend={7}
          tone="warning"
        />
        <MetricCard
          label={t("cards.outstandingBalance")}
          value={formatCurrency(overview.summary.totalOutstandingBalance, appLocale)}
          hint={t("cards.outstandingBalanceHint")}
          trend={-4}
          tone="warning"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.45fr_0.55fr]">
        <CustomersTable data={overview.rows} locale={appLocale} />

        <CustomerHealthPanel
          featuredCustomer={overview.featuredCustomer}
          locale={appLocale}
          summary={overview.summary}
          translations={{
            featured: t("featured"),
            featuredDescription: t("featuredDescription", {
              name: overview.featuredCustomer.name,
              collection: overview.featuredCustomer.preferredCollection,
            }),
            statsTitle: t("healthPanel.title"),
            statsDescription: t("healthPanel.description"),
            summaryCards: {
              growthCustomers: t("healthPanel.cards.growthCustomers"),
              growthCustomersHint: t("healthPanel.cards.growthCustomersHint"),
              overdueCustomers: t("healthPanel.cards.overdueCustomers"),
              overdueCustomersHint: t("healthPanel.cards.overdueCustomersHint"),
              followUpCustomers: t("healthPanel.cards.followUpCustomers"),
              followUpCustomersHint: t("healthPanel.cards.followUpCustomersHint"),
            },
            featuredMeta: {
              collection: t("healthPanel.featured.collection"),
              contact: t("healthPanel.featured.contact"),
              exposure: t("cards.exposure"),
              paymentHealth: t("healthPanel.featured.paymentHealth"),
              lastActivity: t("healthPanel.featured.lastActivity"),
            },
            paymentStatuses: {
              none: tPaymentStatuses("none"),
              paid: tPaymentStatuses("paid"),
              pending: tPaymentStatuses("pending"),
              partial: tPaymentStatuses("partial"),
              overdue: tPaymentStatuses("overdue"),
            },
          }}
        />
      </div>
    </div>
  );
}
