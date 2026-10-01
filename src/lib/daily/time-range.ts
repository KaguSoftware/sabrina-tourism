const TIME_RE = /^([01]?\d|2[0-3]):([0-5]\d)(?::[0-5]\d)?$/;

/** "9:00", "09:00" or "09:00:00" become "09:00". Anything else is not a time. */
export function normalizeTime(value: string | null | undefined): string | null {
  if (typeof value !== "string") return null;
  const match = TIME_RE.exec(value.trim());
  if (!match) return null;
  return `${match[1].padStart(2, "0")}:${match[2]}`;
}

/**
 * Display text for a package's time frame, or null when there is nothing
 * honest to show.
 *
 * - both times valid and different: "09:00 – 18:00"
 * - only one valid time: just that time
 * - identical start and end (a placeholder such as 10:00 – 10:00), or no valid
 *   time at all: null, so callers hide the line instead of printing nonsense
 */
export function formatTimeRange(
  start: string | null | undefined,
  end: string | null | undefined,
): string | null {
  const from = normalizeTime(start);
  const to = normalizeTime(end);
  if (from && to) return from === to ? null : `${from} – ${to}`;
  return from ?? to ?? null;
}
