import { ArrowRight, Blocks, ChartColumnIncreasing, ShieldCheck } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { BrandMark } from "@/components/shared/brand-mark";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { siteConfig } from "@/lib/constants/site";
import { Link } from "@/lib/i18n/navigation";
import { fabricLogService } from "@/server/services/fabriclog-service";

type LandingPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function LandingPage({ params }: LandingPageProps) {
  const { locale } = await params;
  const tLanding = await getTranslations({ locale, namespace: "Landing" });
  const tCommon = await getTranslations({ locale, namespace: "Common" });
  const totalCustomers = fabricLogService.getCustomers().length;
  const totalInvoices = fabricLogService.getInvoices().length;
  const totalFabrics = fabricLogService.getFabrics().length;
  const totalLocales = siteConfig.locales.length;

  const highlights = [
    {
      icon: Blocks,
      title: tLanding("highlights.customers"),
    },
    {
      icon: ChartColumnIncreasing,
      title: tLanding("highlights.inventory"),
    },
    {
      icon: ArrowRight,
      title: tLanding("highlights.orders"),
    },
    {
      icon: ShieldCheck,
      title: tLanding("highlights.finance"),
    },
  ];

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-8">
      <header className="flex items-center justify-between py-4">
        <BrandMark />
        <Button asChild className="rounded-full px-5">
          <Link href="/dashboard">{tCommon("openDemo")}</Link>
        </Button>
      </header>

      <section className="grid flex-1 gap-10 py-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/80 px-4 py-2 text-sm text-muted-foreground shadow-sm">
            <span className="size-2 rounded-full bg-chart-2" />
            {tLanding("eyebrow")}
          </div>

          <div className="space-y-5">
            <h1 className="max-w-3xl font-heading text-5xl font-semibold tracking-tight text-balance sm:text-6xl">
              {tLanding("title")}
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
              {tLanding("description")}
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <Button asChild size="lg" className="rounded-full px-6">
              <Link href="/dashboard">
                {tLanding("primaryCta")}
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-full px-6">
              <Link href="/customers">{tLanding("secondaryCta")}</Link>
            </Button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {highlights.map((highlight) => {
              const Icon = highlight.icon;
              return (
                <Card key={highlight.title} className="surface-panel border-0">
                  <CardContent className="flex items-start gap-4 px-5 py-5">
                    <span className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <Icon className="size-5" />
                    </span>
                    <p className="text-sm leading-6 text-foreground/90">
                      {highlight.title}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        <div className="grid gap-5">
          <Card className="surface-panel border-0 bg-[linear-gradient(135deg,color-mix(in_srgb,var(--primary)_88%,white),color-mix(in_srgb,var(--chart-1)_58%,white))] text-white">
            <CardHeader>
              <p className="text-xs uppercase tracking-[0.22em] text-white/70">
                {tCommon("demoBadge")}
              </p>
              <CardTitle className="max-w-sm text-3xl font-semibold text-balance">
                {tLanding("highlightsTitle")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-white/88">
              <p>{tCommon("portfolioNote")}</p>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/20 bg-white/10 p-4">
                  <p className="text-2xl font-semibold">{totalCustomers}</p>
                  <p className="mt-1 text-white/72">{tLanding("stats.customers")}</p>
                </div>
                <div className="rounded-2xl border border-white/20 bg-white/10 p-4">
                  <p className="text-2xl font-semibold">{totalInvoices}</p>
                  <p className="mt-1 text-white/72">{tLanding("stats.invoices")}</p>
                </div>
                <div className="rounded-2xl border border-white/20 bg-white/10 p-4">
                  <p className="text-2xl font-semibold">{totalFabrics}</p>
                  <p className="mt-1 text-white/72">{tLanding("stats.fabrics")}</p>
                </div>
                <div className="rounded-2xl border border-white/20 bg-white/10 p-4">
                  <p className="text-2xl font-semibold">{totalLocales}</p>
                  <p className="mt-1 text-white/72">{tLanding("stats.languages")}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="surface-panel border-0">
            <CardHeader>
              <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                {tLanding("safetyTitle")}
              </p>
              <CardTitle className="text-2xl font-semibold tracking-tight">
                {tLanding("safetyDescription")}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>
      </section>
    </main>
  );
}
