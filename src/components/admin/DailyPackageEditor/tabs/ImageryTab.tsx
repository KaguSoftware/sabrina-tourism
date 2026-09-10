"use client";
import { useFormContext } from "react-hook-form";
import { FormField } from "@/components/admin/FormField/FormField";
import { Input } from "@/components/admin/Input/Input";
import { ImageUploader } from "@/components/admin/ImageUploader/ImageUploader";
import { ImagePresetPicker } from "@/components/admin/ImagePresetPicker/ImagePresetPicker";
import { GalleryGrid } from "@/components/admin/shared-tabs/GalleryGrid";
import { getPublicUrl } from "@/lib/supabase/storage";
import type { DailyFormValues } from "@/app/admin/(authed)/daily/[id]/schema";

function HeroImageField({ name, label, hint, folder }: { name: "hero_image" | "card_image"; label: string; hint?: string; folder: string }) {
  const { watch, setValue, register } = useFormContext<DailyFormValues>();
  const url = watch(name) ?? "";
  const previewUrl = url ? getPublicUrl(url) : null;
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
      <ImagePresetPicker value={url} onChange={(u) => setValue(name, u, { shouldDirty: true })} />
    </FormField>
  );
}

export function ImageryTab() {
  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <HeroImageField label="Hero image (detail page)" name="hero_image" folder="daily/hero" />
        <HeroImageField label="Card image (listing)" hint="Optional — falls back to the hero image." name="card_image" folder="daily/cards" />
      </div>
      <GalleryGrid folder="daily/gallery" itemLabel="Photo" heading="Group / Activity Gallery" />
    </div>
  );
}
