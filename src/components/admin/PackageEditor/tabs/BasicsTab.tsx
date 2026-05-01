"use client";

import { useFormContext, Controller } from "react-hook-form";
import { FormField } from "@/components/admin/FormField/FormField";
import { Input } from "@/components/admin/Input/Input";
import { Select } from "@/components/admin/Input/Select";
import { Textarea } from "@/components/admin/Input/Textarea";
import { Toggle } from "../primitives";
import { REGIONS } from "../types";
import { slugify } from "@/lib/utils/slug";
import type { PackageFormValues } from "../types";

export function BasicsTab() {
  const {
    register,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<PackageFormValues>();

  const name = watch("name");
  const isPublished = watch("is_published");
  const isFeatured = watch("is_featured");
  const computedSlug = slugify(name || "");

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="md:col-span-2">
        <FormField label="Name" required error={errors.name?.message}>
          <Input {...register("name")} placeholder="e.g. Istanbul Unveiled" />
          <p className="font-mono text-[11px] text-muted mt-1">
            URL: /packages/{computedSlug || "…"}
          </p>
        </FormField>
      </div>

      <FormField label="Region" required error={errors.region?.message}>
        <Select {...register("region")}>
          {REGIONS.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </Select>
      </FormField>

      <FormField label="Duration label" required error={errors.duration?.message}>
        <Input {...register("duration")} placeholder="e.g. 5 days / 4 nights" />
      </FormField>

      <FormField label="Duration (days)" required error={errors.duration_days?.message}>
        <Input type="number" min={1} {...register("duration_days", { valueAsNumber: true })} />
      </FormField>

      <div className="flex gap-4">
        <FormField label="Min people" required error={errors.min_people?.message}>
          <Input type="number" min={1} {...register("min_people", { valueAsNumber: true })} />
        </FormField>
        <FormField label="Max people" required error={errors.max_people?.message}>
          <Input type="number" min={1} {...register("max_people", { valueAsNumber: true })} />
        </FormField>
      </div>

      <FormField label="Available from" required error={errors.available_from?.message}>
        <Input type="date" {...register("available_from")} />
      </FormField>
      <FormField label="Available to" required error={errors.available_to?.message}>
        <Input type="date" {...register("available_to")} />
      </FormField>

      <div className="md:col-span-2">
        <FormField
          label="Short description"
          hint="~200 chars — used on listing cards and meta"
          required
          error={errors.short_description?.message}
        >
          <Textarea rows={3} {...register("short_description")} />
        </FormField>
      </div>

      <div className="flex flex-col gap-3">
        <p className="font-mono text-[11px] tracking-[0.22em] uppercase text-muted font-medium">Published</p>
        <Controller
          name="is_published"
          control={control}
          render={({ field }) => (
            <Toggle
              checked={field.value}
              onChange={(v) => {
                field.onChange(v);
                if (!v) setValue("is_featured", false);
              }}
            />
          )}
        />
      </div>

      <div className="flex flex-col gap-3">
        <p className="font-mono text-[11px] tracking-[0.22em] uppercase text-muted font-medium">
          Featured{" "}
          {!isPublished && (
            <span className="text-[9px] normal-case tracking-normal">(publish first)</span>
          )}
        </p>
        <Controller
          name="is_featured"
          control={control}
          render={({ field }) => (
            <Toggle checked={field.value} onChange={field.onChange} disabled={!isPublished} />
          )}
        />
        {isFeatured && (
          <p className="font-mono text-[10px] text-ochre tracking-wide">
            Max 3 featured — enforced on save.
          </p>
        )}
      </div>
    </div>
  );
}
