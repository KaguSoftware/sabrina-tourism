"use client";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Globe } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/routing";
import { routing } from "@/i18n/routing";
import { LOCALE_LABELS } from "@/i18n/locales";

const LOCALE_FLAGS: Record<string, string> = {
  en: "🇬🇧",
  tr: "🇹🇷",
  ar: "🇸🇦",
  es: "🇪🇸",
  it: "🇮🇹",
  fr: "🇫🇷",
  de: "🇩🇪",
  ru: "🇷🇺",
  zh: "🇨🇳",
  ja: "🇯🇵",
};

function localeLabel(loc: string) {
  return LOCALE_LABELS[loc as keyof typeof LOCALE_LABELS] ?? loc.toUpperCase();
}

export function LanguageSwitcher({ transparent }: { transparent?: boolean }) {
  const locale = useLocale();
  const t = useTranslations("languageSwitcher");
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }

    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  function switchLocale(next: string) {
    if (next === locale) return;
    setOpen(false);
    router.push(pathname, { locale: next });
  }

  const currentLabel = localeLabel(locale);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={t("label")}
        className={`inline-flex items-center gap-2 py-1.5 font-mono text-[11px] tracking-[0.14em] uppercase transition-colors duration-200 ${
          transparent ? "text-cream/80 hover:text-cream" : "text-ink/65 hover:text-ink"
        }`}
      >
        <Globe size={15} strokeWidth={1.8} aria-hidden="true" />
        <span>{currentLabel}</span>
        <ChevronDown
          size={13}
          strokeWidth={1.8}
          aria-hidden="true"
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      <div
        className={`absolute top-full right-0 mt-3 min-w-28 border border-rule bg-cream shadow-[0_10px_34px_-10px_rgba(11,26,46,0.25)] transition-all duration-200 origin-top-right ${
          open ? "opacity-100 scale-y-100 pointer-events-auto" : "opacity-0 scale-y-95 pointer-events-none"
        }`}
        role="menu"
      >
        <div className="absolute -top-3 left-0 right-0 h-3" />
        {routing.locales.map((loc) => (
          <button
            key={loc}
            type="button"
            onClick={() => switchLocale(loc)}
            className={`flex w-full items-center gap-2 px-4 py-3 text-left font-mono text-[11px] tracking-[0.14em] uppercase transition-colors duration-150 border-b border-rule last:border-0 ${
              loc === locale
                ? "bg-cream-warm text-ochre font-semibold"
                : "text-ink hover:bg-cream-warm hover:text-ochre"
            }`}
            aria-label={t("switchTo", { locale: localeLabel(loc) })}
            aria-current={loc === locale ? "true" : undefined}
            role="menuitem"
          >
            <span className="text-[14px] leading-none" aria-hidden="true">
              {LOCALE_FLAGS[loc]}
            </span>
            <span>{localeLabel(loc)}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
