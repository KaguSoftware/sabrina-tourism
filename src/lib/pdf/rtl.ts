// Fixes Arabic rendering for react-pdf by:
// 1. Reshaping (joining letters into correct contextual forms via arabic-reshaper)
// 2. Reversing word order so RTL reads correctly under a renderer that lays out
//    chars left-to-right (matches the strategy PremadePackagePDF has been using).
//
// The npm `arabic-reshaper` package exports `convertArabic`, not `reshape` —
// prefer convertArabic so letters actually join. Without this the file falls
// through to word-only reversal and Arabic letters render in their isolated
// (gappy) presentation forms.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const arabicReshaper = require("arabic-reshaper");

const reshaperModule = arabicReshaper.default ?? arabicReshaper;
const reshape: ((s: string) => string) | null =
  typeof reshaperModule.convertArabic === "function"
    ? reshaperModule.convertArabic
    : typeof reshaperModule.reshape === "function"
      ? reshaperModule.reshape
      : null;

export function visualRTL(text: string): string {
  if (!text) return text;

  return text
    .split("\n")
    .map((line) => {
      // Reshape contextually so multi-letter Arabic words join up; intra-word
      // letter order is preserved so the contextual forms stay valid.
      const joined = reshape ? reshape(line) : line;
      // Then word-reverse — same as before — so RTL reading order is correct.
      return joined.split(" ").reverse().join(" ");
    })
    .join("\n");
}
