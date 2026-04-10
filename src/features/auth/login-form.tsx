"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { AlertCircle, ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";

import { FieldGroup } from "@/components/shared/field-group";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signInAction } from "@/app/[locale]/(auth)/login/actions";
import type { AppLocale } from "@/lib/constants/site";
import type { AuthActionState } from "@/types/auth";

const initialState: AuthActionState = {};

type LoginFormProps = {
  locale: AppLocale;
  next?: string;
};

function LoginSubmitButton() {
  const { pending } = useFormStatus();
  const t = useTranslations("Auth");

  return (
    <Button type="submit" size="lg" className="w-full rounded-2xl">
      {pending ? t("submitPending") : t("submit")}
      {!pending ? <ArrowRight className="size-4" /> : null}
    </Button>
  );
}

export function LoginForm({ locale, next }: LoginFormProps) {
  const t = useTranslations("Auth");
  const [state, formAction] = useActionState(signInAction, initialState);

  return (
    <form action={formAction} className="section-stack">
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="next" value={next ?? ""} />

      <FieldGroup
        label={t("fields.email")}
        description={t("fields.emailDescription")}
      >
        <Input
          name="email"
          type="email"
          autoComplete="email"
          placeholder="ayla@fabriclog.demo"
          required
        />
      </FieldGroup>

      <FieldGroup
        label={t("fields.password")}
        description={t("fields.passwordDescription")}
      >
        <Input
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="************"
          required
        />
      </FieldGroup>

      {state.errorKey ? (
        <div className="rounded-2xl border border-rose-200/80 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          <div className="flex items-start gap-2">
            <AlertCircle className="mt-0.5 size-4 shrink-0" />
            <p>{t("errors.invalidCredentials")}</p>
          </div>
        </div>
      ) : null}

      <LoginSubmitButton />
    </form>
  );
}
