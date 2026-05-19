"use client";
import { useEffect, useRef, useState } from "react";
import { DEFAULT_THRESHOLD, DEFAULT_ROOT_MARGIN } from "./constants";
import type { UseRevealOptions } from "./types";

export function useReveal(options: UseRevealOptions = {}) {
  const ref = useRef<HTMLElement | null>(null);
  const { threshold = DEFAULT_THRESHOLD, rootMargin = DEFAULT_ROOT_MARGIN } =
    options;

  // Track prefers-reduced-motion in state so we react to OS-level toggles
  // while the page is mounted.
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mql.matches);

    const onChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    if (typeof mql.addEventListener === "function") {
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    }
    // Safari < 14 fallback
    mql.addListener(onChange);
    return () => mql.removeListener(onChange);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (prefersReducedMotion) {
      el.setAttribute("data-revealed", "true");
      return;
    }

    el.setAttribute("data-reveal", "true");

    // Fallback: reveal after 1.2 s regardless, so fast-scroll can't leave
    // content permanently faint if IntersectionObserver never fires.
    const fallback = window.setTimeout(() => {
      el.setAttribute("data-revealed", "true");
    }, 1200);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          clearTimeout(fallback);
          entry.target.setAttribute("data-revealed", "true");
          observer.disconnect();
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    return () => {
      clearTimeout(fallback);
      observer.disconnect();
    };
  }, [threshold, rootMargin, prefersReducedMotion]);

  return ref;
}
