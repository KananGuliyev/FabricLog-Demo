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
      tCommon("unknown"),
    fabricName:
      fabrics.find((fabric) => fabric.id === order.fabricId)?.name ??
      tCommon("unknown"),
  }));

  const liveValue = orders.reduce((sum, order) => sum + order.amount, 0);

  return (
    <div className="page-grid">
      <PageIntro
        badge={tCommon("demoBadge")}
        title={t("title")}
        description={t("description")}
      />

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label={t("cards.liveOrderValue")}
          value={formatCurrency(liveValue, appLocale)}
          hint={t("cards.liveOrderValueHint")}
          trend={16}
          tone="success"
        />
        <MetricCard
          label={t("cards.inProduction")}
          value={`${orders.filter((order) => order.status === "production").length}`}
          hint={t("cards.inProductionHint")}
          trend={5}
          tone="critical"
        />
        <MetricCard
          label={t("cards.readyToDispatch")}
          value={`${orders.filter((order) => order.status === "ready").length}`}
          hint={t("cards.readyToDispatchHint")}
          trend={4}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.45fr_0.55fr]">
        <OrdersTable data={orderRows} locale={appLocale} />

        <Card>
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
