"use client";
import { useFormContext } from "react-hook-form";
import { FormField } from "@/components/admin/FormField/FormField";
import { Input } from "@/components/admin/Input/Input";
import type { PremadeFormValues } from "@/app/admin/(authed)/fixed-dates/[id]/schema";

export function PricingTab() {
  const { register } = useFormContext<PremadeFormValues>();

  const numberOpts = { setValueAs: (v: unknown) => (v === "" || v === null || v === undefined ? null : Number(v)) };

  return (
    <div className="max-w-2xl space-y-6">
      <p className="font-sans text-[14px] text-ink-soft leading-relaxed">
        Per-bucket pricing shown on the public page. Leave any blank to hide that bucket.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField label="1 adult" hint="Price for a solo traveller">
          <Input type="number" min={0} step="0.01" {...register("price_1_person", numberOpts)} placeholder="e.g. 1800" />
        </FormField>

        <FormField label="2 adults" hint="Per person, double occupancy">
          <Input type="number" min={0} step="0.01" {...register("price_2_people", numberOpts)} placeholder="e.g. 1500" />
        </FormField>

        <FormField label="3 adults" hint="Per person, triple occupancy">
          <Input type="number" min={0} step="0.01" {...register("price_3_people", numberOpts)} placeholder="e.g. 1300" />
        </FormField>

        <FormField label="Baby / Infant" hint="Flat baby supplement (if any)">
          <Input type="number" min={0} step="0.01" {...register("price_baby", numberOpts)} placeholder="e.g. 0" />
        </FormField>
      </div>
    </div>
  );
}
