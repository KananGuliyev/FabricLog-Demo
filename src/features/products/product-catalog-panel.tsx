import { StatusBadge } from "@/components/shared/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AppLocale } from "@/lib/constants/site";
import { formatCurrency, formatNumber, formatPercent } from "@/lib/formatting";
import type {
  ProductOverviewRow,
  ProductsOverviewSummary,
} from "@/types/domain";

type ProductCatalogPanelProps = {
  featuredProduct: ProductOverviewRow;
  locale: AppLocale;
  summary: ProductsOverviewSummary;
  translations: {
    title: string;
    description: string;
    featuredLabel: string;
    featuredDescription: string;
    categoryBreakdownTitle: string;
    categoryBreakdownDescription: string;
    categoryLabel: (category: string) => string;
    availabilityLabels: Record<ProductOverviewRow["status"], string>;
    pressureLabels: Record<"critical" | "healthy" | "watch", string>;
    meta: {
      category: string;
      availability: string;
      available: string;
      price: string;
      pressure: string;
      stock: string;
    };
    breakdown: {
      productsCount: string;
      reservationShare: string;
    };
  };
  pressureKey: "critical" | "healthy" | "watch";
};

export function ProductCatalogPanel({
  featuredProduct,
  locale,
  summary,
  translations,
  pressureKey,
}: ProductCatalogPanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{translations.title}</CardTitle>
        <p className="body-copy text-sm text-muted-foreground">
          {translations.description}
        </p>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="rounded-[1.75rem] bg-primary px-5 py-5 text-primary-foreground shadow-sm shadow-primary/15">
          <p className="subtle-label text-primary-foreground/72">
            {translations.featuredLabel}
          </p>
          <p className="mt-2 text-2xl font-semibold">{featuredProduct.name}</p>
          <p className="mt-1 text-sm text-primary-foreground/74">
            {featuredProduct.sku}
          </p>
          <p className="mt-3 text-sm leading-6 text-primary-foreground/86">
            {translations.featuredDescription}
          </p>
        </div>

        <div className="panel-secondary space-y-4 px-5 py-5">
          <div className="flex items-center justify-between gap-3">
            <p className="subtle-label text-muted-foreground">
              {translations.meta.availability}
            </p>
            <StatusBadge
              status={featuredProduct.status}
              label={translations.availabilityLabels[featuredProduct.status]}
            />
          </div>

          <div className="grid gap-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="subtle-label text-muted-foreground">
                  {translations.meta.category}
                </p>
                <p className="mt-1 text-sm font-medium">
                  {translations.categoryLabel(featuredProduct.category)}
                </p>
              </div>
              <div>
                <p className="subtle-label text-muted-foreground">
                  {translations.meta.price}
                </p>
                <p className="mt-1 text-sm font-medium">
                  {formatCurrency(featuredProduct.unitPrice, locale)}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="subtle-label text-muted-foreground">
                  {translations.meta.stock}
                </p>
                <p className="mt-1 text-sm font-medium">
                  {formatNumber(featuredProduct.stockMeters, locale)} m
                </p>
              </div>
              <div>
                <p className="subtle-label text-muted-foreground">
                  {translations.meta.available}
                </p>
                <p className="mt-1 text-sm font-medium">
                  {formatNumber(featuredProduct.availableMeters, locale)} m
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 rounded-2xl border border-border/80 bg-background px-4 py-3">
              <div>
                <p className="subtle-label text-muted-foreground">
                  {translations.meta.pressure}
                </p>
                <p className="mt-1 text-sm font-medium">
                  {translations.pressureLabels[pressureKey]}
                </p>
              </div>
              <p className="text-sm font-semibold text-foreground">
                {formatPercent(featuredProduct.reservationRate, locale)}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <p className="section-title text-base">
              {translations.categoryBreakdownTitle}
            </p>
            <p className="body-copy mt-1 text-sm text-muted-foreground">
              {translations.categoryBreakdownDescription}
            </p>
          </div>

          <div className="space-y-3">
            {summary.categoryBreakdown.slice(0, 4).map((item) => (
              <div
                key={item.category}
                className="flex items-center justify-between gap-4 rounded-2xl border border-border/70 bg-muted/22 px-4 py-3"
              >
                <div>
                  <p className="text-sm font-medium">
                    {translations.categoryLabel(item.category)}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {translations.breakdown.productsCount.replace(
                      "{count}",
                      formatNumber(item.productsCount, locale)
                    )}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">
                    {formatPercent(item.reservationRate, locale)}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {translations.breakdown.reservationShare.replace(
                      "{value}",
                      `${formatNumber(item.reservedMeters, locale)} m`
                    )}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
