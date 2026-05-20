"use client";

import { useEffect, useRef, useState, createElement } from "react";
import type { RevealProps } from "./types";

// One shared IntersectionObserver across every Reveal on the page.
// Previously each Reveal was a framer-motion <m.div> with its own
// whileInView observer + variant resolver. With 300+ Reveals on long pages
// this dominated hydration cost and contributed to scroll-time work.
let sharedObserver: IntersectionObserver | null = null;
const targets = new WeakMap<Element, () => void>();

function getObserver(): IntersectionObserver {
  if (sharedObserver) return sharedObserver;
  sharedObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          const cb = targets.get(entry.target);
          if (cb) {
            cb();
            targets.delete(entry.target);
            sharedObserver!.unobserve(entry.target);
          }
        }
      }
    },
    { rootMargin: "-10% 0px -10% 0px" },
  );
  return sharedObserver;
}

export function Reveal({
  children,
  delay = 0,
  className = "",
  as = "div",
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setShown(true);
      return;
    }
    const observer = getObserver();
    targets.set(el, () => setShown(true));
    observer.observe(el);
    return () => {
      observer.unobserve(el);
      targets.delete(el);
    };
  }, []);

  const style: React.CSSProperties = {
    opacity: shown ? 1 : 0,
    transform: shown ? "translate3d(0,0,0)" : "translate3d(0,20px,0)",
    transition: `opacity 700ms cubic-bezier(0.22,0.61,0.36,1) ${delay}ms, transform 700ms cubic-bezier(0.22,0.61,0.36,1) ${delay}ms`,
    willChange: shown ? undefined : "opacity, transform",
  };

  return createElement(as, { ref, className, style }, children);
}
