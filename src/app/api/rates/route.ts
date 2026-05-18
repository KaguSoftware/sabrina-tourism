import { NextResponse } from "next/server";
import { CURRENCIES, type Currency } from "@/i18n/currencies";

const SYMBOLS = CURRENCIES.filter((c) => c !== "EUR").join(",");
const ENDPOINT = process.env.EXCHANGE_RATES_URL ?? "https://api.frankfurter.dev/v1/latest";

export const revalidate = 43200; // 12 hours

interface FrankfurterResponse {
  base: string;
  date: string;
  rates: Record<string, number>;
}

export async function GET() {
  const fetchedAt = new Date().toISOString();
  try {
    const res = await fetch(`${ENDPOINT}?base=EUR&symbols=${SYMBOLS}`, {
      next: { revalidate: 43200 },
    });
    if (!res.ok) throw new Error(`rates upstream ${res.status}`);
    const data = (await res.json()) as FrankfurterResponse;
    const rates: Record<Currency, number> = { EUR: 1 } as Record<Currency, number>;
    for (const c of CURRENCIES) {
      if (c === "EUR") continue;
      const v = data.rates?.[c];
      if (typeof v === "number" && Number.isFinite(v) && v > 0) {
        rates[c] = v;
      }
    }
    return NextResponse.json({ base: "EUR", rates, fetchedAt, stale: false });
  } catch {
    return NextResponse.json(
      { base: "EUR", rates: { EUR: 1 } as Record<Currency, number>, fetchedAt, stale: true },
      { status: 200 },
    );
  }
}
