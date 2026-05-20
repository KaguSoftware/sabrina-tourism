"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { ChevronDown } from "lucide-react";
import { AnimatePresence, m } from "framer-motion";

interface NavToursProps {
  currentPath: string;
  transparent: boolean;
}

const TOUR_TYPES = [
  {
    href: "/tours/custom-packages",
    labelKey: "privatePackages",
    cadenceKey: "privatePackagesCadence",
    descriptionKey: "privatePackagesDescription",
    image: "/sabrina_trabzon_private_tours.webp",
  },
  {
    href: "/tours/fixed-dates",
    labelKey: "groupPackages",
    cadenceKey: "groupPackagesCadence",
    descriptionKey: "groupPackagesDescription",
    image: "/istanbul_group_tour.webp",
  },
  {
    href: "/tours/daily-packages",
    labelKey: "dailyPackages",
    cadenceKey: "dailyPackagesCadence",
    descriptionKey: "dailyPackagesDescription",
    image: "/sabrina_istanbul_daily_tours.webp",
  },
] as const;

export function NavTours({ currentPath, transparent }: NavToursProps) {
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

  const isActive =
    currentPath === "/packages" ||
    currentPath.startsWith("/packages/") ||
    currentPath.startsWith("/tours/");

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={scheduleClose}
    >
      <Link
        ref={triggerRef}
        href={`${pfx}/packages`}
        onKeyDown={handleTriggerKeyDown}
        className={`relative inline-flex items-center gap-1.5 text-[14px] lg:text-[15px] tracking-[0.16em] uppercase font-medium py-1.5 transition-colors duration-300 select-none after:absolute after:left-0 after:right-0 after:bottom-0 after:h-px after:bg-ochre after:scale-x-0 after:origin-left rtl:after:origin-right after:transition-transform after:duration-300 hover:after:scale-x-100 ${
          transparent ? "text-cream" : "text-ink"
        } ${isActive || open ? "after:scale-x-100" : ""}`}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        {t("tours")}
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
            className="absolute top-full left-1/2 -translate-x-1/2 mt-3 z-50 w-[840px] max-w-[calc(100vw-2rem)]"
            role="menu"
          >
            {/* hover bridge */}
            <div className="absolute -top-3 left-0 right-0 h-3" />

            <div className="relative bg-cream border border-rule shadow-[0_12px_48px_-8px_rgba(11,26,46,0.22)] overflow-hidden flex flex-col max-h-[calc(100vh-6rem)]">
              {/* Header band */}
              <div className="relative shrink-0 flex items-start justify-between gap-6 px-7 pt-6 pb-5 border-b border-rule">
                <div>
                  <div className="flex items-center gap-3">
                    <span aria-hidden className="block h-px w-6 bg-ochre" />
                    <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-muted">
                      {t("toursMenuKicker")}
                    </p>
                  </div>
                  <p className="mt-2 font-display font-light text-[clamp(20px,1.6vw,24px)] text-navy leading-[1.15] tracking-tight">
                    {t("toursMenuHeading")}
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

              {/* Three photo-led cards */}
              <div className="grid grid-cols-3 divide-x divide-rule overflow-y-auto min-h-0">
                {TOUR_TYPES.map((item, idx) => (
                  <Link
                    key={item.href}
                    ref={(el) => {
                      itemRefs.current[idx] = el;
                    }}
                    href={`${pfx}${item.href}`}
                    onKeyDown={(e) => handleItemKeyDown(e, idx)}
                    className="group relative flex flex-col p-4 hover:bg-ochre/5 transition-colors duration-300 ease-[cubic-bezier(0.22,0.61,0.36,1)]"
                    role="menuitem"
                  >
                    {/* Photo */}
                    <div className="relative w-full aspect-4/3 overflow-hidden border border-rule">
                      <Image
                        src={item.image}
                        alt=""
                        fill
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                        sizes="280px"
                      />
                      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-navy/75 via-navy/15 to-transparent transition-opacity duration-300 group-hover:from-navy/85" />
                      <p className="absolute bottom-3 left-3 right-3 font-mono text-[10px] tracking-[0.18em] uppercase text-cream/95">
                        {t(item.cadenceKey)}
                      </p>
                    </div>

                    {/* Body */}
                    <div className="mt-4 flex-1">
                      <p className="relative inline-block font-display font-semibold text-[22px] leading-[1.15] tracking-tight text-ink group-hover:text-ochre transition-colors duration-300 after:absolute after:left-0 after:right-0 after:-bottom-0.5 after:h-px after:bg-ochre after:scale-x-0 after:origin-left after:transition-transform after:duration-300 group-hover:after:scale-x-100">
                        {t(item.labelKey)}
                      </p>
                      <p className="mt-2.5 text-[12.5px] leading-[1.55] text-ink-soft pr-5">
                        {t(item.descriptionKey)}
                      </p>
                    </div>

                    {/* Chevron */}
                    <span
                      aria-hidden
                      className="mt-3 self-end font-mono text-[14px] text-muted group-hover:text-ochre group-hover:translate-x-0.5 transition-[color,transform] duration-300"
                    >
                      →
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}
