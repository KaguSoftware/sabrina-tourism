"use client";
import { useEffect, useRef, useState } from "react";

const GLOW_WINDOW = 3;

/**
 * Tracks which item in a vertical list is closest to the viewport's vertical
 * midline and returns a Set of indices for the "glow window" — the anchor
 * plus the (GLOW_WINDOW - 1) items immediately preceding it.
 *
 * Used by the day-by-day itinerary lists on tour detail pages to highlight
 * the day the user is currently reading.
 *
 * Was previously inlined as identical `useStopGlow` / `useItineraryGlow`
 * functions across two files.
 */
export function useScrollAnchorGlow<T extends HTMLElement = HTMLLIElement>(count: number) {
  const refs = useRef<(T | null)[]>([]);
  const [anchor, setAnchor] = useState<number | null>(null);

  useEffect(() => {
    function onScroll() {
      const mid = window.innerHeight / 2;
      let closest = -1;
      let closestDist = Infinity;
      refs.current.forEach((el, i) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const dist = Math.abs(rect.top + rect.height / 2 - mid);
        if (dist < closestDist) {
          closestDist = dist;
          closest = i;
        }
      });
      if (closest !== -1) setAnchor(closest);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [count]);

  const active = new Set(
    anchor === null
      ? []
      : Array.from({ length: GLOW_WINDOW }, (_, k) => anchor - (GLOW_WINDOW - 1) + k).filter(
          (i) => i >= 0 && i < count,
        ),
  );
  return { refs, active };
}
