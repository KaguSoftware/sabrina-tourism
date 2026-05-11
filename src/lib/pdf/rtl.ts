// Fixes Arabic rendering for react-pdf by:
// 1. Reshaping (joining letters into correct contextual forms via arabic-reshaper)
// 2. Adding a hair space ( ) to prevent final dot-shift
// 3. Reversing characters (fixing visual order since react-pdf's bidi engine is broken)
// eslint-disable-next-line @typescript-eslint/no-require-imports
const arabicReshaper = require("arabic-reshaper");

const reshaper = arabicReshaper.default ?? arabicReshaper;

export function visualRTL(text: string): string {
  if (!text) return text;

  if (typeof reshaper.reshape !== "function") {
    // Fallback: word-order reversal only
    return text
      .split("\n")
      .map((line) => line.split(" ").reverse().join(" "))
      .join("\n");
  }

  return text
    .split("\n")
    .map((line) => {
      const reshaped = reshaper.reshape(line);
      return (reshaped + " ").split("").reverse().join("");
    })
    .join("\n");
}
