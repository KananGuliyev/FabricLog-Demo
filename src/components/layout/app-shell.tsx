"use client";

import { Menu } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { LanguageSwitcher } from "@/components/navigation/language-switcher";
import { navigationItems } from "@/components/navigation/navigation-config";
import { BrandMark } from "@/components/shared/brand-mark";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Link, usePathname } from "@/lib/i18n/navigation";
import { cn } from "@/lib/utils";

type AppShellProps = {
  children: React.ReactNode;
};

function NavigationList({ mobile = false }: { mobile?: boolean }) {
  const pathname = usePathname();
  const t = useTranslations("Navigation");

  return (
    <nav className={cn("space-y-1.5", mobile && "mt-8")}>
      {navigationItems.map((item) => {
        const active =
          pathname === item.href || pathname.startsWith(`${item.href}/`);
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium transition-all",
              active
                ? "bg-white/14 text-white shadow-lg"
                : "text-sidebar-foreground/72 hover:bg-white/8 hover:text-white"
            )}
          >
            <span
              className={cn(
                "flex size-9 items-center justify-center rounded-xl",
                active ? "bg-white/15" : "bg-white/5"
              )}
            >
              <Icon className="size-4.5" />
            </span>
            {t(item.labelKey)}
          </Link>
        );
      })}
    </nav>
  );
}

export function AppShell({ children }: AppShellProps) {
  const locale = useLocale();
  const pathname = usePathname();
  const tShell = useTranslations("Shell");
  const tCommon = useTranslations("Common");
  const tNavigation = useTranslations("Navigation");

  const currentItem =
    navigationItems.find(
      (item) => pathname === item.href || pathname.startsWith(`${item.href}/`)
    ) ?? navigationItems[0]!;

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[18rem_1fr]">
      <aside className="hidden border-r border-sidebar-border bg-sidebar px-5 py-6 text-sidebar-foreground lg:flex lg:flex-col lg:justify-between">
        <div className="space-y-8">
          <BrandMark />
          <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.22em] text-sidebar-foreground/56">
              {tShell("subtitle")}
            </p>
            <p className="mt-2 text-sm leading-6 text-sidebar-foreground/86">
              {tCommon("portfolioNote")}
            </p>
          </div>
          <NavigationList />
        </div>
        <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-sidebar-foreground/56">
            {tCommon("localeLabel")}
          </p>
          <p className="mt-2 text-sm font-medium">
            {locale === "en"
              ? tCommon("localeEnglish")
              : tCommon("localeAzerbaijani")}
          </p>
          <p className="mt-1 text-sm text-sidebar-foreground/72">
            {tShell("demoSafe")}
          </p>
        </div>
      </aside>

      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-30 border-b border-border/70 bg-background/84 backdrop-blur-xl">
          <div className="mx-auto flex w-full max-w-7xl items-center gap-4 px-4 py-4 sm:px-6 lg:px-8">
            <div className="lg:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Menu className="size-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="border-none bg-sidebar p-6 text-sidebar-foreground">
                  <BrandMark />
                  <NavigationList mobile />
                </SheetContent>
              </Sheet>
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                {tShell("welcomeBack")}
              </p>
              <div className="mt-1 flex flex-wrap items-center gap-3">
                <h1 className="font-heading text-xl font-semibold tracking-tight sm:text-2xl">
                  {tNavigation(currentItem.labelKey)}
                </h1>
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  {tCommon("demoBadge")}
                </span>
              </div>
            </div>

            <div className="hidden items-center gap-4 md:flex">
              <div className="rounded-2xl border border-border/70 bg-card/80 px-4 py-2 text-right shadow-sm">
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  {tCommon("updatedLabel")}
                </p>
                <p className="text-sm font-medium">09 Apr 2026</p>
              </div>
              <LanguageSwitcher />
            </div>
          </div>
          <Separator />
        </header>

        <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
