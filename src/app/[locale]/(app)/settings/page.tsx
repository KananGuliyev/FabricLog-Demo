import { LayoutGrid, Rows3, Sparkles } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { MetricCard } from "@/components/shared/metric-card";
import { PageIntro } from "@/components/shared/page-intro";
import { SettingsAboutPanel } from "@/features/settings/settings-about-panel";
import { SettingsDisclaimerPanel } from "@/features/settings/settings-disclaimer-panel";
import { SettingsLanguagePanel } from "@/features/settings/settings-language-panel";
import { SettingsPreferencesPanel } from "@/features/settings/settings-preferences-panel";
import { SettingsProfilePanel } from "@/features/settings/settings-profile-panel";
import type { AppLocale } from "@/lib/constants/site";

type SettingsPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function SettingsPage({ params }: SettingsPageProps) {
  const { locale } = await params;
  const appLocale = locale as AppLocale;
  const t = await getTranslations({ locale, namespace: "Settings" });
  const tCommon = await getTranslations({ locale, namespace: "Common" });
  const activeLocaleLabel =
    appLocale === "az"
      ? tCommon("localeAzerbaijani")
      : tCommon("localeEnglish");

  return (
    <div className="page-grid">
      <PageIntro
        badge={tCommon("demoBadge")}
        title={t("title")}
        description={t("description")}
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <MetricCard
          label={t("cards.activeLocale")}
          value={activeLocaleLabel}
          hint={t("cards.activeLocaleHint")}
          tone="success"
        />
        <MetricCard
          label={t("cards.interfaceMode")}
          value={t("cards.interfaceModeValue")}
          hint={t("cards.interfaceModeHint")}
        />
        <MetricCard
          label={t("cards.workspaceState")}
          value={t("cards.workspaceStateValue")}
          hint={t("cards.workspaceStateHint")}
          tone="warning"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="section-stack">
          <SettingsProfilePanel
            title={t("profile.title")}
            description={t("profile.description")}
            badgeLabel={t("badges.demoWorkspace")}
            profile={{
              name: t("profile.name"),
              role: t("profile.role"),
              workspace: t("profile.workspace"),
              summary: t("profile.summary"),
              email: t("profile.email"),
              region: t("profile.region"),
            }}
            labels={{
              role: t("profile.meta.role"),
              email: t("profile.meta.email"),
              workspace: t("profile.meta.workspace"),
              region: t("profile.meta.region"),
            }}
          />

          <SettingsLanguagePanel
            title={t("language.title")}
            description={t("language.description")}
            switcherLabel={t("language.switcherLabel")}
            switcherDescription={t("language.switcherDescription")}
            supportNote={t("language.supportNote")}
            locales={[
              {
                code: "EN",
                label: tCommon("localeEnglish"),
                description: t("language.localeCards.enDescription"),
                active: appLocale === "en",
              },
              {
                code: "AZ",
                label: tCommon("localeAzerbaijani"),
                description: t("language.localeCards.azDescription"),
                active: appLocale === "az",
              },
            ]}
            statuses={{
              active: t("badges.active"),
              available: t("badges.available"),
            }}
          />
        </div>

        <div className="section-stack">
          <SettingsPreferencesPanel
            title={t("preferences.title")}
            description={t("preferences.description")}
            badgeLabel={t("badges.readOnly")}
            items={[
              {
                id: "density",
                title: t("preferences.items.density.title"),
                description: t("preferences.items.density.description"),
                value: t("preferences.items.density.value"),
                icon: Rows3,
              },
              {
                id: "statusVisibility",
                title: t("preferences.items.statusVisibility.title"),
                description: t("preferences.items.statusVisibility.description"),
                value: t("preferences.items.statusVisibility.value"),
                icon: LayoutGrid,
              },
              {
                id: "summaryMode",
                title: t("preferences.items.summaryMode.title"),
                description: t("preferences.items.summaryMode.description"),
                value: t("preferences.items.summaryMode.value"),
                icon: Sparkles,
              },
            ]}
          />

          <SettingsAboutPanel
            title={t("about.title")}
            description={t("about.description")}
            badgeLabel={t("badges.readOnly")}
            eyebrow={t("about.eyebrow")}
            summary={t("about.summary")}
            meta={{
              product: t("about.meta.product"),
              positioning: t("about.meta.positioning"),
              foundation: t("about.meta.foundation"),
              coverage: t("about.meta.coverage"),
            }}
            values={{
              product: tCommon("appName"),
              positioning: t("about.values.positioning"),
              foundation: t("about.values.foundation"),
              coverage: t("about.values.coverage"),
            }}
            highlights={[
              t("about.highlights.bilingual"),
              t("about.highlights.mockData"),
              t("about.highlights.publicSafe"),
            ]}
          />
        </div>
      </div>

      <SettingsDisclaimerPanel
        title={t("disclaimer.title")}
        description={t("disclaimer.description")}
        badgeLabel={t("badges.publicSafe")}
        body={t("disclaimer.body")}
        items={[
          t("disclaimer.items.customers"),
          t("disclaimer.items.finance"),
          t("disclaimer.items.controls"),
        ]}
      />
    </div>
  );
}
