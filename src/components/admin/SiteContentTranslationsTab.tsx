"use client";
import { useState } from "react";
import { toast } from "sonner";
import { Save } from "lucide-react";
import { ContentTranslationsTab, type TranslatableField, type TranslationsState } from "@/components/admin/ContentTranslationsTab/ContentTranslationsTab";
import { saveSiteContentTranslations } from "@/lib/translations/content-actions";

interface Props {
  contentKey: string;
  fields: TranslatableField[];
  initialTranslations: TranslationsState;
}

export function SiteContentTranslationsTab({ contentKey, fields, initialTranslations }: Props) {
  const [translations, setTranslations] = useState<TranslationsState>(initialTranslations);
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    try {
      const { error } = await saveSiteContentTranslations(contentKey, translations);
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
        context={`Site content: ${contentKey}`}
      />
    </div>
  );
}
