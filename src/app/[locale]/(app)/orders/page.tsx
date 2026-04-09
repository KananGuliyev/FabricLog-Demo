import { getTranslations } from "next-intl/server";

import { OrderIntakePreview } from "@/components/forms/order-intake-preview";
import { MetricCard } from "@/components/shared/metric-card";
import { PageIntro } from "@/components/shared/page-intro";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OrdersTable } from "@/features/orders/orders-table";
import type { AppLocale } from "@/lib/constants/site";
import { formatCurrency } from "@/lib/formatting";
import { fabricLogService } from "@/server/services/fabriclog-service";

type OrdersPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function OrdersPage({ params }: OrdersPageProps) {
  const { locale } = await params;
  const appLocale = locale as AppLocale;
  const t = await getTranslations({ locale, namespace: "Orders" });
  const tCommon = await getTranslations({ locale, namespace: "Common" });

  const orders = fabricLogService.getOrders();
  const customers = fabricLogService.getCustomers();
  const fabrics = fabricLogService.getFabrics();

  const orderRows = orders.map((order) => ({
    ...order,
    customerName:
      customers.find((customer) => customer.id === order.customerId)?.company ??
      "Unknown",
    fabricName:
      fabrics.find((fabric) => fabric.id === order.fabricId)?.name ?? "Unknown",
  }));

  const liveValue = orders.reduce((sum, order) => sum + order.amount, 0);

  return (
    <div className="space-y-8">
      <PageIntro
        badge={tCommon("demoBadge")}
        title={t("title")}
        description={t("description")}
      />

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label={t("cards.liveOrderValue")}
          value={formatCurrency(liveValue, appLocale)}
          hint="Total seeded order portfolio currently tracked in the demo"
          trend={16}
          tone="success"
        />
        <MetricCard
          label={t("cards.inProduction")}
          value={`${orders.filter((order) => order.status === "production").length}`}
          hint="Orders actively moving through cutting and finishing"
          trend={5}
          tone="critical"
        />
        <MetricCard
          label={t("cards.readyToDispatch")}
          value={`${orders.filter((order) => order.status === "ready").length}`}
          hint="Orders prepared for final QA and outbound coordination"
          trend={4}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.45fr_0.55fr]">
        <OrdersTable data={orderRows} locale={appLocale} />

        <Card className="surface-panel border-0">
          <CardHeader>
            <CardTitle>{t("cards.formFoundation")}</CardTitle>
          </CardHeader>
          <CardContent>
            <OrderIntakePreview />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
