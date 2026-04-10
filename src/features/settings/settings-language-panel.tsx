import { Languages } from "lucide-react";

import { LanguageSwitcher } from "@/components/navigation/language-switcher";
import { FeaturePanel } from "@/components/shared/feature-panel";
import { FieldGroup } from "@/components/shared/field-group";
import { Badge } from "@/components/ui/badge";

type SettingsLanguagePanelProps = {
  title: string;
  description: string;
  switcherLabel: string;
  switcherDescription: string;
  supportNote: string;
  locales: Array<{
    code: string;
    label: string;
    description: string;
    active: boolean;
  }>;
  statuses: {
    active: string;
    available: string;
  };
};

export function SettingsLanguagePanel({
  title,
  description,
  switcherLabel,
  switcherDescription,
  supportNote,
  locales,
  statuses,
}: SettingsLanguagePanelProps) {
  return (
    <FeaturePanel title={title} description={description}>
      <div className="section-stack">
        <FieldGroup
          label={switcherLabel}
          description={switcherDescription}
          className="panel-secondary px-5 py-5"
        >
          <LanguageSwitcher />
        </FieldGroup>

        <div className="grid gap-3 sm:grid-cols-2">
          {locales.map((locale) => (
            <div key={locale.code} className="panel-secondary px-4 py-4">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <Languages className="size-4 text-primary" />
                    <p className="text-sm font-semibold text-foreground">
                      {locale.label}
                    </p>
                  </div>
                  <p className="subtle-label text-muted-foreground">
                    {locale.code}
                  </p>
                </div>

                <Badge
                  variant={locale.active ? "default" : "outline"}
                  className={
                    locale.active
                      ? "bg-primary/10 text-primary hover:bg-primary/10"
                      : undefined
                  }
                >
                  {locale.active ? statuses.active : statuses.available}
                </Badge>
              </div>

              <p className="body-copy mt-4 text-sm text-muted-foreground">
                {locale.description}
              </p>
            </div>
          ))}
        </div>

        <div className="panel-inset border-dashed px-5 py-4">
          <p className="body-copy text-sm text-muted-foreground">{supportNote}</p>
        </div>
      </div>
    </FeaturePanel>
  );
}
