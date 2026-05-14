"use client";
import { useFormContext, useFieldArray } from "react-hook-form";
import { X, Plus } from "lucide-react";
import { FormField } from "@/components/admin/FormField/FormField";
import { Input } from "@/components/admin/Input/Input";
import { Textarea } from "@/components/admin/Input/Textarea";
import { Toggle } from "@/components/admin/PackageEditor/primitives";
import { DateRangePicker } from "@/components/primitives/DateRangePicker/DateRangePicker";
import type { PremadeFormValues } from "@/app/admin/(authed)/fixed-dates/[id]/schema";

export function BasicsTab() {
  const { register, control, watch, setValue, formState: { errors } } = useFormContext<PremadeFormValues>();
  const isPublished = watch("is_published");

  const { fields: destFields, append: appendDest, remove: removeDest } = useFieldArray({ control, name: "destinations" as never });
  const destinations = watch("destinations") as string[];

  const { fields: dateFields, append: appendDate, remove: removeDate } = useFieldArray({ control, name: "dates" });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="md:col-span-2">
        <FormField label="Package name" required error={errors.name?.message}>
          <Input {...register("name")} placeholder="e.g. Cappadocia Group Departure" />
        </FormField>
      </div>

      {/* Departure dates */}
      <div className="md:col-span-2">
        <p className="font-mono text-[11px] tracking-[0.22em] uppercase text-muted font-medium mb-3">
          Departure dates
          <span className="ml-2 text-[9px] normal-case tracking-normal text-muted/60">These appear as pills on the public page</span>
        </p>
        <div className="space-y-3">
          {dateFields.map((field, i) => {
            const startVal = watch(`dates.${i}.start_date`);
            const endVal = watch(`dates.${i}.end_date`);
            return (
              <div key={field.id} className="flex items-center gap-3">
                <div className="flex-1">
                  <DateRangePicker
                    start={startVal}
                    end={endVal}
                    onChange={(s, e) => {
                      setValue(`dates.${i}.start_date`, s, { shouldDirty: true });
                      setValue(`dates.${i}.end_date`, e, { shouldDirty: true });
                    }}
                    placeholder={`Departure ${i + 1} — pick range`}
                  />
                </div>
                <button type="button" onClick={() => removeDate(i)} className="text-ink-soft hover:text-terracotta transition-colors p-1 shrink-0">
                  <X size={14} />
                </button>
              </div>
            );
          })}
          <button
            type="button"
            onClick={() => appendDate({ start_date: "", end_date: "" })}
            className="flex items-center gap-1.5 font-mono text-[10px] tracking-[0.2em] uppercase text-ink-soft hover:text-ochre transition-colors mt-1"
          >
            <Plus size={12} /> Add departure
          </button>
        </div>
      </div>

      <div className="md:col-span-2">
        <FormField label="Destinations">
          <div className="space-y-2">
            {destinations.map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <Input {...register(`destinations.${i}` as const)} placeholder="e.g. Istanbul" className="flex-1" />
                <button type="button" onClick={() => removeDest(i)} className="text-ink-soft hover:text-terracotta transition-colors p-1"><X size={14} /></button>
              </div>
            ))}
            <button type="button" onClick={() => appendDest("" as never)} className="flex items-center gap-1.5 font-mono text-[10px] tracking-[0.2em] uppercase text-ink-soft hover:text-ochre transition-colors">
              <Plus size={12} /> Add destination
            </button>
          </div>
        </FormField>
      </div>

      <div className="md:col-span-2">
        <FormField label="Short description" hint="~200 chars — used on cards" required error={errors.short_description?.message}>
          <Textarea rows={3} {...register("short_description")} />
        </FormField>
      </div>

      <FormField label="Price (starting from)">
        <Input
          type="number"
          min="0"
          step="1"
          {...register("price", { setValueAs: (v) => (v === "" || v == null ? null : Number(v)) })}
          placeholder="e.g. 1200"
        />
      </FormField>

      <FormField label="Currency">
        <Input {...register("currency")} placeholder="e.g. USD" />
      </FormField>

      <div className="flex flex-col gap-3">
        <p className="font-mono text-[11px] tracking-[0.22em] uppercase text-muted font-medium">Published</p>
        <Toggle
          checked={isPublished}
          onChange={(v) => setValue("is_published", v, { shouldDirty: true })}
        />
        {isPublished && <p className="font-mono text-[10px] text-ochre tracking-wide">Visible on the public site.</p>}
      </div>
    </div>
  );
}
