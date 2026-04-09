"use client";

import { useTranslations } from "next-intl";

import { Link } from "@/lib/i18n/navigation";
import { cn } from "@/lib/utils";
import type { NavigationItem } from "@/types/ui";

type AppSidebarNavProps = {
  activePath: string;
  items: NavigationItem[];
  mobile?: boolean;
};

export function AppSidebarNav({
  activePath,
  items,
  mobile = false,
}: AppSidebarNavProps) {
  const t = useTranslations("Navigation");

  return (
    <nav className={cn("space-y-1.5", mobile && "mt-8")}>
      {items.map((item) => {
        const active =
          activePath === item.href || activePath.startsWith(`${item.href}/`);
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium transition-all duration-200",
              active
                ? "bg-white/14 text-white shadow-lg shadow-black/10"
                : "text-sidebar-foreground/72 hover:bg-white/8 hover:text-white"
            )}
          >
            <span
              className={cn(
                "flex size-9 items-center justify-center rounded-xl transition-colors",
                active ? "bg-white/16" : "bg-white/5"
              )}
            >
              <Icon className="size-4.5" />
            </span>
            {t(item.labelKey)}
          </Link>
        );
      })}
    </nav>
  );
}
