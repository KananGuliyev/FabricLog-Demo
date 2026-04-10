import { Layers3 } from "lucide-react";

import { FeaturePanel } from "@/components/shared/feature-panel";
import { Badge } from "@/components/ui/badge";

type SettingsAboutPanelProps = {
  title: string;
  description: string;
  badgeLabel: string;
  eyebrow: string;
  summary: string;
  meta: {
    product: string;
    positioning: string;
    foundation: string;
    coverage: string;
  };
  values: {
    product: string;
    positioning: string;
    foundation: string;
    coverage: string;
  };
  highlights: string[];
};

export function SettingsAboutPanel({
  title,
  description,
  badgeLabel,
  eyebrow,
  summary,
  meta,
  values,
  highlights,
}: SettingsAboutPanelProps) {
  const metaItems = [
    { key: "product", label: meta.product, value: values.product },
    { key: "positioning", label: meta.positioning, value: values.positioning },
    { key: "foundation", label: meta.foundation, value: values.foundation },
    { key: "coverage", label: meta.coverage, value: values.coverage },
  ] as const;

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
      <div className="section-stack">
        <div className="panel-inset border-dashed px-5 py-5">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex size-9 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Layers3 className="size-4.5" />
            </div>
            <div className="space-y-2">
              <p className="subtle-label text-primary">{eyebrow}</p>
              <p className="body-copy text-sm text-muted-foreground">{summary}</p>
            </div>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {metaItems.map((item) => (
            <div key={item.key} className="panel-secondary px-4 py-4">
              <p className="subtle-label text-muted-foreground">{item.label}</p>
              <p className="mt-2 text-sm font-semibold text-foreground">
                {item.value}
              </p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          {highlights.map((item) => (
            <Badge key={item} variant="outline">
              {item}
            </Badge>
          ))}
        </div>
      </div>
    </FeaturePanel>
  );
}
