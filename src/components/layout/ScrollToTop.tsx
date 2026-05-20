"use client";
import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect } from "react";

// Run synchronously before paint on the client so scrollY is 0 by the time
// any other layout effect (e.g. PaperPlanePath) reads it.
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function ScrollToTop() {
  const pathname = usePathname();
  useIsomorphicLayoutEffect(() => {
    if (pathname?.includes("/tours/custom-packages") || pathname?.includes("/packages/custom")) return;
    if (window.location.hash) return;
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname]);
  return null;
}
