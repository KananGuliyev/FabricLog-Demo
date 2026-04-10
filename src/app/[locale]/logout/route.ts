import { NextResponse } from "next/server";

import { clearDemoSessionFromResponse } from "@/lib/auth/session";
import { isAppLocale, siteConfig } from "@/lib/constants/site";

type LogoutRouteProps = {
  params: Promise<{ locale: string }>;
};

export async function GET(request: Request, { params }: LogoutRouteProps) {
  const { locale } = await params;
  const safeLocale = isAppLocale(locale) ? locale : siteConfig.defaultLocale;
  const response = NextResponse.redirect(new URL(`/${safeLocale}/login`, request.url));

  return clearDemoSessionFromResponse(response);
}
