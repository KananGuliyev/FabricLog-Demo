"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { useTranslations } from "next-intl";

import { DataTable } from "@/components/data-table/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import type { AppLocale } from "@/lib/constants/site";
import { formatCurrency, formatDate } from "@/lib/formatting";
import type { PaymentRecord } from "@/types/domain";

export type PaymentRow = PaymentRecord & {
  customerName: string;
};

type PaymentsTableProps = {
  data: PaymentRow[];
  locale: AppLocale;
};

export function PaymentsTable({ data, locale }: PaymentsTableProps) {
  const t = useTranslations("Payments");
  const tStatuses = useTranslations("Statuses.payment");

  const columns: ColumnDef<PaymentRow>[] = [
    { accessorKey: "id", header: t("table.payment") },
    { accessorKey: "customerName", header: t("table.customer") },
    { accessorKey: "invoiceId", header: t("table.invoice") },
    {
      accessorKey: "paidAt",
      header: t("table.date"),
      cell: ({ row }) => formatDate(row.original.paidAt, locale),
    },
    { accessorKey: "method", header: t("table.method") },
    {
      accessorKey: "amount",
      header: t("table.amount"),
      cell: ({ row }) => formatCurrency(row.original.amount, locale),
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
