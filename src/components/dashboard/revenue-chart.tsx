"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { AppLocale } from "@/lib/constants/site";
import { formatCurrency } from "@/lib/formatting";
import type { DashboardSummary } from "@/types/domain";

type RevenueChartProps = {
  data: DashboardSummary["monthlyRevenue"];
  locale: AppLocale;
};

export function RevenueChart({ data, locale }: RevenueChartProps) {
  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="revenueFill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="5%" stopColor="var(--color-chart-1)" stopOpacity={0.35} />
              <stop offset="95%" stopColor="var(--color-chart-1)" stopOpacity={0.04} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="4 4"
            vertical={false}
            stroke="color-mix(in srgb, var(--border) 80%, transparent)"
          />
          <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={12} />
          <YAxis
            tickLine={false}
            axisLine={false}
            width={88}
            tickFormatter={(value: number) => formatCurrency(value, locale)}
          />
          <Tooltip
            formatter={(value) => [
              formatCurrency(Number(value ?? 0), locale),
              "Revenue",
            ]}
            contentStyle={{
              borderRadius: 18,
              border: "1px solid color-mix(in srgb, var(--border) 70%, transparent)",
              background: "color-mix(in srgb, var(--card) 96%, white)",
            }}
          />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="var(--color-chart-1)"
            fill="url(#revenueFill)"
            strokeWidth={3}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
