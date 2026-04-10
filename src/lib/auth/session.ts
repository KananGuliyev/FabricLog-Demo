import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import type { DemoSession } from "@/types/auth";

export const DEMO_SESSION_COOKIE = "fabriclog_demo_session";
const DEMO_SESSION_TOKEN = "fabriclog-demo-session-v1";
const DEMO_SESSION_MAX_AGE = 60 * 60 * 8;

export const demoCredentials = {
  email: "ayla@fabriclog.demo",
  password: "FabricLog2026",
} as const;

export const demoUser: DemoSession = {
  email: demoCredentials.email,
  initials: "AM",
  name: "Ayla Mammadli",
  role: "Operations manager",
  workspace: "FabricLog Demo Workspace",
};

function getSessionCookieConfig() {
  return {
    httpOnly: true,
    maxAge: DEMO_SESSION_MAX_AGE,
    path: "/",
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
  };
}

export function isValidDemoSessionToken(value?: string | null) {
  return value === DEMO_SESSION_TOKEN;
}

export function validateDemoCredentials(email: string, password: string) {
  return (
    email.trim().toLowerCase() === demoCredentials.email &&
    password === demoCredentials.password
  );
}

export async function getDemoSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(DEMO_SESSION_COOKIE)?.value;

  return isValidDemoSessionToken(token) ? demoUser : null;
}

export async function createDemoSession() {
  const cookieStore = await cookies();
  cookieStore.set(
    DEMO_SESSION_COOKIE,
    DEMO_SESSION_TOKEN,
    getSessionCookieConfig()
  );
}

export async function clearDemoSession() {
  const cookieStore = await cookies();
  cookieStore.set(DEMO_SESSION_COOKIE, "", {
    ...getSessionCookieConfig(),
    expires: new Date(0),
    maxAge: 0,
  });
}

export function clearDemoSessionFromResponse(response: NextResponse) {
  response.cookies.set(DEMO_SESSION_COOKIE, "", {
    ...getSessionCookieConfig(),
    expires: new Date(0),
    maxAge: 0,
  });

  return response;
}
