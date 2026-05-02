"use client";
import { useEffect, useRef } from "react";
import { DEFAULT_THRESHOLD, DEFAULT_ROOT_MARGIN } from "./constants";
import type { UseRevealOptions } from "./types";

export function useReveal(options: UseRevealOptions = {}) {
  const ref = useRef<HTMLElement | null>(null);
  const { threshold = DEFAULT_THRESHOLD, rootMargin = DEFAULT_ROOT_MARGIN } =
    options;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) {
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
  }, [threshold, rootMargin]);

  return ref;
}
