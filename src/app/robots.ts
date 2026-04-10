import type { MetadataRoute } from "next";

import {
  getSiteOrigin,
  isProductionDeployment,
} from "@/lib/constants/site";

export default function robots(): MetadataRoute.Robots {
  const siteOrigin = getSiteOrigin();

  return {
    host: new URL(siteOrigin).host,
    sitemap: `${siteOrigin}/sitemap.xml`,
    rules: isProductionDeployment()
      ? {
          userAgent: "*",
          allow: "/",
        }
      : {
          userAgent: "*",
          disallow: "/",
        },
  };
}
