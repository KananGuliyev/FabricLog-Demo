import {
  ordersOverviewSchema,
  type Customer,
  type FabricProduct,
  type Invoice,
  type Order,
  type OrderBillingStatus,
  type OrderOverviewRow,
} from "@/types/domain";

function resolvePaymentStatus(invoice?: Invoice): OrderBillingStatus {
  return invoice?.status ?? "none";
}

function buildItemSummary(productName: string, quantityMeters: number) {
  return `${productName} · ${quantityMeters} m`;
}

function buildOrderRow(params: {
  customerName: string;
  invoice?: Invoice;
  order: Order;
  productName: string;
}): OrderOverviewRow {
  const { customerName, invoice, order, productName } = params;

  return {
    id: order.id,
    referenceCode: order.referenceCode,
    customerName,
    fabricName: productName,
    orderDate: order.createdAt,
    deliveryDate: order.deliveryDate,
    itemSummary: buildItemSummary(productName, order.quantityMeters),
    quantityMeters: order.quantityMeters,
    totalAmount: order.amount,
    status: order.status,
    paymentStatus: resolvePaymentStatus(invoice),
    invoiceId: invoice?.id ?? null,
  };
}

function featuredOrderSort(left: OrderOverviewRow, right: OrderOverviewRow) {
  const statusPriority: Record<OrderOverviewRow["status"], number> = {
    production: 0,
    ready: 1,
    sampling: 2,
    new: 3,
    dispatched: 4,
  };
  const paymentPriority: Record<OrderOverviewRow["paymentStatus"], number> = {
    overdue: 0,
    partial: 1,
    pending: 2,
    none: 3,
    paid: 4,
  };

  const byOrderStatus = statusPriority[left.status] - statusPriority[right.status];

  if (byOrderStatus !== 0) {
    return byOrderStatus;
  }

  const byPaymentStatus =
    paymentPriority[left.paymentStatus] - paymentPriority[right.paymentStatus];

  if (byPaymentStatus !== 0) {
    return byPaymentStatus;
  }

  if (right.totalAmount !== left.totalAmount) {
    return right.totalAmount - left.totalAmount;
  }

  return left.referenceCode.localeCompare(right.referenceCode);
}

export function buildOrdersOverview(params: {
  customers: Customer[];
  fabrics: FabricProduct[];
  invoices: Invoice[];
  orders: Order[];
}) {
  const customersById = new Map(
    params.customers.map((customer) => [customer.id, customer])
  );
  const fabricsById = new Map(params.fabrics.map((fabric) => [fabric.id, fabric]));
  const invoicesByOrderId = new Map(
    params.invoices.map((invoice) => [invoice.orderId, invoice])
  );

  const rows = params.orders
    .map((order) =>
      buildOrderRow({
        customerName:
          customersById.get(order.customerId)?.company ?? "Unknown customer",
        invoice: invoicesByOrderId.get(order.id),
        order,
        productName: fabricsById.get(order.fabricId)?.name ?? "Unknown product",
      })
    )
    .sort((left, right) => {
      if (left.orderDate !== right.orderDate) {
        return right.orderDate.localeCompare(left.orderDate);
      }

      return right.referenceCode.localeCompare(left.referenceCode);
    });

  const billingFollowUpCount = rows.filter(
    (row) => row.paymentStatus !== "paid"
  ).length;

  return ordersOverviewSchema.parse({
    summary: {
      totalOrders: rows.length,
      liveOrderValue: rows.reduce((sum, row) => sum + row.totalAmount, 0),
      inProductionCount: rows.filter((row) => row.status === "production").length,
      readyToDispatchCount: rows.filter((row) => row.status === "ready").length,
      billingFollowUpCount,
    },
    rows,
    featuredOrder: [...rows].sort(featuredOrderSort)[0] ?? rows[0],
  });
}
