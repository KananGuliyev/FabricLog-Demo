export const siteConfig = {
  name: "FabricLog",
  description:
    "A portfolio-safe textile operations demo for customers, stock, orders, invoices, and payments.",
  titleTemplate: "%s | FabricLog",
  defaultLocale: "en",
  locales: ["en", "az"] as const,
  currency: "AZN",
  demoLastUpdatedAt: "2026-04-09",
  supportEmail: "ayla@fabriclog.demo",
} as const;

export type AppLocale = (typeof siteConfig.locales)[number];
type DeploymentEnvironment = "development" | "preview" | "production";

export function isAppLocale(value: string): value is AppLocale {
  return siteConfig.locales.includes(value as AppLocale);
}

export function getSiteOrigin() {
  const configuredUrl = process.env.SITE_URL?.trim();

  if (configuredUrl) {
    return configuredUrl.startsWith("http")
      ? configuredUrl
      : `https://${configuredUrl}`;
  }

  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }

  return "http://localhost:3000";
}

export function getDeploymentEnvironment(): DeploymentEnvironment {
  const vercelEnv = process.env.VERCEL_ENV;

  if (
    vercelEnv === "development" ||
    vercelEnv === "preview" ||
    vercelEnv === "production"
  ) {
    return vercelEnv;
  }

  return process.env.NODE_ENV === "production" ? "production" : "development";
}

export function isProductionDeployment() {
  return getDeploymentEnvironment() === "production";
}
