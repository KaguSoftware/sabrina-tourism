import { CURRENCIES, type Currency } from "@/i18n/currencies";
import type { Rates } from "@/lib/currency/format";

export const RATES_STORAGE_KEY = "sabrina:rates:v1";
/** Cached rates older than this are shown as "approximate" but still used. */
export const RATES_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

function pickNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) && value > 0 ? value : null;
}

/**
 * Merge two rate tables (primary wins, fallback fills the gaps) into EUR-based
 * rates for the supported currencies. Invalid or missing values are skipped, so
 * a currency with no rate simply renders in EUR.
 */
export function mergeRates(
  primary: Record<string, unknown>,
  fallback: Record<string, unknown>,
): Rates {
  const rates: Rates = { EUR: 1 };
  for (const c of CURRENCIES as readonly Currency[]) {
    if (c === "EUR") continue;
    const v = pickNumber(primary[c]) ?? pickNumber(fallback[c]);
    if (v !== null) rates[c] = v;
  }
  return rates;
}

export function hasForeignRates(rates: Rates): boolean {
  return Object.keys(rates).some((k) => k !== "EUR" && pickNumber(rates[k as Currency]) !== null);
}

export interface CachedRates {
  rates: Rates;
  fetchedAt: string;
}

/** Parse a stored value defensively; returns null for anything unusable. */
export function parseCachedRates(raw: string | null, now: number = Date.now()): CachedRates | null {
  if (!raw) return null;
  try {
    const data = JSON.parse(raw) as { rates?: Record<string, unknown>; fetchedAt?: unknown };
    if (!data || typeof data.fetchedAt !== "string" || !data.rates) return null;
    const at = Date.parse(data.fetchedAt);
    if (!Number.isFinite(at) || at > now + 60_000) return null;
    const rates = mergeRates(data.rates, {});
    if (!hasForeignRates(rates)) return null;
    return { rates, fetchedAt: data.fetchedAt };
  } catch {
    return null;
  }
}

export function isFresh(fetchedAt: string, now: number = Date.now()): boolean {
  const at = Date.parse(fetchedAt);
  return Number.isFinite(at) && now - at <= RATES_MAX_AGE_MS;
}
