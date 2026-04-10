import type { ReactNode } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

type PreviewColumn<T> = {
  align?: "left" | "right";
  header: string;
  key: keyof T;
  render?: (row: T) => ReactNode;
};

type DashboardPreviewTableProps<T extends { id: string }> = {
  columns: PreviewColumn<T>[];
  description: string;
  rows: T[];
  title: string;
};

export function DashboardPreviewTable<T extends { id: string }>({
  columns,
  description,
  rows,
  title,
}: DashboardPreviewTableProps<T>) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <p className="body-copy text-sm text-muted-foreground">{description}</p>
      </CardHeader>
      <CardContent className="p-0">
        <div className="table-frame rounded-none border-x-0 border-b-0">
          <Table>
            <TableHeader className="bg-muted/34">
              <TableRow>
                {columns.map((column) => (
                  <TableHead
                    key={String(column.key)}
                    className={cn(
                      column.align === "right" ? "text-right" : "text-left"
                    )}
                  >
                    {column.header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id}>
                  {columns.map((column) => (
                    <TableCell
                      key={`${row.id}-${String(column.key)}`}
                      className={cn(
                        "align-middle",
                        column.align === "right" ? "text-right" : "text-left"
                      )}
                    >
                      {column.render
                        ? column.render(row)
                        : (row[column.key] as ReactNode)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
