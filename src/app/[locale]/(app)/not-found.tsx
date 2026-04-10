import { getTranslations } from "next-intl/server";

import { EmptyState } from "@/components/shared/empty-state";
import { PageIntro } from "@/components/shared/page-intro";
import { Button } from "@/components/ui/button";
import { Link } from "@/lib/i18n/navigation";

export default async function AppNotFound() {
  const t = await getTranslations("NotFound");
  const tCommon = await getTranslations("Common");

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
            <Button asChild>
              <Link href="/dashboard">{t("backAction")}</Link>
            </Button>
          }
        />
      </div>
    </div>
  );
}
