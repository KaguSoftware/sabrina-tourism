"use client";
import { useFormContext, useFieldArray } from "react-hook-form";
import { X, Plus } from "lucide-react";
import { FormField } from "@/components/admin/FormField/FormField";
import { Input } from "@/components/admin/Input/Input";
import { Select } from "@/components/admin/Input/Select";
import type { PremadeFormValues } from "@/app/admin/(authed)/fixed-dates/[id]/schema";
import type { PremadeHotelOption } from "../PremadeEditor";

function TagList({
  values,
  onChange,
  placeholder,
}: {
  values: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
}) {
  return (
    <div className="space-y-2">
      {values.map((v, i) => (
        <div key={i} className="flex items-center gap-2">
          <input
            type="text"
            value={v}
            onChange={(e) => {
              const next = [...values];
              next[i] = e.target.value;
              onChange(next);
            }}
            placeholder={placeholder}
            className="flex-1 px-3 py-2 border border-rule text-[13px] text-ink bg-cream focus:outline-none focus:border-ochre/60 transition-colors"
          />
          <button type="button" onClick={() => onChange(values.filter((_, j) => j !== i))} className="text-ink-soft hover:text-terracotta transition-colors p-1">
            <X size={13} />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...values, ""])}
        className="flex items-center gap-1.5 font-mono text-[10px] tracking-[0.2em] uppercase text-ink-soft hover:text-ochre transition-colors"
      >
        <Plus size={12} /> Add
      </button>
    </div>
  );
}

export function TiersTab({ availableHotels = [] }: { availableHotels?: PremadeHotelOption[] }) {
  const { register, control, watch, setValue } = useFormContext<PremadeFormValues>();
  const { fields, append, remove } = useFieldArray({ control, name: "tiers" });

  return (
    <div className="space-y-8">
      {fields.map((field, i) => {
        const guideLanguages = watch(`tiers.${i}.guide_languages`) ?? [];
        const highlights = watch(`tiers.${i}.highlights`) ?? [];

        return (
          <div key={field.id} className="border border-rule p-6 space-y-5 relative">
            <button
              type="button"
              onClick={() => remove(i)}
              className="absolute top-4 right-4 text-ink-soft hover:text-terracotta transition-colors"
            >
              <X size={14} />
            </button>

            <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-ochre">Tier {i + 1}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Tier name" hint="e.g. Essential / Signature / Private">
                <Input {...register(`tiers.${i}.tier_name`)} placeholder="Signature" />
              </FormField>
              <FormField label="Vehicle class">
                <Input {...register(`tiers.${i}.vehicle_class`)} placeholder="Mercedes V-Class with private driver" />
              </FormField>
              <FormField label="Hotel" hint="Optional — links this tier to a hotel record.">
                <Select
                  value={watch(`tiers.${i}.hotel_id`) ?? ""}
                  onChange={(e) =>
                    setValue(`tiers.${i}.hotel_id`, e.target.value === "" ? null : e.target.value, { shouldDirty: true })
                  }
                >
                  <option value="">— None —</option>
                  {availableHotels.map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.name}
                      {h.region ? ` — ${h.region}` : ""}
                    </option>
                  ))}
                </Select>
              </FormField>
              <FormField label="Accommodation">
                <Input {...register(`tiers.${i}.accommodation`)} placeholder="4★ design hotels" />
              </FormField>
              <FormField label="Group size">
                <Input {...register(`tiers.${i}.group_size`)} placeholder="Private — up to 6" />
              </FormField>
              <FormField label="Meals included">
                <Input {...register(`tiers.${i}.meals_included`)} placeholder="Breakfast + 3 curated dinners" />
              </FormField>
            </div>

            <FormField label="Guide languages">
              <TagList
                values={guideLanguages}
                onChange={(v) => setValue(`tiers.${i}.guide_languages`, v, { shouldDirty: true })}
                placeholder="e.g. English"
              />
            </FormField>

            <FormField label="Highlights" hint="Bullet points shown on tier card">
              <TagList
                values={highlights}
                onChange={(v) => setValue(`tiers.${i}.highlights`, v, { shouldDirty: true })}
                placeholder="e.g. Private guide throughout"
              />
            </FormField>
          </div>
        );
      })}

      <button
        type="button"
        onClick={() => append({ tier_name: "", vehicle_class: "", accommodation: "", hotel_id: null, group_size: "", guide_languages: [], meals_included: "", highlights: [] })}
        className="flex items-center gap-1.5 font-mono text-[10px] tracking-[0.2em] uppercase text-ink-soft hover:text-ochre transition-colors"
      >
        <Plus size={12} /> Add tier
      </button>
    </div>
  );
}
