import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { DetailActivityPanel } from "@/components/shared/detail-activity-panel";
import { DetailMetaGrid } from "@/components/shared/detail-meta-grid";
import { DetailPreviewList } from "@/components/shared/detail-preview-list";
import { FeaturePanel } from "@/components/shared/feature-panel";
import { MetricCard } from "@/components/shared/metric-card";
import { PageIntro } from "@/components/shared/page-intro";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import type { AppLocale } from "@/lib/constants/site";
import { formatCurrency, formatDate } from "@/lib/formatting";
import { Link } from "@/lib/i18n/navigation";
import { fabricLogService } from "@/server/services/fabriclog-service";
import type { RecentActivity } from "@/types/domain";

type InvoiceDetailPageProps = {
  params: Promise<{ invoiceId: string; locale: string }>;
};

const activityToneMap: Record<RecentActivity["type"], string> = {
  payment_received: "bg-emerald-500",
  invoice_partial_paid: "bg-amber-500",
  invoice_overdue: "bg-rose-500",
  order_in_production: "bg-sky-500",
  order_ready: "bg-indigo-500",
  order_dispatched: "bg-violet-500",
  inventory_low: "bg-orange-500",
  invoice_issued: "bg-stone-500",
};

export default async function InvoiceDetailPage({
  params,
}: InvoiceDetailPageProps) {
  const { invoiceId, locale } = await params;
  const appLocale = locale as AppLocale;
  const t = await getTranslations({ locale, namespace: "InvoiceDetail" });
  const tCommon = await getTranslations({ locale, namespace: "Common" });
  const tActivity = await getTranslations({
    locale,
    namespace: "Dashboard.activity",
  });
  const tPaymentStatuses = await getTranslations({
    locale,
    namespace: "Statuses.payment",
  });
  const tOrderStatuses = await getTranslations({
    locale,
    namespace: "Statuses.order",
  });
  const tTiers = await getTranslations({ locale, namespace: "Statuses.tiers" });

  const detail = fabricLogService.getInvoiceDetail(invoiceId);

  if (!detail) {
    notFound();
  }

  return (
    <div className="page-grid">
      <PageIntro
        badge={tCommon("demoBadge")}
        title={detail.invoice.id}
        description={t("description", { customer: detail.invoice.customerName })}
        action={
          <Button asChild variant="outline">
            <Link href="/invoices">{t("backAction")}</Link>
          </Button>
        }
      />

      <div className="panel-secondary flex flex-col gap-4 px-5 py-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-2">
          <p className="text-lg font-semibold text-foreground">
            {detail.customer.company}
          </p>
          <p className="body-copy max-w-2xl text-sm text-muted-foreground">
            {t("hero.description", {
              dueDate: formatDate(detail.invoice.dueDate, appLocale),
            })}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusBadge
            status={detail.invoice.badgeStatus}
            label={t(`badges.${detail.invoice.badgeStatus}`)}
          />
          <StatusBadge
            status={detail.customer.tier}
            label={tTiers(detail.customer.tier)}
          />
        </div>
      </div>

      <div className="page-metrics-grid">
        <MetricCard
          label={t("cards.amount")}
          value={formatCurrency(detail.invoice.amount, appLocale)}
          hint={t("cards.amountHint")}
          tone="neutral"
        />
        <MetricCard
          label={t("cards.paidAmount")}
          value={formatCurrency(detail.invoice.paidAmount, appLocale)}
          hint={t("cards.paidAmountHint")}
          tone="success"
        />
        <MetricCard
          label={t("cards.outstandingAmount")}
          value={formatCurrency(detail.invoice.outstandingAmount, appLocale)}
          hint={t("cards.outstandingAmountHint")}
          tone="warning"
        />
        <MetricCard
          label={t("cards.dueDate")}
          value={formatDate(detail.invoice.dueDate, appLocale)}
          hint={t("cards.dueDateHint")}
          tone={detail.invoice.badgeStatus === "overdue" ? "critical" : "neutral"}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] xl:items-start">
        <div className="section-stack">
          <FeaturePanel
            title={t("summary.title")}
            description={t("summary.description")}
          >
            <div className="section-stack">
              <div className="panel-highlight">
                <p className="subtle-label text-primary-foreground/72">
                  {t("summary.highlightLabel")}
                </p>
                <p className="mt-2 text-xl font-semibold">
                  <Link
                    href={`/customers/${detail.customer.id}`}
                    className="transition-colors hover:text-primary-foreground/88"
                  >
                    {detail.customer.company}
                  </Link>
                </p>
                <p className="mt-3 text-sm leading-6 text-primary-foreground/86">
                  {t("summary.highlightDescription", {
                    email: detail.customer.email,
                  })}
                </p>
              </div>

              <DetailMetaGrid
                items={[
                  {
                    label: t("summary.fields.customer"),
                    value: (
                      <Link
                        href={`/customers/${detail.customer.id}`}
                        className="transition-colors hover:text-primary"
                      >
                        {detail.customer.company}
                      </Link>
                    ),
                  },
                  {
                    label: t("summary.fields.issueDate"),
                    value: formatDate(detail.invoice.issueDate, appLocale),
                  },
                  {
                    label: t("summary.fields.dueDate"),
                    value: formatDate(detail.invoice.dueDate, appLocale),
                  },
                  {
                    label: t("summary.fields.order"),
                    value: detail.order ? (
                      <Link
                        href={`/orders/${detail.order.id}`}
                        className="transition-colors hover:text-primary"
                      >
                        {detail.order.referenceCode}
                      </Link>
                    ) : (
                      t("summary.noOrder")
                    ),
                  },
                ]}
              />
            </div>
          </FeaturePanel>

          <DetailPreviewList
            title={t("payments.title")}
            description={t("payments.description")}
            emptyTitle={t("payments.emptyTitle")}
            emptyDescription={t("payments.emptyDescription")}
            items={detail.payments.map((payment) => ({
              id: payment.id,
              title: payment.method,
              subtitle: formatDate(payment.paidAt, appLocale),
              trailing: (
                <p className="text-sm font-semibold text-foreground">
                  {formatCurrency(payment.amount, appLocale)}
                </p>
              ),
              meta: (
                <StatusBadge
                  status={payment.status}
                  label={tPaymentStatuses(payment.status)}
                />
              ),
            }))}
          />
        </div>

        <div className="section-stack">
          <FeaturePanel
            title={t("collections.title")}
            description={t("collections.description")}
          >
            <div className="section-stack">
              <div className="panel-secondary px-5 py-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="subtle-label text-muted-foreground">
                      {t("collections.statusLabel")}
                    </p>
                    <p className="mt-2">
                      <StatusBadge
                        status={detail.invoice.badgeStatus}
                        label={t(`badges.${detail.invoice.badgeStatus}`)}
                      />
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="subtle-label text-muted-foreground">
                      {t("collections.outstandingLabel")}
                    </p>
                    <p className="mt-2 text-sm font-semibold text-foreground">
                      {formatCurrency(detail.invoice.outstandingAmount, appLocale)}
                    </p>
                  </div>
                </div>
              </div>

              <DetailMetaGrid
                items={[
                  {
                    label: t("collections.fields.contact"),
                    value: detail.customer.email,
                  },
                  {
                    label: t("collections.fields.tier"),
                    value: (
                      <StatusBadge
                        status={detail.customer.tier}
                        label={tTiers(detail.customer.tier)}
                      />
                    ),
                  },
                  {
                    label: t("collections.fields.orderStatus"),
                    value: detail.order ? (
                      <StatusBadge
                        status={detail.order.status}
                        label={tOrderStatuses(detail.order.status)}
                      />
                    ) : (
                      t("collections.noOrderStatus")
                    ),
                  },
                  {
                    label: t("collections.fields.itemSummary"),
                    value: detail.order?.itemSummary ?? t("collections.noItemSummary"),
                  },
                ]}
              />
            </div>
          </FeaturePanel>

          <DetailActivityPanel
            title={t("activity.title")}
            description={t("activity.description")}
            emptyTitle={t("activity.emptyTitle")}
            emptyDescription={t("activity.emptyDescription")}
            items={detail.recentActivity.map((activity) => ({
              id: activity.id,
              dateLabel: formatDate(activity.occurredAt, appLocale),
              title: tActivity(`types.${activity.type}.title`),
              description: tActivity(`types.${activity.type}.description`, {
                amount: activity.amount
                  ? formatCurrency(activity.amount, appLocale)
                  : formatCurrency(0, appLocale),
                customerName: activity.customerName ?? tCommon("unknown"),
                invoiceId: activity.invoiceId ?? tCommon("unknown"),
                orderCode: activity.orderCode ?? tCommon("unknown"),
                productName: activity.productName ?? tCommon("unknown"),
              }),
              toneClassName: activityToneMap[activity.type],
            }))}
          />
        </div>
      </div>
    </div>
  );
}
