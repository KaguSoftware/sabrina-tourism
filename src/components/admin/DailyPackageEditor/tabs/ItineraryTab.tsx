"use client";
import { useFormContext, useFieldArray } from "react-hook-form";
import { Trash2, Plus } from "lucide-react";
import { FormField } from "@/components/admin/FormField/FormField";
import { Input } from "@/components/admin/Input/Input";
import { Textarea } from "@/components/admin/Input/Textarea";
import type { DailyFormValues } from "@/app/admin/(authed)/daily/[id]/schema";

export function ItineraryTab() {
  const { register, control, formState: { errors } } = useFormContext<DailyFormValues>();
  const { fields, append, remove } = useFieldArray({ control, name: "stops" });

  return (
    <div className="space-y-6">
      <p className="font-sans text-[14px] text-ink-soft leading-relaxed">
        Add each stop in chronological order. Include a place name and short description of what happens there.
      </p>

      {fields.map((field, i) => {
        const errs = errors.stops?.[i];
        return (
          <div key={field.id} className="border border-rule p-6 space-y-4 relative">
            <div className="flex items-center justify-between">
              <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-muted">Stop {i + 1}</p>
              <button type="button" onClick={() => remove(i)} className="text-ink-soft hover:text-terracotta transition-colors"><Trash2 size={14} /></button>
            </div>
            <FormField label="Place" error={errs?.place?.message}>
              <Input {...register(`stops.${i}.place`)} placeholder="e.g. Sultanahmet Square" />
            </FormField>
            <FormField label="Description" error={errs?.description?.message}>
              <Textarea rows={2} {...register(`stops.${i}.description`)} placeholder="What guests will experience here…" />
            </FormField>
          </div>
        );
      })}

      <button type="button" onClick={() => append({ place: "", description: "" })}
        className="flex items-center gap-2 px-5 py-2.5 font-mono text-[11px] tracking-[0.16em] uppercase font-medium border border-ochre text-ochre hover:bg-ochre hover:text-navy transition-all duration-200">
        <Plus size={14} /> Add stop
      </button>
    </div>
  );
}
