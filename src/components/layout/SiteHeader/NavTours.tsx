"use client";
import { useState, useRef } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";

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
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 26h20" />
        <path d="M21 5.5a2.5 2.5 0 0 1 3.5 3.5L11 22.5l-5 1.5 1.5-5L21 5.5z" />
        <path d="M19.5 7l3.5 3.5" />
      </svg>
    ),
  },
  {
    href: "/tours/fixed-dates",
    labelKey: "groupPackages",
    cadenceKey: "groupPackagesCadence",
    descriptionKey: "groupPackagesDescription",
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="7" width="22" height="20" rx="1" />
        <path d="M5 13h22" />
        <path d="M11 4v6M21 4v6" />
        <circle cx="11" cy="19" r="0.75" fill="currentColor" />
        <circle cx="16" cy="19" r="0.75" fill="currentColor" />
        <circle cx="21" cy="19" r="0.75" fill="currentColor" />
      </svg>
    ),
  },
  {
    href: "/tours/daily-packages",
    labelKey: "dailyPackages",
    cadenceKey: "dailyPackagesCadence",
    descriptionKey: "dailyPackagesDescription",
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="16" cy="16" r="5" />
        <path d="M16 3v3M16 26v3M3 16h3M26 16h3M6.5 6.5l2.1 2.1M23.4 23.4l2.1 2.1M6.5 25.5l2.1-2.1M23.4 8.6l2.1-2.1" />
      </svg>
    ),
  },
] as const;

export function NavTours({ currentPath, transparent }: NavToursProps) {
  const locale = useLocale();
  const t = useTranslations("nav");
  const pfx = locale === "en" ? "" : `/${locale}`;
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleMouseEnter() {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpen(true);
  }

  function handleMouseLeave() {
    timeoutRef.current = setTimeout(() => setOpen(false), 120);
  }

  const isActive =
    currentPath === "/packages" ||
    currentPath.startsWith("/packages/") ||
    currentPath.startsWith("/tours/");

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link
        href={`${pfx}/packages`}
        className={`relative text-[13px] tracking-[0.14em] uppercase font-medium py-1.5 transition-colors duration-300 select-none after:absolute after:left-0 after:right-0 after:bottom-0 after:h-px after:bg-ochre after:scale-x-0 after:origin-left after:transition-transform after:duration-300 hover:after:scale-x-100 ${
          transparent ? "text-cream" : "text-ink"
        } ${isActive || open ? "after:scale-x-100" : ""}`}
        aria-haspopup="true"
        aria-expanded={open}
      >
        {t("tours")}
      </Link>

      <div
        data-open={open}
        className="absolute top-full left-1/2 -translate-x-1/2 mt-3 z-50 w-[840px] pointer-events-none opacity-0 -translate-y-1 transition-[opacity,transform] duration-200 ease-[cubic-bezier(0.22,0.61,0.36,1)] data-[open=true]:pointer-events-auto data-[open=true]:opacity-100 data-[open=true]:translate-y-0 motion-reduce:transition-none motion-reduce:translate-y-0"
        role="menu"
        aria-hidden={!open}
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

          {/* Three cards */}
          <div className="grid grid-cols-3 divide-x divide-rule">
            {TOUR_TYPES.map((item) => (
              <Link
                key={item.href}
                href={`${pfx}${item.href}`}
                className="group relative flex flex-col gap-4 p-7 pb-8 hover:bg-ochre/5 transition-colors duration-300 ease-[cubic-bezier(0.22,0.61,0.36,1)]"
                role="menuitem"
              >
                <span className="text-navy/70 group-hover:text-ochre transition-colors duration-300">
                  {item.icon}
                </span>

                <div>
                  <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-muted group-hover:text-ochre transition-colors duration-300">
                    {t(item.cadenceKey)}
                  </p>
                  <p className="relative inline-block mt-2 font-display font-normal text-[17px] leading-[1.15] tracking-tight text-ink group-hover:text-ochre transition-colors duration-300 after:absolute after:left-0 after:right-0 after:-bottom-0.5 after:h-px after:bg-ochre after:scale-x-0 after:origin-left after:transition-transform after:duration-300 group-hover:after:scale-x-100">
                    {t(item.labelKey)}
                  </p>
                  <p className="mt-3 text-[12.5px] leading-[1.55] text-ink-soft">
                    {t(item.descriptionKey)}
                  </p>
                </div>

                <span
                  aria-hidden
                  className="absolute bottom-4 right-5 font-mono text-[14px] text-muted group-hover:text-ochre group-hover:translate-x-0.5 transition-[color,transform] duration-300"
                >
                  →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
