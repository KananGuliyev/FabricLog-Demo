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
  neutral: "from-card to-card/70",
  success: "from-emerald-50 to-card",
  warning: "from-amber-50 to-card",
  critical: "from-rose-50 to-card",
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
        "surface-panel border-0 bg-gradient-to-br",
        toneStyles[tone]
      )}
    >
      <CardHeader className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
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
        <CardTitle className="text-3xl font-semibold tracking-tight">
          {value}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 text-sm text-muted-foreground">
        {hint}
      </CardContent>
    </Card>
  );
}
