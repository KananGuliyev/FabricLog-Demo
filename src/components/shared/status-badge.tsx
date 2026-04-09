import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const statusToneMap = {
  signature: "success",
  growth: "neutral",
  studio: "warning",
  available: "success",
  low: "warning",
  reserved: "neutral",
  new: "neutral",
  sampling: "warning",
  production: "critical",
  ready: "success",
  dispatched: "neutral",
  paid: "success",
  partial: "warning",
  pending: "neutral",
  overdue: "critical",
} as const;

const toneStyles = {
  success: "border-emerald-200/80 bg-emerald-50 text-emerald-700",
  warning: "border-amber-200/80 bg-amber-50 text-amber-700",
  critical: "border-rose-200/80 bg-rose-50 text-rose-700",
  neutral: "border-slate-200/90 bg-slate-100 text-slate-700",
};

type StatusBadgeProps = {
  label: string;
  status: keyof typeof statusToneMap;
};

export function StatusBadge({ label, status }: StatusBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "rounded-full px-2.5 py-1 text-[0.72rem] font-semibold tracking-[0.04em]",
        toneStyles[statusToneMap[status]]
      )}
    >
      {label}
    </Badge>
  );
}
