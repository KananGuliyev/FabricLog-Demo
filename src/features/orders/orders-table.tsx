"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { useTranslations } from "next-intl";

import { DataTable } from "@/components/data-table/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import type { AppLocale } from "@/lib/constants/site";
import { formatCurrency, formatDate } from "@/lib/formatting";
import type { Order } from "@/types/domain";

export type OrderRow = Order & {
  customerName: string;
  fabricName: string;
};

type OrdersTableProps = {
  data: OrderRow[];
  locale: AppLocale;
};

export function OrdersTable({ data, locale }: OrdersTableProps) {
  const t = useTranslations("Orders");
  const tStatuses = useTranslations("Statuses.order");

  const columns: ColumnDef<OrderRow>[] = [
    {
      accessorKey: "referenceCode",
      header: t("table.reference"),
      cell: ({ row }) => (
        <div>
          <p className="font-medium">{row.original.referenceCode}</p>
          <p className="text-sm text-muted-foreground">{row.original.id}</p>
        </div>
      ),
    },
    { accessorKey: "customerName", header: t("table.customer") },
    { accessorKey: "fabricName", header: t("table.fabric") },
    {
      accessorKey: "quantityMeters",
      header: t("table.quantity"),
      cell: ({ row }) => `${row.original.quantityMeters} m`,
    },
    {
      accessorKey: "amount",
      header: t("table.amount"),
      cell: ({ row }) => formatCurrency(row.original.amount, locale),
    },
    {
      accessorKey: "createdAt",
      header: t("table.created"),
      cell: ({ row }) => formatDate(row.original.createdAt, locale),
    },
    {
      accessorKey: "deliveryDate",
      header: t("table.delivery"),
      cell: ({ row }) => formatDate(row.original.deliveryDate, locale),
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
