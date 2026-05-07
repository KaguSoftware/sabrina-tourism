"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Sparkles } from "lucide-react";
import { translateContentBatch, type ContentLocale } from "@/lib/translations/ai";
import { LOCALES as ALL_LOCALES, LOCALE_LABELS as ALL_LABELS, LOCALE_NAMES, isRTL } from "@/i18n/locales";

const LOCALES = ALL_LOCALES.filter((l) => l !== "en") as ContentLocale[];
const LOCALE_SHORT = ALL_LABELS as Record<ContentLocale, string>;
const LOCALE_LABELS = LOCALE_NAMES as Record<ContentLocale, string>;

export interface TranslatableField {
  key: string;
  label: string;
  englishValue: string;
  multiline?: boolean;
}

export interface TranslationsState {
  [fieldKey: string]: Record<ContentLocale, string>;
}

interface Props {
  fields: TranslatableField[];
  translations: TranslationsState;
  onChange: (next: TranslationsState) => void;
  context: string;
}

export function ContentTranslationsTab({ fields, translations, onChange, context }: Props) {
  const [activeLocale, setActiveLocale] = useState<ContentLocale>("tr");
  const [translating, setTranslating] = useState(false);

  function getVal(fieldKey: string, locale: ContentLocale): string {
    return translations[fieldKey]?.[locale] ?? "";
  }

  function setVal(fieldKey: string, locale: ContentLocale, value: string) {
    onChange({
      ...translations,
      [fieldKey]: {
        ...(translations[fieldKey] ?? {}),
        [locale]: value,
      } as Record<ContentLocale, string>,
    });
  }

  async function handleTranslateAll() {
    const englishFields: Record<string, string> = {};
    for (const f of fields) {
      if (f.englishValue?.trim()) englishFields[f.key] = f.englishValue;
    }
    if (Object.keys(englishFields).length === 0) {
      toast.error("Fill in English content first");
      return;
    }

    setTranslating(true);
    try {
      const { result, error } = await translateContentBatch(englishFields, context);
      if (error) { toast.error(error); return; }
      if (!result) return;

      const next = { ...translations };
      for (const [key, localeMap] of Object.entries(result)) {
        next[key] = Object.fromEntries(
          LOCALES.map((l) => [l, localeMap[l] ?? ""])
        ) as Record<ContentLocale, string>;
      }
      onChange(next);
      toast.success(`Translated all fields to ${LOCALE_LABELS[activeLocale]} (and all other locales)`);
    } finally {
      setTranslating(false);
    }
  }

  const missingCount = fields.filter((f) => !getVal(f.key, activeLocale)).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
        <div>
          <p className="font-mono text-[11px] tracking-[0.22em] uppercase text-muted mb-1">Content translations</p>
          {missingCount > 0 && (
            <p className="font-mono text-[10px] tracking-[0.14em] text-terracotta">
              {missingCount} field{missingCount > 1 ? "s" : ""} missing in {LOCALE_SHORT[activeLocale]}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={handleTranslateAll}
          disabled={translating}
          className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.16em] uppercase px-4 py-2.5 border border-ochre text-ochre hover:bg-ochre/10 transition-colors duration-150 disabled:opacity-50 self-start sm:self-auto"
        >
          <Sparkles size={13} />
          {translating ? "Translating all fields…" : "Translate all with AI"}
        </button>
      </div>

      {/* Locale tabs */}
      <div className="flex gap-1 border-b border-rule pb-0">
        {LOCALES.map((loc) => {
          const missing = fields.filter((f) => !getVal(f.key, loc)).length;
          return (
            <button
              key={loc}
              type="button"
              onClick={() => setActiveLocale(loc)}
              className={`font-mono text-[11px] tracking-[0.16em] uppercase px-4 py-2 border-b-2 transition-colors duration-150 flex items-center gap-1.5 ${
                activeLocale === loc
                  ? "border-ochre text-ink font-bold"
                  : "border-transparent text-ink-soft hover:text-ink"
              }`}
            >
              {LOCALE_SHORT[loc]}
              {missing > 0 && (
                <span className="w-1.5 h-1.5 rounded-full bg-terracotta shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {/* Fields */}
      <div className="space-y-5">
        {fields.map((field) => {
          const enVal = field.englishValue;
          const translated = getVal(field.key, activeLocale);
          const isEmpty = !translated;

          return (
            <div key={field.key} className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-5 border-b border-rule/50 last:border-0 last:pb-0">
              {/* English reference */}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-muted">{field.label}</p>
                  <span className="font-mono text-[9px] tracking-[0.14em] uppercase text-muted bg-cream-deep border border-rule px-1.5 py-0.5">EN</span>
                </div>
                <div className={`text-[13px] text-ink-soft leading-[1.6] bg-cream border border-rule px-3 py-2 min-h-10 ${field.multiline ? "whitespace-pre-wrap" : ""}`}>
                  {enVal || <span className="text-muted italic text-[12px]">No English value yet</span>}
                </div>
              </div>

              {/* Translation */}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-muted">{field.label}</p>
                  <span className={`font-mono text-[9px] tracking-[0.14em] uppercase px-1.5 py-0.5 border ${
                    isEmpty ? "text-terracotta border-terracotta/40 bg-terracotta/5" : "text-ochre border-ochre/40 bg-ochre/5"
                  }`}>
                    {LOCALE_SHORT[activeLocale]}
                    {isEmpty && " · missing"}
                  </span>
                </div>
                {field.multiline ? (
                  <textarea
                    value={translated}
                    onChange={(e) => setVal(field.key, activeLocale, e.target.value)}
                    rows={4}
                    dir={isRTL(activeLocale) ? "rtl" : "ltr"}
                    className="w-full text-[13px] text-ink leading-[1.6] bg-cream border border-rule px-3 py-2 resize-y focus:outline-none focus:border-ochre transition-colors duration-150"
                  />
                ) : (
                  <input
                    type="text"
                    value={translated}
                    onChange={(e) => setVal(field.key, activeLocale, e.target.value)}
                    dir={isRTL(activeLocale) ? "rtl" : "ltr"}
                    className="w-full text-[13px] text-ink bg-cream border border-rule px-3 py-2 focus:outline-none focus:border-ochre transition-colors duration-150 h-10"
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
