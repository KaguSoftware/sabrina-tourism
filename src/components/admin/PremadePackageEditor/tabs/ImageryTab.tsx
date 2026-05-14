"use client";
import { useFormContext, useFieldArray } from "react-hook-form";
import { X, Plus } from "lucide-react";
import { FormField } from "@/components/admin/FormField/FormField";
import { Input } from "@/components/admin/Input/Input";
import { ImageUploader } from "@/components/admin/ImageUploader/ImageUploader";
import { getPublicUrl } from "@/lib/supabase/storage";
import type { PremadeFormValues } from "@/app/admin/(authed)/fixed-dates/[id]/schema";

const PRESET_HEROES = [
  { label: "Istanbul", url: "/istanbul-hero1.png" },
  { label: "Cappadocia", url: "/capadocia-hero.png" },
  { label: "Antalya", url: "/Antalya-hero.png" },
  { label: "Pamukkale", url: "/Pamukkale-hero.png" },
  { label: "Black Sea", url: "/black-sea-hero.png" },
  { label: "Eastern", url: "/Eastern-hero.png" },
];

function HeroPresetPicker({ name }: { name: "hero_image" | "card_image" }) {
  const { watch, setValue } = useFormContext<PremadeFormValues>();
  const current = watch(name) ?? "";

  return (
    <div className="mt-3">
      <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-muted mb-2">Quick select — city heroes</p>
      <div className="grid grid-cols-4 gap-2">
        {PRESET_HEROES.map((p) => {
          const active = current === p.url;
          return (
            <button
              key={p.url}
              type="button"
              onClick={() => setValue(name, p.url, { shouldDirty: true })}
              className={`relative aspect-video overflow-hidden border-2 transition-all duration-150 ${active ? "border-ochre" : "border-transparent hover:border-ochre/50"}`}
              title={p.label}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.url} alt={p.label} className="w-full h-full object-cover" />
              <span className={`absolute inset-x-0 bottom-0 font-mono text-[9px] tracking-[0.12em] uppercase px-1 py-0.5 text-center truncate ${active ? "bg-ochre text-navy" : "bg-navy/60 text-cream"}`}>
                {p.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

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
      {showPresets && <HeroPresetPicker name={name as "hero_image" | "card_image"} />}
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
