import {
  customerSchema,
  fabricProductSchema,
  invoiceSchema,
  orderSchema,
  paymentRecordSchema,
} from "@/types/domain";

export const demoCustomers = customerSchema.array().parse([
  {
    id: "cust-atelier-north",
    name: "Nigar Rahimova",
    company: "Atelier North",
    region: "Baku, Azerbaijan",
    email: "hello@ateliernorth.demo",
    tier: "signature",
    preferredCollection: "Soft Weave Essentials",
    totalOrders: 18,
    outstandingBalance: 18400,
    lastOrderDate: "2026-04-04"
  },
  {
    id: "cust-caspian-loom",
    name: "Samir Asadov",
    company: "Caspian Loom House",
    region: "Ganja, Azerbaijan",
    email: "procurement@caspianloom.demo",
    tier: "growth",
    preferredCollection: "Premium Linen Studio",
    totalOrders: 11,
    outstandingBalance: 9200,
    lastOrderDate: "2026-03-29"
  },
  {
    id: "cust-riviera-hotel",
    name: "Leyla Mammadli",
    company: "Riviera Hotel Supply",
    region: "Tbilisi, Georgia",
    email: "ops@rivierahotel.demo",
    tier: "signature",
    preferredCollection: "Hospitality Jacquards",
    totalOrders: 25,
    outstandingBalance: 0,
    lastOrderDate: "2026-04-02"
  },
  {
    id: "cust-saffron-home",
    name: "Aysel Karim",
    company: "Saffron Home Studio",
    region: "Istanbul, Turkiye",
    email: "studio@saffronhome.demo",
    tier: "studio",
    preferredCollection: "Organic Cotton Blend",
    totalOrders: 7,
    outstandingBalance: 6400,
    lastOrderDate: "2026-03-18"
  },
  {
    id: "cust-metro-tailor",
    name: "Elvin Hasanli",
    company: "Metro Tailor Group",
    region: "Baku, Azerbaijan",
    email: "buying@metrotailor.demo",
    tier: "growth",
    preferredCollection: "Structured Suiting Line",
    totalOrders: 14,
    outstandingBalance: 13600,
    lastOrderDate: "2026-03-31"
  },
  {
    id: "cust-amber-atelier",
    name: "Gunel Aliyeva",
    company: "Amber Atelier",
    region: "Sheki, Azerbaijan",
    email: "orders@amberatelier.demo",
    tier: "studio",
    preferredCollection: "Velvet Accent Stories",
    totalOrders: 6,
    outstandingBalance: 4800,
    lastOrderDate: "2026-02-24"
  }
]);

export const demoFabrics = fabricProductSchema.array().parse([
  {
    id: "fab-soft-weave",
    sku: "FL-101",
    name: "Soft Weave Cotton",
    category: "Cotton",
    composition: "92% Cotton / 8% Elastane",
    colorway: "Stone Sand",
    widthCm: 148,
    weightGsm: 220,
    stockMeters: 4800,
    reservedMeters: 1350,
    unitPrice: 34,
    status: "available"
  },
  {
    id: "fab-premium-linen",
    sku: "FL-118",
    name: "Premium Linen Studio",
    category: "Linen",
    composition: "100% Linen",
    colorway: "Warm Oat",
    widthCm: 150,
    weightGsm: 245,
    stockMeters: 1420,
    reservedMeters: 920,
    unitPrice: 49,
    status: "low"
  },
  {
    id: "fab-jacquard-hotel",
    sku: "FL-205",
    name: "Hospitality Jacquard",
    category: "Jacquard",
    composition: "67% Polyester / 33% Cotton",
    colorway: "Harbor Blue",
    widthCm: 145,
    weightGsm: 310,
    stockMeters: 2180,
    reservedMeters: 1260,
    unitPrice: 56,
    status: "reserved"
  },
  {
    id: "fab-organic-blend",
    sku: "FL-132",
    name: "Organic Cotton Blend",
    category: "Blend",
    composition: "70% Organic Cotton / 30% Viscose",
    colorway: "Olive Mist",
    widthCm: 146,
    weightGsm: 210,
    stockMeters: 3560,
    reservedMeters: 710,
    unitPrice: 38,
    status: "available"
  },
  {
    id: "fab-structured-suiting",
    sku: "FL-301",
    name: "Structured Suiting",
    category: "Suiting",
    composition: "58% Wool / 42% Polyester",
    colorway: "Midnight Slate",
    widthCm: 152,
    weightGsm: 285,
    stockMeters: 2680,
    reservedMeters: 980,
    unitPrice: 64,
    status: "available"
  },
  {
    id: "fab-velvet-accent",
    sku: "FL-411",
    name: "Velvet Accent",
    category: "Velvet",
    composition: "82% Polyester / 18% Cotton",
    colorway: "Burnished Copper",
    widthCm: 142,
    weightGsm: 330,
    stockMeters: 980,
    reservedMeters: 610,
    unitPrice: 58,
    status: "low"
  }
]);

