import { getTranslations } from "next-intl/server";

import { MetricCard } from "@/components/shared/metric-card";
import { PageIntro } from "@/components/shared/page-intro";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

  const payments = fabricLogService.getPayments();
  const customers = fabricLogService.getCustomers();

  const paymentRows = payments.map((payment) => ({
    ...payment,
    customerName:
      customers.find((customer) => customer.id === payment.customerId)?.company ??
      tCommon("unknown"),
  }));

  return (
    <div className="page-grid">
      <PageIntro
        badge={tCommon("demoBadge")}
        title={t("title")}
        description={t("description")}
      />

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label={t("cards.collectedPayments")}
          value={formatCurrency(
            payments.reduce((sum, payment) => sum + payment.amount, 0),
            appLocale
          )}
          hint={t("cards.collectedPaymentsHint")}
          trend={12}
          tone="success"
        />
        <MetricCard
          label={t("cards.bankTransfers")}
          value={`${payments.filter((payment) => payment.method.includes("Bank")).length}`}
          hint={t("cards.bankTransfersHint")}
          trend={4}
        />
        <MetricCard
          label={t("cards.partialReceipts")}
          value={`${payments.filter((payment) => payment.status === "partial").length}`}
          hint={t("cards.partialReceiptsHint")}
          trend={-1}
          tone="warning"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.45fr_0.55fr]">
        <PaymentsTable data={paymentRows} locale={appLocale} />

        <Card>
          <CardHeader>
            <CardTitle>{t("cards.collectionNoteTitle")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-6 text-muted-foreground">
            <p>{t("notes.primary")}</p>
            <p>{t("notes.secondary")}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
