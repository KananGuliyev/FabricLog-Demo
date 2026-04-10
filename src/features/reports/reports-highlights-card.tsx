import type { ReactNode } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type ReportsHighlightsCardProps = {
  title: string;
  description: string;
  items: Array<{
    id: string;
    title: string;
    subtitle: string;
    metric: string;
    detail?: ReactNode;
  }>;
};

export function ReportsHighlightsCard({
  title,
  description,
  items,
}: ReportsHighlightsCardProps) {
  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <p className="body-copy text-sm text-muted-foreground">{description}</p>
      </CardHeader>
      <CardContent className="space-y-3 pt-0">
        {items.map((item) => (
          <div
            key={item.id}
            className="rounded-2xl border border-border/70 bg-muted/22 px-4 py-4"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium">{item.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {item.subtitle}
                </p>
              </div>
              <p className="text-sm font-semibold">{item.metric}</p>
            </div>
            {item.detail ? <div className="mt-3">{item.detail}</div> : null}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
