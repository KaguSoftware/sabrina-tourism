"use client";
import { useFormContext, useFieldArray } from "react-hook-form";
import { X, Plus } from "lucide-react";
import { FormField } from "@/components/admin/FormField/FormField";
import { Input } from "@/components/admin/Input/Input";
import { ImageUploader } from "@/components/admin/ImageUploader/ImageUploader";
import { ImagePresetPicker } from "@/components/admin/ImagePresetPicker/ImagePresetPicker";
import { getPublicUrl } from "@/lib/supabase/storage";
import type { DailyFormValues } from "@/app/admin/(authed)/daily/[id]/schema";

function HeroImageField({ name, label, folder }: { name: "hero_image" | "card_image"; label: string; folder: string }) {
  const { watch, setValue, register } = useFormContext<DailyFormValues>();
  const url = watch(name) ?? "";
  const previewUrl = url ? getPublicUrl(url) : null;
  return (
    <FormField label={label}>
      {previewUrl ? (
        <div className="relative aspect-video border border-rule overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={previewUrl} alt="" className="w-full h-full object-cover" />
          <button type="button" onClick={() => setValue(name, "")} className="absolute top-1 right-1 w-6 h-6 bg-ink/70 text-cream flex items-center justify-center text-sm hover:bg-terracotta transition-colors">×</button>
        </div>
      ) : (
        <ImageUploader value={null} onChange={(p) => { if (p) setValue(name, p); }} folder={folder} aspectRatio="16/9" />
      )}
      <Input {...register(name)} placeholder="Or paste URL…" className="mt-2" />
      <ImagePresetPicker
        value={url}
        onChange={(u) => setValue(name, u, { shouldDirty: true })}
      />
    </FormField>
  );
}

export function ImageryTab() {
  const { control, watch, setValue, register } = useFormContext<DailyFormValues>();
  const { fields, append, remove } = useFieldArray({ control, name: "gallery" });
  const gallery = watch("gallery");

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <HeroImageField label="Hero image (detail page)" name="hero_image" folder="daily/hero" />
        <HeroImageField label="Card image (listing)" name="card_image" folder="daily/cards" />
      </div>

      <div>
        <p className="font-mono text-[11px] tracking-[0.22em] uppercase text-muted font-medium mb-5">Group / Activity Gallery</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {fields.map((field, i) => {
            const url = gallery[i]?.url ?? "";
            const previewUrl = url ? getPublicUrl(url) : null;
            return (
              <div key={field.id} className="border border-rule p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-muted">Photo {i + 1}</span>
                  <button type="button" onClick={() => remove(i)} className="text-ink-soft hover:text-terracotta transition-colors"><X size={14} /></button>
                </div>
                {previewUrl ? (
                  <div className="relative aspect-4/3 border border-rule overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={previewUrl} alt="" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => setValue(`gallery.${i}.url`, "")} className="absolute top-1 right-1 w-6 h-6 bg-ink/70 text-cream flex items-center justify-center text-sm hover:bg-terracotta transition-colors">×</button>
                  </div>
                ) : (
                  <ImageUploader value={null} onChange={(p) => { if (p) setValue(`gallery.${i}.url`, p); }} folder="daily/gallery" aspectRatio="4/3" />
                )}
                <Input {...register(`gallery.${i}.url`)} placeholder="Or paste URL…" />
              </div>
            );
          })}
          <div className="border border-dashed border-ochre/40 flex items-center justify-center min-h-[160px] cursor-pointer hover:border-ochre transition-colors"
            onClick={() => append({ url: "" })}>
            <div className="flex flex-col items-center gap-2 text-muted">
              <Plus size={24} />
              <span className="font-mono text-[10px] tracking-[0.2em] uppercase">Add photo</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
