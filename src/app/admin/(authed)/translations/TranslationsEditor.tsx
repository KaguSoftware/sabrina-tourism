"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import { Sparkles, Save, ChevronDown, ChevronUp } from "lucide-react";
import { saveMessages, translateWithAI } from "./actions";

import { LOCALES, LOCALE_LABELS, isRTL, type Locale } from "@/i18n/locales";

type Messages = Record<Locale, Record<string, unknown>>;

// Flatten nested object to dot-notation keys: { "nav.home": "Home" }
function flatten(obj: Record<string, unknown>, prefix = ""): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v !== null && typeof v === "object" && !Array.isArray(v)) {
      Object.assign(result, flatten(v as Record<string, unknown>, key));
    } else {
      result[key] = String(v ?? "");
    }
  }
  return result;
}

// Set a value in a nested object by dot-notation path
function setNested(obj: Record<string, unknown>, dotKey: string, value: string): Record<string, unknown> {
  const clone = structuredClone(obj);
  const parts = dotKey.split(".");
  let cursor: Record<string, unknown> = clone;
  for (let i = 0; i < parts.length - 1; i++) {
    if (typeof cursor[parts[i]] !== "object") cursor[parts[i]] = {};
    cursor = cursor[parts[i]] as Record<string, unknown>;
  }
  cursor[parts[parts.length - 1]] = value;
  return clone;
}

// Get top-level namespace keys
function getNamespaces(messages: Messages): string[] {
  return Object.keys(messages.en ?? {});
}

function getNamespaceFlat(messages: Messages, ns: string): Record<Locale, Record<string, string>> {
  const result = {} as Record<Locale, Record<string, string>>;
  for (const locale of LOCALES) {
    const nsData = (messages[locale]?.[ns] ?? {}) as Record<string, unknown>;
    result[locale] = flatten(nsData);
  }
  return result;
}

interface NSEditorProps {
  ns: string;
  messages: Messages;
  onMessagesChange: (next: Messages) => void;
}

