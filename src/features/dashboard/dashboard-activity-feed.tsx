import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type ActivityFeedItem = {
  colorClassName: string;
  dateLabel: string;
  description: string;
  id: string;
  title: string;
};

type DashboardActivityFeedProps = {
  description: string;
  items: ActivityFeedItem[];
  title: string;
};

export function DashboardActivityFeed({
  description,
  items,
  title,
}: DashboardActivityFeedProps) {
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
            className="panel-secondary flex gap-4 px-4 py-3.5"
          >
            <span
              className={cn(
                "mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full",
                item.colorClassName
              )}
            />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <p className="font-medium">{item.title}</p>
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
      </CardContent>
    </Card>
  );
}
