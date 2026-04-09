import { Download, Layers3, Radar, ShieldCheck } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { FeaturePanel } from "@/components/shared/feature-panel";
import { MetricCard } from "@/components/shared/metric-card";
import { PageIntro } from "@/components/shared/page-intro";
import { Badge } from "@/components/ui/badge";

type ReportsPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function ReportsPage({ params }: ReportsPageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Reports" });
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
          label={t("cards.exportsReady")}
          value="06"
          hint="Structured reporting views already fit the dashboard visual system."
          trend={12}
          tone="success"
        />
        <MetricCard
          label={t("cards.coverage")}
          value="Sales + Ops"
          hint="Reports are positioned to combine customer, catalog, and finance perspectives."
          trend={8}
        />
        <MetricCard
          label={t("cards.refreshCycle")}
          value="Weekly"
          hint="A future reporting cadence can plug into the existing mock-service layer."
          trend={4}
          tone="warning"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <FeaturePanel
          title={t("panels.collectionsTitle")}
          description={t("panels.collectionsDescription")}
          action={<Badge className="bg-primary/10 text-primary hover:bg-primary/10">Demo ready</Badge>}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[1.75rem] bg-primary px-5 py-5 text-primary-foreground shadow-sm shadow-primary/15">
              <Download className="size-5" />
              <p className="mt-4 text-lg font-semibold">Monthly packs</p>
              <p className="mt-2 text-sm leading-6 text-primary-foreground/86">
                {t("panels.collectionsBody")}
              </p>
            </div>
            <div className="space-y-4">
              <div className="panel-secondary px-5 py-5">
                <Layers3 className="size-5 text-primary" />
                <p className="mt-4 text-base font-semibold">Aging buckets</p>
                <p className="body-copy mt-2 text-sm text-muted-foreground">
                  Use this slot for receivables aging, collector notes, and export filters.
                </p>
              </div>
              <div className="panel-secondary px-5 py-5">
                <ShieldCheck className="size-5 text-primary" />
                <p className="mt-4 text-base font-semibold">Collection confidence</p>
                <p className="body-copy mt-2 text-sm text-muted-foreground">
                  Pair payment status with account health signals without changing the shell.
                </p>
              </div>
            </div>
          </div>
        </FeaturePanel>

        <FeaturePanel
          title={t("panels.catalogTitle")}
          description={t("panels.catalogDescription")}
        >
          <div className="space-y-4">
            <div className="panel-secondary px-5 py-5">
              <Radar className="size-5 text-primary" />
              <p className="mt-4 text-base font-semibold">Demand pulse</p>
              <p className="body-copy mt-2 text-sm text-muted-foreground">
                {t("panels.catalogBody")}
              </p>
            </div>
            <div className="panel-inset border-dashed px-5 py-5">
              <p className="text-sm font-semibold">{t("panels.roadmapTitle")}</p>
              <p className="body-copy mt-2 text-sm text-muted-foreground">
                {t("panels.roadmapDescription")}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Badge variant="outline">{t("panels.roadmapItems.profitability")}</Badge>
                <Badge variant="outline">{t("panels.roadmapItems.regional")}</Badge>
                <Badge variant="outline">{t("panels.roadmapItems.inventory")}</Badge>
              </div>
            </div>
          </div>
        </FeaturePanel>
      </div>
    </div>
  );
}
