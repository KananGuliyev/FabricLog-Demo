import {
  reportsOverviewSchema,
  type Customer,
  type FabricProduct,
  type Invoice,
  type Order,
  type OrderBillingStatus,
  type ReportsCustomerHighlight,
  type ReportsOrderHighlight,
  type ReportsOrderStatusItem,
  type ReportsPaymentBreakdownItem,
  type ReportsRevenuePoint,
} from "@/types/domain";

function groupRevenueByMonth(invoices: Invoice[]): ReportsRevenuePoint[] {
  const grouped = invoices.reduce<
    Record<string, { month: string; revenue: number; invoices: number; sortKey: string }>
  >((acc, invoice) => {
    const sortKey = invoice.issuedAt.slice(0, 7);
    const month = new Date(invoice.issuedAt).toLocaleDateString("en-US", {
      month: "short",
    });

    if (!acc[sortKey]) {
      acc[sortKey] = { month, revenue: 0, invoices: 0, sortKey };
    }

    acc[sortKey].revenue += invoice.amount;
    acc[sortKey].invoices += 1;

    return acc;
  }, {});

  return Object.values(grouped)
    .sort((left, right) => left.sortKey.localeCompare(right.sortKey))
    .map(({ month, revenue, invoices: count }) => ({
      month,
      revenue,
      invoices: count,
    }));
}

function buildPaymentBreakdown(
  invoices: Invoice[]
): ReportsPaymentBreakdownItem[] {
  const grouped = invoices.reduce<
    Record<
      Invoice["status"],
      {
        status: Invoice["status"];
        count: number;
        totalAmount: number;
        openAmount: number;
      }
    >
  >(
    (acc, invoice) => {
      if (!acc[invoice.status]) {
        acc[invoice.status] = {
          status: invoice.status,
          count: 0,
          totalAmount: 0,
          openAmount: 0,
        };
      }

      acc[invoice.status].count += 1;
      acc[invoice.status].totalAmount += invoice.amount;
      acc[invoice.status].openAmount += Math.max(
        invoice.amount - invoice.paidAmount,
        0
      );

      return acc;
    },
    {
      paid: { status: "paid", count: 0, totalAmount: 0, openAmount: 0 },
      partial: { status: "partial", count: 0, totalAmount: 0, openAmount: 0 },
      pending: { status: "pending", count: 0, totalAmount: 0, openAmount: 0 },
      overdue: { status: "overdue", count: 0, totalAmount: 0, openAmount: 0 },
    }
  );

  return Object.values(grouped);
}

function buildOrderStatusOverview(orders: Order[]): ReportsOrderStatusItem[] {
  const grouped = orders.reduce<
    Record<Order["status"], { status: Order["status"]; count: number; totalAmount: number }>
  >(
    (acc, order) => {
      if (!acc[order.status]) {
        acc[order.status] = { status: order.status, count: 0, totalAmount: 0 };
      }

      acc[order.status].count += 1;
      acc[order.status].totalAmount += order.amount;

      return acc;
    },
    {
      new: { status: "new", count: 0, totalAmount: 0 },
      sampling: { status: "sampling", count: 0, totalAmount: 0 },
      production: { status: "production", count: 0, totalAmount: 0 },
      ready: { status: "ready", count: 0, totalAmount: 0 },
      dispatched: { status: "dispatched", count: 0, totalAmount: 0 },
    }
  );

  return Object.values(grouped);
}

