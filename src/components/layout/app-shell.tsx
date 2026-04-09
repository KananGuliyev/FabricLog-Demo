"use client";

import { useLocale, useTranslations } from "next-intl";

import { AppContentFrame } from "@/components/layout/app-content-frame";
import { AppHeader } from "@/components/layout/app-header";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { LanguageSwitcher } from "@/components/navigation/language-switcher";
import {
  findRouteByPath,
  navigationItems,
} from "@/components/navigation/navigation-config";
import { usePathname } from "@/lib/i18n/navigation";

type AppShellProps = {
  children: React.ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  const locale = useLocale();
  const pathname = usePathname();
  const tShell = useTranslations("Shell");
  const tCommon = useTranslations("Common");
  const tNavigation = useTranslations("Navigation");

  const currentItem = findRouteByPath(pathname) ?? navigationItems[0]!;
  const localeName =
    locale === "en"
      ? tCommon("localeEnglish")
      : tCommon("localeAzerbaijani");

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[18rem_1fr]">
      <AppSidebar
        activePath={pathname}
        infoLabel={tShell("subtitle")}
        infoText={tCommon("portfolioNote")}
        items={navigationItems}
        localeLabel={tCommon("localeLabel")}
        localeName={localeName}
        localeNote={tShell("demoSafe")}
      />

      <div className="flex min-h-screen flex-col">
        <AppHeader
          activePath={pathname}
          currentTitle={tNavigation(currentItem.labelKey)}
          demoBadge={tCommon("demoBadge")}
          items={navigationItems}
          lastUpdatedLabel={tCommon("updatedLabel")}
          mobileMenuLabel={tShell("mobileMenuLabel")}
          searchActionLabel={tShell("searchActionLabel")}
          searchHint={tShell("welcomeBack")}
          updatedValue="09 Apr 2026"
          languageSwitcher={<LanguageSwitcher />}
        />

        <AppContentFrame>{children}</AppContentFrame>
      </div>
    </div>
  );
}
