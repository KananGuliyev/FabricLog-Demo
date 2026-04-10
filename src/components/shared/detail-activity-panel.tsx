import { EmptyState } from "@/components/shared/empty-state";
import { FeaturePanel } from "@/components/shared/feature-panel";
import { cn } from "@/lib/utils";

type DetailActivityPanelProps = {
  title: string;
  description?: string;
  emptyTitle: string;
  emptyDescription?: string;
  items: Array<{
    id: string;
    dateLabel: string;
    title: string;
    description: string;
    toneClassName: string;
  }>;
};

export function DetailActivityPanel({
  title,
  description,
  emptyTitle,
  emptyDescription,
  items,
}: DetailActivityPanelProps) {
  return (
    <FeaturePanel title={title} description={description}>
      {items.length ? (
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="panel-secondary flex gap-4 px-4 py-4"
            >
              <span
                className={cn(
                  "mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full",
                  item.toneClassName
                )}
              />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <p className="text-sm font-semibold text-foreground">
                    {item.title}
                  </p>
                  <p className="subtle-label text-muted-foreground">
                    {item.dateLabel}
                  </p>
                </div>
                <p className="body-copy mt-1 text-sm text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState title={emptyTitle} description={emptyDescription} />
      )}
    </FeaturePanel>
  );
}
