import {
  customerDetailSchema,
  type CustomersOverview,
  type Invoice,
  type InvoicesOverview,
  type Order,
  type OrdersOverview,
  type RecentActivity,
} from "@/types/domain";

export function buildCustomerDetail(params: {
  customerId: string;
  customersOverview: CustomersOverview;
  invoices: Invoice[];
  invoicesOverview: InvoicesOverview;
  orders: Order[];
  ordersOverview: OrdersOverview;
  recentActivity: RecentActivity[];
}) {
  const {
    customerId,
    customersOverview,
    invoices,
    invoicesOverview,
    orders,
    ordersOverview,
    recentActivity,
  } = params;

  const profile = customersOverview.rows.find((row) => row.id === customerId);

  if (!profile) {
    return null;
  }

  const orderRowsById = new Map(ordersOverview.rows.map((row) => [row.id, row]));
  const invoiceRowsById = new Map(
    invoicesOverview.rows.map((row) => [row.id, row])
  );

  const recentOrders = orders
    .filter((order) => order.customerId === customerId)
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt))
    .map((order) => orderRowsById.get(order.id))
    .filter((row): row is NonNullable<typeof row> => Boolean(row));

  const recentInvoices = invoices
    .filter((invoice) => invoice.customerId === customerId)
    .sort((left, right) => right.issuedAt.localeCompare(left.issuedAt))
    .map((invoice) => invoiceRowsById.get(invoice.id))
    .filter((row): row is NonNullable<typeof row> => Boolean(row));

  const accountActivity = recentActivity
    .filter((activity) => activity.customerName === profile.company)
    .sort((left, right) => right.occurredAt.localeCompare(left.occurredAt));

  return customerDetailSchema.parse({
    profile: {
      ...profile,
      totalInvoicedValue: invoices
        .filter((invoice) => invoice.customerId === customerId)
        .reduce((sum, invoice) => sum + invoice.amount, 0),
    },
    recentOrders,
    recentInvoices,
    recentActivity: accountActivity,
  });
}
