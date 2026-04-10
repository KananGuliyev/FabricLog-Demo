import { MetricCard } from "@/components/shared/metric-card";
import { cn } from "@/lib/utils";
import type { StatTone } from "@/types/ui";

type DashboardMetric = {
  hint: string;
  label: string;
  tone?: StatTone;
  trend?: number;
  value: string;
};

type DashboardKpiGridProps = {
  className?: string;
  metrics: DashboardMetric[];
};

export function DashboardKpiGrid({
  className,
  metrics,
}: DashboardKpiGridProps) {
  return (
    <div className={cn("grid gap-4 md:grid-cols-2 xl:grid-cols-5", className)}>
      {metrics.map((metric) => (
        <MetricCard
          key={metric.label}
          label={metric.label}
          value={metric.value}
          hint={metric.hint}
          trend={metric.trend}
          tone={metric.tone}
        />
      ))}
    </div>
  );
}
