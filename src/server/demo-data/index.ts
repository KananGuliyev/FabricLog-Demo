import { customerSchema } from "@/types/domain";

import { customerProfiles } from "./customer-profiles";
import { demoFabrics } from "./fabrics";
import { demoInvoices } from "./invoices";
import { demoOrders } from "./orders";
import { demoPayments } from "./payments";
import { demoRecentActivity } from "./recent-activity";

export const demoCustomers = customerSchema.array().parse(
  customerProfiles.map((profile) => {
    const customerOrders = demoOrders.filter((order) => order.customerId === profile.id);
    const outstandingBalance = demoInvoices
      .filter((invoice) => invoice.customerId === profile.id)
      .reduce((sum, invoice) => sum + (invoice.amount - invoice.paidAmount), 0);

    const lastOrderDate =
      customerOrders
        .map((order) => order.createdAt)
        .sort((left, right) => right.localeCompare(left))[0] ?? "2026-01-01";

    return {
      ...profile,
      outstandingBalance,
      lastOrderDate,
    };
  })
);

export {
  demoFabrics,
  demoInvoices,
  demoOrders,
  demoPayments,
  demoRecentActivity,
};
