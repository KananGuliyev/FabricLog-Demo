import type { ReactNode } from "react";

type DetailMetaGridProps = {
  items: Array<{
    label: string;
    value: ReactNode;
  }>;
};

export function DetailMetaGrid({ items }: DetailMetaGridProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {items.map((item) => (
        <div key={item.label} className="panel-secondary px-4 py-4">
          <p className="subtle-label text-muted-foreground">{item.label}</p>
          <div className="mt-2 text-sm font-medium text-foreground">
            {item.value}
          </div>
        </div>
      ))}
    </div>
  );
}
