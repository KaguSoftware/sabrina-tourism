"use client";
import { useFormContext, useFieldArray } from "react-hook-form";
import { ListEditor } from "@/components/admin/PackageEditor/primitives";
import type { HotelFormValues } from "@/app/admin/(authed)/hotels/[id]/schema";

export function AmenitiesTab() {
  const { control, watch, setValue } = useFormContext<HotelFormValues>();
  const { fields, append, remove } = useFieldArray({ control, name: "amenities" });
  const amenities = watch("amenities");

  return (
    <div className="max-w-xl">
      <p className="font-sans text-[14px] text-ink-soft mb-6 leading-relaxed">
        Add the unique highlights guests will see on the hotel detail page — views, special facilities, signature experiences. Keep each entry concise (3–5 words).
      </p>
      <ListEditor
        items={amenities}
        onAdd={() => append({ text: "" })}
        onRemove={remove}
        onChange={(i, val) => setValue(`amenities.${i}.text`, val)}
        placeholder="e.g. Private Hammam"
      />
    </div>
  );
}
