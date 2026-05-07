"use client";
import { useFormContext } from "react-hook-form";
import { X, Plus } from "lucide-react";
import { FormField } from "@/components/admin/FormField/FormField";
import { Input } from "@/components/admin/Input/Input";
import type { PremadeFormValues } from "@/app/admin/(authed)/fixed-dates/[id]/schema";

export function VehicleTab() {
  const { register, watch, setValue, formState: { errors } } = useFormContext<PremadeFormValues>();
  const features = watch("vehicle_features") ?? [];

  return (
    <div className="max-w-xl space-y-8">
      <FormField label="Vehicle model" required error={errors.vehicle_model?.message}>
        <Input {...register("vehicle_model")} placeholder="e.g. Mercedes Sprinter" />
      </FormField>

      <FormField label="Features">
        <div className="space-y-2">
          {features.map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <Input {...register(`vehicle_features.${i}` as const)} placeholder="e.g. Air conditioning" className="flex-1" />
              <button type="button" onClick={() => setValue("vehicle_features", features.filter((_, idx) => idx !== i))} className="text-ink-soft hover:text-terracotta transition-colors p-1"><X size={14} /></button>
            </div>
          ))}
          <button type="button" onClick={() => setValue("vehicle_features", [...features, ""])}
            className="flex items-center gap-1.5 font-mono text-[10px] tracking-[0.2em] uppercase text-ink-soft hover:text-ochre transition-colors">
            <Plus size={12} /> Add feature
          </button>
        </div>
      </FormField>
    </div>
  );
}
