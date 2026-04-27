"use client";
import { useEffect, useRef } from "react";
import { HEADING_BASE } from "./constants";
import type { GoldUnderlineHeadingProps } from "./types";

export function GoldUnderlineHeading({
  as: Tag = "h2",
  children,
  className = "",
}: GoldUnderlineHeadingProps) {
  const ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) {
      el.classList.add("drawn");
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("drawn");
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref as React.RefObject<never>}
      className={`${HEADING_BASE} ${className}`}
    >
      {children}
    </Tag>
  );
}
