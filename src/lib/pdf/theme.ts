// Exact site design tokens from src/styles/globals.css
export const C = {
  cream:      "#f5ede0",
  creamDeep:  "#e8dac8",
  ink:        "#1f1a14",
  inkSoft:    "#4a4036",
  navy:       "#0b1a2e",
  navySoft:   "#162b47",
  ochre:      "#c99a3f",
  gold:       "#b8893d",
  terracotta: "#c46b4f",
  tealDeep:   "#1b4d5c",
  rule:       "#d6cab5",
} as const;

// Default Latin fonts
export const F = {
  display: "Fraunces",
  body:    "Inter",
  mono:    "JetBrains Mono",
} as const;

export const MARGIN = 52;

export interface FontSet {
  display: string;
  body: string;
  mono: string;
  rtl: boolean;
  /** Scale factor applied to large display sizes (default 1.0) */
  displayScale: number;
}

/** Turkish-aware toUpperCase — data (city/region names) is always Turkish, so İ/I is always correct. */
export function upper(text: string): string {
  return text.toLocaleUpperCase("tr");
}

// Returns the right font set for a given locale.
// Arabic and CJK scripts need dedicated fonts — Latin fonts can't render them.
export function getFontsForLocale(locale: string): FontSet {
  switch (locale) {
    case "ar":
      return { display: "IBMPlexSansArabic", body: "IBMPlexSansArabic", mono: "IBMPlexSansArabic", rtl: true, displayScale: 0.65 };
    case "ja":
      return { display: "Noto Sans JP", body: "Noto Sans JP", mono: "Noto Sans JP", rtl: false, displayScale: 0.85 };
    case "zh":
      return { display: "Noto Sans SC", body: "Noto Sans SC", mono: "Noto Sans SC", rtl: false, displayScale: 0.85 };
    case "ru":
      return { display: "Noto Sans", body: "Noto Sans", mono: "JetBrains Mono", rtl: false, displayScale: 1.0 };
    default:
      return { display: "Fraunces", body: "Inter", mono: "JetBrains Mono", rtl: false, displayScale: 1.0 };
  }
}
