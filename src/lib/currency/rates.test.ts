import { describe, expect, it } from "vitest";
import { hasForeignRates, isFresh, mergeRates, parseCachedRates } from "./rates";

const NOW = Date.parse("2026-10-01T12:00:00Z");

describe("mergeRates", () => {
  it("prefers the primary source and fills gaps from the fallback", () => {
    const rates = mergeRates({ USD: 1.1, TRY: 40 }, { USD: 9, IRR: 45000, GBP: 0.85 });
    expect(rates).toMatchObject({ EUR: 1, USD: 1.1, TRY: 40, IRR: 45000, GBP: 0.85 });
  });

  it("skips invalid values so that currency falls back to EUR", () => {
    const rates = mergeRates({ USD: 0, TRY: -3, GBP: Number.NaN, JPY: "160" }, {});
    expect(rates).toEqual({ EUR: 1 });
  });

  it("ignores currencies the site does not support", () => {
    expect(mergeRates({ AUD: 1.6 }, {})).toEqual({ EUR: 1 });
  });
});

describe("hasForeignRates", () => {
  it("is false for EUR only and true once any other rate exists", () => {
    expect(hasForeignRates({ EUR: 1 })).toBe(false);
    expect(hasForeignRates({ EUR: 1, USD: 1.1 })).toBe(true);
  });
});

describe("parseCachedRates", () => {
  const good = JSON.stringify({ rates: { USD: 1.1, TRY: 40 }, fetchedAt: "2026-10-01T08:00:00Z" });

  it("restores a valid cached snapshot", () => {
    expect(parseCachedRates(good, NOW)).toEqual({
      rates: { EUR: 1, USD: 1.1, TRY: 40 },
      fetchedAt: "2026-10-01T08:00:00Z",
    });
  });

  it("returns null for missing, broken or empty data", () => {
    expect(parseCachedRates(null, NOW)).toBeNull();
    expect(parseCachedRates("not json", NOW)).toBeNull();
    expect(parseCachedRates(JSON.stringify({ rates: { EUR: 1 }, fetchedAt: "2026-10-01T08:00:00Z" }), NOW)).toBeNull();
    expect(parseCachedRates(JSON.stringify({ rates: { USD: 1.1 }, fetchedAt: "yesterday" }), NOW)).toBeNull();
  });

  it("rejects a timestamp from the future", () => {
    const future = JSON.stringify({ rates: { USD: 1.1 }, fetchedAt: "2026-10-05T00:00:00Z" });
    expect(parseCachedRates(future, NOW)).toBeNull();
  });
});

describe("isFresh", () => {
  it("is true within a week and false after", () => {
    expect(isFresh("2026-09-28T12:00:00Z", NOW)).toBe(true);
    expect(isFresh("2026-09-20T12:00:00Z", NOW)).toBe(false);
  });
});
