import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type ReportsBreakdownCardProps = {
  title: string;
  description: string;
  items: Array<{
    id: string;
    label: string;
    countLabel: string;
    toneClassName: string;
    valueLabel: string;
    width: number;
  }>;
};

export function ReportsBreakdownCard({
  title,
  description,
  items,
}: ReportsBreakdownCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <p className="body-copy text-sm text-muted-foreground">{description}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="rounded-2xl border border-border/70 bg-muted/24 px-4 py-3"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium">{item.label}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {item.countLabel}
                </p>
              </div>
              <p className="text-sm font-semibold">{item.valueLabel}</p>
            </div>
            <div className="mt-3 h-2 rounded-full bg-muted/70">
              <div
                className={cn("h-full rounded-full", item.toneClassName)}
                style={{ width: `${Math.max(item.width, 8)}%` }}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
