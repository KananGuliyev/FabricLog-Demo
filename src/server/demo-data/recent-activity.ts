import { recentActivitySchema } from "@/types/domain";

export const demoRecentActivity = recentActivitySchema.array().parse([
  {
    id: "activity-2409",
    type: "inventory_low",
    occurredAt: "2026-04-09",
    productName: "Premium Linen Studio",
  },
  {
    id: "activity-2408",
    type: "order_in_production",
    occurredAt: "2026-04-08",
    customerName: "Loom & Line Concept",
    orderCode: "LNL-2408",
  },
  {
    id: "activity-2407",
    type: "invoice_partial_paid",
    occurredAt: "2026-04-07",
    customerName: "Atelier North",
    invoiceId: "inv-2401",
    amount: 10500,
  },
  {
    id: "activity-2406",
    type: "order_ready",
    occurredAt: "2026-04-06",
    customerName: "Metro Tailor Group",
    orderCode: "MTG-2404",
  },
  {
    id: "activity-2405",
    type: "invoice_issued",
    occurredAt: "2026-04-05",
    customerName: "Riviera Hotel Supply",
    invoiceId: "inv-2402",
    amount: 70560,
  },
  {
    id: "activity-2404",
    type: "order_dispatched",
    occurredAt: "2026-04-04",
    customerName: "Saffron Home Studio",
    orderCode: "SFH-2405",
  },
  {
    id: "activity-2403",
    type: "invoice_overdue",
    occurredAt: "2026-04-03",
    customerName: "Metro Tailor Group",
    invoiceId: "inv-2404",
    amount: 39680,
  },
  {
    id: "activity-2402",
    type: "payment_received",
    occurredAt: "2026-04-02",
    customerName: "Harbor Bespoke Interiors",
    invoiceId: "inv-2409",
    amount: 4360,
  },
]);
