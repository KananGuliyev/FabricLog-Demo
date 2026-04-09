"use client";

import { useTranslations } from "next-intl";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { FieldGroup } from "@/components/shared/field-group";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const previewOrderSchema = z.object({
  customer: z.string().min(2),
  fabric: z.string().min(2),
  quantity: z.number().positive(),
});

type PreviewOrderValues = z.infer<typeof previewOrderSchema>;

const defaultValues: PreviewOrderValues = {
  customer: "Atelier North",
  fabric: "Soft Weave Cotton",
  quantity: 480,
};

export function OrderIntakePreview() {
  const t = useTranslations("Orders.form");
  const form = useForm<PreviewOrderValues>({
    resolver: zodResolver(previewOrderSchema),
    defaultValues,
  });

  const onSubmit = form.handleSubmit(() => {
    form.reset(defaultValues);
  });

  return (
    <form onSubmit={onSubmit} className="section-stack">
      <FieldGroup label={t("customer")}>
        <Input {...form.register("customer")} />
      </FieldGroup>
      <FieldGroup label={t("fabric")}>
        <Input {...form.register("fabric")} />
      </FieldGroup>
      <FieldGroup label={t("quantity")} description={t("helper")}>
        <Input
          type="number"
          {...form.register("quantity", { valueAsNumber: true })}
          min={0}
        />
      </FieldGroup>
      <Button type="submit" className="w-full">
        {t("submit")}
      </Button>
    </form>
  );
}
