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

interface CurrencyContextValue {
  currency: Currency;
  setCurrency: (next: Currency, opts?: { manual?: boolean }) => void;
  rates: Rates;
  isLive: boolean;
  fetchedAt: string | null;
}

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

const COOKIE_CURRENCY = "NEXT_CURRENCY";
const COOKIE_MANUAL = "NEXT_CURRENCY_MANUAL";
const COOKIE_MAX_AGE = 31536000;

function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function writeCookie(name: string, value: string) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${COOKIE_MAX_AGE}`;
}

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
  const [fetchedAt, setFetchedAt] = useState<string | null>(null);

  const lastLocale = useRef<string | null>(null);

  // Fetch rates once on mount.
  useEffect(() => {
    let cancelled = false;
    fetch("/api/rates")
      .then((r) => r.json())
      .then((data: { rates?: Rates; stale?: boolean; fetchedAt?: string }) => {
        if (cancelled) return;
        if (data?.rates) setRates({ EUR: 1, ...data.rates });
        setIsLive(!data?.stale);
        setFetchedAt(data?.fetchedAt ?? null);
      })
      .catch(() => {
        if (!cancelled) setIsLive(false);
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

  const value = useMemo<CurrencyContextValue>(
    () => ({ currency, setCurrency, rates, isLive, fetchedAt }),
    [currency, setCurrency, rates, isLive, fetchedAt],
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
      fetchedAt: null,
    };
  }
  return ctx;
}
