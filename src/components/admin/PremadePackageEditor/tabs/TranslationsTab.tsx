"use client";

import { useState } from "react";
import { toast } from "sonner";

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
    ...formValues.tiers.flatMap((tier, i) => [
      { key: `tier_${i}_tier_name`, label: `${tier.tier_name} tier — name`, englishValue: tier.tier_name },
      { key: `tier_${i}_vehicle_class`, label: `${tier.tier_name} tier — vehicle`, englishValue: tier.vehicle_class },
      { key: `tier_${i}_group_size`, label: `${tier.tier_name} tier — group size`, englishValue: tier.group_size },
      { key: `tier_${i}_meals_included`, label: `${tier.tier_name} tier — meals`, englishValue: tier.meals_included },
      ...(tier.guide_languages.length > 0
        ? [{ key: `tier_${i}_guide_languages`, label: `${tier.tier_name} tier — guide languages`, englishValue: tier.guide_languages.join("\n"), multiline: true }]
        : []),
      ...(tier.highlights.length > 0
        ? [{ key: `tier_${i}_highlights`, label: `${tier.tier_name} tier — highlights`, englishValue: tier.highlights.join("\n"), multiline: true }]
        : []),
    ]),
    ...formValues.included.map((item, i) => ({ key: `inclusion_included_${i}`, label: `Included: ${item.text.slice(0, 40)}`, englishValue: item.text })),
    ...formValues.not_included.map((item, i) => ({ key: `inclusion_not_included_${i}`, label: `Not included: ${item.text.slice(0, 40)}`, englishValue: item.text })),
  ];

  async function handleSave(next: TranslationsState) {
    const { error } = await savePremadeTranslations(pkgId, next);
    if (error) toast.error(error);
  }

  return (
    <ContentTranslationsTab
      fields={fields}
      translations={translations}
      onChange={setTranslations}
      context={`Group tour: "${formValues.name}"`}
      onSave={handleSave}
    />
  );
}
