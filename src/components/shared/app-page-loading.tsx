import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function AppPageLoading() {
  return (
    <div className="page-grid">
      <div className="space-y-4">
        <Skeleton className="h-7 w-28 rounded-full" />
        <div className="space-y-3">
          <Skeleton className="h-11 w-full max-w-xl" />
          <Skeleton className="h-5 w-full max-w-2xl" />
          <Skeleton className="h-5 w-full max-w-lg" />
        </div>
      </div>

      <div className="page-metrics-grid">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index}>
            <CardHeader className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-7 w-16 rounded-full" />
              </div>
              <Skeleton className="h-9 w-28" />
            </CardHeader>
            <CardContent className="pt-0">
              <Skeleton className="h-4 w-full max-w-[14rem]" />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="page-rail-grid">
        <Card>
          <CardHeader className="space-y-3">
            <Skeleton className="h-7 w-40" />
            <Skeleton className="h-4 w-full max-w-md" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-11 w-full rounded-2xl" />
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, index) => (
                <Skeleton key={index} className="h-14 w-full rounded-2xl" />
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="section-stack">
          <Card>
            <CardHeader className="space-y-3">
              <Skeleton className="h-7 w-32" />
              <Skeleton className="h-4 w-full" />
            </CardHeader>
            <CardContent className="space-y-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <Skeleton key={index} className="h-20 w-full rounded-[1.5rem]" />
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
