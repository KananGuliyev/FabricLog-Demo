import { BrandMark } from "@/components/shared/brand-mark";
import type { NavigationItem } from "@/types/ui";

import { AppSidebarNav } from "./app-sidebar-nav";

type AppSidebarProps = {
  activePath: string;
  infoLabel: string;
  infoText: string;
  items: NavigationItem[];
  localeLabel: string;
  localeName: string;
  localeNote: string;
};

export function AppSidebar({
  activePath,
  infoLabel,
  infoText,
  items,
  localeLabel,
  localeName,
  localeNote,
}: AppSidebarProps) {
  return (
    <aside className="hidden border-r border-sidebar-border/90 bg-sidebar px-5 py-6 text-sidebar-foreground lg:flex lg:flex-col lg:justify-between">
      <div className="space-y-8">
        <BrandMark />
        <div className="rounded-[1.75rem] border border-white/10 bg-white/6 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
          <p className="text-xs uppercase tracking-[0.22em] text-sidebar-foreground/56">
            {infoLabel}
          </p>
          <p className="mt-2 text-sm leading-6 text-sidebar-foreground/82">
            {infoText}
          </p>
        </div>
        <AppSidebarNav activePath={activePath} items={items} />
      </div>

      <div className="rounded-[1.75rem] border border-white/10 bg-white/6 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
        <p className="text-xs uppercase tracking-[0.22em] text-sidebar-foreground/56">
          {localeLabel}
        </p>
        <p className="mt-2 text-sm font-medium">{localeName}</p>
        <p className="mt-1 text-sm text-sidebar-foreground/72">{localeNote}</p>
      </div>
    </aside>
  );
}
