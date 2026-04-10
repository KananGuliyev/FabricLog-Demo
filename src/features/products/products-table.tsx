"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { useTranslations } from "next-intl";

import { DataTable } from "@/components/data-table/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import type { AppLocale } from "@/lib/constants/site";
import { formatCurrency, formatNumber } from "@/lib/formatting";
import type { FabricProduct } from "@/types/domain";

type ProductsTableProps = {
  data: FabricProduct[];
  locale: AppLocale;
};

export function ProductsTable({ data, locale }: ProductsTableProps) {
  const t = useTranslations("Products");
  const tStatuses = useTranslations("Statuses.fabric");

  const columns: ColumnDef<FabricProduct>[] = [
    {
      accessorKey: "name",
      header: t("table.product"),
      cell: ({ row }) => (
        <div>
          <p className="font-medium">{row.original.name}</p>
          <p className="text-sm text-muted-foreground">{row.original.sku}</p>
        </div>
      ),
    },
    { accessorKey: "composition", header: t("table.composition") },
    {
      accessorKey: "widthCm",
      header: t("table.width"),
      cell: ({ row }) => `${row.original.widthCm} cm`,
    },
    {
      accessorKey: "weightGsm",
      header: t("table.weight"),
      cell: ({ row }) => `${row.original.weightGsm} gsm`,
    },
    {
      accessorKey: "stockMeters",
      header: t("table.stock"),
      cell: ({ row }) => `${formatNumber(row.original.stockMeters, locale)} m`,
    },
    {
      accessorKey: "reservedMeters",
      header: t("table.reserved"),
      cell: ({ row }) =>
        `${formatNumber(row.original.reservedMeters, locale)} m`,
    },
    {
      accessorKey: "unitPrice",
      header: t("table.price"),
      cell: ({ row }) => formatCurrency(row.original.unitPrice, locale),
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
