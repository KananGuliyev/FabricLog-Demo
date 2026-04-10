"use client";

import { useTranslations } from "next-intl";

import { EmptyState } from "@/components/shared/empty-state";
import { PageIntro } from "@/components/shared/page-intro";
import { Button } from "@/components/ui/button";
import { Link } from "@/lib/i18n/navigation";

type LocaleErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function LocaleErrorPage({
  error,
  reset,
}: LocaleErrorPageProps) {
  const t = useTranslations("ErrorPage");
  const tCommon = useTranslations("Common");

  return (
    <div className="page-grid">
      <PageIntro
        badge={tCommon("demoBadge")}
        title={t("title")}
        description={t("description")}
      />

      <div className="panel-secondary px-6 py-6">
        <EmptyState
          title={t("emptyTitle")}
          description={t("emptyDescription")}
          action={
            <div className="flex flex-wrap justify-center gap-3">
              <Button onClick={reset}>{t("retryAction")}</Button>
              <Button asChild variant="outline">
                <Link href="/dashboard">{t("backAction")}</Link>
              </Button>
            </div>
          }
        />
        {error.digest ? (
          <p className="mt-4 text-center text-xs text-muted-foreground">
            {t("reference", { digest: error.digest })}
          </p>
        ) : null}
      </div>
    </div>
  );
}