function buildCustomerHighlights(params: {
  customers: Customer[];
  invoices: Invoice[];
}): ReportsCustomerHighlight[] {
  const invoicesByCustomerId = params.invoices.reduce<
    Map<string, { invoiceValue: number; outstandingAmount: number }>
  >((acc, invoice) => {
    const current = acc.get(invoice.customerId) ?? {
      invoiceValue: 0,
      outstandingAmount: 0,
    };

    current.invoiceValue += invoice.amount;
    current.outstandingAmount += Math.max(invoice.amount - invoice.paidAmount, 0);
    acc.set(invoice.customerId, current);

    return acc;
  }, new Map());

  return params.customers
    .map((customer) => {
      const summary = invoicesByCustomerId.get(customer.id) ?? {
        invoiceValue: 0,
        outstandingAmount: 0,
      };

      return {
        id: customer.id,
        customerName: customer.company,
        tier: customer.tier,
        orderCount: customer.totalOrders,
        invoiceValue: summary.invoiceValue,
        outstandingAmount: summary.outstandingAmount,
      };
    })
    .sort((left, right) => {
      if (right.invoiceValue !== left.invoiceValue) {
        return right.invoiceValue - left.invoiceValue;
      }

      if (right.orderCount !== left.orderCount) {
        return right.orderCount - left.orderCount;
      }

      return left.customerName.localeCompare(right.customerName);
    })
    .slice(0, 3);
}

function resolveOrderPaymentStatus(invoice?: Invoice): OrderBillingStatus {
  return invoice?.status ?? "none";
}

function buildOrderHighlights(params: {
  customers: Customer[];
  fabrics: FabricProduct[];
  invoices: Invoice[];
  orders: Order[];
}): ReportsOrderHighlight[] {
  const customersById = new Map(
    params.customers.map((customer) => [customer.id, customer])
  );
  const fabricsById = new Map(params.fabrics.map((fabric) => [fabric.id, fabric]));
  const invoicesByOrderId = new Map(
    params.invoices.map((invoice) => [invoice.orderId, invoice])
  );

  return params.orders
    .map((order) => {
      const productName = fabricsById.get(order.fabricId)?.name ?? "Unknown product";

      return {
        id: order.id,
        referenceCode: order.referenceCode,
        customerName:
          customersById.get(order.customerId)?.company ?? "Unknown customer",
        itemSummary: `${productName} - ${order.quantityMeters} m`,
        amount: order.amount,
        deliveryDate: order.deliveryDate,
        status: order.status,
        paymentStatus: resolveOrderPaymentStatus(invoicesByOrderId.get(order.id)),
      };
    })
    .sort((left, right) => {
      const leftActive = left.status === "dispatched" ? 1 : 0;
      const rightActive = right.status === "dispatched" ? 1 : 0;

      if (leftActive !== rightActive) {
        return leftActive - rightActive;
      }

      if (right.amount !== left.amount) {
        return right.amount - left.amount;
      }

      return left.referenceCode.localeCompare(right.referenceCode);
    })
    .slice(0, 3);
}

export function buildReportsOverview(params: {
  customers: Customer[];
  fabrics: FabricProduct[];
  invoices: Invoice[];
  orders: Order[];
}) {
  const totalRevenue = params.invoices.reduce(
    (sum, invoice) => sum + invoice.amount,
    0
  );
  const totalCollected = params.invoices.reduce(
    (sum, invoice) => sum + invoice.paidAmount,
    0
  );

  return reportsOverviewSchema.parse({
    summary: {
      totalRevenue,
      collectionRate: totalRevenue === 0 ? 0 : totalCollected / totalRevenue,
      overdueExposure: params.invoices
        .filter((invoice) => invoice.status === "overdue")
        .reduce(
          (sum, invoice) => sum + Math.max(invoice.amount - invoice.paidAmount, 0),
          0
        ),
      activeOrders: params.orders.filter((order) => order.status !== "dispatched")
        .length,
      activeCustomers: params.customers.filter((customer) => customer.totalOrders > 0)
        .length,
      pendingInvoices: params.invoices.filter(
        (invoice) => invoice.status === "pending" || invoice.status === "partial"
      ).length,
      lowStockReferences: params.fabrics.filter((fabric) => fabric.status === "low")
        .length,
    },
    revenueTrend: groupRevenueByMonth(params.invoices),
    paymentBreakdown: buildPaymentBreakdown(params.invoices),
    orderStatusOverview: buildOrderStatusOverview(params.orders),
    customerHighlights: buildCustomerHighlights(params),
    orderHighlights: buildOrderHighlights(params),
  });
}
