import { cn } from "@/lib/utils";

type FieldGroupProps = {
  label: string;
  description?: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
};

export function FieldGroup({
  label,
  description,
  error,
  children,
  className,
}: FieldGroupProps) {
  return (
    <div className={cn("space-y-2.5", className)}>
      <div className="space-y-1">
        <p className="subtle-label text-foreground">{label}</p>
        {description ? <p className="body-copy text-sm">{description}</p> : null}
      </div>
      {children}
      {error ? <p className="text-sm font-medium text-destructive">{error}</p> : null}
    </div>
  );
}
