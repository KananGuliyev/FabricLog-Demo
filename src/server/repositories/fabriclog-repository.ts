import {
  demoCustomers,
  demoFabrics,
  demoInvoices,
  demoOrders,
  demoPayments,
  demoRecentActivity,
} from "@/server/demo-data";

export const fabricLogRepository = {
  getCustomers: () => demoCustomers,
  getFabrics: () => demoFabrics,
  getOrders: () => demoOrders,
  getInvoices: () => demoInvoices,
  getPayments: () => demoPayments,
  getRecentActivity: () => demoRecentActivity,
};
