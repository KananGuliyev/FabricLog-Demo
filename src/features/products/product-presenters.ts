import type { ProductOverviewRow } from "@/types/domain";

const categoryKeyMap: Record<string, string> = {
  Blend: "blend",
  Boucle: "boucle",
  Cotton: "cotton",
  Jacquard: "jacquard",
  Linen: "linen",
  Sheer: "sheer",
  Suiting: "suiting",
  Twill: "twill",
  Velvet: "velvet",
};

export function getProductCategoryKey(category: string) {
  return categoryKeyMap[category] ?? null;
}

export function getProductPressureKey(product: {
  reservationRate: number;
  status: ProductOverviewRow["status"];
}) {
  if (product.status === "low" || product.reservationRate >= 0.65) {
    return "critical";
  }

  if (product.status === "reserved" || product.reservationRate >= 0.4) {
    return "watch";
  }

  return "healthy";
}
