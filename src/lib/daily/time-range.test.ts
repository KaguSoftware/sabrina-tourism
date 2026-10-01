import { describe, expect, it } from "vitest";
import { formatTimeRange, normalizeTime } from "./time-range";

describe("normalizeTime", () => {
  it("pads and trims valid times", () => {
    expect(normalizeTime("9:00")).toBe("09:00");
    expect(normalizeTime(" 09:30 ")).toBe("09:30");
    expect(normalizeTime("18:45:00")).toBe("18:45");
  });

  it("rejects anything that is not a time", () => {
    for (const bad of ["", "  ", "24:00", "10:60", "ten", "10", null, undefined]) {
      expect(normalizeTime(bad as string | null | undefined)).toBeNull();
    }
  });
});

describe("formatTimeRange", () => {
  it("shows a normal range", () => {
    expect(formatTimeRange("09:00", "18:00")).toBe("09:00 – 18:00");
    expect(formatTimeRange("9:00", "18:00:00")).toBe("09:00 – 18:00");
  });

  it("hides a placeholder range where start equals end", () => {
    expect(formatTimeRange("10:00", "10:00")).toBeNull();
    expect(formatTimeRange("10:00", "10:00:00")).toBeNull();
  });

  it("hides the line when both times are missing or invalid", () => {
    expect(formatTimeRange("", "")).toBeNull();
    expect(formatTimeRange(null, undefined)).toBeNull();
    expect(formatTimeRange("n/a", "tbd")).toBeNull();
  });

  it("shows the one valid time when the other is missing", () => {
    expect(formatTimeRange("09:00", "")).toBe("09:00");
    expect(formatTimeRange(null, "20:00")).toBe("20:00");
  });

  it("keeps an overnight range", () => {
    expect(formatTimeRange("22:00", "02:00")).toBe("22:00 – 02:00");
  });
});
