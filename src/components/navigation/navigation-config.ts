import {
  BarChart3,
  LayoutDashboard,
  Package,
  ReceiptText,
  Settings2,
  ShoppingBag,
  SwatchBook,
  UsersRound,
  WalletCards,
} from "lucide-react";

import type { NavigationItem } from "@/types/ui";

export const appRoutes: NavigationItem[] = [
  { href: "/dashboard", icon: LayoutDashboard, labelKey: "dashboard", primary: true },
  { href: "/customers", icon: UsersRound, labelKey: "customers", primary: true },
  { href: "/products", icon: Package, labelKey: "products", primary: true },
  { href: "/orders", icon: ShoppingBag, labelKey: "orders", primary: true },
  { href: "/invoices", icon: ReceiptText, labelKey: "invoices", primary: true },
  { href: "/reports", icon: BarChart3, labelKey: "reports", primary: true },
  { href: "/settings", icon: Settings2, labelKey: "settings", primary: true },
  { href: "/payments", icon: WalletCards, labelKey: "payments", primary: false },
  { href: "/fabrics", icon: SwatchBook, labelKey: "products", primary: false },
];

export const navigationItems = appRoutes.filter((route) => route.primary);

export function findRouteByPath(pathname: string) {
  return appRoutes.find(
    (route) => pathname === route.href || pathname.startsWith(`${route.href}/`)
  );
}
