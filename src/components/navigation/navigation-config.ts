import {
  LayoutDashboard,
  ReceiptText,
  ShoppingBag,
  SwatchBook,
  UsersRound,
  WalletCards,
} from "lucide-react";

import type { NavigationItem } from "@/types/ui";

export const navigationItems: NavigationItem[] = [
  { href: "/dashboard", icon: LayoutDashboard, labelKey: "dashboard" },
  { href: "/customers", icon: UsersRound, labelKey: "customers" },
  { href: "/fabrics", icon: SwatchBook, labelKey: "fabrics" },
  { href: "/orders", icon: ShoppingBag, labelKey: "orders" },
  { href: "/invoices", icon: ReceiptText, labelKey: "invoices" },
  { href: "/payments", icon: WalletCards, labelKey: "payments" },
];
