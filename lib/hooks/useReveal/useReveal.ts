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

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.setAttribute("data-revealed", "true");
          observer.disconnect();
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return ref;
}
