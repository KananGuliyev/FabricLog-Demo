import { z } from "zod";

export const customerTierValues = ["signature", "growth", "studio"] as const;
export const fabricStatusValues = ["available", "low", "reserved"] as const;
export const orderStatusValues = [
  "new",
  "sampling",
  "production",
  "ready",
  "dispatched",
] as const;
export const paymentStatusValues = ["paid", "partial", "pending", "overdue"] as const;
export const orderBillingStatusValues = [
  "none",
  ...paymentStatusValues,
] as const;
export const invoiceBadgeStatusValues = [
  "paid",
  "unpaid",
  "pending",
  "overdue",
] as const;
export const customerPaymentHealthValues = [
  "none",
  "paid",
  "pending",
  "partial",
  "overdue",
] as const;
export const dashboardStatusIndicatorValues = [
  "low_stock",
  "overdue_invoices",
  "pending_invoices",
  "production_orders",
] as const;
export const recentActivityTypeValues = [
  "payment_received",
  "invoice_partial_paid",
  "invoice_overdue",
  "order_in_production",
  "order_ready",
  "order_dispatched",
  "inventory_low",
  "invoice_issued",
] as const;

export const customerSchema = z.object({
  id: z.string(),
  name: z.string(),
  company: z.string(),
  region: z.string(),
  email: z.string().email(),
  tier: z.enum(customerTierValues),
  preferredCollection: z.string(),
  totalOrders: z.number().int().nonnegative(),
  outstandingBalance: z.number().nonnegative(),
  lastOrderDate: z.string(),
});

export const fabricProductSchema = z.object({
  id: z.string(),
  sku: z.string(),
  name: z.string(),
  category: z.string(),
  composition: z.string(),
  colorway: z.string(),
  widthCm: z.number().int().positive(),
  weightGsm: z.number().int().positive(),
  stockMeters: z.number().int().nonnegative(),
  reservedMeters: z.number().int().nonnegative(),
  unitPrice: z.number().nonnegative(),
  status: z.enum(fabricStatusValues),
});

export const orderSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  fabricId: z.string(),
  referenceCode: z.string(),
  quantityMeters: z.number().int().positive(),
  amount: z.number().nonnegative(),
  createdAt: z.string(),
  deliveryDate: z.string(),
  status: z.enum(orderStatusValues),
});

export const invoiceSchema = z.object({
  id: z.string(),
  orderId: z.string(),
  customerId: z.string(),
  issuedAt: z.string(),
  dueAt: z.string(),
  amount: z.number().nonnegative(),
  paidAmount: z.number().nonnegative(),
  status: z.enum(paymentStatusValues),
});

export const paymentRecordSchema = z.object({
  id: z.string(),
  invoiceId: z.string(),
  customerId: z.string(),
  amount: z.number().nonnegative(),
  paidAt: z.string(),
  method: z.string(),
  status: z.enum(paymentStatusValues),
});

export const customerOverviewRowSchema = z.object({
  id: z.string(),
  name: z.string(),
  company: z.string(),
  email: z.string().email(),
  region: z.string(),
  tier: z.enum(customerTierValues),
  preferredCollection: z.string(),
  totalOrders: z.number().int().nonnegative(),
  invoiceCount: z.number().int().nonnegative(),
  paidInvoicesCount: z.number().int().nonnegative(),
  openInvoicesCount: z.number().int().nonnegative(),
  outstandingBalance: z.number().nonnegative(),
  paymentHealth: z.enum(customerPaymentHealthValues),
  lastActivityDate: z.string(),
});

export const customersOverviewSummarySchema = z.object({
  totalCustomers: z.number().int().nonnegative(),
  signatureCustomers: z.number().int().nonnegative(),
  growthCustomers: z.number().int().nonnegative(),
  totalOutstandingBalance: z.number().nonnegative(),
  overdueCustomers: z.number().int().nonnegative(),
  followUpCustomers: z.number().int().nonnegative(),
});

export const customersOverviewSchema = z.object({
  summary: customersOverviewSummarySchema,
  rows: z.array(customerOverviewRowSchema),
  featuredCustomer: customerOverviewRowSchema,
});

export const productOverviewRowSchema = z.object({
  id: z.string(),
  sku: z.string(),
  name: z.string(),
  category: z.string(),
  composition: z.string(),
  colorway: z.string(),
  widthCm: z.number().int().positive(),
  weightGsm: z.number().int().positive(),
  unitPrice: z.number().nonnegative(),
  stockMeters: z.number().int().nonnegative(),
  reservedMeters: z.number().int().nonnegative(),
  availableMeters: z.number().int().nonnegative(),
  reservationRate: z.number().min(0).max(1),
  status: z.enum(fabricStatusValues),
});

