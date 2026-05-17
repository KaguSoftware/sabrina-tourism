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
        <FormField label={tl("oneAdult")} hint={th("soloTraveller")}>
          <Input type="number" min={0} step="0.01" {...register("price_1_person", numberOpts)} placeholder="e.g. 1800" />
        </FormField>

        <FormField label={tl("twoAdults")} hint={th("doubleOccupancy")}>
          <Input type="number" min={0} step="0.01" {...register("price_2_people", numberOpts)} placeholder="e.g. 1500" />
        </FormField>

        <FormField label={tl("babyInfant")} hint={th("babySupp")}>
          <Input type="number" min={0} step="0.01" {...register("price_baby", numberOpts)} placeholder="e.g. 0" />
        </FormField>

        <FormField label="Single-room supplement" hint="Extra charge added per person for single-room occupancy.">
          <Input type="number" min={0} step="0.01" {...register("price_single_room_supplement", numberOpts)} placeholder="e.g. 300" />
        </FormField>

        <FormField label="Per-child price" hint="Shown next to each child age in the reservation form.">
          <Input type="number" min={0} step="0.01" {...register("price_per_child", numberOpts)} placeholder="e.g. 400" />
        </FormField>
      </div>
    </div>
  );
}
