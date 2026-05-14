"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Save } from "lucide-react";
import { ContentTranslationsTab, type TranslatableField, type TranslationsState } from "@/components/admin/ContentTranslationsTab/ContentTranslationsTab";
import { savePremadeTranslations } from "@/lib/translations/content-actions";
import type { PremadeFormValues } from "@/app/admin/(authed)/fixed-dates/[id]/schema";

interface Props {
  pkgId: string;
  formValues: PremadeFormValues;
  initialTranslations: TranslationsState;
}

export function PremadeTranslationsTab({ pkgId, formValues, initialTranslations }: Props) {
  const [translations, setTranslations] = useState<TranslationsState>(initialTranslations);
  const [saving, setSaving] = useState(false);

  const fields: TranslatableField[] = [
    { key: "name", label: "Package name", englishValue: formValues.name },
    { key: "short_description", label: "Short description", englishValue: formValues.short_description, multiline: true },
    ...(formValues.overview ? [{ key: "overview", label: "Overview", englishValue: formValues.overview, multiline: true }] : []),
    ...(formValues.accommodation_name ? [{ key: "accommodation_name", label: "Accommodation name", englishValue: formValues.accommodation_name }] : []),
    ...(formValues.accommodation_description ? [{ key: "accommodation_description", label: "Accommodation description", englishValue: formValues.accommodation_description, multiline: true }] : []),
    ...formValues.itinerary.flatMap((day, i) => [
      { key: `day_${i}_title`, label: `Day ${day.day_number} — title`, englishValue: day.title },
      ...(day.description ? [{ key: `day_${i}_description`, label: `Day ${day.day_number} — description`, englishValue: day.description, multiline: true }] : []),
    ]),
    ...formValues.tiers.flatMap((tier, i) =>
      tier.highlights.length > 0
        ? [{ key: `tier_${i}_highlights`, label: `${tier.tier_name} tier — highlights`, englishValue: tier.highlights.join("\n"), multiline: true }]
        : []
    ),
    ...formValues.included.map((item, i) => ({ key: `inclusion_included_${i}`, label: `Included: ${item.text.slice(0, 40)}`, englishValue: item.text })),
    ...formValues.not_included.map((item, i) => ({ key: `inclusion_not_included_${i}`, label: `Not included: ${item.text.slice(0, 40)}`, englishValue: item.text })),
  ];

  async function handleSave() {
    setSaving(true);
    try {
      const { error } = await savePremadeTranslations(pkgId, translations);
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
        context={`Fixed-date group package: "${formValues.name}"`}
      />
    </div>
  );
}