export const demoOrders = orderSchema.array().parse([
  {
    id: "ord-2401",
    customerId: "cust-atelier-north",
    fabricId: "fab-soft-weave",
    referenceCode: "ATN-2401",
    quantityMeters: 850,
    amount: 28900,
    createdAt: "2026-04-04",
    deliveryDate: "2026-04-19",
    status: "production"
  },
  {
    id: "ord-2402",
    customerId: "cust-riviera-hotel",
    fabricId: "fab-jacquard-hotel",
    referenceCode: "RVH-2402",
    quantityMeters: 1260,
    amount: 70560,
    createdAt: "2026-04-02",
    deliveryDate: "2026-04-28",
    status: "sampling"
  },
  {
    id: "ord-2403",
    customerId: "cust-caspian-loom",
    fabricId: "fab-premium-linen",
    referenceCode: "CSP-2403",
    quantityMeters: 540,
    amount: 26460,
    createdAt: "2026-03-29",
    deliveryDate: "2026-04-16",
    status: "new"
  },
  {
    id: "ord-2404",
    customerId: "cust-metro-tailor",
    fabricId: "fab-structured-suiting",
    referenceCode: "MTG-2404",
    quantityMeters: 620,
    amount: 39680,
    createdAt: "2026-03-31",
    deliveryDate: "2026-04-18",
    status: "ready"
  },
  {
    id: "ord-2405",
    customerId: "cust-saffron-home",
    fabricId: "fab-organic-blend",
    referenceCode: "SFH-2405",
    quantityMeters: 310,
    amount: 11780,
    createdAt: "2026-03-18",
    deliveryDate: "2026-04-08",
    status: "dispatched"
  },
  {
    id: "ord-2406",
    customerId: "cust-amber-atelier",
    fabricId: "fab-velvet-accent",
    referenceCode: "AMB-2406",
    quantityMeters: 210,
    amount: 12180,
    createdAt: "2026-02-24",
    deliveryDate: "2026-03-11",
    status: "dispatched"
  },
  {
    id: "ord-2407",
    customerId: "cust-riviera-hotel",
    fabricId: "fab-jacquard-hotel",
    referenceCode: "RVH-2407",
    quantityMeters: 980,
    amount: 54880,
    createdAt: "2026-01-20",
    deliveryDate: "2026-02-14",
    status: "dispatched"
  }
]);

export const demoInvoices = invoiceSchema.array().parse([
  {
    id: "inv-2401",
    orderId: "ord-2401",
    customerId: "cust-atelier-north",
    issuedAt: "2026-04-05",
    dueAt: "2026-04-19",
    amount: 28900,
    paidAmount: 10500,
    status: "partial"
  },
  {
    id: "inv-2402",
    orderId: "ord-2402",
    customerId: "cust-riviera-hotel",
    issuedAt: "2026-04-03",
    dueAt: "2026-04-24",
    amount: 70560,
    paidAmount: 0,
    status: "pending"
  },
  {
    id: "inv-2403",
    orderId: "ord-2403",
    customerId: "cust-caspian-loom",
    issuedAt: "2026-03-30",
    dueAt: "2026-04-12",
    amount: 26460,
    paidAmount: 17260,
    status: "partial"
  },
  {
    id: "inv-2404",
    orderId: "ord-2404",
    customerId: "cust-metro-tailor",
    issuedAt: "2026-03-31",
    dueAt: "2026-04-10",
    amount: 39680,
    paidAmount: 0,
    status: "overdue"
  },
  {
    id: "inv-2405",
    orderId: "ord-2405",
    customerId: "cust-saffron-home",
    issuedAt: "2026-03-18",
    dueAt: "2026-04-01",
    amount: 11780,
    paidAmount: 11780,
    status: "paid"
  },
  {
    id: "inv-2406",
    orderId: "ord-2406",
    customerId: "cust-amber-atelier",
    issuedAt: "2026-02-24",
    dueAt: "2026-03-09",
    amount: 12180,
    paidAmount: 7380,
    status: "partial"
  },
  {
    id: "inv-2407",
    orderId: "ord-2407",
    customerId: "cust-riviera-hotel",
    issuedAt: "2026-01-20",
    dueAt: "2026-02-05",
    amount: 54880,
    paidAmount: 54880,
    status: "paid"
  }
]);

export const demoPayments = paymentRecordSchema.array().parse([
  {
    id: "pay-2401",
    invoiceId: "inv-2401",
    customerId: "cust-atelier-north",
    amount: 10500,
    paidAt: "2026-04-07",
    method: "Bank transfer",
    status: "partial"
  },
  {
    id: "pay-2403",
    invoiceId: "inv-2403",
    customerId: "cust-caspian-loom",
    amount: 17260,
    paidAt: "2026-04-01",
    method: "Card settlement",
    status: "partial"
  },
  {
    id: "pay-2405",
    invoiceId: "inv-2405",
    customerId: "cust-saffron-home",
    amount: 11780,
    paidAt: "2026-03-27",
    method: "Bank transfer",
    status: "paid"
  },
  {
    id: "pay-2406",
    invoiceId: "inv-2406",
    customerId: "cust-amber-atelier",
    amount: 7380,
    paidAt: "2026-03-03",
    method: "Card settlement",
    status: "partial"
  },
  {
    id: "pay-2407",
    invoiceId: "inv-2407",
    customerId: "cust-riviera-hotel",
    amount: 54880,
    paidAt: "2026-01-29",
    method: "Wire",
    status: "paid"
  }
]);
