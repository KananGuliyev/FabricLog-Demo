"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { useTranslations } from "next-intl";

import { DataTable } from "@/components/data-table/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import type { AppLocale } from "@/lib/constants/site";
import { formatCurrency, formatDate } from "@/lib/formatting";
import type { Customer } from "@/types/domain";

type CustomersTableProps = {
  data: Customer[];
  locale: AppLocale;
};

export function CustomersTable({ data, locale }: CustomersTableProps) {
  const t = useTranslations("Customers");
  const tStatuses = useTranslations("Statuses.tiers");

  const columns: ColumnDef<Customer>[] = [
    {
      accessorKey: "company",
      header: t("table.name"),
      cell: ({ row }) => (
        <div>
          <p className="font-medium">{row.original.company}</p>
          <p className="text-sm text-muted-foreground">{row.original.name}</p>
        </div>
      ),
    },
    { accessorKey: "region", header: t("table.region") },
    {
      accessorKey: "tier",
      header: t("table.tier"),
      cell: ({ row }) => (
        <StatusBadge
          status={row.original.tier}
          label={tStatuses(row.original.tier)}
        />
      ),
    },
    { accessorKey: "preferredCollection", header: t("table.collection") },
    { accessorKey: "totalOrders", header: t("table.orders") },
    {
      accessorKey: "outstandingBalance",
      header: t("table.balance"),
      cell: ({ row }) => formatCurrency(row.original.outstandingBalance, locale),
    },
    {
      accessorKey: "lastOrderDate",
      header: t("table.lastOrder"),
      cell: ({ row }) => formatDate(row.original.lastOrderDate, locale),
    },
  ];

  return (
    <DataTable
      data={data}
      columns={columns}
      searchPlaceholder={t("searchPlaceholder")}
      emptyMessage="No customers found."
    />
  );
}
