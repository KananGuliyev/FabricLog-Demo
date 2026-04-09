import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type PageIntroProps = {
  badge?: string;
  description: string;
  title: string;
  action?: React.ReactNode;
  className?: string;
};

export function PageIntro({
  badge,
  description,
  title,
  action,
  className,
}: PageIntroProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between",
        className
      )}
    >
      <div className="max-w-2xl space-y-3">
        {badge ? (
          <Badge className="bg-primary/10 text-primary hover:bg-primary/10">
            {badge}
          </Badge>
        ) : null}
        <div className="space-y-2">
          <h1 className="font-heading text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            {title}
          </h1>
          <p className="max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">
            {description}
          </p>
        </div>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
