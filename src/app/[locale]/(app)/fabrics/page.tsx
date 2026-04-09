import { getTranslations } from "next-intl/server";

import { FabricsTable } from "@/features/fabrics/fabrics-table";
import { MetricCard } from "@/components/shared/metric-card";
import { PageIntro } from "@/components/shared/page-intro";
import type { AppLocale } from "@/lib/constants/site";
import { formatCurrency, formatNumber } from "@/lib/formatting";
import { fabricLogService } from "@/server/services/fabriclog-service";

type FabricsPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function FabricsPage({ params }: FabricsPageProps) {
  const { locale } = await params;
  const appLocale = locale as AppLocale;
  const t = await getTranslations({ locale, namespace: "Fabrics" });
  const tCommon = await getTranslations({ locale, namespace: "Common" });

  const fabrics = fabricLogService.getFabrics();
  const totalStock = fabrics.reduce((sum, fabric) => sum + fabric.stockMeters, 0);
  const reservedStock = fabrics.reduce(
    (sum, fabric) => sum + fabric.reservedMeters,
    0
  );
  const avgPrice =
    fabrics.reduce((sum, fabric) => sum + fabric.unitPrice, 0) / fabrics.length;

  return (
    <div className="space-y-8">
      <PageIntro
        badge={tCommon("demoBadge")}
        title={t("title")}
        description={t("description")}
      />

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label={t("cards.totalStock")}
          value={`${formatNumber(totalStock, appLocale)} m`}
          hint="Available catalog position across the demo assortment"
          trend={11}
          tone="success"
        />
        <MetricCard
          label={t("cards.reservedStock")}
          value={`${formatNumber(reservedStock, appLocale)} m`}
          hint="Committed to current pipeline orders and sampling work"
          trend={7}
          tone="warning"
        />
        <MetricCard
          label={t("cards.averageUnitPrice")}
          value={formatCurrency(avgPrice, appLocale)}
          hint="Weighted for a premium but balanced textile portfolio"
          trend={3}
        />
      </div>

      <FabricsTable data={fabrics} locale={appLocale} />
    </div>
  );
}