function NamespaceEditor({ ns, messages, onMessagesChange }: NSEditorProps) {
  const [open, setOpen] = useState(false);
  const [activeLocale, setActiveLocale] = useState<Locale>("tr");
  const [translating, setTranslating] = useState(false);
  const [saving, setSaving] = useState(false);

  const nsFlat = getNamespaceFlat(messages, ns);
  const enKeys = Object.keys(nsFlat.en);

  function handleChange(key: string, value: string) {
    const fullKey = `${ns}.${key}`;
    const updated = setNested(
      messages[activeLocale] as Record<string, unknown>,
      fullKey,
      value
    );
    onMessagesChange({ ...messages, [activeLocale]: updated });
  }

  async function handleTranslate() {
    setTranslating(true);
    try {
      // Translate current locale using EN as source
      const { result, error } = await translateWithAI(ns, nsFlat.en, activeLocale);
      if (error) { toast.error(error); return; }
      if (!result) return;

      // Merge translated keys back into the locale messages
      let updated = messages[activeLocale] as Record<string, unknown>;
      for (const [k, v] of Object.entries(result)) {
        updated = setNested(updated, `${ns}.${k}`, v);
      }
      onMessagesChange({ ...messages, [activeLocale]: updated });
      toast.success(`Translated "${ns}" to ${LOCALE_LABELS[activeLocale]}`);
    } finally {
      setTranslating(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    try {
      const { error } = await saveMessages(
        activeLocale,
        messages[activeLocale] as Record<string, unknown>
      );
      if (error) toast.error(error);
      else toast.success(`Saved ${LOCALE_LABELS[activeLocale]} translations`);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className={`border bg-cream-warm ${open ? "border-rule border-l-2 border-l-ochre" : "border-rule"}`}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-cream-deep transition-colors duration-150"
      >
        <div>
          <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-muted mb-0.5">Namespace</p>
          <p className="font-display text-[18px] font-semibold tracking-tight text-ink">{ns}</p>
          <p className="font-mono text-[10px] tracking-[0.14em] text-muted mt-0.5">{enKeys.length} keys</p>
        </div>
        {open ? <ChevronUp size={16} className="text-ochre flex-shrink-0" /> : <ChevronDown size={16} className="text-ochre flex-shrink-0" />}
      </button>

      {open && (
        <div className="px-6 pb-8 pt-4 border-t border-rule space-y-5">
          {/* Locale tabs */}
          <div className="flex items-center gap-1 border-b border-rule pb-3">
            {LOCALES.filter((l) => l !== "en").map((loc) => (
              <button
                key={loc}
                type="button"
                onClick={() => setActiveLocale(loc)}
                className={`font-mono text-[11px] tracking-[0.16em] uppercase px-3 py-1.5 border transition-colors duration-150 ${
                  activeLocale === loc
                    ? "border-ochre bg-ochre/10 text-ink font-bold"
                    : "border-rule text-ink-soft hover:border-ochre/50"
                }`}
              >
                {LOCALE_LABELS[loc]}
              </button>
            ))}
            <div className="ml-auto flex gap-2">
              <button
                type="button"
                onClick={handleTranslate}
                disabled={translating}
                className="inline-flex items-center gap-1.5 font-mono text-[10px] tracking-[0.16em] uppercase px-3 py-1.5 border border-ochre text-ochre hover:bg-ochre/10 transition-colors duration-150 disabled:opacity-50"
              >
                <Sparkles size={12} />
                {translating ? "Translating…" : "Translate with AI"}
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center gap-1.5 font-mono text-[10px] tracking-[0.16em] uppercase px-3 py-1.5 bg-navy text-ochre hover:bg-navy/80 transition-colors duration-150 disabled:opacity-50"
              >
                <Save size={12} />
                {saving ? "Saving…" : "Save"}
              </button>
            </div>
          </div>

          {/* Keys table */}
          <div className="space-y-3">
            {enKeys.map((key) => (
              <div key={key} className="grid grid-cols-[1fr_1fr] gap-4 border-b border-rule/50 pb-3 last:border-0 last:pb-0">
                <div className="space-y-1">
                  <p className="font-mono text-[9px] tracking-[0.18em] uppercase text-muted">{key}</p>
                  <p className="text-[13px] text-ink-soft leading-[1.5] bg-cream border border-rule px-3 py-2 min-h-[38px]">
                    {nsFlat.en[key] || <span className="text-muted italic">—</span>}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="font-mono text-[9px] tracking-[0.18em] uppercase text-muted">
                    {LOCALE_LABELS[activeLocale]}
                    {!nsFlat[activeLocale][key] && (
                      <span className="ml-1 text-terracotta">missing</span>
                    )}
                  </p>
                  <textarea
                    value={nsFlat[activeLocale][key] ?? ""}
                    onChange={(e) => handleChange(key, e.target.value)}
                    rows={1}
                    dir={isRTL(activeLocale) ? "rtl" : "ltr"}
                    className="w-full text-[13px] text-ink leading-[1.5] bg-cream border border-rule px-3 py-2 min-h-[38px] resize-y focus:outline-none focus:border-ochre transition-colors duration-150"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

interface Props {
  initialMessages: Messages;
}

export function TranslationsEditor({ initialMessages }: Props) {
  const [messages, setMessages] = useState<Messages>(initialMessages);
  const namespaces = getNamespaces(messages);

  const handleChange = useCallback((next: Messages) => setMessages(next), []);

  return (
    <div className="space-y-3">
      <div className="bg-ochre/10 border border-ochre/30 px-5 py-4 mb-6">
        <p className="font-mono text-[11px] tracking-[0.14em] uppercase text-ink mb-1">How this works</p>
        <p className="text-[13px] text-ink-soft leading-[1.6]">
          Select a language tab, edit fields or click <strong>Translate with AI</strong> to auto-fill from English, then hit <strong>Save</strong> to write the file. Changes go live on next page load.
        </p>
      </div>
      {namespaces.map((ns) => (
        <NamespaceEditor
          key={ns}
          ns={ns}
          messages={messages}
          onMessagesChange={handleChange}
        />
      ))}
    </div>
  );
}
