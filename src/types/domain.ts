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

export type Customer = z.infer<typeof customerSchema>;
export type CustomerTier = (typeof customerTierValues)[number];
export type FabricProduct = z.infer<typeof fabricProductSchema>;
export type FabricStatus = (typeof fabricStatusValues)[number];
export type Order = z.infer<typeof orderSchema>;
export type OrderStatus = (typeof orderStatusValues)[number];
export type Invoice = z.infer<typeof invoiceSchema>;
export type PaymentRecord = z.infer<typeof paymentRecordSchema>;
export type PaymentStatus = (typeof paymentStatusValues)[number];
export type CustomerPaymentHealth = (typeof customerPaymentHealthValues)[number];
export type CustomerOverviewRow = z.infer<typeof customerOverviewRowSchema>;
export type CustomersOverviewSummary = z.infer<typeof customersOverviewSummarySchema>;
export type CustomersOverview = z.infer<typeof customersOverviewSchema>;
export type ProductOverviewRow = z.infer<typeof productOverviewRowSchema>;
export type ProductCategoryBreakdown = z.infer<typeof productCategoryBreakdownSchema>;
export type ProductsOverviewSummary = z.infer<typeof productsOverviewSummarySchema>;
export type ProductsOverview = z.infer<typeof productsOverviewSchema>;
export type DashboardStatusIndicatorKey = (typeof dashboardStatusIndicatorValues)[number];
export type DashboardOrderPreview = z.infer<typeof dashboardOrderPreviewSchema>;
export type DashboardInvoicePreview = z.infer<typeof dashboardInvoicePreviewSchema>;
export type DashboardStatusIndicator = z.infer<typeof dashboardStatusIndicatorSchema>;
export type RecentActivity = z.infer<typeof recentActivitySchema>;
export type RecentActivityType = (typeof recentActivityTypeValues)[number];
export type DashboardSummary = z.infer<typeof dashboardSummarySchema>;
