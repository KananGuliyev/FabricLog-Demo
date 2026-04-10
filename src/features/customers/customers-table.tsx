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
import type { CustomerOverviewRow } from "@/types/domain";

type CustomersTableProps = {
  data: CustomerOverviewRow[];
  locale: AppLocale;
};

export function CustomersTable({ data, locale }: CustomersTableProps) {
  const t = useTranslations("Customers");
  const tTierStatuses = useTranslations("Statuses.tiers");
  const tPaymentStatuses = useTranslations("Statuses.payment");

  const [tierFilter, setTierFilter] = useState("all");
  const [paymentHealthFilter, setPaymentHealthFilter] = useState("all");

  const filteredData = useMemo(() => {
    return data.filter((customer) => {
      const matchesTier =
        tierFilter === "all" || customer.tier === tierFilter;
      const matchesPaymentHealth =
        paymentHealthFilter === "all" ||
        customer.paymentHealth === paymentHealthFilter;

      return matchesTier && matchesPaymentHealth;
    });
  }, [data, paymentHealthFilter, tierFilter]);

  const filterGroups: TableFilterGroup[] = [
    {
      label: t("filters.tierLabel"),
      value: tierFilter,
      onChange: setTierFilter,
      options: [
        { label: t("filters.all"), value: "all" },
        { label: tTierStatuses("signature"), value: "signature" },
        { label: tTierStatuses("growth"), value: "growth" },
        { label: tTierStatuses("studio"), value: "studio" },
      ],
    },
    {
      label: t("filters.paymentHealthLabel"),
      value: paymentHealthFilter,
      onChange: setPaymentHealthFilter,
      options: [
        { label: t("filters.all"), value: "all" },
        { label: tPaymentStatuses("paid"), value: "paid" },
        { label: tPaymentStatuses("partial"), value: "partial" },
        { label: tPaymentStatuses("pending"), value: "pending" },
        { label: tPaymentStatuses("overdue"), value: "overdue" },
        { label: tPaymentStatuses("none"), value: "none" },
      ],
    },
  ];

  const columns: ColumnDef<CustomerOverviewRow>[] = [
    {
      accessorKey: "company",
      header: t("table.account"),
      cell: ({ row }) => (
        <div className="space-y-1">
          <p className="font-medium">{row.original.company}</p>
          <p className="text-sm text-muted-foreground">{row.original.name}</p>
        </div>
      ),
    },
    {
      accessorKey: "email",
      header: t("table.contact"),
      cell: ({ row }) => (
        <div className="space-y-1">
          <p className="text-sm font-medium">{row.original.email}</p>
          <p className="text-xs text-muted-foreground">
            {row.original.preferredCollection}
          </p>
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
          label={tTierStatuses(row.original.tier)}
        />
      ),
    },
    { accessorKey: "totalOrders", header: t("table.orders") },
    { accessorKey: "invoiceCount", header: t("table.invoices") },
    {
      accessorKey: "paymentHealth",
      header: t("table.paymentHealth"),
      cell: ({ row }) => (
        <div className="space-y-1">
          <StatusBadge
            status={row.original.paymentHealth}
            label={tPaymentStatuses(row.original.paymentHealth)}
          />
          <p className="text-xs text-muted-foreground">
            {t("table.paymentCue", {
              open: row.original.openInvoicesCount,
              paid: row.original.paidInvoicesCount,
            })}
          </p>
        </div>
      ),
    },
    {
      accessorKey: "outstandingBalance",
      header: t("table.balance"),
      cell: ({ row }) => formatCurrency(row.original.outstandingBalance, locale),
    },
    {
      accessorKey: "lastActivityDate",
      header: t("table.lastActivity"),
      cell: ({ row }) => formatDate(row.original.lastActivityDate, locale),
    },
  ];

  return (
    <DataTable
      data={filteredData}
      columns={columns}
      searchAccessor={(row) =>
        [
          row.company,
          row.name,
          row.email,
          row.region,
          row.preferredCollection,
        ].join(" ")
      }
      searchPlaceholder={t("searchPlaceholder")}
      emptyMessage={t("emptyState")}
      emptyDescription={t("emptyStateDescription")}
      toolbarExtras={<TableFilterBar groups={filterGroups} />}
    />
  );
}