export const productCategoryBreakdownSchema = z.object({
  category: z.string(),
  productsCount: z.number().int().nonnegative(),
  stockMeters: z.number().int().nonnegative(),
  reservedMeters: z.number().int().nonnegative(),
  reservationRate: z.number().min(0).max(1),
});

export const productsOverviewSummarySchema = z.object({
  totalProducts: z.number().int().nonnegative(),
  totalStock: z.number().int().nonnegative(),
  reservedStock: z.number().int().nonnegative(),
  lowStockCount: z.number().int().nonnegative(),
  categoryBreakdown: z.array(productCategoryBreakdownSchema),
});

export const productsOverviewSchema = z.object({
  summary: productsOverviewSummarySchema,
  rows: z.array(productOverviewRowSchema),
  featuredProduct: productOverviewRowSchema,
});

export const orderOverviewRowSchema = z.object({
  id: z.string(),
  referenceCode: z.string(),
  customerName: z.string(),
  fabricName: z.string(),
  orderDate: z.string(),
  deliveryDate: z.string(),
  itemSummary: z.string(),
  quantityMeters: z.number().int().nonnegative(),
  totalAmount: z.number().nonnegative(),
  status: z.enum(orderStatusValues),
  paymentStatus: z.enum(orderBillingStatusValues),
  invoiceId: z.string().nullable(),
});

export const ordersOverviewSummarySchema = z.object({
  totalOrders: z.number().int().nonnegative(),
  liveOrderValue: z.number().nonnegative(),
  inProductionCount: z.number().int().nonnegative(),
  readyToDispatchCount: z.number().int().nonnegative(),
  billingFollowUpCount: z.number().int().nonnegative(),
});

export const ordersOverviewSchema = z.object({
  summary: ordersOverviewSummarySchema,
  rows: z.array(orderOverviewRowSchema),
  featuredOrder: orderOverviewRowSchema,
});

export const invoiceOverviewRowSchema = z.object({
  id: z.string(),
  customerName: z.string(),
  issueDate: z.string(),
  dueDate: z.string(),
  amount: z.number().nonnegative(),
  paidAmount: z.number().nonnegative(),
  outstandingAmount: z.number().nonnegative(),
  paymentStatus: z.enum(paymentStatusValues),
  badgeStatus: z.enum(invoiceBadgeStatusValues),
  orderReference: z.string().nullable(),
});

export const invoicesOverviewSummarySchema = z.object({
  totalInvoices: z.number().int().nonnegative(),
  openInvoiceValue: z.number().nonnegative(),
  overdueExposure: z.number().nonnegative(),
  paidInFullCount: z.number().int().nonnegative(),
  unpaidCount: z.number().int().nonnegative(),
  pendingCount: z.number().int().nonnegative(),
});

export const invoicesOverviewSchema = z.object({
  summary: invoicesOverviewSummarySchema,
  rows: z.array(invoiceOverviewRowSchema),
  featuredInvoice: invoiceOverviewRowSchema,
});

export const paymentOverviewRowSchema = z.object({
  id: z.string(),
  customerName: z.string(),
  invoiceId: z.string(),
  invoiceAmount: z.number().nonnegative(),
  outstandingAmount: z.number().nonnegative(),
  paidAt: z.string(),
  dueDate: z.string(),
  method: z.string(),
  amount: z.number().nonnegative(),
  status: z.enum(paymentStatusValues),
});

export const paymentsOverviewSummarySchema = z.object({
  totalPayments: z.number().int().nonnegative(),
  collectedValue: z.number().nonnegative(),
  bankTransferCount: z.number().int().nonnegative(),
  cardSettlementCount: z.number().int().nonnegative(),
  wireTransferCount: z.number().int().nonnegative(),
  partialReceiptsCount: z.number().int().nonnegative(),
  settledPaymentsCount: z.number().int().nonnegative(),
});

export const paymentsOverviewSchema = z.object({
  summary: paymentsOverviewSummarySchema,
  rows: z.array(paymentOverviewRowSchema),
  featuredPayment: paymentOverviewRowSchema,
});

export const reportsRevenuePointSchema = z.object({
  month: z.string(),
  revenue: z.number().nonnegative(),
  invoices: z.number().int().nonnegative(),
});

export const reportsPaymentBreakdownItemSchema = z.object({
  status: z.enum(paymentStatusValues),
  count: z.number().int().nonnegative(),
  totalAmount: z.number().nonnegative(),
  openAmount: z.number().nonnegative(),
});

export const reportsOrderStatusItemSchema = z.object({
  status: z.enum(orderStatusValues),
  count: z.number().int().nonnegative(),
  totalAmount: z.number().nonnegative(),
});

