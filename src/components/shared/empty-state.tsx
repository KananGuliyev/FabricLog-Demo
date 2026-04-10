import { Inbox } from "lucide-react";

import { cn } from "@/lib/utils";

type EmptyStateProps = {
  title: string;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
  action?: React.ReactNode;
  className?: string;
};

export function EmptyState({
  title,
  description,
  icon: Icon = Inbox,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn("empty-state", className)}>
      <div className="mx-auto flex size-14 items-center justify-center rounded-[1.35rem] border border-primary/10 bg-primary/10 text-primary shadow-sm">
        <Icon className="size-5" />
      </div>
      <div className="space-y-2.5">
        <p className="font-heading text-base font-semibold tracking-tight text-foreground">
          {title}
        </p>
        {description ? (
          <p className="body-copy mx-auto max-w-md text-sm leading-6">
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div>{action}</div> : null}
    </div>
  );
}
