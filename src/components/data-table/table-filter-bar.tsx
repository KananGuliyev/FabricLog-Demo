import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type TableFilterGroup = {
  label: string;
  onChange: (value: string) => void;
  options: Array<{
    label: string;
    value: string;
  }>;
  value: string;
};

type TableFilterBarProps = {
  className?: string;
  groups: TableFilterGroup[];
};

export function TableFilterBar({ className, groups }: TableFilterBarProps) {
  return (
    <div className={cn("flex flex-wrap items-center gap-3", className)}>
      {groups.map((group) => (
        <div key={group.label} className="toolbar-group">
          <span className="toolbar-group-label">
            {group.label}
          </span>
          <div className="flex flex-wrap gap-2">
            {group.options.map((option) => (
              <Button
                key={option.value}
                type="button"
                variant={group.value === option.value ? "secondary" : "outline"}
                size="xs"
                className={cn(
                  "rounded-full",
                  group.value === option.value && "shadow-none"
                )}
                onClick={() => group.onChange(option.value)}
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
