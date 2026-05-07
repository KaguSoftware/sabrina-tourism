"use client";
import { useFormContext, useFieldArray } from "react-hook-form";
import { X, Plus } from "lucide-react";
import { Input } from "@/components/admin/Input/Input";
import type { PremadeFormValues } from "@/app/admin/(authed)/fixed-dates/[id]/schema";

function InclusionList({
  name,
  label,
  placeholder,
}: {
  name: "included" | "not_included";
  label: string;
  placeholder: string;
}) {
  const { register, control } = useFormContext<PremadeFormValues>();
  const { fields, append, remove } = useFieldArray({ control, name: name as never });

  return (
    <div>
      <p className="font-mono text-[11px] tracking-[0.22em] uppercase text-muted font-medium mb-3">{label}</p>
      <div className="space-y-2">
        {fields.map((field, i) => (
          <div key={field.id} className="flex items-center gap-2">
            <Input {...register(`${name}.${i}` as never)} placeholder={placeholder} className="flex-1" />
            <button type="button" onClick={() => remove(i)} className="text-ink-soft hover:text-terracotta transition-colors p-1 shrink-0">
              <X size={14} />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => append("" as never)}
          className="flex items-center gap-1.5 font-mono text-[10px] tracking-[0.2em] uppercase text-ink-soft hover:text-ochre transition-colors mt-1"
        >
          <Plus size={12} /> Add item
        </button>
      </div>
    </div>
  );
}

export function InclusionsTab() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
      <InclusionList
        name="included"
        label="Included"
        placeholder="e.g. All private transfers"
      />
      <InclusionList
        name="not_included"
        label="Not included"
        placeholder="e.g. International flights"
      />
    </div>
  );
}
