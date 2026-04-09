import { getTranslations } from "next-intl/server";

import { MetricCard } from "@/components/shared/metric-card";
import { PageIntro } from "@/components/shared/page-intro";
import { InvoicesTable } from "@/features/invoices/invoices-table";
import type { AppLocale } from "@/lib/constants/site";
import { formatCurrency } from "@/lib/formatting";
import { fabricLogService } from "@/server/services/fabriclog-service";

type InvoicesPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function InvoicesPage({ params }: InvoicesPageProps) {
  const { locale } = await params;
  const appLocale = locale as AppLocale;
  const t = await getTranslations({ locale, namespace: "Invoices" });
  const tCommon = await getTranslations({ locale, namespace: "Common" });

  const invoices = fabricLogService.getInvoices();
  const customers = fabricLogService.getCustomers();

  const invoiceRows = invoices.map((invoice) => ({
    ...invoice,
    customerName:
      customers.find((customer) => customer.id === invoice.customerId)?.company ??
      "Unknown",
  }));

  const overdueValue = invoices
    .filter((invoice) => invoice.status === "overdue")
    .reduce((sum, invoice) => sum + (invoice.amount - invoice.paidAmount), 0);

  return (
    <div className="space-y-8">
      <PageIntro
        badge={tCommon("demoBadge")}
        title={t("title")}
        description={t("description")}
      />

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label={t("cards.openInvoiceValue")}
          value={formatCurrency(
            invoices.reduce(
              (sum, invoice) => sum + (invoice.amount - invoice.paidAmount),
              0
            ),
            appLocale
          )}
          hint="Outstanding receivables across pending, partial, and overdue invoices"
          trend={-2}
          tone="warning"
        />
        <MetricCard
          label={t("cards.overdueExposure")}
          value={formatCurrency(overdueValue, appLocale)}
          hint="Receivables already beyond their expected due date"
          trend={-7}
          tone="critical"
        />
        <MetricCard
          label={t("cards.paidInFull")}
          value={`${invoices.filter((invoice) => invoice.status === "paid").length}`}
          hint="Invoices cleared without follow-up"
          trend={10}
          tone="success"
        />
      </div>

      <InvoicesTable data={invoiceRows} locale={appLocale} />
    </div>
  );
}
