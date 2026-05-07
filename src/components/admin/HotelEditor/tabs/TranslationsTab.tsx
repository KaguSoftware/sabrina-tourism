"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Save } from "lucide-react";
import { ContentTranslationsTab, type TranslatableField, type TranslationsState } from "@/components/admin/ContentTranslationsTab/ContentTranslationsTab";
import { saveHotelTranslations } from "@/lib/translations/content-actions";
import type { HotelFormValues } from "@/app/admin/(authed)/hotels/[id]/schema";

interface Props {
  hotelId: string;
  formValues: HotelFormValues;
  initialTranslations: TranslationsState;
}

export function HotelTranslationsTab({ hotelId, formValues, initialTranslations }: Props) {
  const [translations, setTranslations] = useState<TranslationsState>(initialTranslations);
  const [saving, setSaving] = useState(false);

  const fields: TranslatableField[] = [
    { key: "name", label: "Hotel name", englishValue: formValues.name },
    { key: "location", label: "Location", englishValue: formValues.location },
    { key: "tag_a", label: "Tag A", englishValue: formValues.tag_a },
    { key: "tag_b", label: "Tag B", englishValue: formValues.tag_b },
    { key: "description", label: "Short description", englishValue: formValues.description, multiline: true },
    { key: "long_description", label: "Long description", englishValue: formValues.long_description, multiline: true },
    ...formValues.amenities.map((a, i) => ({
      key: `amenity_${i}`,
      label: `Amenity ${i + 1}`,
      englishValue: a.text,
    })),
    ...formValues.room_types.flatMap((room, i) => [
      { key: `room_${i}_name`, label: `Room ${i + 1} — name`, englishValue: room.name },
      { key: `room_${i}_beds`, label: `Room ${i + 1} — beds`, englishValue: room.beds },
      { key: `room_${i}_size`, label: `Room ${i + 1} — size`, englishValue: room.size },
      ...(room.highlights.length > 0
        ? [{ key: `room_${i}_highlights`, label: `Room ${i + 1} — highlights`, englishValue: room.highlights.join("\n"), multiline: true }]
        : []),
    ]),
  ];

  async function handleSave() {
    setSaving(true);
    try {
      const { error } = await saveHotelTranslations(hotelId, translations);
      if (error) toast.error(error);
      else toast.success("Translations saved.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 font-mono text-[11px] tracking-[0.16em] uppercase font-medium bg-ochre text-navy hover:bg-gold transition-all duration-200 disabled:opacity-60"
        >
          <Save size={13} />
          {saving ? "Saving…" : "Save translations"}
        </button>
      </div>
      <ContentTranslationsTab
        fields={fields}
        translations={translations}
        onChange={setTranslations}
        context={`Hotel: "${formValues.name}", ${formValues.region}, Turkey`}
      />
    </div>
  );
}
