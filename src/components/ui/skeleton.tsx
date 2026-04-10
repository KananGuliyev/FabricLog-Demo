import { cn } from "@/lib/utils";

type SkeletonProps = {
  className?: string;
};

export function Skeleton({ className }: SkeletonProps) {
  return <div className={cn("loading-block", className)} aria-hidden="true" />;
}
