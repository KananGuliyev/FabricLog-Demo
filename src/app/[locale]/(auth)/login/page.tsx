import { ArrowLeft, KeyRound, ShieldCheck } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";

import { LanguageSwitcher } from "@/components/navigation/language-switcher";
import { BrandMark } from "@/components/shared/brand-mark";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "@/lib/i18n/navigation";
import { demoCredentials, getDemoSession } from "@/lib/auth/session";
import { buildLocalizedAppPath } from "@/lib/auth/routing";
import { siteConfig, type AppLocale } from "@/lib/constants/site";
import { formatDate } from "@/lib/formatting";

import { LoginForm } from "@/features/auth/login-form";

type LoginPageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ next?: string }>;
};

export default async function LoginPage({
  params,
  searchParams,
}: LoginPageProps) {
  const { locale } = await params;
  const { next } = await searchParams;
  const appLocale = locale as AppLocale;
  const t = await getTranslations({ locale, namespace: "Auth" });
  const tCommon = await getTranslations({ locale, namespace: "Common" });
  const session = await getDemoSession();

  if (session) {
    redirect(buildLocalizedAppPath(appLocale, next));
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(205,151,91,0.12),transparent_32%),linear-gradient(180deg,color-mix(in_srgb,var(--background)_95%,white),var(--background))]">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <header className="flex items-center justify-between gap-4 py-4">
          <BrandMark />

          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <Button asChild variant="outline" className="rounded-full px-4">
              <Link href="/">
                <ArrowLeft className="size-4" />
                {t("backToHome")}
              </Link>
            </Button>
          </div>
        </header>

        <section className="grid flex-1 gap-10 py-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
          <div className="space-y-6">
            <Badge className="bg-primary/10 text-primary hover:bg-primary/10">
              {tCommon("demoBadge")}
            </Badge>

            <div className="space-y-4">
              <h1 className="font-heading text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
                {t("title")}
              </h1>
              <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                {t("description")}
              </p>
            </div>

            <Card className="surface-panel border-border/70 shadow-none">
              <CardHeader className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <KeyRound className="size-5" />
                  </div>
                  <div>
                    <p className="subtle-label text-muted-foreground">
                      {t("credentials.eyebrow")}
                    </p>
                    <CardTitle className="text-2xl font-semibold tracking-tight">
                      {t("credentials.title")}
                    </CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="section-stack">
                <p className="body-copy text-sm text-muted-foreground">
                  {t("credentials.description")}
                </p>
                <div className="grid gap-3">
                  <div className="panel-secondary px-4 py-4">
                    <p className="subtle-label text-muted-foreground">
                      {t("credentials.emailLabel")}
                    </p>
                    <p className="mt-2 text-sm font-semibold text-foreground">
                      {demoCredentials.email}
                    </p>
                  </div>
                  <div className="panel-secondary px-4 py-4">
                    <p className="subtle-label text-muted-foreground">
                      {t("credentials.passwordLabel")}
                    </p>
                    <p className="mt-2 text-sm font-semibold text-foreground">
                      {demoCredentials.password}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="surface-panel border-border/70 shadow-none">
              <CardHeader className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <ShieldCheck className="size-5" />
                  </div>
                  <div>
                    <p className="subtle-label text-muted-foreground">
                      {t("howItWorks.eyebrow")}
                    </p>
                    <CardTitle className="text-2xl font-semibold tracking-tight">
                      {t("howItWorks.title")}
                    </CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="section-stack">
                <p className="body-copy text-sm text-muted-foreground">
                  {t("howItWorks.description")}
                </p>
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="panel-secondary px-4 py-4">
                    <p className="subtle-label text-muted-foreground">
                      {t("howItWorks.items.account")}
                    </p>
                    <p className="mt-2 text-sm font-semibold text-foreground">
                      {t("howItWorks.values.account")}
                    </p>
                  </div>
                  <div className="panel-secondary px-4 py-4">
                    <p className="subtle-label text-muted-foreground">
                      {t("howItWorks.items.session")}
                    </p>
                    <p className="mt-2 text-sm font-semibold text-foreground">
                      {t("howItWorks.values.session")}
                    </p>
                  </div>
                  <div className="panel-secondary px-4 py-4">
                    <p className="subtle-label text-muted-foreground">
                      {tCommon("updatedLabel")}
                    </p>
                    <p className="mt-2 text-sm font-semibold text-foreground">
                      {formatDate(siteConfig.demoLastUpdatedAt, appLocale)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="surface-panel border-border/70 shadow-none">
            <CardHeader className="space-y-3">
              <Badge variant="outline" className="w-fit">
                {t("form.badge")}
              </Badge>
              <div className="space-y-2">
                <CardTitle className="text-3xl font-semibold tracking-tight">
                  {t("form.title")}
                </CardTitle>
                <p className="body-copy text-sm text-muted-foreground">
                  {t("form.description")}
                </p>
              </div>
            </CardHeader>
            <CardContent className="section-stack">
              <LoginForm locale={appLocale} next={next} />

              <div className="panel-inset border-dashed px-5 py-4">
                <p className="body-copy text-sm text-muted-foreground">
                  {t("form.footer")}
                </p>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}
