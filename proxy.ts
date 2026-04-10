import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";

import { protectedAppPaths, normalizeAuthNextPath } from "./src/lib/auth/routing";
import {
  DEMO_SESSION_COOKIE,
  isValidDemoSessionToken,
} from "./src/lib/auth/session";
import { isAppLocale } from "./src/lib/constants/site";
import { routing } from "./src/lib/i18n/routing";

const intlMiddleware = createMiddleware(routing);

function isProtectedPath(pathname: string) {
  return protectedAppPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );
}

function getLocaleFromPathname(pathname: string) {
  const [, maybeLocale] = pathname.split("/");
  return maybeLocale && isAppLocale(maybeLocale) ? maybeLocale : null;
}

function stripLocalePrefix(pathname: string, locale: string) {
  const stripped = pathname.replace(new RegExp(`^/${locale}`), "") || "/";
  return stripped.startsWith("/") ? stripped : `/${stripped}`;
}

export default function proxy(request: NextRequest) {
  const intlResponse = intlMiddleware(request);

  if (intlResponse && intlResponse.headers.has("location")) {
    return intlResponse;
  }

  const locale = getLocaleFromPathname(request.nextUrl.pathname);

  if (!locale) {
    return intlResponse;
  }

  const pathWithoutLocale = stripLocalePrefix(request.nextUrl.pathname, locale);
  const hasSession = isValidDemoSessionToken(
    request.cookies.get(DEMO_SESSION_COOKIE)?.value
  );

  if (pathWithoutLocale === "/login" && hasSession) {
    const next = normalizeAuthNextPath(request.nextUrl.searchParams.get("next"));
    return NextResponse.redirect(
      new URL(`/${locale}${next}`, request.url)
    );
  }

  if (isProtectedPath(pathWithoutLocale) && !hasSession) {
    const loginUrl = new URL(`/${locale}/login`, request.url);
    const next = `${pathWithoutLocale}${request.nextUrl.search}`;
    loginUrl.searchParams.set("next", normalizeAuthNextPath(next));

    return NextResponse.redirect(loginUrl);
  }

  return intlResponse;
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
