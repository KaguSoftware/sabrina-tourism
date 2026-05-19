"use client";
import { useFormContext, useFieldArray, Controller } from "react-hook-form";
import { X, Plus } from "lucide-react";
import { Input } from "@/components/admin/Input/Input";
import { InclusionIconPicker } from "@/components/admin/InclusionIconPicker";

interface InclusionItem {
  text: string;
  icon?: string | null;
}

// Minimal form shape — works with any form that has these two fields
interface InclusionsFormShape {
  included: InclusionItem[];
  not_included: InclusionItem[];
}

function InclusionList({
  name,
  label,
  placeholder,
}: {
  name: "included" | "not_included";
  label: string;
  placeholder: string;
}) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { register, control } = useFormContext<InclusionsFormShape>() as any;
  const { fields, append, remove } = useFieldArray({ control, name });

  return (
    <div>
      <p className="font-mono text-[11px] tracking-[0.22em] uppercase text-muted font-medium mb-3">{label}</p>
      <div className="space-y-2">
        {fields.map((field: { id: string }, i: number) => (
          <div key={field.id} className="flex items-center gap-2">
            <Controller
              control={control}
              name={`${name}.${i}.icon` as const}
              render={({ field: f }: { field: { value: string | null; onChange: (v: string | null) => void } }) => (
                <InclusionIconPicker value={f.value ?? null} onChange={(v) => f.onChange(v)} />
              )}
            />
            <Input {...register(`${name}.${i}.text` as const)} placeholder={placeholder} className="flex-1" />
            <button
              type="button"
              onClick={() => remove(i)}
              className="text-ink-soft hover:text-terracotta transition-colors p-1 shrink-0"
              aria-label="Remove"
            >
              <X size={14} />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => append({ text: "", icon: null })}
          className="flex items-center gap-1.5 font-mono text-[10px] tracking-[0.2em] uppercase text-ink-soft hover:text-ochre transition-colors mt-1"
        >
          <Plus size={12} /> Add item
        </button>
      </div>
    </div>
  );
}

export function InclusionsTab({
  includedPlaceholder = "e.g. Airport transfers",
  notIncludedPlaceholder = "e.g. International flights",
}: {
  includedPlaceholder?: string;
  notIncludedPlaceholder?: string;
} = {}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
      <InclusionList name="included" label="Included" placeholder={includedPlaceholder} />
      <InclusionList name="not_included" label="Not included" placeholder={notIncludedPlaceholder} />
    </div>
  );
}
