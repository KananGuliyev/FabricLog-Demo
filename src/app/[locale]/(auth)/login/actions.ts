"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { createDemoSession, validateDemoCredentials } from "@/lib/auth/session";
import { buildLocalizedAppPath } from "@/lib/auth/routing";
import { isAppLocale, type AppLocale } from "@/lib/constants/site";
import type { AuthActionState } from "@/types/auth";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  locale: z.string(),
  next: z.string().optional(),
});

export async function signInAction(
  _previousState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    locale: formData.get("locale"),
    next: formData.get("next"),
  });

  if (!parsed.success || !isAppLocale(parsed.data.locale)) {
    return { errorKey: "invalidCredentials" };
  }

  const { email, password, locale, next } = parsed.data;

  if (!validateDemoCredentials(email, password)) {
    return { errorKey: "invalidCredentials" };
  }

  await createDemoSession();
  redirect(buildLocalizedAppPath(locale as AppLocale, next));
}
