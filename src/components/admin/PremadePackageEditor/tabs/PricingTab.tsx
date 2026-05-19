"use client";
import { useFormContext } from "react-hook-form";
import { useTranslations } from "next-intl";
import { FormField } from "@/components/admin/FormField/FormField";
import { Input } from "@/components/admin/Input/Input";
import type { PremadeFormValues } from "@/app/admin/(authed)/fixed-dates/[id]/schema";

export function PricingTab() {
  const { register } = useFormContext<PremadeFormValues>();
  const tl = useTranslations("admin.formLabels");
  const th = useTranslations("admin.formHints");

  const numberOpts = { setValueAs: (v: unknown) => (v === "" || v === null || v === undefined ? null : Number(v)) };

  return (
    <div className="max-w-2xl space-y-6">
      <p className="font-sans text-[14px] text-ink-soft leading-relaxed">
        {th("pricingDescPremade")}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField label="In double room (per person)" hint="Per-person rate when two share a room.">
          <Input type="number" min={0} step="0.01" {...register("price_2_people", numberOpts)} placeholder="e.g. 1500" />
        </FormField>

        <FormField label="Single-room supplement" hint='Added on top of the double-room rate; shown as "+ amount" under "In single room".'>
          <Input type="number" min={0} step="0.01" {...register("price_single_room_supplement", numberOpts)} placeholder="e.g. 300" />
        </FormField>

        <FormField label="Per-child price" hint="Per-child rate shown in the pricing panel.">
          <Input type="number" min={0} step="0.01" {...register("price_per_child", numberOpts)} placeholder="e.g. 400" />
        </FormField>
      </div>
    </div>
  );
}
