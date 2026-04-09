import {
  demoCustomers,
  demoFabrics,
  demoInvoices,
  demoOrders,
  demoPayments,
} from "@/server/demo-data/fabriclog-demo-data";

export const fabricLogRepository = {
  getCustomers: () => demoCustomers,
  getFabrics: () => demoFabrics,
  getOrders: () => demoOrders,
  getInvoices: () => demoInvoices,
  getPayments: () => demoPayments,
};
