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
import { formatCurrency, formatDate, formatNumber } from "@/lib/formatting";
import type { OrderOverviewRow } from "@/types/domain";

type OrdersTableProps = {
  data: OrderOverviewRow[];
  locale: AppLocale;
};

export function OrdersTable({ data, locale }: OrdersTableProps) {
  const t = useTranslations("Orders");
  const tOrderStatuses = useTranslations("Statuses.order");
  const tPaymentStatuses = useTranslations("Statuses.payment");

  const [orderStatusFilter, setOrderStatusFilter] = useState("all");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("all");

  const filteredData = useMemo(() => {
    return data.filter((order) => {
      const matchesOrderStatus =
        orderStatusFilter === "all" || order.status === orderStatusFilter;
      const matchesPaymentStatus =
        paymentStatusFilter === "all" ||
        order.paymentStatus === paymentStatusFilter;

      return matchesOrderStatus && matchesPaymentStatus;
    });
  }, [data, orderStatusFilter, paymentStatusFilter]);

  const filterGroups: TableFilterGroup[] = [
    {
      label: t("filters.orderStatusLabel"),
      value: orderStatusFilter,
      onChange: setOrderStatusFilter,
      options: [
        { label: t("filters.all"), value: "all" },
        { label: tOrderStatuses("new"), value: "new" },
        { label: tOrderStatuses("sampling"), value: "sampling" },
        { label: tOrderStatuses("production"), value: "production" },
        { label: tOrderStatuses("ready"), value: "ready" },
        { label: tOrderStatuses("dispatched"), value: "dispatched" },
      ],
    },
    {
      label: t("filters.paymentStatusLabel"),
      value: paymentStatusFilter,
      onChange: setPaymentStatusFilter,
      options: [
        { label: t("filters.all"), value: "all" },
        { label: tPaymentStatuses("none"), value: "none" },
        { label: tPaymentStatuses("paid"), value: "paid" },
        { label: tPaymentStatuses("partial"), value: "partial" },
        { label: tPaymentStatuses("pending"), value: "pending" },
        { label: tPaymentStatuses("overdue"), value: "overdue" },
      ],
    },
  ];

  const columns: ColumnDef<OrderOverviewRow>[] = [
    {
      accessorKey: "referenceCode",
      header: t("table.order"),
      cell: ({ row }) => (
        <div className="space-y-1">
          <p className="font-medium">{row.original.referenceCode}</p>
          <p className="text-sm text-muted-foreground">{row.original.id}</p>
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
            {row.original.invoiceId ?? t("table.awaitingInvoice")}
          </p>
        </div>
      ),
    },
    {
      accessorKey: "orderDate",
      header: t("table.orderDate"),
      cell: ({ row }) => (
        <div className="space-y-1">
          <p className="text-sm font-medium">
            {formatDate(row.original.orderDate, locale)}
          </p>
          <p className="text-xs text-muted-foreground">
            {t("table.deliveryCue", {
              date: formatDate(row.original.deliveryDate, locale),
            })}
          </p>
        </div>
      ),
    },
    {
      accessorKey: "itemSummary",
      header: t("table.items"),
      cell: ({ row }) => (
        <div className="space-y-1">
          <p className="text-sm font-medium">{row.original.fabricName}</p>
          <p className="text-xs text-muted-foreground">
            {t("table.itemsCue", {
              quantity: formatNumber(row.original.quantityMeters, locale),
            })}
          </p>
        </div>
      ),
    },
    {
      accessorKey: "totalAmount",
      header: t("table.totalAmount"),
      cell: ({ row }) => formatCurrency(row.original.totalAmount, locale),
    },
    {
      accessorKey: "status",
      header: t("table.orderStatus"),
      cell: ({ row }) => (
        <StatusBadge
          status={row.original.status}
          label={tOrderStatuses(row.original.status)}
        />
      ),
    },
    {
      accessorKey: "paymentStatus",
      header: t("table.paymentStatus"),
      cell: ({ row }) => (
        <div className="space-y-1">
          <StatusBadge
            status={row.original.paymentStatus}
            label={tPaymentStatuses(row.original.paymentStatus)}
          />
          <p className="text-xs text-muted-foreground">
            {row.original.invoiceId
              ? t("table.invoiceCue", { invoiceId: row.original.invoiceId })
              : t("table.awaitingInvoice")}
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
        [
          row.id,
          row.referenceCode,
          row.customerName,
          row.fabricName,
          row.itemSummary,
          row.invoiceId ?? "",
        ].join(" ")
      }
      searchPlaceholder={t("searchPlaceholder")}
      emptyMessage={t("emptyState")}
      emptyDescription={t("emptyStateDescription")}
      toolbarExtras={<TableFilterBar groups={filterGroups} />}
    />
  );
}
