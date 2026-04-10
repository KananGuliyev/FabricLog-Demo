import { getTranslations } from "next-intl/server";

import { MetricCard } from "@/components/shared/metric-card";
import { PageIntro } from "@/components/shared/page-intro";
import { ProductsTable } from "@/features/products/products-table";
import type { AppLocale } from "@/lib/constants/site";
import { formatCurrency, formatNumber } from "@/lib/formatting";
import { fabricLogService } from "@/server/services/fabriclog-service";

type ProductsPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function ProductsPage({ params }: ProductsPageProps) {
  const { locale } = await params;
  const appLocale = locale as AppLocale;
  const t = await getTranslations({ locale, namespace: "Products" });
  const tCommon = await getTranslations({ locale, namespace: "Common" });

  const products = fabricLogService.getFabrics();
  const totalStock = products.reduce((sum, product) => sum + product.stockMeters, 0);
  const reservedStock = products.reduce(
    (sum, product) => sum + product.reservedMeters,
    0
  );
  const avgPrice =
    products.reduce((sum, product) => sum + product.unitPrice, 0) /
    products.length;

  return (
    <div className="page-grid">
      <PageIntro
        badge={tCommon("demoBadge")}
        title={t("title")}
        description={t("description")}
      />

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label={t("cards.totalStock")}
          value={`${formatNumber(totalStock, appLocale)} m`}
          hint={t("cards.totalStockHint")}
          trend={11}
          tone="success"
        />
        <MetricCard
          label={t("cards.reservedStock")}
          value={`${formatNumber(reservedStock, appLocale)} m`}
          hint={t("cards.reservedStockHint")}
          trend={7}
          tone="warning"
        />
        <MetricCard
          label={t("cards.averageUnitPrice")}
          value={formatCurrency(avgPrice, appLocale)}
          hint={t("cards.averageUnitPriceHint")}
          trend={3}
        />
      </div>

      <ProductsTable data={products} locale={appLocale} />
    </div>
  );
}
