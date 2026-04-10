import {
  productsOverviewSchema,
  type FabricProduct,
  type ProductCategoryBreakdown,
  type ProductOverviewRow,
} from "@/types/domain";

const statusPriority: Record<FabricProduct["status"], number> = {
  low: 0,
  reserved: 1,
  available: 2,
};

function toProductOverviewRow(product: FabricProduct): ProductOverviewRow {
  const availableMeters = Math.max(product.stockMeters - product.reservedMeters, 0);
  const reservationRate =
    product.stockMeters === 0 ? 0 : product.reservedMeters / product.stockMeters;

  return {
    ...product,
    availableMeters,
    reservationRate,
  };
}

function buildCategoryBreakdown(
  rows: ProductOverviewRow[]
): ProductCategoryBreakdown[] {
  const aggregates = new Map<
    string,
    Omit<ProductCategoryBreakdown, "reservationRate">
  >();

  rows.forEach((row) => {
    const current = aggregates.get(row.category) ?? {
      category: row.category,
      productsCount: 0,
      stockMeters: 0,
      reservedMeters: 0,
    };

    current.productsCount += 1;
    current.stockMeters += row.stockMeters;
    current.reservedMeters += row.reservedMeters;
    aggregates.set(row.category, current);
  });

  return [...aggregates.values()]
    .map((item) => ({
      ...item,
      reservationRate:
        item.stockMeters === 0 ? 0 : item.reservedMeters / item.stockMeters,
    }))
    .sort((left, right) => {
      if (right.reservedMeters !== left.reservedMeters) {
        return right.reservedMeters - left.reservedMeters;
      }

      return left.category.localeCompare(right.category);
    });
}

export function buildProductsOverview(params: { fabrics: FabricProduct[] }) {
  const rows = params.fabrics
    .map(toProductOverviewRow)
    .sort((left, right) => {
      const byStatus = statusPriority[left.status] - statusPriority[right.status];

      if (byStatus !== 0) {
        return byStatus;
      }

      if (right.reservationRate !== left.reservationRate) {
        return right.reservationRate - left.reservationRate;
      }

      return left.name.localeCompare(right.name);
    });

  const featuredProduct =
    [...rows].sort((left, right) => {
      const leftPriority = left.status === "available" ? 1 : 0;
      const rightPriority = right.status === "available" ? 1 : 0;

      if (leftPriority !== rightPriority) {
        return leftPriority - rightPriority;
      }

      if (right.reservationRate !== left.reservationRate) {
        return right.reservationRate - left.reservationRate;
      }

      if (right.reservedMeters !== left.reservedMeters) {
        return right.reservedMeters - left.reservedMeters;
      }

      return left.name.localeCompare(right.name);
    })[0] ?? rows[0];

  return productsOverviewSchema.parse({
    summary: {
      totalProducts: rows.length,
      totalStock: rows.reduce((sum, row) => sum + row.stockMeters, 0),
      reservedStock: rows.reduce((sum, row) => sum + row.reservedMeters, 0),
      lowStockCount: rows.filter((row) => row.status === "low").length,
      categoryBreakdown: buildCategoryBreakdown(rows),
    },
    rows,
    featuredProduct,
  });
}
