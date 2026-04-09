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

export const dashboardSummarySchema = z.object({
  totalRevenue: z.number().nonnegative(),
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
export type DashboardSummary = z.infer<typeof dashboardSummarySchema>;