export const reportsCustomerHighlightSchema = z.object({
  id: z.string(),
  customerName: z.string(),
  tier: z.enum(customerTierValues),
  orderCount: z.number().int().nonnegative(),
  invoiceValue: z.number().nonnegative(),
  outstandingAmount: z.number().nonnegative(),
});

export const reportsOrderHighlightSchema = z.object({
  id: z.string(),
  referenceCode: z.string(),
  customerName: z.string(),
  itemSummary: z.string(),
  amount: z.number().nonnegative(),
  deliveryDate: z.string(),
  status: z.enum(orderStatusValues),
  paymentStatus: z.enum(orderBillingStatusValues),
});

export const reportsOverviewSummarySchema = z.object({
  totalRevenue: z.number().nonnegative(),
  collectionRate: z.number().nonnegative(),
  overdueExposure: z.number().nonnegative(),
  activeOrders: z.number().int().nonnegative(),
  activeCustomers: z.number().int().nonnegative(),
  pendingInvoices: z.number().int().nonnegative(),
  lowStockReferences: z.number().int().nonnegative(),
});

export const reportsOverviewSchema = z.object({
  summary: reportsOverviewSummarySchema,
  revenueTrend: z.array(reportsRevenuePointSchema),
  paymentBreakdown: z.array(reportsPaymentBreakdownItemSchema),
  orderStatusOverview: z.array(reportsOrderStatusItemSchema),
  customerHighlights: z.array(reportsCustomerHighlightSchema),
  orderHighlights: z.array(reportsOrderHighlightSchema),
});

export const recentActivitySchema = z.object({
  id: z.string(),
  type: z.enum(recentActivityTypeValues),
  occurredAt: z.string(),
  customerName: z.string().optional(),
  orderCode: z.string().optional(),
  invoiceId: z.string().optional(),
  productName: z.string().optional(),
  amount: z.number().nonnegative().optional(),
});

export const dashboardOrderPreviewSchema = z.object({
  id: z.string(),
  referenceCode: z.string(),
  customerName: z.string(),
  amount: z.number().nonnegative(),
  deliveryDate: z.string(),
  status: z.enum(orderStatusValues),
});

export const dashboardInvoicePreviewSchema = z.object({
  id: z.string(),
  customerName: z.string(),
  amount: z.number().nonnegative(),
  paidAmount: z.number().nonnegative(),
  dueAt: z.string(),
  status: z.enum(paymentStatusValues),
});

export const dashboardStatusIndicatorSchema = z.object({
  key: z.enum(dashboardStatusIndicatorValues),
  count: z.number().int().nonnegative(),
});

export const dashboardSummarySchema = z.object({
  totalCustomers: z.number().int().nonnegative(),
  totalOrders: z.number().int().nonnegative(),
  totalInvoices: z.number().int().nonnegative(),
  totalRevenue: z.number().nonnegative(),
  unpaidInvoicesCount: z.number().int().nonnegative(),
  openInvoices: z.number().int().nonnegative(),
  pendingPayments: z.number().int().nonnegative(),
  activeCustomers: z.number().int().nonnegative(),
  collectionRate: z.number().nonnegative(),
  lowStockCount: z.number().int().nonnegative(),
  monthlyRevenue: z.array(
    z.object({
      month: z.string(),
      revenue: z.number().nonnegative(),
      invoices: z.number().int().nonnegative(),
    })
  ),
  paymentBreakdown: z.array(
    z.object({
      status: z.enum(paymentStatusValues),
      count: z.number().int().nonnegative(),
      value: z.number().nonnegative(),
    })
  ),
  orderPipeline: z.array(
    z.object({
      status: z.enum(orderStatusValues),
      count: z.number().int().nonnegative(),
    })
  ),
  recentOrders: z.array(dashboardOrderPreviewSchema),
  recentInvoices: z.array(dashboardInvoicePreviewSchema),
  statusIndicators: z.array(dashboardStatusIndicatorSchema),
  recentActivity: z.array(recentActivitySchema),
});

export const customerDetailSchema = z.object({
  profile: customerOverviewRowSchema.extend({
    totalInvoicedValue: z.number().nonnegative(),
  }),
  recentOrders: z.array(orderOverviewRowSchema),
  recentInvoices: z.array(invoiceOverviewRowSchema),
  recentActivity: z.array(recentActivitySchema),
});

export const productDetailSchema = z.object({
  product: productOverviewRowSchema,
  activeOrdersCount: z.number().int().nonnegative(),
  linkedCustomersCount: z.number().int().nonnegative(),
  totalOrderedMeters: z.number().int().nonnegative(),
  relatedOrders: z.array(orderOverviewRowSchema),
  recentActivity: z.array(recentActivitySchema),
});

