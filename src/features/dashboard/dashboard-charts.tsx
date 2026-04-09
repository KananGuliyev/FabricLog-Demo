"use client";

import dynamic from "next/dynamic";

import type { AppLocale } from "@/lib/constants/site";
import type { DashboardSummary } from "@/types/domain";

const RevenueChart = dynamic(
  () => import("@/components/dashboard/revenue-chart").then((mod) => mod.RevenueChart),
  { ssr: false, loading: () => <div className="h-72 rounded-3xl bg-muted/40" /> }
);

const PaymentBreakdownChart = dynamic(
  () =>
    import("@/components/dashboard/payment-breakdown-chart").then(
      (mod) => mod.PaymentBreakdownChart
    ),
  { ssr: false, loading: () => <div className="h-64 rounded-3xl bg-muted/40" /> }
);

const OrderPipelineChart = dynamic(
  () =>
    import("@/components/dashboard/order-pipeline-chart").then(
      (mod) => mod.OrderPipelineChart
    ),
  { ssr: false, loading: () => <div className="h-72 rounded-3xl bg-muted/40" /> }
);

export function DashboardRevenueChart(props: {
  data: DashboardSummary["monthlyRevenue"];
  locale: AppLocale;
}) {
  return <RevenueChart {...props} />;
}

export function DashboardPaymentChart(props: {
  data: DashboardSummary["paymentBreakdown"];
  locale: AppLocale;
}) {
  return <PaymentBreakdownChart {...props} />;
}

export function DashboardPipelineChart(props: {
  data: DashboardSummary["orderPipeline"];
}) {
  return <OrderPipelineChart {...props} />;
}
