import {
  productDetailSchema,
  type OrdersOverview,
  type ProductDetail,
  type ProductsOverview,
  type RecentActivity,
} from "@/types/domain";

type ProductOrder = {
  customerId: string;
  fabricId: string;
  id: string;
  quantityMeters: number;
};

export function buildProductDetail(params: {
  orders: ProductOrder[];
  ordersOverview: OrdersOverview;
  productId: string;
  productsOverview: ProductsOverview;
  recentActivity: RecentActivity[];
}): ProductDetail | null {
  const {
    orders,
    ordersOverview,
    productId,
    productsOverview,
    recentActivity,
  } = params;

  const product = productsOverview.rows.find((row) => row.id === productId);

  if (!product) {
    return null;
  }

  const orderRowsById = new Map(ordersOverview.rows.map((row) => [row.id, row]));

  const relatedOrders = orders
    .filter((order) => order.fabricId === productId)
    .sort((left, right) => right.id.localeCompare(left.id))
    .map((order) => orderRowsById.get(order.id))
    .filter((row): row is NonNullable<typeof row> => Boolean(row));

  const inventoryActivity = recentActivity
    .filter((activity) => activity.productName === product.name)
    .sort((left, right) => right.occurredAt.localeCompare(left.occurredAt));

  const activeOrdersCount = relatedOrders.filter(
    (order) => order.status !== "dispatched"
  ).length;

  return productDetailSchema.parse({
    product,
    activeOrdersCount,
    linkedCustomersCount: new Set(relatedOrders.map((order) => order.customerName))
      .size,
    totalOrderedMeters: orders
      .filter((order) => order.fabricId === productId)
      .reduce((sum, order) => sum + order.quantityMeters, 0),
    relatedOrders,
    recentActivity: inventoryActivity,
  });
}
