import { BriefcaseBusiness, Building2, Mail, MapPin } from "lucide-react";

import { FeaturePanel } from "@/components/shared/feature-panel";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

type SettingsProfilePanelProps = {
  title: string;
  description: string;
  badgeLabel: string;
  profile: {
    name: string;
    role: string;
    workspace: string;
    summary: string;
    email: string;
    region: string;
  };
  labels: {
    role: string;
    email: string;
    workspace: string;
    region: string;
  };
};

const profileMetaIcons = {
  role: BriefcaseBusiness,
  email: Mail,
  workspace: Building2,
  region: MapPin,
} as const;

export function SettingsProfilePanel({
  title,
  description,
  badgeLabel,
  profile,
  labels,
}: SettingsProfilePanelProps) {
  const metaItems = [
    {
      key: "role",
      label: labels.role,
      value: profile.role,
    },
    {
      key: "email",
      label: labels.email,
      value: profile.email,
    },
    {
      key: "workspace",
      label: labels.workspace,
      value: profile.workspace,
    },
    {
      key: "region",
      label: labels.region,
      value: profile.region,
    },
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
        <div className="panel-secondary flex items-start gap-4 px-5 py-5">
          <Avatar className="size-12 rounded-2xl">
            <AvatarFallback className="rounded-2xl bg-primary text-primary-foreground">
              {profile.name
                .split(" ")
                .map((part) => part[0])
                .join("")
                .slice(0, 2)}
            </AvatarFallback>
          </Avatar>

          <div className="space-y-2">
            <div className="space-y-1">
              <p className="text-base font-semibold">{profile.name}</p>
              <p className="subtle-label text-muted-foreground">{profile.workspace}</p>
            </div>
            <p className="body-copy text-sm text-muted-foreground">
              {profile.summary}
            </p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {metaItems.map((item) => {
            const Icon = profileMetaIcons[item.key];

            return (
              <div key={item.key} className="panel-secondary px-4 py-4">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Icon className="size-4" />
                  </div>
                  <div className="space-y-1.5">
                    <p className="subtle-label text-muted-foreground">
                      {item.label}
                    </p>
                    <p className="text-sm font-semibold text-foreground">
                      {item.value}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </FeaturePanel>
  );
}
