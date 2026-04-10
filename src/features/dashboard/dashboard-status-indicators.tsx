import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type StatusIndicatorItem = {
  count: number;
  label: string;
  tone: "critical" | "neutral" | "success" | "warning";
};

type DashboardStatusIndicatorsProps = {
  description: string;
  items: StatusIndicatorItem[];
  title: string;
};

const toneStyles: Record<StatusIndicatorItem["tone"], string> = {
  success: "border-emerald-200/80 bg-emerald-50 text-emerald-700",
  warning: "border-amber-200/80 bg-amber-50 text-amber-700",
  critical: "border-rose-200/80 bg-rose-50 text-rose-700",
  neutral: "border-slate-200/90 bg-slate-100 text-slate-700",
};

export function DashboardStatusIndicators({
  description,
  items,
  title,
}: DashboardStatusIndicatorsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <p className="body-copy text-sm text-muted-foreground">{description}</p>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-3">
        {items.map((item) => (
          <div
            key={item.label}
            className={cn(
              "inline-flex min-w-[10.5rem] flex-1 items-center justify-between rounded-2xl border px-4 py-3",
              toneStyles[item.tone]
            )}
          >
            <span className="text-sm font-medium">{item.label}</span>
            <span className="text-xl font-semibold">{item.count}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
