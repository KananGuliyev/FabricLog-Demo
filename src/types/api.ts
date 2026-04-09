import { z } from "zod";

import {
  customerSchema,
  dashboardSummarySchema,
  fabricProductSchema,
  invoiceSchema,
  orderSchema,
  paymentRecordSchema,
} from "@/types/domain";

export const customersResponseSchema = z.object({
  data: z.array(customerSchema),
});

export const fabricsResponseSchema = z.object({
  data: z.array(fabricProductSchema),
});

export const ordersResponseSchema = z.object({
  data: z.array(orderSchema),
});

export const invoicesResponseSchema = z.object({
  data: z.array(invoiceSchema),
});

export const paymentsResponseSchema = z.object({
  data: z.array(paymentRecordSchema),
});

export const dashboardResponseSchema = z.object({
  data: dashboardSummarySchema,
});

export type CustomersResponse = z.infer<typeof customersResponseSchema>;
export type FabricsResponse = z.infer<typeof fabricsResponseSchema>;
export type OrdersResponse = z.infer<typeof ordersResponseSchema>;
export type InvoicesResponse = z.infer<typeof invoicesResponseSchema>;
export type PaymentsResponse = z.infer<typeof paymentsResponseSchema>;
export type DashboardResponse = z.infer<typeof dashboardResponseSchema>;
