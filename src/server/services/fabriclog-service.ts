import { buildCustomerDetail } from "@/server/mappers/customer-detail-mapper";
import { buildCustomersOverview } from "@/server/mappers/customers-mapper";
import { buildDashboardSummary } from "@/server/mappers/dashboard-mapper";
import { buildInvoiceDetail } from "@/server/mappers/invoice-detail-mapper";
import { buildInvoicesOverview } from "@/server/mappers/invoices-mapper";
import { buildOrderDetail } from "@/server/mappers/order-detail-mapper";
import { buildOrdersOverview } from "@/server/mappers/orders-mapper";
import { buildPaymentsOverview } from "@/server/mappers/payments-mapper";
import { buildProductDetail } from "@/server/mappers/product-detail-mapper";
import { buildProductsOverview } from "@/server/mappers/products-mapper";
import { buildReportsOverview } from "@/server/mappers/reports-mapper";
import { fabricLogRepository } from "@/server/repositories/fabriclog-repository";

function getDemoContext() {
  return {
    customers: fabricLogRepository.getCustomers(),
    fabrics: fabricLogRepository.getFabrics(),
    invoices: fabricLogRepository.getInvoices(),
    orders: fabricLogRepository.getOrders(),
    payments: fabricLogRepository.getPayments(),
    recentActivity: fabricLogRepository.getRecentActivity(),
  };
}

function getOverviewContext() {
  const context = getDemoContext();

  return {
    ...context,
    customersOverview: buildCustomersOverview({
      customers: context.customers,
      invoices: context.invoices,
      payments: context.payments,
      recentActivity: context.recentActivity,
    }),
    invoicesOverview: buildInvoicesOverview({
      customers: context.customers,
      invoices: context.invoices,
      orders: context.orders,
    }),
    ordersOverview: buildOrdersOverview({
      customers: context.customers,
      fabrics: context.fabrics,
      invoices: context.invoices,
      orders: context.orders,
    }),
    paymentsOverview: buildPaymentsOverview({
      customers: context.customers,
      invoices: context.invoices,
      payments: context.payments,
    }),
    productsOverview: buildProductsOverview({
      fabrics: context.fabrics,
    }),
  };
}

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
    const { customers, invoices, payments, recentActivity } = getDemoContext();
    return buildCustomersOverview({
      customers,
      invoices,
      payments,
      recentActivity,
    });
  },
  getCustomerDetail(customerId: string) {
    const {
      customersOverview,
      invoices,
      invoicesOverview,
      orders,
      ordersOverview,
      recentActivity,
    } = getOverviewContext();

    return buildCustomerDetail({
      customerId,
      customersOverview,
      invoices,
      invoicesOverview,
      orders,
      ordersOverview,
      recentActivity,
    });
  },
  getProductsOverview() {
    return getOverviewContext().productsOverview;
  },
  getProductDetail(productId: string) {
    const {
      orders,
      ordersOverview,
      productsOverview,
      recentActivity,
    } = getOverviewContext();

    return buildProductDetail({
      orders,
      ordersOverview,
      productId,
      productsOverview,
      recentActivity,
    });
  },
  getOrdersOverview() {
    return getOverviewContext().ordersOverview;
  },
  getOrderDetail(orderId: string) {
    const {
      customersOverview,
      invoices,
      invoicesOverview,
      orders,
      ordersOverview,
      payments,
      productsOverview,
      recentActivity,
    } = getOverviewContext();

    return buildOrderDetail({
      customersOverview,
      invoices,
      invoicesOverview,
      orderId,
      orders,
      ordersOverview,
      payments,
      productsOverview,
      recentActivity,
    });
  },
  getInvoicesOverview() {
    return getOverviewContext().invoicesOverview;
  },
  getPaymentsOverview() {
    return getOverviewContext().paymentsOverview;
  },
  getInvoiceDetail(invoiceId: string) {
    const {
      customersOverview,
      invoices,
      invoicesOverview,
      orders,
      ordersOverview,
      payments,
      productsOverview,
      recentActivity,
    } = getOverviewContext();

    return buildInvoiceDetail({
      customersOverview,
      invoiceId,
      invoices,
      invoicesOverview,
      orders,
      ordersOverview,
      payments,
      productsOverview,
      recentActivity,
    });
  },
  getDashboardSummary() {
    const { customers, fabrics, invoices, orders, recentActivity } =
      getDemoContext();

    return buildDashboardSummary({
      customers,
      fabrics,
      invoices,
      orders,
      recentActivity,
    });
  },
  getReportsOverview() {
    const { customers, fabrics, invoices, orders } = getDemoContext();

    return buildReportsOverview({
      customers,
      fabrics,
      invoices,
      orders,
    });
  },
};
