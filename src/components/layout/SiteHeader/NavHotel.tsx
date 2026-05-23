"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { ChevronDown } from "lucide-react";
import { AnimatePresence, m } from "framer-motion";
import { REGIONS, REGION_SLUGS } from "@/lib/packages/constants";
import type { HotelPublic } from "@/lib/db/hotels";

export type Region = (typeof REGIONS)[number];

/** Maps each REGIONS value to its nav.regions translation key */
const REGION_TO_NAV_KEY: Record<Region, string> = {
  Istanbul: "istanbul",
  Cappadocia: "cappadocia",
  Aegean: "aegean",
  Mediterranean: "mediterranean",
  "Black Sea": "blackSea",
  "Eastern Anatolia": "easternAnatolia",
};

interface NavHotelProps {
  currentPath: string;
  transparent: boolean;
  hotelsByRegion: Record<Region, HotelPublic[]>;
}

export function NavHotel({ currentPath, transparent, hotelsByRegion }: NavHotelProps) {
  const locale = useLocale();
  const t = useTranslations("nav");
  const pfx = locale === "en" ? "" : `/${locale}`;
  const [open, setOpen] = useState(false);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const triggerRef = useRef<HTMLAnchorElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Array<HTMLAnchorElement | null>>([]);

  const clearClose = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  };

  const scheduleClose = useCallback(() => {
    clearClose();
    closeTimeoutRef.current = setTimeout(() => setOpen(false), 80);
  }, []);

  function handleMouseEnter() {
    clearClose();
    setOpen(true);
  }

  function handleTriggerKeyDown(e: React.KeyboardEvent<HTMLAnchorElement>) {
    if (e.key === "ArrowDown" || e.key === " " || (e.key === "Enter" && !open)) {
      e.preventDefault();
      setOpen(true);
      requestAnimationFrame(() => itemRefs.current[0]?.focus());
    } else if (e.key === "Escape" && open) {
      e.preventDefault();
      setOpen(false);
    }
  }

  function handleItemKeyDown(e: React.KeyboardEvent<HTMLAnchorElement>, idx: number) {
    if (e.key === "ArrowDown" || e.key === "ArrowRight") {
      e.preventDefault();
      const next = (idx + 1) % itemRefs.current.length;
      itemRefs.current[next]?.focus();
    } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
      e.preventDefault();
      const prev = (idx - 1 + itemRefs.current.length) % itemRefs.current.length;
      itemRefs.current[prev]?.focus();
    } else if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
      triggerRef.current?.focus();
    } else if (e.key === "Tab") {
      setOpen(false);
    }
  }

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      if (
        triggerRef.current?.contains(target) ||
        menuRef.current?.contains(target)
      ) {
        return;
      }
      setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  useEffect(() => () => clearClose(), []);

  const isActive = currentPath.startsWith("/regions");
  const visibleRegions = REGIONS.filter(
    (r) => (hotelsByRegion[r]?.length ?? 0) > 0
  );
  const totalProperties = visibleRegions.reduce(
    (sum, r) => sum + (hotelsByRegion[r]?.length ?? 0),
    0
  );
  const totalCount = visibleRegions.length;
  // Cap at 3 columns, but if there are very few items, use a tighter row
  // so the cards stay generously sized instead of stretching across the menu.
  const colCount = Math.min(3, Math.max(1, totalCount));
  const menuWidthClass =
    colCount === 1
      ? "w-[340px]"
      : colCount === 2
        ? "w-[620px]"
        : "w-[840px]";
  // Last-row size for centering trailing items (e.g. 5 → 3+2 centered).
  const remainder = totalCount % colCount;
  const lastRowSize = remainder === 0 ? colCount : remainder;
  const lastRowStart = totalCount - lastRowSize;
  // Each card takes 1/colCount of the row's width via flex-basis.
  const itemBasis =
    colCount === 1 ? "100%" : colCount === 2 ? "50%" : "33.3333%";

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={scheduleClose}
    >
      <Link
        ref={triggerRef}
        href={`${pfx}/regions`}
        onKeyDown={handleTriggerKeyDown}
        className={`relative inline-flex items-center gap-1.5 text-[14px] lg:text-[15px] tracking-[0.16em] uppercase font-medium py-1.5 transition-colors duration-300 select-none after:absolute after:left-0 after:right-0 after:bottom-0 after:h-px after:bg-ochre after:scale-x-0 after:origin-left rtl:after:origin-right after:transition-transform after:duration-300 hover:after:scale-x-100 ${
          transparent ? "text-cream" : "text-ink"
        } ${isActive || open ? "after:scale-x-100" : ""}`}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        {t("hotels")}
        <ChevronDown
          aria-hidden="true"
          size={16}
          strokeWidth={1.8}
          className={`shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </Link>

      <AnimatePresence>
        {open && (
          <m.div
            ref={menuRef}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4, transition: { duration: 0.12, ease: [0.4, 0, 1, 1] } }}
            transition={{ duration: 0.2, ease: [0.22, 0.61, 0.36, 1] }}
            className={`absolute top-full left-1/2 -translate-x-1/2 mt-3 z-50 ${menuWidthClass} max-w-[calc(100vw-2rem)]`}
            role="menu"
          >
            {/* hover bridge */}
            <div className="absolute -top-3 left-0 right-0 h-3" />

        <div className="relative bg-cream border border-rule shadow-[0_12px_48px_-8px_rgba(11,26,46,0.22)] overflow-hidden">
          {/* Header band */}
          <div className="relative flex items-start justify-between gap-6 px-7 pt-6 pb-5 border-b border-rule">
            <div>
              <div className="flex items-center gap-3">
                <span aria-hidden className="block h-px w-6 bg-ochre" />
                <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-muted">
                  {t("hotelsMenuKicker")}
                </p>
              </div>
              <p className="mt-2 font-display font-light text-[clamp(20px,1.6vw,24px)] text-navy leading-[1.15] tracking-tight">
                {t("hotelsMenuHeading")}
              </p>
            </div>
            <svg
              aria-hidden
              width="72"
              height="24"
              viewBox="0 0 72 24"
              className="hidden md:block shrink-0 mt-1.5 text-ochre/40"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
            >
              <path d="M0 18 L10 6 L20 18 L30 6 L40 18 L50 6 L60 18 L70 6" />
              <circle cx="68" cy="12" r="1.5" fill="currentColor" stroke="none" />
            </svg>
          </div>

          {/* Region cards — last row centers so odd counts feel intentional */}
          <div className="flex flex-wrap justify-center">
            {visibleRegions.map((region, idx) => {
              const hotelList = hotelsByRegion[region] ?? [];
              const first = hotelList[0]!;
              const remaining = hotelList.length - 1;
              const regionKey = REGION_TO_NAV_KEY[region];
              const isLastRow = idx >= lastRowStart;
              const isCenteredTrailing = isLastRow && lastRowSize < colCount;
              const colInRow = isLastRow ? idx - lastRowStart : idx % colCount;
              // Divider rules: vertical between siblings in the same row, horizontal
              // for any row past the first. Computed manually because the centered
              // trailing row breaks `divide-*` utility assumptions.
              const showLeftDivider = colInRow > 0;
              const showTopDivider = idx >= colCount;

              return (
                <Link
                  key={region}
                  ref={(el) => {
                    itemRefs.current[idx] = el;
                  }}
                  href={`${pfx}/regions/${REGION_SLUGS[region]}`}
                  onKeyDown={(e) => handleItemKeyDown(e, idx)}
                  style={{ flexBasis: itemBasis }}
                  className={`group relative flex flex-col gap-2.5 p-4 hover:bg-ochre/5 transition-colors duration-300 ease-[cubic-bezier(0.22,0.61,0.36,1)] ${
                    showLeftDivider ? "border-l border-rule" : ""
                  } ${showTopDivider ? "border-t border-rule" : ""} ${
                    isCenteredTrailing
                      ? "bg-linear-to-b from-transparent via-ochre/[0.025] to-ochre/[0.04]"
                      : ""
                  }`}
                  role="menuitem"
                >
                  <div className="relative w-full aspect-video overflow-hidden border border-rule">
                    <Image
                      src={first.images[0]}
                      alt={first.name}
                      fill
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                      sizes="280px"
                    />
                    {isCenteredTrailing && (
                      <span
                        aria-hidden
                        className="absolute top-2 left-2 font-mono text-[9px] tracking-[0.22em] uppercase text-cream/90 bg-navy/55 backdrop-blur-[2px] px-1.5 py-0.5"
                      >
                        {t("hotelsMenuKicker")}
                      </span>
                    )}
                  </div>

                  <div>
                    <p className="relative inline-block font-display font-semibold text-[18px] leading-[1.15] tracking-tight text-navy group-hover:text-ochre transition-colors duration-300 after:absolute after:left-0 after:right-0 after:-bottom-0.5 after:h-px after:bg-ochre after:scale-x-0 after:origin-left after:transition-transform after:duration-300 group-hover:after:scale-x-100">
                      {t(`regions.${regionKey}`)}
                    </p>
                    <p className="mt-1 font-display font-normal text-[13px] leading-[1.2] tracking-tight text-ink-soft truncate">
                      {first.name}
                    </p>
                    {remaining > 0 && (
                      <p className="mt-0.5 font-mono text-[10px] tracking-[0.12em] uppercase text-muted">
                        {remaining === 1
                          ? t("otherHotel", { count: remaining })
                          : t("otherHotels", { count: remaining })}
                      </p>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Footer band */}
          <div className="border-t border-rule px-7 py-3">
            <p className="font-mono text-[10px] tracking-[0.16em] uppercase text-muted">
              {t("partneredPropertiesAcrossTurkey", { count: totalProperties })}
            </p>
          </div>
        </div>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}
