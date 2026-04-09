import type { LucideIcon } from "lucide-react";

export type NavigationItem = {
  href: string;
  icon: LucideIcon;
  labelKey: string;
};

export type StatTone = "neutral" | "success" | "warning" | "critical";
