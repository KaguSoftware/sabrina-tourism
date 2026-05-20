/**
 * Format an ISO date string (`YYYY-MM-DD`) for display in a given locale.
 *
 * The repo previously had four near-identical inline copies — they differed
 * only in which `Intl.DateTimeFormat` parts they included, so we expose those
 * as a `style` enum instead of forking the function per caller.
 *
 * `T00:00:00` is appended because parsing a bare `YYYY-MM-DD` is treated as
 * UTC midnight by `new Date()`, which shifts the date back a day in negative
 * UTC offsets. Appending the time makes it a local-time parse and matches
 * what users expect (e.g. "2026-05-20" → "20 May 2026", never "19 May").
 */
export type DateStyle = "full" | "long" | "short";

export function formatDate(iso: string, locale: string, style: DateStyle = "long"): string {
  if (!iso) return "—";
  // Accept both `YYYY-MM-DD` and any other string Date() can parse.
  const d = iso.length === 10 ? new Date(iso + "T00:00:00") : new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;

  const options: Intl.DateTimeFormatOptions =
    style === "full"
      ? { weekday: "long", day: "numeric", month: "long", year: "numeric" }
      : style === "short"
        ? { day: "numeric", month: "long" }
        : { day: "numeric", month: "long", year: "numeric" };

  return d.toLocaleDateString(locale, options);
}
