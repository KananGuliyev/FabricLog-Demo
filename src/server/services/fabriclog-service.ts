import { buildCustomersOverview } from "@/server/mappers/customers-mapper";
import { buildDashboardSummary } from "@/server/mappers/dashboard-mapper";
import { fabricLogRepository } from "@/server/repositories/fabriclog-repository";

export const fabricLogService = {
  getCustomers() {
    return fabricLogRepository.getCustomers();
  },
  getFabrics() {
    return fabricLogRepository.getFabrics();
  },
  getOrders() {
    return fabricLogRepository.getOrders();
  },
  getInvoices() {
    return fabricLogRepository.getInvoices();
  },
  getPayments() {
    return fabricLogRepository.getPayments();
  },
  getRecentActivity() {
    return fabricLogRepository.getRecentActivity();
  },
  getCustomersOverview() {
    const customers = fabricLogRepository.getCustomers();
    const invoices = fabricLogRepository.getInvoices();
    const payments = fabricLogRepository.getPayments();
    const recentActivity = fabricLogRepository.getRecentActivity();

    return buildCustomersOverview({
      customers,
      invoices,
      payments,
      recentActivity,
    });
  },
  getDashboardSummary() {
    const customers = fabricLogRepository.getCustomers();
    const fabrics = fabricLogRepository.getFabrics();
    const invoices = fabricLogRepository.getInvoices();
    const orders = fabricLogRepository.getOrders();
    const recentActivity = fabricLogRepository.getRecentActivity();

    return buildDashboardSummary({
      customers,
      fabrics,
      invoices,
      orders,
      recentActivity,
    });
  },
};
