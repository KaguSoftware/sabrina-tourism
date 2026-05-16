"use client";
import { useState } from "react";
import { toast } from "sonner";
import { ContentTranslationsTab, type TranslatableField, type TranslationsState } from "@/components/admin/ContentTranslationsTab/ContentTranslationsTab";
import { saveSiteContentTranslations } from "@/lib/translations/content-actions";

interface Props {
  contentKey: string;
  fields: TranslatableField[];
  initialTranslations: TranslationsState;
}

export function SiteContentTranslationsTab({ contentKey, fields, initialTranslations }: Props) {
  const [translations, setTranslations] = useState<TranslationsState>(initialTranslations);

  async function handleSave(next: TranslationsState) {
    const { error } = await saveSiteContentTranslations(contentKey, next);
    if (error) toast.error(error);
  }

  return (
    <ContentTranslationsTab
      fields={fields}
      translations={translations}
      onChange={setTranslations}
      context={`Site content: ${contentKey}`}
      onSave={handleSave}
    />
  );
}
