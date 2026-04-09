import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { SectionHeader } from "./section-header";

type FeaturePanelProps = {
  title: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
};

export function FeaturePanel({
  title,
  description,
  action,
  children,
  className,
}: FeaturePanelProps) {
  return (
    <Card className={cn("gap-4", className)}>
      <CardHeader>
        <SectionHeader title={title} description={description} action={action} />
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
