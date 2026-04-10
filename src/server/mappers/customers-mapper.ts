import type {
  Customer,
  CustomerOverviewRow,
  CustomerPaymentHealth,
  CustomersOverview,
  Invoice,
  PaymentRecord,
  RecentActivity,
} from "@/types/domain";

function resolvePaymentHealth(invoices: Invoice[]): CustomerPaymentHealth {
  if (!invoices.length) {
    return "none";
  }

  if (invoices.some((invoice) => invoice.status === "overdue")) {
    return "overdue";
  }

  if (invoices.some((invoice) => invoice.status === "partial")) {
    return "partial";
  }

  if (invoices.some((invoice) => invoice.status === "pending")) {
    return "pending";
  }

  return "paid";
}

function resolveLastActivityDate(params: {
  customer: Customer;
  customerInvoices: Invoice[];
  customerPayments: PaymentRecord[];
  recentActivity: RecentActivity[];
}) {
  const { customer, customerInvoices, customerPayments, recentActivity } = params;
  const dates = [
    customer.lastOrderDate,
    ...customerInvoices.map((invoice) => invoice.issuedAt),
    ...customerPayments.map((payment) => payment.paidAt),
    ...recentActivity.map((activity) => activity.occurredAt),
  ];

  return dates.sort((left, right) => right.localeCompare(left))[0] ?? customer.lastOrderDate;
}

function buildCustomerRows(params: {
  customers: Customer[];
  invoices: Invoice[];
  payments: PaymentRecord[];
  recentActivity: RecentActivity[];
}): CustomerOverviewRow[] {
  const { customers, invoices, payments, recentActivity } = params;

  return customers
    .map((customer) => {
      const customerInvoices = invoices.filter(
        (invoice) => invoice.customerId === customer.id
      );
      const customerPayments = payments.filter(
        (payment) => payment.customerId === customer.id
      );
      const customerActivity = recentActivity.filter(
        (activity) => activity.customerName === customer.company
      );
      const paidInvoicesCount = customerInvoices.filter(
        (invoice) => invoice.status === "paid"
      ).length;

      return {
        id: customer.id,
        name: customer.name,
        company: customer.company,
        email: customer.email,
        region: customer.region,
        tier: customer.tier,
        preferredCollection: customer.preferredCollection,
        totalOrders: customer.totalOrders,
        invoiceCount: customerInvoices.length,
        paidInvoicesCount,
        openInvoicesCount: customerInvoices.length - paidInvoicesCount,
        outstandingBalance: customer.outstandingBalance,
        paymentHealth: resolvePaymentHealth(customerInvoices),
        lastActivityDate: resolveLastActivityDate({
          customer,
          customerInvoices,
          customerPayments,
          recentActivity: customerActivity,
        }),
      };
    })
    .sort((left, right) => left.company.localeCompare(right.company));
}

export function buildCustomersOverview(params: {
  customers: Customer[];
  invoices: Invoice[];
  payments: PaymentRecord[];
  recentActivity: RecentActivity[];
}): CustomersOverview {
  const rows = buildCustomerRows(params);
  const featuredCustomer =
    [...rows].sort((left, right) => {
      if (right.outstandingBalance !== left.outstandingBalance) {
        return right.outstandingBalance - left.outstandingBalance;
      }

      return right.totalOrders - left.totalOrders;
    })[0] ?? rows[0]!;

  return {
    summary: {
      totalCustomers: rows.length,
      signatureCustomers: rows.filter((row) => row.tier === "signature").length,
      growthCustomers: rows.filter((row) => row.tier === "growth").length,
      totalOutstandingBalance: rows.reduce(
        (sum, row) => sum + row.outstandingBalance,
        0
      ),
      overdueCustomers: rows.filter((row) => row.paymentHealth === "overdue").length,
      followUpCustomers: rows.filter((row) =>
        row.paymentHealth === "partial" || row.paymentHealth === "pending"
      ).length,
    },
    rows,
    featuredCustomer,
  };
}
