"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Save } from "lucide-react";
import { ContentTranslationsTab, type TranslatableField, type TranslationsState } from "@/components/admin/ContentTranslationsTab/ContentTranslationsTab";
import { saveDailyTranslations } from "@/lib/translations/content-actions";
import type { DailyFormValues } from "@/app/admin/(authed)/daily/[id]/schema";

interface Props {
  pkgId: string;
  formValues: DailyFormValues;
  initialTranslations: TranslationsState;
}

export function DailyTranslationsTab({ pkgId, formValues, initialTranslations }: Props) {
  const [translations, setTranslations] = useState<TranslationsState>(initialTranslations);
  const [saving, setSaving] = useState(false);

  const fields: TranslatableField[] = [
    { key: "name", label: "Tour name", englishValue: formValues.name },
    { key: "short_description", label: "Short description", englishValue: formValues.short_description, multiline: true },
    ...formValues.stops.flatMap((stop, i) => [
      { key: `stop_${i}_place`, label: `Stop ${i + 1} — place`, englishValue: stop.place },
      ...(stop.description ? [{ key: `stop_${i}_description`, label: `Stop ${i + 1} — description`, englishValue: stop.description, multiline: true }] : []),
    ]),
    ...formValues.included.map((item, i) => ({
      key: `included_${i}`,
      label: `Included item ${i + 1}`,
      englishValue: item.text,
    })),
  ];

  async function handleSave() {
    setSaving(true);
    try {
      const { error } = await saveDailyTranslations(pkgId, translations);
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
        context={`Daily tour package: "${formValues.name}"`}
      />
    </div>
  );
}
