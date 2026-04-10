import type { DashboardSummary, Invoice, Order, RecentActivity } from "@/types/domain";

function groupByMonth(invoices: Invoice[]) {
  const revenueByMonth = invoices.reduce<
    Record<string, { month: string; revenue: number; invoices: number; sortKey: string }>
  >(
    (acc, invoice) => {
      const date = new Date(invoice.issuedAt);
      const sortKey = invoice.issuedAt.slice(0, 7);
      const month = date.toLocaleDateString("en-US", {
        month: "short",
      });

      if (!acc[sortKey]) {
        acc[sortKey] = { month, revenue: 0, invoices: 0, sortKey };
      }

      acc[sortKey].revenue += invoice.amount;
      acc[sortKey].invoices += 1;

      return acc;
    },
    {}
  );

  return Object.values(revenueByMonth)
    .sort((left, right) => left.sortKey.localeCompare(right.sortKey))
    .map(({ month, revenue, invoices }) => ({
      month,
      revenue,
      invoices,
    }));
}

function buildPaymentBreakdown(invoices: Invoice[]): DashboardSummary["paymentBreakdown"] {
  const summary = invoices.reduce<
    Record<Invoice["status"], { status: Invoice["status"]; count: number; value: number }>
  >(
    (acc, invoice) => {
      if (!acc[invoice.status]) {
        acc[invoice.status] = { status: invoice.status, count: 0, value: 0 };
      }

      acc[invoice.status].count += 1;
      acc[invoice.status].value += invoice.amount - invoice.paidAmount;

      return acc;
    },
    {
      paid: { status: "paid", count: 0, value: 0 },
      partial: { status: "partial", count: 0, value: 0 },
      pending: { status: "pending", count: 0, value: 0 },
      overdue: { status: "overdue", count: 0, value: 0 },
    }
  );

  return Object.values(summary);
}

function buildOrderPipeline(orders: Order[]): DashboardSummary["orderPipeline"] {
  const summary = orders.reduce<
    Record<Order["status"], { status: Order["status"]; count: number }>
  >(
    (acc, order) => {
      if (!acc[order.status]) {
        acc[order.status] = { status: order.status, count: 0 };
      }

      acc[order.status].count += 1;
      return acc;
    },
    {
      new: { status: "new", count: 0 },
      sampling: { status: "sampling", count: 0 },
      production: { status: "production", count: 0 },
      ready: { status: "ready", count: 0 },
      dispatched: { status: "dispatched", count: 0 },
    }
  );

  return Object.values(summary);
}

export function buildDashboardSummary(params: {
  activeCustomers: number;
  invoices: Invoice[];
  lowStockCount: number;
  orders: Order[];
  recentActivity: RecentActivity[];
}): DashboardSummary {
  const { activeCustomers, invoices, lowStockCount, orders, recentActivity } = params;
  const totalRevenue = invoices.reduce((sum, invoice) => sum + invoice.amount, 0);
  const totalCollected = invoices.reduce((sum, invoice) => sum + invoice.paidAmount, 0);

  return {
    totalRevenue,
    openInvoices: invoices.filter((invoice) => invoice.status !== "paid").length,
    pendingPayments: invoices.filter((invoice) => invoice.status === "pending" || invoice.status === "overdue").length,
    activeCustomers,
    collectionRate: totalCollected / totalRevenue,
    lowStockCount,
    monthlyRevenue: groupByMonth(invoices),
    paymentBreakdown: buildPaymentBreakdown(invoices),
    orderPipeline: buildOrderPipeline(orders),
    recentActivity: [...recentActivity].sort((left, right) =>
      right.occurredAt.localeCompare(left.occurredAt)
    ),
  };
}
