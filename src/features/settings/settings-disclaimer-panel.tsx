import { ShieldCheck } from "lucide-react";

import { FeaturePanel } from "@/components/shared/feature-panel";
import { Badge } from "@/components/ui/badge";

type SettingsDisclaimerPanelProps = {
  title: string;
  description: string;
  badgeLabel: string;
  body: string;
  items: string[];
};

export function SettingsDisclaimerPanel({
  title,
  description,
  badgeLabel,
  body,
  items,
}: SettingsDisclaimerPanelProps) {
  return (
    <FeaturePanel
      title={title}
      description={description}
      action={
        <Badge className="bg-primary/10 text-primary hover:bg-primary/10">
          {badgeLabel}
        </Badge>
      }
    >
      <div className="panel-inset border-dashed px-5 py-5">
        <div className="flex items-start gap-4">
          <div className="mt-0.5 flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
            <ShieldCheck className="size-5" />
          </div>

          <div className="flex-1 space-y-4">
            <p className="body-copy text-sm text-muted-foreground">{body}</p>

            <div className="grid gap-3 md:grid-cols-3">
              {items.map((item) => (
                <div key={item} className="panel-secondary px-4 py-4">
                  <p className="body-copy text-sm text-muted-foreground">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </FeaturePanel>
  );
}
