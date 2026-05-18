"use client";
import { useFormContext, useFieldArray } from "react-hook-form";
import { X, Plus } from "lucide-react";
import { FormField } from "@/components/admin/FormField/FormField";
import { Input } from "@/components/admin/Input/Input";
import { ImageUploader } from "@/components/admin/ImageUploader/ImageUploader";
import { ImagePresetPicker } from "@/components/admin/ImagePresetPicker/ImagePresetPicker";
import { getPublicUrl } from "@/lib/supabase/storage";
import type { PremadeFormValues } from "@/app/admin/(authed)/fixed-dates/[id]/schema";

function ImageField({ label, name, folder, showPresets }: { label: string; name: "hero_image" | "card_image" | "accommodation_image_a" | "accommodation_image_b"; folder: string; showPresets?: boolean }) {
  const { watch, setValue, register } = useFormContext<PremadeFormValues>();
  const url = watch(name) ?? "";
  const isExternal = url.startsWith("http") || url.startsWith("/");
  const previewUrl = url ? (isExternal ? url : getPublicUrl(url)) : null;

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
      {showPresets && (
        <ImagePresetPicker
          value={url}
          onChange={(u) => setValue(name, u, { shouldDirty: true })}
        />
      )}
    </FormField>
  );
}

export function ImageryTab() {
  const { control, watch, setValue, register } = useFormContext<PremadeFormValues>();
  const { fields, append, remove } = useFieldArray({ control, name: "gallery" });
  const gallery = watch("gallery");

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <ImageField label="Hero image (detail page)" name="hero_image" folder="premade/hero" showPresets />
        <ImageField label="Card image (listing)" name="card_image" folder="premade/cards" showPresets />
      </div>

      <div>
        <p className="font-mono text-[11px] tracking-[0.22em] uppercase text-muted font-medium mb-5">Gallery</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {fields.map((field, i) => {
            const url = gallery[i]?.url ?? "";
            const previewUrl = url ? getPublicUrl(url) : null;
            return (
              <div key={field.id} className="border border-rule p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-muted">Image {i + 1}</span>
                  <button type="button" onClick={() => remove(i)} className="text-ink-soft hover:text-terracotta transition-colors"><X size={14} /></button>
                </div>
                {previewUrl ? (
                  <div className="relative aspect-4/3 border border-rule overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={previewUrl} alt="" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => setValue(`gallery.${i}.url`, "")} className="absolute top-1 right-1 w-6 h-6 bg-ink/70 text-cream flex items-center justify-center text-sm hover:bg-terracotta transition-colors">×</button>
                  </div>
                ) : (
                  <ImageUploader value={null} onChange={(p) => { if (p) setValue(`gallery.${i}.url`, p); }} folder="premade/gallery" aspectRatio="4/3" />
                )}
                <Input {...register(`gallery.${i}.url`)} placeholder="Or paste URL…" />
              </div>
            );
          })}
          <div className="border border-dashed border-ochre/40 flex items-center justify-center min-h-[160px] cursor-pointer hover:border-ochre transition-colors"
            onClick={() => append({ url: "" })}>
            <div className="flex flex-col items-center gap-2 text-muted">
              <Plus size={24} />
              <span className="font-mono text-[10px] tracking-[0.2em] uppercase">Add image</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
