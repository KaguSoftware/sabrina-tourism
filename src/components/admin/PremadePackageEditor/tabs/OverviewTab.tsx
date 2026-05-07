"use client";
import { useFormContext } from "react-hook-form";
import { FormField } from "@/components/admin/FormField/FormField";
import { Input } from "@/components/admin/Input/Input";
import { Textarea } from "@/components/admin/Input/Textarea";
import type { PremadeFormValues } from "@/app/admin/(authed)/fixed-dates/[id]/schema";

export function OverviewTab() {
  const { register, formState: { errors } } = useFormContext<PremadeFormValues>();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <FormField label="Region" hint="e.g. Cappadocia">
        <Input {...register("region")} placeholder="e.g. Istanbul & Cappadocia" />
      </FormField>

      <FormField label="Duration" hint="e.g. 7 days / 6 nights">
        <Input {...register("duration")} placeholder="e.g. 7 days / 6 nights" />
      </FormField>

      <FormField label="Min people">
        <Input
          type="number"
          min={1}
          {...register("min_people", { setValueAs: (v) => (v === "" || v === null ? null : Number(v)) })}
          placeholder="1"
        />
      </FormField>

      <FormField label="Max people">
        <Input
          type="number"
          min={1}
          {...register("max_people", { setValueAs: (v) => (v === "" || v === null ? null : Number(v)) })}
          placeholder="8"
        />
      </FormField>

      <FormField label="Available from" hint="Date range shown on public page">
        <Input type="date" {...register("available_from")} />
      </FormField>

      <FormField label="Available to">
        <Input type="date" {...register("available_to")} />
      </FormField>

      <div className="md:col-span-2">
        <FormField
          label="Overview"
          hint="Separate paragraphs with a blank line. First paragraph gets a drop-cap on the public page."
          error={errors.overview?.message}
        >
          <Textarea rows={8} {...register("overview")} placeholder={"First paragraph...\n\nSecond paragraph..."} />
        </FormField>
      </div>
    </div>
  );
}
