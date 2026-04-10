import type { LucideIcon } from "lucide-react";

import { FeaturePanel } from "@/components/shared/feature-panel";
import { Badge } from "@/components/ui/badge";

type PreferenceItem = {
  id: string;
  title: string;
  description: string;
  value: string;
  icon: LucideIcon;
};

type SettingsPreferencesPanelProps = {
  title: string;
  description: string;
  badgeLabel: string;
  items: PreferenceItem[];
};

export function SettingsPreferencesPanel({
  title,
  description,
  badgeLabel,
  items,
}: SettingsPreferencesPanelProps) {
  return (
    <FeaturePanel
      title={title}
      description={description}
      action={<Badge variant="outline">{badgeLabel}</Badge>}
    >
      <div className="section-stack">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <div key={item.id} className="panel-secondary flex gap-4 px-5 py-5">
              <div className="mt-0.5 flex size-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Icon className="size-4.5" />
              </div>

              <div className="flex-1 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-foreground">
                    {item.title}
                  </p>
                  <Badge variant="outline">{item.value}</Badge>
                </div>
                <p className="body-copy text-sm text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </FeaturePanel>
  );
}
