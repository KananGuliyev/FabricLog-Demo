export const siteConfig = {
  name: "FabricLog",
  description:
    "A portfolio-safe textile operations demo for customers, stock, orders, invoices, and payments.",
  defaultLocale: "en",
  locales: ["en", "az"] as const,
  currency: "AZN",
} as const;

export type AppLocale = (typeof siteConfig.locales)[number];

export function isAppLocale(value: string): value is AppLocale {
  return siteConfig.locales.includes(value as AppLocale);
}
