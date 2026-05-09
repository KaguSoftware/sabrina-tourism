// Exact site design tokens from src/styles/globals.css
export const C = {
  cream:      "#f5ede0",   // --color-cream (light bg)
  creamDeep:  "#e8dac8",   // --color-cream-deep (darker paper)
  ink:        "#1f1a14",   // --color-ink
  inkSoft:    "#4a4036",   // --color-ink-soft
  navy:       "#0b1a2e",   // --color-navy
  navySoft:   "#162b47",   // --color-navy-soft
  ochre:      "#c99a3f",   // --color-ochre (gold accent)
  gold:       "#b8893d",   // --color-gold
  terracotta: "#c46b4f",   // --color-terracotta
  tealDeep:   "#1b4d5c",   // --color-teal-deep
  rule:       "#d6cab5",   // --color-rule
} as const;

export const F = {
  display: "Fraunces",      // site's --font-fraunces
  body:    "Inter",         // site's --font-inter
  mono:    "JetBrains Mono",// site's --font-mono
} as const;

export const MARGIN = 52;