export const orderDetailSchema = z.object({
  order: orderOverviewRowSchema,
  customer: customerOverviewRowSchema,
  product: productOverviewRowSchema,
  invoice: invoiceOverviewRowSchema.nullable(),
  payments: z.array(paymentRecordSchema),
  recentActivity: z.array(recentActivitySchema),
});

export const invoiceDetailSchema = z.object({
  invoice: invoiceOverviewRowSchema,
  customer: customerOverviewRowSchema,
  order: orderOverviewRowSchema.nullable(),
  product: productOverviewRowSchema.nullable(),
  payments: z.array(paymentRecordSchema),
  recentActivity: z.array(recentActivitySchema),
});

export type Customer = z.infer<typeof customerSchema>;
export type CustomerTier = (typeof customerTierValues)[number];
export type FabricProduct = z.infer<typeof fabricProductSchema>;
export type FabricStatus = (typeof fabricStatusValues)[number];
export type Order = z.infer<typeof orderSchema>;
export type OrderStatus = (typeof orderStatusValues)[number];
export type Invoice = z.infer<typeof invoiceSchema>;
export type PaymentRecord = z.infer<typeof paymentRecordSchema>;
export type PaymentStatus = (typeof paymentStatusValues)[number];
export type OrderBillingStatus = (typeof orderBillingStatusValues)[number];
export type InvoiceBadgeStatus = (typeof invoiceBadgeStatusValues)[number];
export type CustomerPaymentHealth = (typeof customerPaymentHealthValues)[number];
export type CustomerOverviewRow = z.infer<typeof customerOverviewRowSchema>;
export type CustomersOverviewSummary = z.infer<typeof customersOverviewSummarySchema>;
export type CustomersOverview = z.infer<typeof customersOverviewSchema>;
export type ProductOverviewRow = z.infer<typeof productOverviewRowSchema>;
export type ProductCategoryBreakdown = z.infer<typeof productCategoryBreakdownSchema>;
export type ProductsOverviewSummary = z.infer<typeof productsOverviewSummarySchema>;
export type ProductsOverview = z.infer<typeof productsOverviewSchema>;
export type OrderOverviewRow = z.infer<typeof orderOverviewRowSchema>;
export type OrdersOverviewSummary = z.infer<typeof ordersOverviewSummarySchema>;
export type OrdersOverview = z.infer<typeof ordersOverviewSchema>;
export type InvoiceOverviewRow = z.infer<typeof invoiceOverviewRowSchema>;
export type InvoicesOverviewSummary = z.infer<typeof invoicesOverviewSummarySchema>;
export type InvoicesOverview = z.infer<typeof invoicesOverviewSchema>;
export type PaymentOverviewRow = z.infer<typeof paymentOverviewRowSchema>;
export type PaymentsOverviewSummary = z.infer<typeof paymentsOverviewSummarySchema>;
export type PaymentsOverview = z.infer<typeof paymentsOverviewSchema>;
export type ReportsRevenuePoint = z.infer<typeof reportsRevenuePointSchema>;
export type ReportsPaymentBreakdownItem = z.infer<
  typeof reportsPaymentBreakdownItemSchema
>;
export type ReportsOrderStatusItem = z.infer<typeof reportsOrderStatusItemSchema>;
export type ReportsCustomerHighlight = z.infer<
  typeof reportsCustomerHighlightSchema
>;
export type ReportsOrderHighlight = z.infer<typeof reportsOrderHighlightSchema>;
export type ReportsOverviewSummary = z.infer<typeof reportsOverviewSummarySchema>;
export type ReportsOverview = z.infer<typeof reportsOverviewSchema>;
export type DashboardStatusIndicatorKey = (typeof dashboardStatusIndicatorValues)[number];
export type DashboardOrderPreview = z.infer<typeof dashboardOrderPreviewSchema>;
export type DashboardInvoicePreview = z.infer<typeof dashboardInvoicePreviewSchema>;
export type DashboardStatusIndicator = z.infer<typeof dashboardStatusIndicatorSchema>;
export type RecentActivity = z.infer<typeof recentActivitySchema>;
export type RecentActivityType = (typeof recentActivityTypeValues)[number];
export type DashboardSummary = z.infer<typeof dashboardSummarySchema>;
export type CustomerDetail = z.infer<typeof customerDetailSchema>;
export type ProductDetail = z.infer<typeof productDetailSchema>;
export type OrderDetail = z.infer<typeof orderDetailSchema>;
export type InvoiceDetail = z.infer<typeof invoiceDetailSchema>;
