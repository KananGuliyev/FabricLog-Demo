"use client";

import { useTranslations } from "next-intl";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import type { AppLocale } from "@/lib/constants/site";
import { formatCurrency } from "@/lib/formatting";
import type { DashboardSummary } from "@/types/domain";

const pieColors = [
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-1)",
  "var(--destructive)",
];

type PaymentBreakdownChartProps = {
  data: DashboardSummary["paymentBreakdown"];
  locale: AppLocale;
};

export function PaymentBreakdownChart({
  data,
  locale,
}: PaymentBreakdownChartProps) {
  const tStatus = useTranslations("Statuses.payment");
  const tCharts = useTranslations("Dashboard.charts");

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
      <div className="h-64 min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip
              formatter={(value) => [
                formatCurrency(Number(value ?? 0), locale),
                tCharts("paymentValueLabel"),
              ]}
              contentStyle={{
                borderRadius: 18,
                border: "1px solid color-mix(in srgb, var(--border) 70%, transparent)",
                background: "color-mix(in srgb, var(--card) 96%, white)",
              }}
            />
            <Pie
              data={data}
              dataKey="value"
              nameKey="status"
              innerRadius={64}
              outerRadius={92}
              paddingAngle={3}
            >
              {data.map((entry, index) => (
                <Cell
                  key={entry.status}
                  fill={pieColors[index % pieColors.length] ?? "var(--color-chart-1)"}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-3">
        {data.map((entry, index) => (
          <div
            key={entry.status}
            className="flex items-center justify-between rounded-2xl border border-border/70 bg-muted/30 px-4 py-3"
          >
            <div className="flex items-center gap-3">
              <span
                className="size-3 rounded-full"
                style={{ backgroundColor: pieColors[index % pieColors.length] }}
              />
              <div>
                <p className="text-sm font-medium">{tStatus(entry.status)}</p>
                <p className="text-xs text-muted-foreground">
                  {tCharts("paymentCountLabel", { count: entry.count })}
                </p>
              </div>
            </div>
            <p className="text-sm font-semibold">
              {formatCurrency(entry.value, locale)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
