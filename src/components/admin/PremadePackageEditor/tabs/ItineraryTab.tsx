"use client";
import { useFormContext, useFieldArray } from "react-hook-form";
import { X, Plus } from "lucide-react";
import { FormField } from "@/components/admin/FormField/FormField";
import { Input } from "@/components/admin/Input/Input";
import { Textarea } from "@/components/admin/Input/Textarea";
import type { PremadeFormValues } from "@/app/admin/(authed)/fixed-dates/[id]/schema";

export function ItineraryTab() {
  const { register, control, watch, formState: { errors } } = useFormContext<PremadeFormValues>();
  const { fields, append, remove } = useFieldArray({ control, name: "itinerary" });
  const itinerary = watch("itinerary");

  return (
    <div className="space-y-6">
      <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted">
        Days are ordered automatically by day number on save.
      </p>

      {fields.map((field, i) => {
        const dayErrors = (errors.itinerary as unknown as Record<number, { title?: { message?: string } }>)?.[i];
        return (
          <div key={field.id} className="border border-rule p-6 space-y-4 relative">
            <button
              type="button"
              onClick={() => remove(i)}
              className="absolute top-4 right-4 text-ink-soft hover:text-terracotta transition-colors"
            >
              <X size={14} />
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-[80px_1fr] gap-4 items-start">
              <FormField label="Day #">
                <Input
                  type="number"
                  min={1}
                  {...register(`itinerary.${i}.day_number`, { valueAsNumber: true })}
                  placeholder="1"
                />
              </FormField>
              <FormField label="Title" required error={dayErrors?.title?.message}>
                <Input {...register(`itinerary.${i}.title`)} placeholder="e.g. Arrival in Istanbul" />
              </FormField>
            </div>

            <FormField label="Description">
              <Textarea rows={3} {...register(`itinerary.${i}.description`)} placeholder="What happens this day…" />
            </FormField>
          </div>
        );
      })}

      <button
        type="button"
        onClick={() => append({ day_number: (itinerary?.length ?? 0) + 1, title: "", description: "" })}
        className="flex items-center gap-1.5 font-mono text-[10px] tracking-[0.2em] uppercase text-ink-soft hover:text-ochre transition-colors"
      >
        <Plus size={12} /> Add day
      </button>
    </div>
  );
}
