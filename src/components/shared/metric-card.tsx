import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { StatTone } from "@/types/ui";

type MetricCardProps = {
  label: string;
  value: string;
  hint: string;
  trend?: number;
  tone?: StatTone;
};

const toneStyles: Record<StatTone, string> = {
  neutral: "border-border/70 bg-gradient-to-br from-card via-card to-muted/25",
  success: "border-emerald-200/70 bg-gradient-to-br from-emerald-50/90 via-card to-card",
  warning: "border-amber-200/70 bg-gradient-to-br from-amber-50/90 via-card to-card",
  critical: "border-rose-200/70 bg-gradient-to-br from-rose-50/90 via-card to-card",
};

export function MetricCard({
  label,
  value,
  hint,
  trend,
  tone = "neutral",
}: MetricCardProps) {
  const TrendIcon = trend === undefined ? Minus : trend >= 0 ? ArrowUpRight : ArrowDownRight;
  const trendLabel =
    trend === undefined ? null : `${trend > 0 ? "+" : ""}${trend.toFixed(0)}%`;
  const isPositive = trend !== undefined && trend >= 0;

  return (
    <Card
      className={cn(
        "gap-4 border bg-gradient-to-br shadow-none",
        toneStyles[tone]
      )}
    >
      <CardHeader className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <p className="subtle-label text-[0.72rem] text-muted-foreground">
            {label}
          </p>
          {trendLabel ? (
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium",
                isPositive
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-rose-100 text-rose-700"
              )}
            >
              <TrendIcon className="size-3.5" />
              {trendLabel}
            </span>
          ) : null}
        </div>
        <CardTitle className="text-3xl font-semibold tracking-tight text-foreground">
          {value}
        </CardTitle>
      </CardHeader>
      <CardContent className="body-copy pt-0 text-sm text-muted-foreground">
        {hint}
      </CardContent>
    </Card>
  );
}
