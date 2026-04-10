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
import { siteConfig, type AppLocale } from "@/lib/constants/site";
import { formatDate } from "@/lib/formatting";
import { usePathname } from "@/lib/i18n/navigation";
import type { DemoSession } from "@/types/auth";

type AppShellProps = {
  children: React.ReactNode;
  session: DemoSession;
};

export function AppShell({ children, session }: AppShellProps) {
  const locale = useLocale() as AppLocale;
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
          searchHint={tShell("welcomeBack")}
          session={session}
          sessionLabel={tShell("sessionLabel")}
          sessionMetaLabel={tShell("sessionMetaLabel")}
          signOutLabel={tShell("signOut")}
          workspaceLabel={tShell("workspaceLabel")}
          workspaceValue={tShell("workspaceValue")}
          workspaceNote={tShell("workspaceNote")}
          logoutHref={`/${locale}/logout`}
          updatedValue={formatDate(siteConfig.demoLastUpdatedAt, locale)}
          languageSwitcher={<LanguageSwitcher />}
        />

        <AppContentFrame>{children}</AppContentFrame>
      </div>
    </div>
  );
}
