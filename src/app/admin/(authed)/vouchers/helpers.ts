import type { VoucherPayload } from "./schema";

export const todayIso = () => new Date().toISOString().slice(0, 10);

/**
 * Latest DOB allowed = today minus 18 years. Used by the DOB picker as both
 * `max` (disables more recent days) and as the picker's initial cursor month
 * so the admin doesn't have to page back ~216 months from the current date.
 */
export function maxDobIso(): string {
  const d = new Date();
  d.setFullYear(d.getFullYear() - 18);
  return d.toISOString().slice(0, 10);
}

/** Whole calendar nights between two ISO dates. Returns 0 on malformed input. */
export function nightsBetween(startIso: string, endIso: string): number {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(startIso) || !/^\d{4}-\d{2}-\d{2}$/.test(endIso)) return 0;
  const s = new Date(startIso + "T00:00:00");
  const e = new Date(endIso + "T00:00:00");
  return Math.max(0, Math.round((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)));
}

/** Voucher-display date format. Always en-GB regardless of voucher locale. */
export function fmtDateForDisplay(iso: string): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return iso;
  return new Date(iso + "T00:00:00").toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function isCurrency(v: string | undefined | null): v is VoucherPayload["currency"] {
  return v === "EUR" || v === "USD" || v === "GBP" || v === "TRY";
}

/**
 * Field-path prefixes shown in the validation toast. e.g. an error on
 * `guests[2].name` surfaces as "Guest 3 — Name is required" instead of just
 * "Name is required" with no context as to which guest row is invalid.
 */
export function firstErrorMessage(errors: unknown, path: string[] = []): string | null {
  if (!errors || typeof errors !== "object") return null;
  for (const [key, value] of Object.entries(errors as Record<string, unknown>)) {
    if (!value || typeof value !== "object") continue;
    const node = value as { message?: string };
    if (typeof node.message === "string" && node.message.length > 0) {
      return formatErrorLabel([...path, key]) + node.message;
    }
    const nested = firstErrorMessage(value, [...path, key]);
    if (nested) return nested;
  }
  return null;
}

function formatErrorLabel(path: string[]): string {
  if (path.length === 0) return "";
  if (path[0] === "guests" && path.length >= 2) {
    const idx = Number(path[1]);
    if (Number.isFinite(idx)) return `Guest ${idx + 1} — `;
  }
  return "";
}
