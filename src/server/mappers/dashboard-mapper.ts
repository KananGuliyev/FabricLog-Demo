import type {
  Customer,
  DashboardSummary,
  FabricProduct,
  Invoice,
  Order,
  RecentActivity,
} from "@/types/domain";

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

function buildRecentOrders(
  customers: Customer[],
  orders: Order[]
): DashboardSummary["recentOrders"] {
  const customerNames = new Map(
    customers.map((customer) => [customer.id, customer.company])
  );

  return [...orders]
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt))
    .slice(0, 5)
    .map((order) => ({
      id: order.id,
      referenceCode: order.referenceCode,
      customerName: customerNames.get(order.customerId) ?? "Unknown",
      amount: order.amount,
      deliveryDate: order.deliveryDate,
      status: order.status,
    }));
}

function buildRecentInvoices(
  customers: Customer[],
  invoices: Invoice[]
): DashboardSummary["recentInvoices"] {
  const customerNames = new Map(
    customers.map((customer) => [customer.id, customer.company])
  );

  return [...invoices]
    .sort((left, right) => right.issuedAt.localeCompare(left.issuedAt))
    .slice(0, 5)
    .map((invoice) => ({
      id: invoice.id,
      customerName: customerNames.get(invoice.customerId) ?? "Unknown",
      amount: invoice.amount,
      paidAmount: invoice.paidAmount,
      dueAt: invoice.dueAt,
      status: invoice.status,
    }));
}

function buildStatusIndicators(
  fabrics: FabricProduct[],
  invoices: Invoice[],
  orders: Order[]
): DashboardSummary["statusIndicators"] {
  return [
    {
      key: "low_stock",
      count: fabrics.filter((fabric) => fabric.status === "low").length,
    },
    {
      key: "overdue_invoices",
      count: invoices.filter((invoice) => invoice.status === "overdue").length,
    },
    {
      key: "pending_invoices",
      count: invoices.filter((invoice) => invoice.status === "pending").length,
    },
    {
      key: "production_orders",
      count: orders.filter((order) => order.status === "production").length,
    },
  ];
}

export function buildDashboardSummary(params: {
  customers: Customer[];
  fabrics: FabricProduct[];
  invoices: Invoice[];
  orders: Order[];
  recentActivity: RecentActivity[];
}): DashboardSummary {
  const { customers, fabrics, invoices, orders, recentActivity } = params;
  const totalRevenue = invoices.reduce((sum, invoice) => sum + invoice.amount, 0);
  const totalCollected = invoices.reduce((sum, invoice) => sum + invoice.paidAmount, 0);
  const totalCustomers = customers.length;
  const totalOrders = orders.length;
  const totalInvoices = invoices.length;
  const unpaidInvoicesCount = invoices.filter((invoice) => invoice.status !== "paid").length;
  const lowStockCount = fabrics.filter((fabric) => fabric.status !== "available").length;

  return {
    totalCustomers,
    totalOrders,
    totalInvoices,
    totalRevenue,
    unpaidInvoicesCount,
    openInvoices: unpaidInvoicesCount,
    pendingPayments: invoices.filter((invoice) => invoice.status === "pending" || invoice.status === "overdue").length,
    activeCustomers: totalCustomers,
    collectionRate: totalCollected / totalRevenue,
    lowStockCount,
    monthlyRevenue: groupByMonth(invoices),
    paymentBreakdown: buildPaymentBreakdown(invoices),
    orderPipeline: buildOrderPipeline(orders),
    recentOrders: buildRecentOrders(customers, orders),
    recentInvoices: buildRecentInvoices(customers, invoices),
    statusIndicators: buildStatusIndicators(fabrics, invoices, orders),
    recentActivity: [...recentActivity].sort((left, right) =>
      right.occurredAt.localeCompare(left.occurredAt)
    ),
  };
}
