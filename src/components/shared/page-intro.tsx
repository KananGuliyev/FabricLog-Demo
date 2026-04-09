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
        "flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between",
        className
      )}
    >
      <div className="max-w-2xl space-y-3">
        {badge ? (
          <Badge className="bg-primary/10 text-primary hover:bg-primary/10">
            {badge}
          </Badge>
        ) : null}
        <div className="space-y-2.5">
          <h1 className="page-title text-balance">
            {title}
          </h1>
          <p className="body-copy max-w-xl text-sm sm:text-base">
            {description}
          </p>
        </div>
      </div>
      {action ? <div className="shrink-0 self-start lg:self-auto">{action}</div> : null}
    </div>
  );
}
