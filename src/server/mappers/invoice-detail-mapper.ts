import {
  invoiceDetailSchema,
  type CustomersOverview,
  type Invoice,
  type InvoicesOverview,
  type Order,
  type OrdersOverview,
  type PaymentRecord,
  type ProductsOverview,
  type RecentActivity,
} from "@/types/domain";

export function buildInvoiceDetail(params: {
  customersOverview: CustomersOverview;
  invoiceId: string;
  invoices: Invoice[];
  invoicesOverview: InvoicesOverview;
  orders: Order[];
  ordersOverview: OrdersOverview;
  payments: PaymentRecord[];
  productsOverview: ProductsOverview;
  recentActivity: RecentActivity[];
}) {
  const {
    customersOverview,
    invoiceId,
    invoices,
    invoicesOverview,
    orders,
    ordersOverview,
    payments,
    productsOverview,
    recentActivity,
  } = params;

  const invoiceRecord = invoices.find((invoice) => invoice.id === invoiceId);
  const invoice = invoicesOverview.rows.find((row) => row.id === invoiceId);

  if (!invoiceRecord || !invoice) {
    return null;
  }

  const customer = customersOverview.rows.find(
    (row) => row.id === invoiceRecord.customerId
  );
  const rawOrder = orders.find((order) => order.id === invoiceRecord.orderId);
  const order = rawOrder
    ? ordersOverview.rows.find((row) => row.id === rawOrder.id) ?? null
    : null;
  const product = rawOrder
    ? productsOverview.rows.find((row) => row.id === rawOrder.fabricId) ?? null
    : null;

  if (!customer) {
    return null;
  }

  const paymentHistory = payments
    .filter((payment) => payment.invoiceId === invoiceId)
    .sort((left, right) => right.paidAt.localeCompare(left.paidAt));

  const invoiceActivity = recentActivity
    .filter(
      (activity) =>
        activity.invoiceId === invoiceId ||
        activity.orderCode === order?.referenceCode
    )
    .sort((left, right) => right.occurredAt.localeCompare(left.occurredAt));

  return invoiceDetailSchema.parse({
    invoice,
    customer,
    order,
    product,
    payments: paymentHistory,
    recentActivity: invoiceActivity,
  });
}
