"use client";
import { useFormContext, useFieldArray } from "react-hook-form";
import { X, Plus } from "lucide-react";
import { ImageUploader } from "@/components/admin/ImageUploader/ImageUploader";
import { Input } from "@/components/admin/Input/Input";
import { getPublicUrl } from "@/lib/supabase/storage";

interface GalleryFormShape {
  gallery: Array<{ url: string; label: string }>;
}

interface GalleryGridProps {
  folder: string;
  itemLabel?: string;
  heading?: string;
}

export function GalleryGrid({ folder, itemLabel = "Image", heading = "Gallery" }: GalleryGridProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { control, watch, setValue, register } = useFormContext<GalleryFormShape>() as any;
  const { fields, append, remove } = useFieldArray({ control, name: "gallery" });
  const gallery = watch("gallery") as Array<{ url: string; label: string }>;

  return (
    <div>
      <p className="font-mono text-[11px] tracking-[0.22em] uppercase text-muted font-medium mb-5">{heading}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {fields.map((field: { id: string }, i: number) => {
          const url = gallery[i]?.url ?? "";
          const previewUrl = url ? getPublicUrl(url) : null;
          return (
            <div key={field.id} className="border border-rule p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-muted">
                  {itemLabel} {i + 1}
                </span>
                <button
                  type="button"
                  onClick={() => remove(i)}
                  className="text-ink-soft hover:text-terracotta transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
              {previewUrl ? (
                <div className="relative aspect-4/3 border border-rule overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={previewUrl} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setValue(`gallery.${i}.url`, "", { shouldDirty: true })}
                    className="absolute top-1 right-1 w-6 h-6 bg-ink/70 text-cream flex items-center justify-center text-sm hover:bg-terracotta transition-colors"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <ImageUploader
                  value={null}
                  onChange={(p) => { if (p) setValue(`gallery.${i}.url`, p, { shouldDirty: true }); }}
                  folder={folder}
                  aspectRatio="4/3"
                />
              )}
              <Input
                {...register(`gallery.${i}.url`)}
                placeholder="Or paste URL…"
                />
              <div className="space-y-1">
                <label className="block font-mono text-[10px] tracking-[0.18em] uppercase text-muted">
                  Tag text
                </label>
                <Input
                  {...register(`gallery.${i}.label`)}
                  placeholder="e.g. Bedroom, Old Town… (blank hides the tag)"
                />
              </div>
            </div>
          );
        })}
        <div
          className="border border-dashed border-ochre/40 flex items-center justify-center min-h-40 cursor-pointer hover:border-ochre transition-colors"
          onClick={() => append({ url: "", label: "" })}
        >
          <div className="flex flex-col items-center gap-2 text-muted">
            <Plus size={24} />
            <span className="font-mono text-[10px] tracking-[0.2em] uppercase">Add {itemLabel.toLowerCase()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
