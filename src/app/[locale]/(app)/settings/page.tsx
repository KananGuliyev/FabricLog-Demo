import { Globe2, LockKeyhole, Palette, SlidersHorizontal } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { FeaturePanel } from "@/components/shared/feature-panel";
import { MetricCard } from "@/components/shared/metric-card";
import { PageIntro } from "@/components/shared/page-intro";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

type SettingsPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function SettingsPage({ params }: SettingsPageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Settings" });
  const tCommon = await getTranslations({ locale, namespace: "Common" });

  return (
    <div className="page-grid">
      <PageIntro
        badge={tCommon("demoBadge")}
        title={t("title")}
        description={t("description")}
      />

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label={t("cards.workspace")}
          value="FabricLog"
          hint={t("cards.workspaceHint")}
          trend={7}
        />
        <MetricCard
          label={t("cards.localization")}
          value={t("cards.localizationValue")}
          hint={t("cards.localizationHint")}
          trend={10}
          tone="success"
        />
        <MetricCard
          label={t("cards.governance")}
          value={t("cards.governanceValue")}
          hint={t("cards.governanceHint")}
          trend={5}
          tone="warning"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <FeaturePanel
          title={t("panels.profileTitle")}
          description={t("panels.profileDescription")}
          action={
            <Badge className="bg-primary/10 text-primary hover:bg-primary/10">
              {t("badges.demoWorkspace")}
            </Badge>
          }
        >
          <div className="panel-secondary flex items-start gap-4 px-5 py-5">
            <Avatar className="size-12 rounded-2xl">
              <AvatarFallback className="rounded-2xl bg-primary text-primary-foreground">
                FL
              </AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <p className="text-base font-semibold">{t("panels.workspaceTitle")}</p>
              <p className="body-copy text-sm text-muted-foreground">
                {t("panels.profileBody")}
              </p>
            </div>
          </div>
        </FeaturePanel>

        <div className="grid gap-6">
          <FeaturePanel
            title={t("panels.experienceTitle")}
            description={t("panels.experienceDescription")}
          >
            <div className="space-y-4">
              <div className="panel-secondary flex items-start gap-4 px-5 py-5">
                <Globe2 className="mt-1 size-5 text-primary" />
                <div>
                  <p className="font-semibold">
                    {t("panels.experienceItems.localeReadyTitle")}
                  </p>
                  <p className="body-copy mt-2 text-sm text-muted-foreground">
                    {t("panels.experienceBody")}
                  </p>
                </div>
              </div>
              <div className="panel-secondary flex items-start gap-4 px-5 py-5">
                <Palette className="mt-1 size-5 text-primary" />
                <div>
                  <p className="font-semibold">
                    {t("panels.experienceItems.visualConsistencyTitle")}
                  </p>
                  <p className="body-copy mt-2 text-sm text-muted-foreground">
                    {t("panels.experienceItems.visualConsistencyBody")}
                  </p>
                </div>
              </div>
            </div>
          </FeaturePanel>

          <FeaturePanel
            title={t("panels.controlsTitle")}
            description={t("panels.controlsDescription")}
          >
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="panel-secondary px-5 py-5">
                <LockKeyhole className="size-5 text-primary" />
                <p className="mt-4 text-sm font-semibold">{t("panels.controlsItems.roles")}</p>
              </div>
              <div className="panel-secondary px-5 py-5">
                <SlidersHorizontal className="size-5 text-primary" />
                <p className="mt-4 text-sm font-semibold">{t("panels.controlsItems.templates")}</p>
              </div>
              <div className="panel-secondary px-5 py-5">
                <Palette className="size-5 text-primary" />
                <p className="mt-4 text-sm font-semibold">{t("panels.controlsItems.integrations")}</p>
              </div>
            </div>
          </FeaturePanel>
        </div>
      </div>
    </div>
  );
}
