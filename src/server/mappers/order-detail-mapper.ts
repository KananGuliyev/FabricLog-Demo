import {
  orderDetailSchema,
  type CustomersOverview,
  type Invoice,
  type InvoicesOverview,
  type Order,
  type OrdersOverview,
  type PaymentRecord,
  type ProductsOverview,
  type RecentActivity,
} from "@/types/domain";

export function buildOrderDetail(params: {
  customersOverview: CustomersOverview;
  invoices: Invoice[];
  invoicesOverview: InvoicesOverview;
  orderId: string;
  orders: Order[];
  ordersOverview: OrdersOverview;
  payments: PaymentRecord[];
  productsOverview: ProductsOverview;
  recentActivity: RecentActivity[];
}) {
  const {
    customersOverview,
    invoices,
    invoicesOverview,
    orderId,
    orders,
    ordersOverview,
    payments,
    productsOverview,
    recentActivity,
  } = params;

  const rawOrder = orders.find((order) => order.id === orderId);
  const order = ordersOverview.rows.find((row) => row.id === orderId);

  if (!rawOrder || !order) {
    return null;
  }

  const invoiceRecord = invoices.find((invoice) => invoice.orderId === orderId);
  const customer = customersOverview.rows.find(
    (row) => row.id === rawOrder.customerId
  );
  const product = productsOverview.rows.find((row) => row.id === rawOrder.fabricId);

  if (!customer || !product) {
    return null;
  }

  const invoice = invoiceRecord
    ? invoicesOverview.rows.find((row) => row.id === invoiceRecord.id) ?? null
    : null;

  const relatedPayments = invoiceRecord
    ? payments
        .filter((payment) => payment.invoiceId === invoiceRecord.id)
        .sort((left, right) => right.paidAt.localeCompare(left.paidAt))
    : [];

  const orderActivity = recentActivity
    .filter(
      (activity) =>
        activity.orderCode === order.referenceCode ||
        activity.invoiceId === invoiceRecord?.id
    )
    .sort((left, right) => right.occurredAt.localeCompare(left.occurredAt));

  return orderDetailSchema.parse({
    order,
    customer,
    product,
    invoice,
    payments: relatedPayments,
    recentActivity: orderActivity,
  });
}
