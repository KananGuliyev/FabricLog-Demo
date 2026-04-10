import {
  paymentsOverviewSchema,
  type Customer,
  type Invoice,
  type PaymentOverviewRow,
  type PaymentRecord,
} from "@/types/domain";

function buildPaymentRow(params: {
  customerName: string;
  invoice: Invoice;
  payment: PaymentRecord;
}): PaymentOverviewRow {
  const { customerName, invoice, payment } = params;

  return {
    id: payment.id,
    customerName,
    invoiceId: payment.invoiceId,
    invoiceAmount: invoice.amount,
    outstandingAmount: Math.max(invoice.amount - invoice.paidAmount, 0),
    paidAt: payment.paidAt,
    dueDate: invoice.dueAt,
    method: payment.method,
    amount: payment.amount,
    status: payment.status,
  };
}

function featuredPaymentSort(
  left: PaymentOverviewRow,
  right: PaymentOverviewRow
) {
  const statusPriority: Record<PaymentOverviewRow["status"], number> = {
    partial: 0,
    pending: 1,
    overdue: 2,
    paid: 3,
  };

  const byStatus = statusPriority[left.status] - statusPriority[right.status];

  if (byStatus !== 0) {
    return byStatus;
  }

  if (left.paidAt !== right.paidAt) {
    return right.paidAt.localeCompare(left.paidAt);
  }

  return right.amount - left.amount;
}

export function buildPaymentsOverview(params: {
  customers: Customer[];
  invoices: Invoice[];
  payments: PaymentRecord[];
}) {
  const customersById = new Map(
    params.customers.map((customer) => [customer.id, customer])
  );
  const invoicesById = new Map(
    params.invoices.map((invoice) => [invoice.id, invoice])
  );

  const rows = params.payments
    .map((payment) => {
      const invoice = invoicesById.get(payment.invoiceId);

      if (!invoice) {
        return null;
      }

      return buildPaymentRow({
        customerName:
          customersById.get(payment.customerId)?.company ?? "Unknown customer",
        invoice,
        payment,
      });
    })
    .filter((row): row is PaymentOverviewRow => Boolean(row))
    .sort((left, right) => {
      if (left.paidAt !== right.paidAt) {
        return right.paidAt.localeCompare(left.paidAt);
      }

      return right.id.localeCompare(left.id);
    });

  return paymentsOverviewSchema.parse({
    summary: {
      totalPayments: rows.length,
      collectedValue: rows.reduce((sum, row) => sum + row.amount, 0),
      bankTransferCount: rows.filter((row) => row.method === "Bank transfer").length,
      cardSettlementCount: rows.filter(
        (row) => row.method === "Card settlement"
      ).length,
      wireTransferCount: rows.filter((row) => row.method === "Wire transfer").length,
      partialReceiptsCount: rows.filter((row) => row.status === "partial").length,
      settledPaymentsCount: rows.filter((row) => row.status === "paid").length,
    },
    rows,
    featuredPayment: [...rows].sort(featuredPaymentSort)[0] ?? rows[0],
  });
}
