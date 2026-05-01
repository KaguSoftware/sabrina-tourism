"use client";

import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { X, Plus } from "lucide-react";
import { FormField } from "@/components/admin/FormField/FormField";
import { Input } from "@/components/admin/Input/Input";
import { TIER_NAMES } from "../types";
import type { PackageFormValues } from "../types";

function TierPanel({ tierIndex }: { tierIndex: number }) {
  // react-hook-form tuple paths don't accept `number` index at the type level —
  // cast to any since tierIndex is always 0 | 1 | 2 at runtime.
  const ctx = useFormContext<PackageFormValues>();
  const reg = ctx.register as any;
  const watchAny = ctx.watch as any;
  const setAny = ctx.setValue as any;
  const errors = ctx.formState.errors;

  const tierErrors = (errors.tiers as any)?.[tierIndex];
  const highlights: string[] = watchAny(`tiers.${tierIndex}.highlights`) ?? [];
  const guideLanguagesRaw: string[] = watchAny(`tiers.${tierIndex}.guide_languages`) ?? [];
  const guideLanguagesStr = guideLanguagesRaw.join(", ");

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
      <FormField label="Vehicle class" required error={tierErrors?.vehicle_class?.message}>
        <Input {...reg(`tiers.${tierIndex}.vehicle_class`)} placeholder="e.g. Luxury SUV" />
      </FormField>
      <FormField label="Accommodation" required error={tierErrors?.accommodation?.message}>
        <Input {...reg(`tiers.${tierIndex}.accommodation`)} placeholder="e.g. 5-star hotels" />
      </FormField>
      <FormField label="Group size" required error={tierErrors?.group_size?.message}>
        <Input {...reg(`tiers.${tierIndex}.group_size`)} placeholder="e.g. 2–6 people" />
      </FormField>
      <FormField
        label="Guide languages"
        hint="Comma-separated, e.g. English, Turkish, French"
        error={tierErrors?.guide_languages?.message}
      >
        <Input
          value={guideLanguagesStr}
          onChange={(e) =>
            setAny(
              `tiers.${tierIndex}.guide_languages`,
              e.target.value.split(",").map((s: string) => s.trim()).filter(Boolean),
            )
          }
          placeholder="English, Turkish"
        />
      </FormField>
      <div className="md:col-span-2">
        <FormField label="Meals included" required error={tierErrors?.meals_included?.message}>
          <Input {...reg(`tiers.${tierIndex}.meals_included`)} placeholder="e.g. Breakfast + 2 dinners" />
        </FormField>
      </div>
      <div className="md:col-span-2">
        <FormField label="Highlights">
          <div className="space-y-2 pt-1">
            {highlights.map((_: string, hi: number) => (
              <div key={hi} className="flex items-center gap-2">
                <Input
                  {...reg(`tiers.${tierIndex}.highlights.${hi}`)}
                  placeholder="e.g. Private guided Hagia Sophia tour"
                />
                <button
                  type="button"
                  onClick={() => setAny(`tiers.${tierIndex}.highlights`, highlights.filter((_: string, idx: number) => idx !== hi))}
                  className="text-ink-soft hover:text-terracotta transition-colors p-1"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => setAny(`tiers.${tierIndex}.highlights`, [...highlights, ""])}
              className="flex items-center gap-1.5 font-mono text-[10px] tracking-[0.2em] uppercase text-ink-soft hover:text-ochre transition-colors"
            >
              <Plus size={12} /> Add highlight
            </button>
          </div>
        </FormField>
      </div>
    </div>
  );
}

export function TiersTab() {
  const [activeTier, setActiveTier] = useState(0);

  return (
    <div>
      <div className="flex border-b border-rule">
        {TIER_NAMES.map((name, i) => (
          <button
            key={name}
            type="button"
            onClick={() => setActiveTier(i)}
            className={`px-5 py-2.5 font-mono text-[10px] tracking-[0.18em] uppercase transition-colors ${
              activeTier === i
                ? "text-ink border-b-2 border-ochre -mb-px"
                : "text-muted hover:text-ink"
            }`}
          >
            {name}
          </button>
        ))}
      </div>
      <TierPanel tierIndex={activeTier} />
    </div>
  );
}
