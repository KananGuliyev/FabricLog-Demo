"use client";

import { useTranslations } from "next-intl";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import type { DashboardSummary } from "@/types/domain";

type OrderPipelineChartProps = {
  data: DashboardSummary["orderPipeline"];
};

export function OrderPipelineChart({ data }: OrderPipelineChartProps) {
  const tStatus = useTranslations("Statuses.order");
  const tCharts = useTranslations("Dashboard.charts");

  return (
    <div className="h-72 min-w-0">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ left: 24 }}>
          <XAxis type="number" hide />
          <YAxis
            type="category"
            dataKey="status"
            tickLine={false}
            axisLine={false}
            width={96}
            tickFormatter={(
              value: DashboardSummary["orderPipeline"][number]["status"]
            ) => tStatus(value)}
          />
          <Tooltip
            formatter={(value) => [Number(value ?? 0), tCharts("pipelineValueLabel")]}
            labelFormatter={(value) =>
              tStatus(
                (value as DashboardSummary["orderPipeline"][number]["status"]) ??
                  "new"
              )
            }
            contentStyle={{
              borderRadius: 18,
              border: "1px solid color-mix(in srgb, var(--border) 70%, transparent)",
              background: "color-mix(in srgb, var(--card) 96%, white)",
            }}
          />
          <Bar dataKey="count" fill="var(--color-chart-3)" radius={999} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
