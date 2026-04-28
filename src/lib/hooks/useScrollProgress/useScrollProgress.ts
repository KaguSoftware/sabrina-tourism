"use client";
import { useEffect } from "react";
import type { ScrollProgressCallback } from "./types";

export function useScrollProgress(cb: ScrollProgressCallback) {
  useEffect(() => {
    let raf = 0;

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const docH =
          document.documentElement.scrollHeight - window.innerHeight;
        const progress = docH > 0 ? Math.min(1, window.scrollY / docH) : 0;
        cb(progress);
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [cb]);
}
