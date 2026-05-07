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
    descriptionKey: "privatePackagesDescription",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
      </svg>
    ),
  },
  {
    href: "/tours/fixed-dates",
    labelKey: "groupPackages",
    descriptionKey: "groupPackagesDescription",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
  },
  {
    href: "/tours/daily-packages",
    labelKey: "dailyPackages",
    descriptionKey: "dailyPackagesDescription",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
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

      {open && (
        <div
          className="absolute top-full left-1/2 -translate-x-1/2 mt-3 bg-cream border border-rule shadow-[0_12px_48px_-8px_rgba(11,26,46,0.22)] z-50 w-[560px]"
          role="menu"
        >
          <div className="absolute -top-3 left-0 right-0 h-3" />

          <div className="grid grid-cols-3 divide-x divide-rule">
            {TOUR_TYPES.map((item) => (
              <Link
                key={item.href}
                href={`${pfx}${item.href}`}
                className="group flex flex-col gap-3 p-4 hover:bg-ochre/5 transition-colors duration-150"
                role="menuitem"
              >
                <span className="text-muted group-hover:text-ochre transition-colors duration-150">
                  {item.icon}
                </span>
                <div>
                  <p className="font-display font-normal text-[13px] leading-[1.2] tracking-tight text-ink group-hover:text-ochre transition-colors duration-150">
                    {t(item.labelKey)}
                  </p>
                  <p className="font-mono text-[10px] tracking-[0.08em] text-muted mt-1 leading-[1.4]">
                    {t(item.descriptionKey)}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          <div className="border-t border-rule px-4 py-2.5">
            <Link
              href={`${pfx}/packages`}
              className="font-mono text-[10px] tracking-[0.16em] uppercase text-muted hover:text-ochre transition-colors duration-150"
            >
              {t("browseAllPackages")}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
