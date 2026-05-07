"use client";
import { useFormContext, useFieldArray, Controller } from "react-hook-form";
import { Plus, Trash2, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { FormField } from "@/components/admin/FormField/FormField";
import { Input } from "@/components/admin/Input/Input";
import type { HotelFormValues } from "@/app/admin/(authed)/hotels/[id]/schema";

export function RoomTypesTab() {
  const t = useTranslations("admin.editor");
  const hintT = useTranslations("admin.formHints");
  const { register, control, watch, setValue, formState: { errors } } = useFormContext<HotelFormValues>();
  const { fields, append, remove } = useFieldArray({ control, name: "room_types" });
  const imageCount = watch("images")?.length ?? 4;

  return (
    <div className="space-y-8">
      <p className="font-sans text-[14px] text-ink-soft leading-relaxed">
        Define the room types guests can choose from. Each room links to one of the gallery images by position (0 = first image, 1 = second, etc.).
      </p>

      {fields.map((field, i) => {
        const highlights = watch(`room_types.${i}.highlights`) as string[] ?? [];
        const errs = errors.room_types?.[i];
        return (
          <div key={field.id} className="border border-rule p-6 space-y-6 relative">
            <div className="flex items-center justify-between">
              <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-muted">{t("room", { n: i + 1 })}</p>
              <button type="button" onClick={() => remove(i)} className="text-ink-soft hover:text-terracotta transition-colors"><Trash2 size={14} /></button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField label="Room name" required error={errs?.name?.message}>
                <Input {...register(`room_types.${i}.name`)} placeholder="e.g. Bosphorus Suite" />
              </FormField>
              <FormField label="Max guests" required error={errs?.capacity?.message}>
                <Input type="number" min={1} {...register(`room_types.${i}.capacity`, { valueAsNumber: true })} />
              </FormField>
              <FormField label="Bed configuration" required error={errs?.beds?.message}>
                <Input {...register(`room_types.${i}.beds`)} placeholder="e.g. 1 king bed" />
              </FormField>
              <FormField label="Room size" required error={errs?.size?.message}>
                <Input {...register(`room_types.${i}.size`)} placeholder="e.g. 42 m²" />
              </FormField>
              <FormField label="Gallery image position" hint={hintT("galleryPosition", { count: Math.max(0, imageCount - 1) })} error={errs?.image_index?.message}>
                <Input type="number" min={0} max={Math.max(0, imageCount - 1)} {...register(`room_types.${i}.image_index`, { valueAsNumber: true })} />
              </FormField>
            </div>

            <FormField label="Highlights">
              <div className="space-y-2">
                {highlights.map((_, hi) => (
                  <div key={hi} className="flex items-center gap-2">
                    <Input {...register(`room_types.${i}.highlights.${hi}`)} placeholder="e.g. Strait view" className="flex-1" />
                    <button type="button" onClick={() => { const next = highlights.filter((_, idx) => idx !== hi); setValue(`room_types.${i}.highlights`, next); }} className="text-ink-soft hover:text-terracotta transition-colors p-1"><X size={14} /></button>
                  </div>
                ))}
                <button type="button" onClick={() => setValue(`room_types.${i}.highlights`, [...highlights, ""])}
                  className="flex items-center gap-1.5 font-mono text-[10px] tracking-[0.2em] uppercase text-ink-soft hover:text-ochre transition-colors">
                  <Plus size={12} /> {t("addHighlight")}
                </button>
              </div>
            </FormField>
          </div>
        );
      })}

      <button type="button" onClick={() => append({ name: "", capacity: 2, beds: "", size: "", image_index: 0, highlights: [] })}
        className="flex items-center gap-2 px-5 py-2.5 font-mono text-[11px] tracking-[0.16em] uppercase font-medium border border-ochre text-ochre hover:bg-ochre hover:text-navy transition-all duration-200">
        <Plus size={14} /> {t("addRoomType")}
      </button>
    </div>
  );
}
