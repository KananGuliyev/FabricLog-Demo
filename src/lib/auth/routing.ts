import type { AppLocale } from "@/lib/constants/site";

const defaultProtectedPath = "/dashboard";

export const protectedAppPaths = [
  "/dashboard",
  "/customers",
  "/products",
  "/orders",
  "/invoices",
  "/reports",
  "/settings",
  "/payments",
  "/fabrics",
] as const;

export function isProtectedAppPath(pathname: string) {
  return protectedAppPaths.some(
    (protectedPath) =>
      pathname === protectedPath || pathname.startsWith(`${protectedPath}/`)
  );
}

export function normalizeAuthNextPath(next: string | null | undefined) {
  if (!next || !next.startsWith("/") || next.startsWith("//")) {
    return defaultProtectedPath;
  }

  const normalized = next.replace(/^\/(en|az)(?=\/|$)/, "") || "/";

  if (
    normalized === "/" ||
    normalized === "/login" ||
    normalized.startsWith("/login?") ||
    normalized === "/logout" ||
    normalized.startsWith("/logout?")
  ) {
    return defaultProtectedPath;
  }

  return normalized;
}

export function buildLocalizedAppPath(locale: AppLocale, next?: string | null) {
  return `/${locale}${normalizeAuthNextPath(next)}`;
}
