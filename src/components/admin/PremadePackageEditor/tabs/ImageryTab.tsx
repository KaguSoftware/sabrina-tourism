"use client";
import { useFormContext } from "react-hook-form";
import { FormField } from "@/components/admin/FormField/FormField";
import { Input } from "@/components/admin/Input/Input";
import { ImageUploader } from "@/components/admin/ImageUploader/ImageUploader";
import { ImagePresetPicker } from "@/components/admin/ImagePresetPicker/ImagePresetPicker";
import { GalleryGrid } from "@/components/admin/shared-tabs/GalleryGrid";
import { getPublicUrl } from "@/lib/supabase/storage";
import type { PremadeFormValues } from "@/app/admin/(authed)/fixed-dates/[id]/schema";

function ImageField({ label, hint, name, folder, showPresets }: { label: string; hint?: string; name: "hero_image" | "card_image" | "accommodation_image_a" | "accommodation_image_b"; folder: string; showPresets?: boolean }) {
  const { watch, setValue, register } = useFormContext<PremadeFormValues>();
  const url = watch(name) ?? "";
  const isExternal = url.startsWith("http") || url.startsWith("/");
  const previewUrl = url ? (isExternal ? url : getPublicUrl(url)) : null;

  return (
    <FormField label={label} hint={hint}>
      {previewUrl ? (
        <div className="relative aspect-video border border-rule overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={previewUrl} alt="" className="w-full h-full object-cover" />
          <button type="button" onClick={() => setValue(name, "", { shouldDirty: true })} className="absolute top-1 right-1 w-6 h-6 bg-ink/70 text-cream flex items-center justify-center text-sm hover:bg-terracotta transition-colors">×</button>
        </div>
      ) : (
        <ImageUploader value={null} onChange={(p) => { if (p) setValue(name, p, { shouldDirty: true }); }} folder={folder} aspectRatio="16/9" />
      )}
      <Input {...register(name)} placeholder="Or paste URL…" className="mt-2" />
      {showPresets && (
        <ImagePresetPicker value={url} onChange={(u) => setValue(name, u, { shouldDirty: true })} />
      )}
    </FormField>
  );
}

export function ImageryTab() {
  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <ImageField label="Hero image (detail page)" name="hero_image" folder="premade/hero" showPresets />
        <ImageField label="Card image (listing)" hint="Optional — falls back to the hero image." name="card_image" folder="premade/cards" showPresets />
      </div>
      <GalleryGrid folder="premade/gallery" itemLabel="Image" heading="Gallery" />
    </div>
  );
}
