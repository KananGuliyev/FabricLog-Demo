"use client";

import { useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { useTranslations } from "next-intl";

import { DataTable } from "@/components/data-table/data-table";
import {
  TableFilterBar,
  type TableFilterGroup,
} from "@/components/data-table/table-filter-bar";
import { StatusBadge } from "@/components/shared/status-badge";
import type { AppLocale } from "@/lib/constants/site";
import { formatCurrency, formatDate } from "@/lib/formatting";
import type { InvoiceOverviewRow } from "@/types/domain";

type InvoicesTableProps = {
  data: InvoiceOverviewRow[];
  locale: AppLocale;
};

export function InvoicesTable({ data, locale }: InvoicesTableProps) {
  const t = useTranslations("Invoices");

  const [paymentStatusFilter, setPaymentStatusFilter] = useState("all");

  const filteredData = useMemo(() => {
    return data.filter((invoice) => {
      return (
        paymentStatusFilter === "all" ||
        invoice.badgeStatus === paymentStatusFilter
      );
    });
  }, [data, paymentStatusFilter]);

  const badgeLabels: Record<InvoiceOverviewRow["badgeStatus"], string> = {
    paid: t("badges.paid"),
    unpaid: t("badges.unpaid"),
    pending: t("badges.pending"),
    overdue: t("badges.overdue"),
  };

  const filterGroups: TableFilterGroup[] = [
    {
      label: t("filters.paymentStatusLabel"),
      value: paymentStatusFilter,
      onChange: setPaymentStatusFilter,
      options: [
        { label: t("filters.all"), value: "all" },
        { label: badgeLabels.paid, value: "paid" },
        { label: badgeLabels.unpaid, value: "unpaid" },
        { label: badgeLabels.pending, value: "pending" },
        { label: badgeLabels.overdue, value: "overdue" },
      ],
    },
  ];

  const columns: ColumnDef<InvoiceOverviewRow>[] = [
    {
      accessorKey: "id",
      header: t("table.invoice"),
      cell: ({ row }) => (
        <div className="space-y-1">
          <p className="font-medium">{row.original.id}</p>
          <p className="text-xs text-muted-foreground">
            {row.original.orderReference
              ? t("table.orderCue", { reference: row.original.orderReference })
              : t("table.orderCueFallback")}
          </p>
        </div>
      ),
    },
    {
      accessorKey: "customerName",
      header: t("table.customer"),
      cell: ({ row }) => (
        <div className="space-y-1">
          <p className="text-sm font-medium">{row.original.customerName}</p>
          <p className="text-xs text-muted-foreground">
            {t("table.paymentCue", {
              amount: formatCurrency(row.original.paidAmount, locale),
            })}
          </p>
        </div>
      ),
    },
    {
      accessorKey: "issueDate",
      header: t("table.issueDate"),
      cell: ({ row }) => formatDate(row.original.issueDate, locale),
    },
    {
      accessorKey: "dueDate",
      header: t("table.dueDate"),
      cell: ({ row }) => (
        <div className="space-y-1">
          <p className="text-sm font-medium">
            {formatDate(row.original.dueDate, locale)}
          </p>
          <p className="text-xs text-muted-foreground">
            {t("table.outstandingCue", {
              amount: formatCurrency(row.original.outstandingAmount, locale),
            })}
          </p>
        </div>
      ),
    },
    {
      accessorKey: "amount",
      header: () => <div className="text-right">{t("table.amount")}</div>,
      cell: ({ row }) => (
        <div className="text-right font-medium">
          {formatCurrency(row.original.amount, locale)}
        </div>
      ),
    },
    {
      accessorKey: "badgeStatus",
      header: t("table.paymentStatus"),
      cell: ({ row }) => (
        <StatusBadge
          status={row.original.badgeStatus}
          label={badgeLabels[row.original.badgeStatus]}
        />
      ),
    },
    {
      accessorKey: "paidAmount",
      header: () => <div className="text-right">{t("table.billing")}</div>,
      cell: ({ row }) => (
        <div className="space-y-1 text-right">
          <p className="text-sm font-medium">
            {t("table.paidLabel", {
              amount: formatCurrency(row.original.paidAmount, locale),
            })}
          </p>
          <p className="text-xs text-muted-foreground">
            {t("table.outstandingLabel", {
              amount: formatCurrency(row.original.outstandingAmount, locale),
            })}
          </p>
        </div>
      ),
    },
  ];

  return (
    <DataTable
      data={filteredData}
      columns={columns}
      searchAccessor={(row) =>
        [row.id, row.customerName, row.orderReference ?? ""].join(" ")
      }
      searchPlaceholder={t("searchPlaceholder")}
      emptyMessage={t("emptyState")}
      emptyDescription={t("emptyStateDescription")}
      toolbarExtras={<TableFilterBar groups={filterGroups} />}
    />
  );
}
