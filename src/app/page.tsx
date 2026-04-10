import { redirect } from "next/navigation";

import { siteConfig } from "@/lib/constants/site";

export default function RootPage() {
  redirect(`/${siteConfig.defaultLocale}`);
}
