"use client";
import { useFormContext } from "react-hook-form";
import { FormField } from "@/components/admin/FormField/FormField";
import { Input } from "@/components/admin/Input/Input";
import { Textarea } from "@/components/admin/Input/Textarea";
import { ImageUploader } from "@/components/admin/ImageUploader/ImageUploader";
import { getPublicUrl } from "@/lib/supabase/storage";
import type { PremadeFormValues } from "@/app/admin/(authed)/fixed-dates/[id]/schema";

function AccomImageField({ label, name }: { label: string; name: "accommodation_image_a" | "accommodation_image_b" }) {
  const { watch, setValue, register } = useFormContext<PremadeFormValues>();
  const url = watch(name) ?? "";
  const previewUrl = url ? getPublicUrl(url) : null;

  return (
    <FormField label={label}>
      {previewUrl ? (
        <div className="relative aspect-4/3 border border-rule overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={previewUrl} alt="" className="w-full h-full object-cover" />
          <button type="button" onClick={() => setValue(name, "")} className="absolute top-1 right-1 w-6 h-6 bg-ink/70 text-cream flex items-center justify-center text-sm hover:bg-terracotta transition-colors">×</button>
        </div>
      ) : (
        <ImageUploader value={null} onChange={(p) => { if (p) setValue(name, p); }} folder="premade/accommodation" aspectRatio="4/3" />
      )}
      <Input {...register(name)} placeholder="Or paste URL…" className="mt-2" />
    </FormField>
  );
}

export function AccommodationTab() {
  const { register, formState: { errors } } = useFormContext<PremadeFormValues>();

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="md:col-span-2">
          <FormField label="Accommodation name" required error={errors.accommodation_name?.message}>
            <Input {...register("accommodation_name")} placeholder="e.g. Cave Suites Cappadocia" />
          </FormField>
        </div>
        <div className="md:col-span-2">
          <FormField label="Accommodation description" hint="Short paragraph shown on the booking page">
            <Textarea rows={4} {...register("accommodation_description")} placeholder="Describe the hotel, its style, location, and key features." />
          </FormField>
        </div>
        <AccomImageField label="Accommodation image A" name="accommodation_image_a" />
        <AccomImageField label="Accommodation image B" name="accommodation_image_b" />
      </div>
    </div>
  );
}
