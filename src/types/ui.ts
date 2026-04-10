import type { LucideIcon } from "lucide-react";

export type NavigationItem = {
  href: string;
  icon: LucideIcon;
  labelKey: string;
  section: "core" | "utility";
};

export type StatTone = "neutral" | "success" | "warning" | "critical";
