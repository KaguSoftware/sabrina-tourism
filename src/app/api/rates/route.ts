import { NextResponse } from "next/server";
import { CURRENCIES, type Currency } from "@/i18n/currencies";

const SYMBOLS = CURRENCIES.filter((c) => c !== "EUR").join(",");
const FRANKFURTER_ENDPOINT =
  process.env.EXCHANGE_RATES_URL ?? "https://api.frankfurter.dev/v1/latest";
const FALLBACK_ENDPOINT =
  process.env.EXCHANGE_RATES_FALLBACK_URL ?? "https://open.er-api.com/v6/latest/EUR";

export const revalidate = 43200; // 12 hours

interface FrankfurterResponse {
  base: string;
  date: string;
  rates: Record<string, number>;
}

interface OpenErApiResponse {
  result: string;
  base_code: string;
  rates: Record<string, number>;
}

async function fetchFrankfurter(): Promise<Record<string, number>> {
  const res = await fetch(`${FRANKFURTER_ENDPOINT}?base=EUR&symbols=${SYMBOLS}`, {
    next: { revalidate: 43200 },
  });
  if (!res.ok) throw new Error(`frankfurter ${res.status}`);
  const data = (await res.json()) as FrankfurterResponse;
  return data.rates ?? {};
}

async function fetchFallback(): Promise<Record<string, number>> {
  const res = await fetch(FALLBACK_ENDPOINT, { next: { revalidate: 43200 } });
  if (!res.ok) throw new Error(`fallback ${res.status}`);
  const data = (await res.json()) as OpenErApiResponse;
  return data.rates ?? {};
}

function pickNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) && value > 0 ? value : null;
}

export async function GET() {
  const fetchedAt = new Date().toISOString();

  const [primary, fallback] = await Promise.allSettled([fetchFrankfurter(), fetchFallback()]);
  const primaryRates = primary.status === "fulfilled" ? primary.value : {};
  const fallbackRates = fallback.status === "fulfilled" ? fallback.value : {};

  const rates: Record<Currency, number> = { EUR: 1 } as Record<Currency, number>;
  for (const c of CURRENCIES) {
    if (c === "EUR") continue;
    const v = pickNumber(primaryRates[c]) ?? pickNumber(fallbackRates[c]);
    if (v !== null) rates[c] = v;
  }

  const hasAny = Object.keys(rates).length > 1;
  if (!hasAny) {
    return NextResponse.json(
      { base: "EUR", rates, fetchedAt, stale: true },
      { status: 200 },
    );
  }

  return NextResponse.json({ base: "EUR", rates, fetchedAt, stale: false });
}
