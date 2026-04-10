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
import { formatCurrency, formatNumber, formatPercent } from "@/lib/formatting";
import type { ProductOverviewRow } from "@/types/domain";

import {
  getProductCategoryKey,
  getProductPressureKey,
} from "./product-presenters";

type ProductsTableProps = {
  data: ProductOverviewRow[];
  locale: AppLocale;
};

export function ProductsTable({ data, locale }: ProductsTableProps) {
  const t = useTranslations("Products");
  const tStatuses = useTranslations("Statuses.fabric");

  const [categoryFilter, setCategoryFilter] = useState("all");
  const [availabilityFilter, setAvailabilityFilter] = useState("all");

  const categoryOptions = useMemo(() => {
    const categories = [...new Set(data.map((product) => product.category))].sort();

    return categories.map((category) => {
      const key = getProductCategoryKey(category);

      return {
        label: key ? t(`categories.${key}`) : category,
        value: category,
      };
    });
  }, [data, t]);

  const filteredData = useMemo(() => {
    return data.filter((product) => {
      const matchesCategory =
        categoryFilter === "all" || product.category === categoryFilter;
      const matchesAvailability =
        availabilityFilter === "all" || product.status === availabilityFilter;

      return matchesCategory && matchesAvailability;
    });
  }, [availabilityFilter, categoryFilter, data]);

  const filterGroups: TableFilterGroup[] = [
    {
      label: t("filters.categoryLabel"),
      value: categoryFilter,
      onChange: setCategoryFilter,
      options: [{ label: t("filters.all"), value: "all" }, ...categoryOptions],
    },
    {
      label: t("filters.availabilityLabel"),
      value: availabilityFilter,
      onChange: setAvailabilityFilter,
      options: [
        { label: t("filters.all"), value: "all" },
        { label: tStatuses("available"), value: "available" },
        { label: tStatuses("low"), value: "low" },
        { label: tStatuses("reserved"), value: "reserved" },
      ],
    },
  ];

  const columns: ColumnDef<ProductOverviewRow>[] = [
    {
      accessorKey: "name",
      header: t("table.product"),
      cell: ({ row }) => (
        <div className="space-y-1">
          <p className="font-medium">{row.original.name}</p>
          <p className="text-sm text-muted-foreground">{row.original.sku}</p>
        </div>
      ),
    },
    {
      accessorKey: "category",
      header: t("table.category"),
      cell: ({ row }) => {
        const key = getProductCategoryKey(row.original.category);

        return (
          <div className="space-y-1">
            <p className="text-sm font-medium">
              {key ? t(`categories.${key}`) : row.original.category}
            </p>
            <p className="text-xs text-muted-foreground">
              {row.original.composition}
            </p>
          </div>
        );
      },
    },
    {
      accessorKey: "colorway",
      header: t("table.variant"),
      cell: ({ row }) => (
        <div className="space-y-1">
          <p className="text-sm font-medium">{row.original.colorway}</p>
          <p className="text-xs text-muted-foreground">
            {row.original.widthCm} cm / {row.original.weightGsm} gsm
          </p>
        </div>
      ),
    },
    {
      accessorKey: "unitPrice",
      header: () => <div className="text-right">{t("table.price")}</div>,
      cell: ({ row }) => (
        <div className="text-right font-medium">
          {formatCurrency(row.original.unitPrice, locale)}
        </div>
      ),
    },
    {
      accessorKey: "stockMeters",
      header: () => <div className="text-right">{t("table.stock")}</div>,
      cell: ({ row }) => (
        <div className="space-y-1 text-right">
          <p className="text-sm font-medium">
            {formatNumber(row.original.stockMeters, locale)} m
          </p>
          <p className="text-xs text-muted-foreground">
            {t("table.stockCue", {
              reserved: formatNumber(row.original.reservedMeters, locale),
            })}
          </p>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: t("table.availability"),
      cell: ({ row }) => (
        <div className="space-y-1">
          <StatusBadge
            status={row.original.status}
            label={tStatuses(row.original.status)}
          />
          <p className="text-xs text-muted-foreground">
            {t(`pressure.${getProductPressureKey(row.original)}`)}
          </p>
        </div>
      ),
    },
    {
      accessorKey: "availableMeters",
      header: () => <div className="text-right">{t("table.available")}</div>,
      cell: ({ row }) => (
        <div className="space-y-1 text-right">
          <p className="text-sm font-medium">
            {formatNumber(row.original.availableMeters, locale)} m
          </p>
          <p className="text-xs text-muted-foreground">
            {formatPercent(row.original.reservationRate, locale)}
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
          row.sku,
          row.name,
          row.category,
          row.colorway,
          row.composition,
        ].join(" ")
      }
      searchPlaceholder={t("searchPlaceholder")}
      emptyMessage={t("emptyState")}
      emptyDescription={t("emptyStateDescription")}
      toolbarExtras={<TableFilterBar groups={filterGroups} />}
    />
  );
}
