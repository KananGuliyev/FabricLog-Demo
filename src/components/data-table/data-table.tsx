/* eslint-disable react-hooks/incompatible-library */
"use client";

import { useDeferredValue, useMemo, useState, type ReactNode } from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import { Search } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

type DataTableProps<TData> = {
  data: TData[];
  columns: ColumnDef<TData>[];
  emptyMessage: string;
  emptyDescription?: string;
  loading?: boolean;
  loadingRows?: number;
  onSearchChange?: (value: string) => void;
  searchAccessor?: (row: TData) => string;
  searchPlaceholder: string;
  searchValue?: string;
  toolbarExtras?: ReactNode;
  tableClassName?: string;
};

export function DataTable<TData>({
  data,
  columns,
  emptyMessage,
  emptyDescription,
  loading = false,
  loadingRows = 5,
  onSearchChange,
  searchAccessor,
  searchPlaceholder,
  searchValue,
  tableClassName,
  toolbarExtras,
}: DataTableProps<TData>) {
  const [internalQuery, setInternalQuery] = useState("");
  const query = searchValue ?? internalQuery;
  const deferredQuery = useDeferredValue(query);
  const setQuery = onSearchChange ?? setInternalQuery;

  const filteredData = useMemo(() => {
    const term = deferredQuery.trim().toLowerCase();

    if (!term) {
      return data;
    }

    return data.filter((row) => {
      const haystack = searchAccessor
        ? searchAccessor(row)
        : JSON.stringify(row);

      return haystack.toLowerCase().includes(term);
    });
  }, [data, deferredQuery, searchAccessor]);

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="section-stack">
      <div className="table-toolbar">
        <div className="table-toolbar-main">
          <div className="relative w-full max-w-xl">
            <Search className="pointer-events-none absolute top-1/2 left-4 z-10 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="pl-11"
              placeholder={searchPlaceholder}
            />
          </div>
        </div>
        {toolbarExtras ? (
          <div className="table-toolbar-side">{toolbarExtras}</div>
        ) : null}
      </div>

      <div className="table-frame">
        <Table className={cn("min-w-[45rem]", tableClassName)}>
          <TableHeader className="bg-muted/40">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: loadingRows }).map((_, rowIndex) => (
                <TableRow key={`loading-${rowIndex}`}>
                  {columns.map((_, columnIndex) => (
                    <TableCell key={`loading-${rowIndex}-${columnIndex}`}>
                      <Skeleton
                        className={cn(
                          "h-4 w-full max-w-[10rem]",
                          columnIndex === 0 && "max-w-[12rem]"
                        )}
                      />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="px-4 py-8"
                >
                  <EmptyState
                    title={emptyMessage}
                    description={emptyDescription}
                  />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
