"use client";

import { Languages } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import type { AppLocale } from "@/lib/constants/site";
import { Link, usePathname } from "@/lib/i18n/navigation";
import { Button } from "@/components/ui/button";

const localeOptions: AppLocale[] = ["en", "az"];

export function LanguageSwitcher() {
  const t = useTranslations("Common");
  const locale = useLocale() as AppLocale;
  const pathname = usePathname();

  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-border/80 bg-card/80 p-1 shadow-sm backdrop-blur">
      <div className="flex size-8 items-center justify-center rounded-full bg-secondary text-muted-foreground">
        <Languages className="size-4" />
      </div>
      {localeOptions.map((option) => {
        const label =
          option === "en" ? t("localeEnglish") : t("localeAzerbaijani");

        return (
          <Button
            key={option}
            asChild
            variant={locale === option ? "default" : "ghost"}
            size="sm"
            className="rounded-full px-3"
          >
            <Link href={pathname} locale={option} aria-label={label}>
              {option.toUpperCase()}
            </Link>
          </Button>
        );
      })}
    </div>
  );
}
