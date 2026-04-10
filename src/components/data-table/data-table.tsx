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

import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EmptyState } from "@/components/shared/empty-state";

type DataTableProps<TData> = {
  data: TData[];
  columns: ColumnDef<TData>[];
  emptyMessage: string;
  emptyDescription?: string;
  onSearchChange?: (value: string) => void;
  searchAccessor?: (row: TData) => string;
  searchPlaceholder: string;
  searchValue?: string;
  toolbarExtras?: ReactNode;
};

export function DataTable<TData>({
  data,
  columns,
  emptyMessage,
  emptyDescription,
  onSearchChange,
  searchAccessor,
  searchPlaceholder,
  searchValue,
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
        <div className="relative w-full max-w-md">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="pl-10"
            placeholder={searchPlaceholder}
          />
        </div>
        {toolbarExtras ? (
          <div className="flex flex-wrap items-center gap-3">{toolbarExtras}</div>
        ) : null}
      </div>

      <div className="table-frame">
        <Table>
          <TableHeader className="bg-muted/34">
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
            {table.getRowModel().rows.length ? (
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
                  className="px-4 py-6"
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
