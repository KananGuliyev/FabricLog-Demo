import { cn } from "@/lib/utils";

type SectionHeaderProps = {
  title: string;
  description?: string;
  eyebrow?: string;
  action?: React.ReactNode;
  className?: string;
};

export function SectionHeader({
  title,
  description,
  eyebrow,
  action,
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between",
        className
      )}
    >
      <div className="min-w-0 space-y-2.5">
        {eyebrow ? <p className="subtle-label">{eyebrow}</p> : null}
        <div className="space-y-2">
          <h2 className="section-title">{title}</h2>
          {description ? (
            <p className="body-copy max-w-2xl text-sm sm:text-[0.98rem]">
              {description}
            </p>
          ) : null}
        </div>
      </div>
      {action ? <div className="shrink-0 self-start">{action}</div> : null}
    </div>
  );
}
