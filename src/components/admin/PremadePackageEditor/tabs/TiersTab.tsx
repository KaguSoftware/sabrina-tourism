"use client";
import { useFormContext, useFieldArray } from "react-hook-form";
import { X, Plus } from "lucide-react";
import { FormField } from "@/components/admin/FormField/FormField";
import { Input } from "@/components/admin/Input/Input";
import { Select } from "@/components/admin/Input/Select";
import { ImageUploader } from "@/components/admin/ImageUploader/ImageUploader";
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

const CUSTOM_HOTEL = "__custom__";

// A hotel that lives only on this tour: shown on the tour's tier card, never
// added to the public hotel list.
function CustomHotelFields({ index }: { index: number }) {
  const { register, watch, setValue, formState: { errors } } = useFormContext<PremadeFormValues>();
  const base = `tiers.${index}.custom_hotel` as const;
  const image = watch(`${base}.image`) ?? "";
  const stars = watch(`${base}.stars`);

  return (
    <div className="border border-dashed border-ochre/50 bg-cream/40 p-5 space-y-4">
      <div>
        <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-ochre">Tour-only hotel</p>
        <p className="text-[12px] text-ink-soft mt-1">
          Only shown on this tour&apos;s page. It is not added to the hotels list.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Hotel name" required error={errors.tiers?.[index]?.custom_hotel?.name?.message}>
          <Input {...register(`${base}.name`)} placeholder="e.g. Kayakapi Premium Caves" />
        </FormField>
        <FormField label="Location">
          <Input {...register(`${base}.region`)} placeholder="e.g. Cappadocia" />
        </FormField>
        <FormField label="Stars">
          <Select
            value={stars ?? ""}
            onChange={(e) =>
              setValue(`${base}.stars`, e.target.value === "" ? null : Number(e.target.value), { shouldDirty: true })
            }
          >
            <option value="">— None —</option>
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>
                {"★".repeat(n)}
              </option>
            ))}
          </Select>
        </FormField>
      </div>
      <FormField label="Hotel image" hint="Shown at the top of the tier card.">
        <ImageUploader
          value={image || null}
          onChange={(p) => setValue(`${base}.image`, p ?? "", { shouldDirty: true })}
          folder="premade/tier-hotels"
          aspectRatio="4/2.1"
        />
      </FormField>
    </div>
  );
}

export function TiersTab({ availableHotels = [] }: { availableHotels?: PremadeHotelOption[] }) {
  const { register, control, watch, setValue } = useFormContext<PremadeFormValues>();
  const { fields, append, remove } = useFieldArray({ control, name: "tiers" });
  const numberOpts = { setValueAs: (v: unknown) => (v === "" || v === null || v === undefined ? null : Number(v)) };

  return (
    <div className="space-y-8">
      {fields.map((field, i) => {
        const guideLanguages = watch(`tiers.${i}.guide_languages`) ?? [];
        const highlights = watch(`tiers.${i}.highlights`) ?? [];
        const customHotel = watch(`tiers.${i}.custom_hotel`);

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
              <FormField label="Tier name" hint="e.g. Essential / Signature / Private" required>
                <Input {...register(`tiers.${i}.tier_name`)} placeholder="Signature" />
              </FormField>
              <FormField label="Vehicle class">
                <Input {...register(`tiers.${i}.vehicle_class`)} placeholder="Mercedes V-Class with private driver" />
              </FormField>
              <FormField label="Hotel" hint="Optional — pick a listed hotel, or add one that only shows on this tour.">
                <Select
                  value={customHotel ? CUSTOM_HOTEL : watch(`tiers.${i}.hotel_id`) ?? ""}
                  onChange={(e) => {
                    const v = e.target.value;
                    if (v === CUSTOM_HOTEL) {
                      setValue(`tiers.${i}.hotel_id`, null, { shouldDirty: true });
                      setValue(`tiers.${i}.custom_hotel`, { name: "", region: "", stars: null, image: "" }, { shouldDirty: true });
                      return;
                    }
                    setValue(`tiers.${i}.custom_hotel`, null, { shouldDirty: true });
                    setValue(`tiers.${i}.hotel_id`, v === "" ? null : v, { shouldDirty: true });
                  }}
                >
                  <option value="">— None —</option>
                  {availableHotels.map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.name}
                      {h.region ? ` — ${h.region}` : ""}
                    </option>
                  ))}
                  <option value={CUSTOM_HOTEL}>+ New hotel for this tour only</option>
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

            {customHotel && <CustomHotelFields index={i} />}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <FormField label="In double room (per person)" hint="Per-person rate when two share a room.">
                <Input type="number" min={0} step="0.01" {...register(`tiers.${i}.price_2_people`, numberOpts)} placeholder="e.g. 1500" />
              </FormField>
              <FormField label="Single-room supplement" hint='Added on top of the double-room rate; shown as "+ amount" under "In single room".'>
                <Input type="number" min={0} step="0.01" {...register(`tiers.${i}.price_single_room_supplement`, numberOpts)} placeholder="e.g. 300" />
              </FormField>
              <FormField label="Per-child price" hint="Per-child rate shown in the pricing panel.">
                <Input type="number" min={0} step="0.01" {...register(`tiers.${i}.price_per_child`, numberOpts)} placeholder="e.g. 400" />
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
        onClick={() => append({ tier_name: "", vehicle_class: "", accommodation: "", hotel_id: null, custom_hotel: null, group_size: "", guide_languages: [], meals_included: "", highlights: [], price_2_people: null, price_single_room_supplement: null, price_per_child: null })}
        className="flex items-center gap-1.5 font-mono text-[10px] tracking-[0.2em] uppercase text-ink-soft hover:text-ochre transition-colors"
      >
        <Plus size={12} /> Add tier
      </button>
    </div>
  );
}
