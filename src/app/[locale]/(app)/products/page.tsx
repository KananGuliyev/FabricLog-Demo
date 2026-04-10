import { getTranslations } from "next-intl/server";

import { MetricCard } from "@/components/shared/metric-card";
import { PageIntro } from "@/components/shared/page-intro";
import { ProductCatalogPanel } from "@/features/products/product-catalog-panel";
import {
  getProductCategoryKey,
  getProductPressureKey,
} from "@/features/products/product-presenters";
import { ProductsTable } from "@/features/products/products-table";
import type { AppLocale } from "@/lib/constants/site";
import { formatNumber } from "@/lib/formatting";
import { fabricLogService } from "@/server/services/fabriclog-service";

type ProductsPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function ProductsPage({ params }: ProductsPageProps) {
  const { locale } = await params;
  const appLocale = locale as AppLocale;
  const t = await getTranslations({ locale, namespace: "Products" });
  const tCommon = await getTranslations({ locale, namespace: "Common" });
  const tStatuses = await getTranslations({
    locale,
    namespace: "Statuses.fabric",
  });

  const overview = fabricLogService.getProductsOverview();

  return (
    <div className="page-grid">
      <PageIntro
        badge={tCommon("demoBadge")}
        title={t("title")}
        description={t("description")}
      />

      <div className="page-metrics-grid">
        <MetricCard
          label={t("cards.totalProducts")}
          value={`${overview.summary.totalProducts}`}
          hint={t("cards.totalProductsHint")}
          trend={5}
        />
        <MetricCard
          label={t("cards.totalStock")}
          value={`${formatNumber(overview.summary.totalStock, appLocale)} m`}
          hint={t("cards.totalStockHint")}
          trend={11}
          tone="success"
        />
        <MetricCard
          label={t("cards.reservedStock")}
          value={`${formatNumber(overview.summary.reservedStock, appLocale)} m`}
          hint={t("cards.reservedStockHint")}
          trend={7}
          tone="warning"
        />
        <MetricCard
          label={t("cards.lowStockCount")}
          value={`${overview.summary.lowStockCount}`}
          hint={t("cards.lowStockCountHint")}
          trend={-2}
          tone="critical"
        />
      </div>

      <div className="page-rail-grid">
        <ProductsTable data={overview.rows} locale={appLocale} />

        <ProductCatalogPanel
          featuredProduct={overview.featuredProduct}
          locale={appLocale}
          summary={overview.summary}
          pressureKey={getProductPressureKey(overview.featuredProduct)}
          translations={{
            title: t("panel.title"),
            description: t("panel.description"),
            featuredLabel: t("panel.featuredLabel"),
            featuredDescription: t("panel.featuredDescription", {
              name: overview.featuredProduct.name,
            }),
            categoryBreakdownTitle: t("panel.categoryBreakdownTitle"),
            categoryBreakdownDescription: t(
              "panel.categoryBreakdownDescription"
            ),
            categoryLabel: (category) => {
              const key = getProductCategoryKey(category);

              return key ? t(`categories.${key}`) : category;
            },
            availabilityLabels: {
              available: tStatuses("available"),
              low: tStatuses("low"),
              reserved: tStatuses("reserved"),
            },
            pressureLabels: {
              critical: t("pressure.critical"),
              healthy: t("pressure.healthy"),
              watch: t("pressure.watch"),
            },
            meta: {
              category: t("panel.meta.category"),
              availability: t("panel.meta.availability"),
              available: t("panel.meta.available"),
              price: t("panel.meta.price"),
              pressure: t("panel.meta.pressure"),
              stock: t("panel.meta.stock"),
            },
            breakdown: {
              productsCount: t("panel.breakdown.productsCount"),
              reservationShare: t("panel.breakdown.reservationShare"),
            },
          }}
        />
      </div>
    </div>
  );
}
