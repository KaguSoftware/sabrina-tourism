"use client";
import { useFormContext, useFieldArray } from "react-hook-form";
import { X, Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { FormField } from "@/components/admin/FormField/FormField";
import { Input } from "@/components/admin/Input/Input";
import { ImageUploader } from "@/components/admin/ImageUploader/ImageUploader";
import { getPublicUrl } from "@/lib/supabase/storage";
import type { HotelFormValues } from "@/app/admin/(authed)/hotels/[id]/schema";

const DEFAULT_LABELS = ["Exterior", "Bedroom", "Bathroom", "View"];

export function GalleryTab() {
  const t = useTranslations("admin.editor");
  const { control, watch, setValue, register } = useFormContext<HotelFormValues>();
  const { fields, append, remove } = useFieldArray({ control, name: "images" });
  const images = watch("images");

  return (
    <div className="space-y-6">
      <p className="font-sans text-[14px] text-ink-soft leading-relaxed">
        Images are shown in order. The position number (0-based) is what Room Types reference. Add a label so admins and the carousel can identify each shot.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {fields.map((field, i) => {
          const url = images[i]?.url ?? "";
          const previewUrl = url ? getPublicUrl(url) : null;
          return (
            <div key={field.id} className="border border-rule p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-muted">{t("image", { n: i })}</span>
                <button type="button" onClick={() => remove(i)} className="text-ink-soft hover:text-terracotta transition-colors"><X size={14} /></button>
              </div>
              {previewUrl ? (
                <div className="relative aspect-4/3 border border-rule overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={previewUrl} alt="" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => setValue(`images.${i}.url`, "")} className="absolute top-1 right-1 w-6 h-6 bg-ink/70 text-cream flex items-center justify-center text-sm hover:bg-terracotta transition-colors">×</button>
                </div>
              ) : (
                <ImageUploader value={null} onChange={(p) => { if (p) setValue(`images.${i}.url`, p); }} folder="hotels/gallery" aspectRatio="4/3" />
              )}
              <FormField label="Label">
                <Input {...register(`images.${i}.label`)} placeholder={DEFAULT_LABELS[i] ?? "e.g. Pool"} />
              </FormField>
              <FormField label="Or paste URL directly">
                <Input {...register(`images.${i}.url`)} placeholder="https://…" />
              </FormField>
            </div>
          );
        })}

        <div className="border border-dashed border-ochre/40 flex items-center justify-center min-h-[200px] cursor-pointer hover:border-ochre transition-colors"
          onClick={() => append({ url: "", label: DEFAULT_LABELS[fields.length] ?? "" })}>
          <div className="flex flex-col items-center gap-2 text-muted">
            <Plus size={24} />
            <span className="font-mono text-[10px] tracking-[0.2em] uppercase">{t("addImage")}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
