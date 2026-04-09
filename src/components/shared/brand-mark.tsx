import { cn } from "@/lib/utils";

type BrandMarkProps = {
  className?: string;
  compact?: boolean;
};

export function BrandMark({ className, compact = false }: BrandMarkProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="relative flex size-10 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,var(--primary),var(--chart-3))] text-primary-foreground shadow-lg shadow-primary/20">
        <span className="absolute inset-1 rounded-[1rem] border border-white/20" />
        <span className="grid grid-cols-2 gap-1">
          <span className="size-1.5 rounded-full bg-white/90" />
          <span className="size-1.5 rounded-full bg-white/70" />
          <span className="size-1.5 rounded-full bg-white/60" />
          <span className="size-1.5 rounded-full bg-white/90" />
        </span>
      </div>
      {!compact ? (
        <div className="flex flex-col">
          <span className="font-heading text-base font-semibold tracking-tight">
            FabricLog
          </span>
          <span className="text-xs text-muted-foreground">
            Textile operations demo
          </span>
        </div>
      ) : null}
    </div>
  );
}
