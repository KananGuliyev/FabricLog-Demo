import {
  BarChart3,
  LayoutDashboard,
  Package,
  ReceiptText,
  Settings2,
  ShoppingBag,
  UsersRound,
  WalletCards,
} from "lucide-react";

import type { NavigationItem } from "@/types/ui";

export const appRoutes: NavigationItem[] = [
  { href: "/dashboard", icon: LayoutDashboard, labelKey: "dashboard", section: "core" },
  { href: "/customers", icon: UsersRound, labelKey: "customers", section: "core" },
  { href: "/products", icon: Package, labelKey: "products", section: "core" },
  { href: "/orders", icon: ShoppingBag, labelKey: "orders", section: "core" },
  { href: "/invoices", icon: ReceiptText, labelKey: "invoices", section: "core" },
  { href: "/payments", icon: WalletCards, labelKey: "payments", section: "core" },
  { href: "/reports", icon: BarChart3, labelKey: "reports", section: "core" },
  { href: "/settings", icon: Settings2, labelKey: "settings", section: "utility" },
];

export const navigationItems = appRoutes;

export function findRouteByPath(pathname: string) {
  return appRoutes.find(
    (route) => pathname === route.href || pathname.startsWith(`${route.href}/`)
  );
}
