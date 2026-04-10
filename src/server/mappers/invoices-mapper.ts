import type { InvoiceBadgeStatus } from "@/types/domain";
import {
  invoicesOverviewSchema,
  type Customer,
  type Invoice,
  type InvoiceOverviewRow,
  type Order,
} from "@/types/domain";

function getBadgeStatus(status: Invoice["status"]): InvoiceBadgeStatus {
  if (status === "partial") {
    return "unpaid";
  }

  return status;
}

function buildInvoiceRow(params: {
  customerName: string;
  invoice: Invoice;
  orderReference: string | null;
}): InvoiceOverviewRow {
  const { customerName, invoice, orderReference } = params;

  return {
    id: invoice.id,
    customerName,
    issueDate: invoice.issuedAt,
    dueDate: invoice.dueAt,
    amount: invoice.amount,
    paidAmount: invoice.paidAmount,
    outstandingAmount: Math.max(invoice.amount - invoice.paidAmount, 0),
    paymentStatus: invoice.status,
    badgeStatus: getBadgeStatus(invoice.status),
    orderReference,
  };
}

function featuredInvoiceSort(left: InvoiceOverviewRow, right: InvoiceOverviewRow) {
  const badgePriority: Record<InvoiceOverviewRow["badgeStatus"], number> = {
    overdue: 0,
    unpaid: 1,
    pending: 2,
    paid: 3,
  };

  const byBadge = badgePriority[left.badgeStatus] - badgePriority[right.badgeStatus];

  if (byBadge !== 0) {
    return byBadge;
  }

  if (right.outstandingAmount !== left.outstandingAmount) {
    return right.outstandingAmount - left.outstandingAmount;
  }

  return right.dueDate.localeCompare(left.dueDate);
}

export function buildInvoicesOverview(params: {
  customers: Customer[];
  invoices: Invoice[];
  orders: Order[];
}) {
  const customersById = new Map(
    params.customers.map((customer) => [customer.id, customer])
  );
  const ordersById = new Map(params.orders.map((order) => [order.id, order]));

  const rows = params.invoices
    .map((invoice) =>
      buildInvoiceRow({
        customerName:
          customersById.get(invoice.customerId)?.company ?? "Unknown customer",
        invoice,
        orderReference: ordersById.get(invoice.orderId)?.referenceCode ?? null,
      })
    )
    .sort((left, right) => {
      if (left.dueDate !== right.dueDate) {
        return left.dueDate.localeCompare(right.dueDate);
      }

      return right.id.localeCompare(left.id);
    });

  return invoicesOverviewSchema.parse({
    summary: {
      totalInvoices: rows.length,
      openInvoiceValue: rows.reduce(
        (sum, row) => sum + row.outstandingAmount,
        0
      ),
      overdueExposure: rows
        .filter((row) => row.badgeStatus === "overdue")
        .reduce((sum, row) => sum + row.outstandingAmount, 0),
      paidInFullCount: rows.filter((row) => row.badgeStatus === "paid").length,
      unpaidCount: rows.filter((row) => row.badgeStatus === "unpaid").length,
      pendingCount: rows.filter((row) => row.badgeStatus === "pending").length,
    },
    rows,
    featuredInvoice: [...rows].sort(featuredInvoiceSort)[0] ?? rows[0],
  });
}
