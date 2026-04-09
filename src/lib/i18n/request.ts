import { getRequestConfig } from "next-intl/server";

import { siteConfig } from "@/lib/constants/site";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !siteConfig.locales.includes(locale as (typeof siteConfig.locales)[number])) {
    locale = siteConfig.defaultLocale;
  }

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
