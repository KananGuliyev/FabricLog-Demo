import { redirect } from "next/navigation";

import { AppShell } from "@/components/layout/app-shell";
import { getDemoSession } from "@/lib/auth/session";

type AppLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function AppLayout({ children, params }: AppLayoutProps) {
  const { locale } = await params;
  const session = await getDemoSession();

  if (!session) {
    redirect(`/${locale}/login`);
  }

  return <AppShell session={session}>{children}</AppShell>;
}
