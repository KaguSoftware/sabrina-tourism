"use client";

import { useFormContext, useFieldArray } from "react-hook-form";
import { X, Plus } from "lucide-react";
import { Input } from "@/components/admin/Input/Input";
import { IconPicker } from "../IconPicker";
import type { PackageFormValues } from "../types";

type InclusionListName = "included" | "not_included";

function InclusionList({
  name,
  variant,
  placeholder,
}: {
  name: InclusionListName;
  variant: "included" | "not_included";
  placeholder: string;
}) {
  const { control, watch, setValue } = useFormContext<PackageFormValues>();
  const { append, remove } = useFieldArray({ control, name });
  const items = watch(name) ?? [];

  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-2">
          <Input
            value={item.text}
            onChange={(e) =>
              setValue(`${name}.${i}.text` as const, e.target.value, {
                shouldDirty: true,
              })
            }
            placeholder={placeholder}
            className="flex-1"
          />
          <IconPicker
            value={item.icon ?? null}
            onChange={(v) =>
              setValue(`${name}.${i}.icon` as const, v, { shouldDirty: true })
            }
            variant={variant}
          />
          <button
            type="button"
            onClick={() => remove(i)}
            className="text-ink-soft hover:text-terracotta transition-colors p-1"
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
  );
}

export function InclusionsTab() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <p className="font-mono text-[11px] tracking-[0.22em] uppercase text-muted font-medium mb-4">Included</p>
        <InclusionList name="included" variant="included" placeholder="e.g. Airport transfers" />
      </div>
      <div>
        <p className="font-mono text-[11px] tracking-[0.22em] uppercase text-muted font-medium mb-4">Not included</p>
        <InclusionList name="not_included" variant="not_included" placeholder="e.g. International flights" />
      </div>
    </div>
  );
}
