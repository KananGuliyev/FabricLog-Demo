"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { useTranslations } from "next-intl";

import { DataTable } from "@/components/data-table/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import type { AppLocale } from "@/lib/constants/site";
import { formatCurrency, formatDate } from "@/lib/formatting";
import type { Invoice } from "@/types/domain";

export type InvoiceRow = Invoice & {
  customerName: string;
};

type InvoicesTableProps = {
  data: InvoiceRow[];
  locale: AppLocale;
};

export function InvoicesTable({ data, locale }: InvoicesTableProps) {
  const t = useTranslations("Invoices");
  const tStatuses = useTranslations("Statuses.payment");

  const columns: ColumnDef<InvoiceRow>[] = [
    { accessorKey: "id", header: t("table.invoice") },
    { accessorKey: "customerName", header: t("table.customer") },
    {
      accessorKey: "issuedAt",
      header: t("table.issued"),
      cell: ({ row }) => formatDate(row.original.issuedAt, locale),
    },
    {
      accessorKey: "dueAt",
      header: t("table.due"),
      cell: ({ row }) => formatDate(row.original.dueAt, locale),
    },
    {
      accessorKey: "amount",
      header: t("table.amount"),
      cell: ({ row }) => formatCurrency(row.original.amount, locale),
    },
    {
      accessorKey: "paidAmount",
      header: t("table.paid"),
      cell: ({ row }) => formatCurrency(row.original.paidAmount, locale),
    },
    {
      accessorKey: "status",
      header: t("table.status"),
      cell: ({ row }) => (
        <StatusBadge
          status={row.original.status}
          label={tStatuses(row.original.status)}
        />
      ),
    },
  ];

  return (
    <DataTable
      data={data}
      columns={columns}
      searchPlaceholder={t("searchPlaceholder")}
      emptyMessage={t("emptyState")}
    />
  );
}
