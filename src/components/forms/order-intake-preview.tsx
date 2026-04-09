"use client";

import { useTranslations } from "next-intl";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="mb-2 block text-sm font-medium">{t("customer")}</label>
        <Input {...form.register("customer")} className="h-11 rounded-2xl" />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium">{t("fabric")}</label>
        <Input {...form.register("fabric")} className="h-11 rounded-2xl" />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium">{t("quantity")}</label>
        <Input
          type="number"
          {...form.register("quantity", { valueAsNumber: true })}
          className="h-11 rounded-2xl"
        />
      </div>
      <p className="text-sm leading-6 text-muted-foreground">
        {t("helper")}
      </p>
      <Button type="submit" className="w-full rounded-2xl">
        {t("submit")}
      </Button>
    </form>
  );
}
