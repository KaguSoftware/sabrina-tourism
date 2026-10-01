import { NextResponse } from "next/server";
import { CURRENCIES } from "@/i18n/currencies";
import type { Rates } from "@/lib/currency/format";
import { hasForeignRates, mergeRates } from "@/lib/currency/rates";

const SYMBOLS = CURRENCIES.filter((c) => c !== "EUR").join(",");
const FRANKFURTER_ENDPOINT =
  process.env.EXCHANGE_RATES_URL ?? "https://api.frankfurter.dev/v1/latest";
const FALLBACK_ENDPOINT =
  process.env.EXCHANGE_RATES_FALLBACK_URL ?? "https://open.er-api.com/v6/latest/EUR";

// Always run on the server. We do our own caching below so that a failed
// upstream call is never stored for hours (it used to be, via the route-level
// `revalidate`, which left the currency menu on "rates unavailable").
export const dynamic = "force-dynamic";

const FRESH_MS = 12 * 60 * 60 * 1000; // good rates are reused for 12 hours
const RETRY_MS = 60 * 1000; // after a failure, try upstream again after a minute
const TIMEOUT_MS = 5000;

interface Snapshot {
  rates: Rates;
  fetchedAt: string;
}

// Survives between requests on a warm server instance. The browser keeps its
// own copy too (see CurrencyProvider), so one bad upstream call does not blank
// prices for visitors who already have rates.
let lastGood: Snapshot | null = null;
let lastAttempt = 0;

async function fetchJson(url: string): Promise<Record<string, unknown>> {
  const res = await fetch(url, { cache: "no-store", signal: AbortSignal.timeout(TIMEOUT_MS) });
  if (!res.ok) throw new Error(`${url} ${res.status}`);
  const data = (await res.json()) as { rates?: Record<string, unknown> };
  return data.rates ?? {};
}

async function refresh(): Promise<Snapshot | null> {
  const [primary, fallback] = await Promise.allSettled([
    fetchJson(`${FRANKFURTER_ENDPOINT}?base=EUR&symbols=${SYMBOLS}`),
    fetchJson(FALLBACK_ENDPOINT),
  ]);
  const rates = mergeRates(
    primary.status === "fulfilled" ? primary.value : {},
    fallback.status === "fulfilled" ? fallback.value : {},
  );
  if (!hasForeignRates(rates)) return null;
  return { rates, fetchedAt: new Date().toISOString() };
}

export async function GET() {
  const now = Date.now();
  const cacheIsFresh = lastGood !== null && now - Date.parse(lastGood.fetchedAt) < FRESH_MS;

  if (!cacheIsFresh && now - lastAttempt >= RETRY_MS) {
    lastAttempt = now;
    const next = await refresh();
    if (next) lastGood = next;
  }

  if (lastGood) {
    // Older than 12 hours means the refresh above failed: still usable, but flagged stale.
    const fresh = Date.now() - Date.parse(lastGood.fetchedAt) < FRESH_MS;
    return NextResponse.json(
      { base: "EUR", rates: lastGood.rates, fetchedAt: lastGood.fetchedAt, stale: !fresh },
      { headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=43200" } },
    );
  }

  // Nothing at all yet: EUR only, and tell caches not to remember this.
  return NextResponse.json(
    { base: "EUR", rates: { EUR: 1 }, fetchedAt: new Date(now).toISOString(), stale: true },
    { headers: { "Cache-Control": "no-store" } },
  );
}
