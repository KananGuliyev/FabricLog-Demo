import type { MetadataRoute } from "next";

import { getSiteOrigin, siteConfig } from "@/lib/constants/site";

const publicRoutes = [
  "/",
  "/login",
  "/dashboard",
  "/customers",
  "/products",
  "/orders",
  "/invoices",
  "/payments",
  "/reports",
  "/settings",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const siteOrigin = getSiteOrigin();

  return siteConfig.locales.flatMap((locale) =>
    publicRoutes.map((route) => ({
      url: `${siteOrigin}/${locale}${route === "/" ? "" : route}`,
      lastModified: siteConfig.demoLastUpdatedAt,
      changeFrequency: route === "/" ? "weekly" : "monthly",
      priority: route === "/" ? 1 : route === "/dashboard" ? 0.9 : 0.7,
    }))
  );
}
