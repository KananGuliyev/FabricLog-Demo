import { buildCustomersOverview } from "@/server/mappers/customers-mapper";
import { buildDashboardSummary } from "@/server/mappers/dashboard-mapper";
import { buildInvoicesOverview } from "@/server/mappers/invoices-mapper";
import { buildOrdersOverview } from "@/server/mappers/orders-mapper";
import { buildProductsOverview } from "@/server/mappers/products-mapper";
import { buildReportsOverview } from "@/server/mappers/reports-mapper";
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
  getProductsOverview() {
    const fabrics = fabricLogRepository.getFabrics();

    return buildProductsOverview({
      fabrics,
    });
  },
  getOrdersOverview() {
    const customers = fabricLogRepository.getCustomers();
    const fabrics = fabricLogRepository.getFabrics();
    const invoices = fabricLogRepository.getInvoices();
    const orders = fabricLogRepository.getOrders();

    return buildOrdersOverview({
      customers,
      fabrics,
      invoices,
      orders,
    });
  },
  getInvoicesOverview() {
    const customers = fabricLogRepository.getCustomers();
    const invoices = fabricLogRepository.getInvoices();
    const orders = fabricLogRepository.getOrders();

    return buildInvoicesOverview({
      customers,
      invoices,
      orders,
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
  getReportsOverview() {
    const customers = fabricLogRepository.getCustomers();
    const fabrics = fabricLogRepository.getFabrics();
    const invoices = fabricLogRepository.getInvoices();
    const orders = fabricLogRepository.getOrders();

    return buildReportsOverview({
      customers,
      fabrics,
      invoices,
      orders,
    });
  },
};
