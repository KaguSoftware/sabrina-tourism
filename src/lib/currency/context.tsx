"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  DEFAULT_CURRENCY,
  LOCALE_TO_CURRENCY,
  isCurrency,
  type Currency,
} from "@/i18n/currencies";
import type { Rates } from "@/lib/currency/format";
import type { Locale } from "@/i18n/locales";
import { readCookie, writeCookie } from "@/lib/utils/cookies";
import { RATES_STORAGE_KEY, hasForeignRates, isFresh, parseCachedRates } from "@/lib/currency/rates";

interface CurrencyContextValue {
  currency: Currency;
  setCurrency: (next: Currency, opts?: { manual?: boolean }) => void;
  rates: Rates;
  /** Rates are recent (or just fetched). False means cached or missing. */
  isLive: boolean;
  /** The first rates request has not finished yet. */
  isLoading: boolean;
  /** We have usable non-EUR rates, live or cached. */
  hasRates: boolean;
  fetchedAt: string | null;
}

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

const COOKIE_CURRENCY = "NEXT_CURRENCY";
const COOKIE_MANUAL = "NEXT_CURRENCY_MANUAL";
export function CurrencyProvider({
  locale,
  children,
}: {
  locale: string;
  children: React.ReactNode;
}) {
  const localeKey = locale as Locale;
  const defaultForLocale = LOCALE_TO_CURRENCY[localeKey] ?? DEFAULT_CURRENCY;

  const [currency, setCurrencyState] = useState<Currency>(() => {
    const stored = readCookie(COOKIE_CURRENCY);
    if (stored && isCurrency(stored)) return stored;
    return defaultForLocale;
  });
  const [rates, setRates] = useState<Rates>({ EUR: 1 });
  const [isLive, setIsLive] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchedAt, setFetchedAt] = useState<string | null>(null);

  const lastLocale = useRef<string | null>(null);

  // Show the last good rates from this browser straight away, then refresh.
  useEffect(() => {
    try {
      const cached = parseCachedRates(window.localStorage.getItem(RATES_STORAGE_KEY));
      if (cached) {
        setRates(cached.rates);
        setFetchedAt(cached.fetchedAt);
        setIsLive(isFresh(cached.fetchedAt));
      }
    } catch {
      // Storage can be blocked (private mode); the fetch below still works.
    }
  }, []);

  // Fetch rates once on mount. A failed or empty answer never replaces rates we already have.
  useEffect(() => {
    let cancelled = false;
    fetch("/api/rates")
      .then((r) => r.json())
      .then((data: { rates?: Rates; stale?: boolean; fetchedAt?: string }) => {
        if (cancelled) return;
        const incoming: Rates = { EUR: 1, ...(data?.rates ?? {}) };
        if (!hasForeignRates(incoming)) return;
        setRates(incoming);
        setIsLive(!data?.stale);
        setFetchedAt(data?.fetchedAt ?? null);
        if (data?.fetchedAt) {
          try {
            window.localStorage.setItem(
              RATES_STORAGE_KEY,
              JSON.stringify({ rates: incoming, fetchedAt: data.fetchedAt }),
            );
          } catch {
            // ignore storage errors
          }
        }
      })
      .catch(() => {
        // Keep whatever rates we already have.
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Auto-switch currency on locale change unless user has set manual override.
  useEffect(() => {
    if (lastLocale.current === locale) return;
    lastLocale.current = locale;
    const manual = readCookie(COOKIE_MANUAL) === "1";
    if (manual) return;
    const next = LOCALE_TO_CURRENCY[localeKey] ?? DEFAULT_CURRENCY;
    setCurrencyState(next);
    writeCookie(COOKIE_CURRENCY, next);
  }, [locale, localeKey]);

  const setCurrency = useCallback((next: Currency, opts?: { manual?: boolean }) => {
    setCurrencyState(next);
    writeCookie(COOKIE_CURRENCY, next);
    if (opts?.manual) writeCookie(COOKIE_MANUAL, "1");
  }, []);

  const hasRates = useMemo(() => hasForeignRates(rates), [rates]);

  const value = useMemo<CurrencyContextValue>(
    () => ({ currency, setCurrency, rates, isLive, isLoading, hasRates, fetchedAt }),
    [currency, setCurrency, rates, isLive, isLoading, hasRates, fetchedAt],
  );

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency(): CurrencyContextValue {
  const ctx = useContext(CurrencyContext);
  if (!ctx) {
    return {
      currency: DEFAULT_CURRENCY,
      setCurrency: () => {},
      rates: { EUR: 1 },
      isLive: false,
      isLoading: false,
      hasRates: false,
      fetchedAt: null,
    };
  }
  return ctx;
}
