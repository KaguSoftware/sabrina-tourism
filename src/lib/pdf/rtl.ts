// Arabic glyph reshaping for react-pdf.
//
// react-pdf renders glyphs at the positions it lays them out, char-by-char, in
// logical (source) order. Without contextual reshaping, each Arabic letter
// renders in its isolated form (with gaps between them).
//
// We use `arabic-reshaper`'s `convertArabic` to convert the logical-order
// string into Arabic Presentation Forms B — each letter gets its correct
// initial / medial / final contextual shape — so multi-letter words read as
// joined script. We DO NOT reverse word order: the chars stay in logical
// source order so they appear on the page in the same order as the source
// English, which is what we want for a left-to-right voucher layout.
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
  if (!text || !reshape) return text;
  return text.split("\n").map((line) => reshape(line)).join("\n");
}
