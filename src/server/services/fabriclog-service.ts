import { buildCustomerDetail } from "@/server/mappers/customer-detail-mapper";
import { buildCustomersOverview } from "@/server/mappers/customers-mapper";
import { buildDashboardSummary } from "@/server/mappers/dashboard-mapper";
import { buildInvoiceDetail } from "@/server/mappers/invoice-detail-mapper";
import { buildInvoicesOverview } from "@/server/mappers/invoices-mapper";
import { buildOrderDetail } from "@/server/mappers/order-detail-mapper";
import { buildOrdersOverview } from "@/server/mappers/orders-mapper";
import { buildProductDetail } from "@/server/mappers/product-detail-mapper";
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
  getCustomerDetail(customerId: string) {
    const customers = fabricLogRepository.getCustomers();
    const invoices = fabricLogRepository.getInvoices();
    const payments = fabricLogRepository.getPayments();
    const orders = fabricLogRepository.getOrders();
    const recentActivity = fabricLogRepository.getRecentActivity();

    return buildCustomerDetail({
      customerId,
      customersOverview: buildCustomersOverview({
        customers,
        invoices,
        payments,
        recentActivity,
      }),
      invoices,
      invoicesOverview: buildInvoicesOverview({
        customers,
        invoices,
        orders,
      }),
      orders,
      ordersOverview: buildOrdersOverview({
        customers,
        fabrics: fabricLogRepository.getFabrics(),
        invoices,
        orders,
      }),
      recentActivity,
    });
  },
  getProductsOverview() {
    const fabrics = fabricLogRepository.getFabrics();

    return buildProductsOverview({
      fabrics,
    });
  },
  getProductDetail(productId: string) {
    const customers = fabricLogRepository.getCustomers();
    const fabrics = fabricLogRepository.getFabrics();
    const invoices = fabricLogRepository.getInvoices();
    const orders = fabricLogRepository.getOrders();
    const recentActivity = fabricLogRepository.getRecentActivity();

    return buildProductDetail({
      orders,
      ordersOverview: buildOrdersOverview({
        customers,
        fabrics,
        invoices,
        orders,
      }),
      productId,
      productsOverview: buildProductsOverview({
        fabrics,
      }),
      recentActivity,
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
  getOrderDetail(orderId: string) {
    const customers = fabricLogRepository.getCustomers();
    const fabrics = fabricLogRepository.getFabrics();
    const invoices = fabricLogRepository.getInvoices();
    const orders = fabricLogRepository.getOrders();
    const payments = fabricLogRepository.getPayments();
    const recentActivity = fabricLogRepository.getRecentActivity();

    return buildOrderDetail({
      customersOverview: buildCustomersOverview({
        customers,
        invoices,
        payments,
        recentActivity,
      }),
      invoices,
      invoicesOverview: buildInvoicesOverview({
        customers,
        invoices,
        orders,
      }),
      orderId,
      orders,
      ordersOverview: buildOrdersOverview({
        customers,
        fabrics,
        invoices,
        orders,
      }),
      payments,
      productsOverview: buildProductsOverview({
        fabrics,
      }),
      recentActivity,
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
  getInvoiceDetail(invoiceId: string) {
    const customers = fabricLogRepository.getCustomers();
    const fabrics = fabricLogRepository.getFabrics();
    const invoices = fabricLogRepository.getInvoices();
    const orders = fabricLogRepository.getOrders();
    const payments = fabricLogRepository.getPayments();
    const recentActivity = fabricLogRepository.getRecentActivity();

    return buildInvoiceDetail({
      customersOverview: buildCustomersOverview({
        customers,
        invoices,
        payments,
        recentActivity,
      }),
      invoiceId,
      invoices,
      invoicesOverview: buildInvoicesOverview({
        customers,
        invoices,
        orders,
      }),
      orders,
      ordersOverview: buildOrdersOverview({
        customers,
        fabrics,
        invoices,
        orders,
      }),
      payments,
      productsOverview: buildProductsOverview({
        fabrics,
      }),
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
