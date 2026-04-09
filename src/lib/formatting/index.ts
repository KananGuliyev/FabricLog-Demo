import { siteConfig, type AppLocale } from "@/lib/constants/site";

const localeMap: Record<AppLocale, string> = {
  en: "en-US",
  az: "az-Latn-AZ",
};

export function getIntlLocale(locale: AppLocale) {
  return localeMap[locale];
}

export function formatCurrency(value: number, locale: AppLocale) {
  return new Intl.NumberFormat(getIntlLocale(locale), {
    style: "currency",
    currency: siteConfig.currency,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatNumber(value: number, locale: AppLocale) {
  return new Intl.NumberFormat(getIntlLocale(locale)).format(value);
}

export function formatPercent(value: number, locale: AppLocale) {
  return new Intl.NumberFormat(getIntlLocale(locale), {
    style: "percent",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDate(value: string, locale: AppLocale) {
  return new Intl.DateTimeFormat(getIntlLocale(locale), {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}
