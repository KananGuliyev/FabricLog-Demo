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
import { Link } from "@/lib/i18n/navigation";
import type { PaymentOverviewRow } from "@/types/domain";

type PaymentsTableProps = {
  data: PaymentOverviewRow[];
  locale: AppLocale;
};

export function PaymentsTable({ data, locale }: PaymentsTableProps) {
  const t = useTranslations("Payments");
  const tStatuses = useTranslations("Statuses.payment");

  const [statusFilter, setStatusFilter] = useState("all");
  const [methodFilter, setMethodFilter] = useState("all");

  const filteredData = useMemo(() => {
    return data.filter((payment) => {
      const matchesStatus =
        statusFilter === "all" || payment.status === statusFilter;
      const matchesMethod =
        methodFilter === "all" || payment.method === methodFilter;

      return matchesStatus && matchesMethod;
    });
  }, [data, methodFilter, statusFilter]);

  const filterGroups: TableFilterGroup[] = [
    {
      label: t("filters.statusLabel"),
      value: statusFilter,
      onChange: setStatusFilter,
      options: [
        { label: t("filters.all"), value: "all" },
        { label: tStatuses("paid"), value: "paid" },
        { label: tStatuses("partial"), value: "partial" },
        { label: tStatuses("pending"), value: "pending" },
        { label: tStatuses("overdue"), value: "overdue" },
      ],
    },
    {
      label: t("filters.methodLabel"),
      value: methodFilter,
      onChange: setMethodFilter,
      options: [
        { label: t("filters.all"), value: "all" },
        {
          label: t("methods.bankTransfer"),
          value: "Bank transfer",
        },
        {
          label: t("methods.cardSettlement"),
          value: "Card settlement",
        },
        {
          label: t("methods.wireTransfer"),
          value: "Wire transfer",
        },
      ],
    },
  ];

  const columns: ColumnDef<PaymentOverviewRow>[] = [
    {
      accessorKey: "id",
      header: t("table.payment"),
      cell: ({ row }) => (
        <div className="space-y-1">
          <p className="text-sm font-medium text-foreground">{row.original.id}</p>
          <p className="text-xs text-muted-foreground">
            {t("table.dateCue", {
              date: formatDate(row.original.paidAt, locale),
            })}
          </p>
        </div>
      ),
    },
    {
      accessorKey: "customerName",
      header: t("table.customer"),
      cell: ({ row }) => (
        <p className="text-sm font-medium text-foreground">
          {row.original.customerName}
        </p>
      ),
    },
    {
      accessorKey: "invoiceId",
      header: t("table.invoice"),
      cell: ({ row }) => (
        <div className="space-y-1">
          <Link
            href={`/invoices/${row.original.invoiceId}`}
            className="text-sm font-medium text-foreground transition-colors hover:text-primary"
          >
            {row.original.invoiceId}
          </Link>
          <p className="text-xs text-muted-foreground">
            {t("table.dueCue", {
              date: formatDate(row.original.dueDate, locale),
            })}
          </p>
        </div>
      ),
    },
    {
      accessorKey: "method",
      header: t("table.method"),
      cell: ({ row }) => (
        <p className="text-sm font-medium text-foreground">
          {t(
            `methods.${
              row.original.method === "Bank transfer"
                ? "bankTransfer"
                : row.original.method === "Card settlement"
                  ? "cardSettlement"
                  : "wireTransfer"
            }`
          )}
        </p>
      ),
    },
    {
      accessorKey: "amount",
      header: () => <div className="text-right">{t("table.amount")}</div>,
      cell: ({ row }) => (
        <div className="space-y-1 text-right">
          <p className="text-sm font-semibold text-foreground">
            {formatCurrency(row.original.amount, locale)}
          </p>
          <p className="text-xs text-muted-foreground">
            {t("table.settlementCue", {
              amount: formatCurrency(row.original.outstandingAmount, locale),
            })}
          </p>
        </div>
      ),
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
      data={filteredData}
      columns={columns}
      searchAccessor={(row) =>
        [row.id, row.customerName, row.invoiceId, row.method].join(" ")
      }
      searchPlaceholder={t("searchPlaceholder")}
      emptyMessage={t("emptyState")}
      emptyDescription={t("emptyStateDescription")}
      toolbarExtras={<TableFilterBar groups={filterGroups} />}
    />
  );
}
