"use client";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function ScrollToTop() {
  const pathname = usePathname();
  useEffect(() => {
    if (pathname?.includes("/tours/custom-packages") || pathname?.includes("/packages/custom")) return;
    if (window.location.hash) return;
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname]);
  return null;
}
