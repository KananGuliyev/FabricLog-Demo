import type { ReactNode } from "react";

import { EmptyState } from "@/components/shared/empty-state";
import { FeaturePanel } from "@/components/shared/feature-panel";

type DetailPreviewListProps = {
  title: string;
  description?: string;
  emptyTitle: string;
  emptyDescription?: string;
  items: Array<{
    id: string;
    title: ReactNode;
    subtitle?: ReactNode;
    meta?: ReactNode;
    trailing?: ReactNode;
  }>;
};

export function DetailPreviewList({
  title,
  description,
  emptyTitle,
  emptyDescription,
  items,
}: DetailPreviewListProps) {
  return (
    <FeaturePanel title={title} description={description}>
      {items.length ? (
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="panel-secondary flex flex-col gap-3 px-4 py-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1 space-y-1.5">
                  <div className="text-sm font-semibold text-foreground">
                    {item.title}
                  </div>
                  {item.subtitle ? (
                    <div className="body-copy text-sm text-muted-foreground">
                      {item.subtitle}
                    </div>
                  ) : null}
                </div>
                {item.trailing ? (
                  <div className="shrink-0 text-right">{item.trailing}</div>
                ) : null}
              </div>
              {item.meta ? <div>{item.meta}</div> : null}
            </div>
          ))}
        </div>
      ) : (
        <EmptyState title={emptyTitle} description={emptyDescription} />
      )}
    </FeaturePanel>
  );
}
