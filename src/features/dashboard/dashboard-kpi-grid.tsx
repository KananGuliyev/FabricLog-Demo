import { MetricCard } from "@/components/shared/metric-card";
import type { StatTone } from "@/types/ui";

type DashboardMetric = {
  hint: string;
  label: string;
  tone?: StatTone;
  trend?: number;
  value: string;
};

type DashboardKpiGridProps = {
  metrics: DashboardMetric[];
};

export function DashboardKpiGrid({ metrics }: DashboardKpiGridProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
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
