"use client";
import { useState, useEffect, useLayoutEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { NAV_ITEMS } from "./constants";
import { NavHotel } from "./NavHotel";
import { NavTours } from "./NavTours";
import { REGIONS, REGION_SLUGS } from "@/lib/packages/constants";
import { genericMessage } from "@/lib/whatsapp/whatsapp";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher/LanguageSwitcher";
import Image from "next/image";

function DropdownNavItem({
  item,
  transparent,
  isActive,
  pathname,
}: {
  item: { href: string; label: string; children?: { href: string; label: string }[] };
  transparent: boolean;
  isActive: boolean;
  pathname: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  return (
    <div ref={ref} className="relative inline-flex items-center" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <Link
        href={item.href}
        className={`inline-flex items-center gap-1 relative text-[13px] tracking-[0.14em] uppercase font-medium py-1.5 transition-colors duration-300 after:absolute after:left-0 after:right-0 after:bottom-0 after:h-px after:bg-ochre after:transition-transform after:duration-300 ${
          transparent ? "text-cream" : "text-ink"
        } ${isActive ? "after:scale-x-100" : "after:scale-x-0 hover:after:scale-x-100"}`}
      >
        {item.label}
        <svg
          width="10" height="10" viewBox="0 0 10 10" fill="none"
          className={`transition-transform duration-200 opacity-60 ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        >
          <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Link>

      {/* Zero-height bridge fills the gap so onMouseLeave doesn't fire mid-travel */}
      <div className="absolute top-full left-0 right-0 h-3" />

      <div
        className={`absolute top-full left-1/2 -translate-x-1/2 mt-3 min-w-45 bg-cream border border-rule shadow-[0_8px_32px_-8px_rgba(11,26,46,0.18)] transition-all duration-200 origin-top ${
          open ? "opacity-100 scale-y-100 pointer-events-auto" : "opacity-0 scale-y-95 pointer-events-none"
        }`}
      >
        {item.children?.map((child) => (
          <Link
            key={child.href}
            href={child.href}
            onClick={() => setOpen(false)}
            className={`block px-5 py-3 font-mono text-[12px] tracking-[0.14em] uppercase transition-colors duration-150 border-b border-rule last:border-0 ${
              pathname === child.href
                ? "text-ochre bg-cream-warm"
                : "text-ink hover:text-ochre hover:bg-cream-warm"
            }`}
          >
            {child.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations("nav");
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useLayoutEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 1);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const localePfx = locale === "en" ? "" : `/${locale}`;
  const NO_HERO_PATHS = [`${localePfx}/tours/custom-packages`];
  const transparent = !scrolled && !NO_HERO_PATHS.includes(pathname) && !menuOpen;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 transition-all duration-300 ${menuOpen ? "z-70" : "z-50"} ${
          transparent
            ? "bg-transparent border-transparent"
            : "bg-cream/95 backdrop-blur-sm border-b border-rule"
        }`}
      >
        <div className="max-w-[1320px] mx-auto px-[clamp(20px,4vw,56px)] py-6 md:py-4 flex items-center justify-between gap-6">
          {/* Brand */}
          <Link
            href={`${localePfx}/`}
            className="inline-flex items-center group"
            aria-label={t("homeAriaLabel")}
          >
            <Image
              src={transparent ? "/logo_1_sabrina_cropped.png" : "/logo_2_sabrina_cropped.png"}
              alt="Sabrina Turizm"
              width="140"
              height="48"
              className="h-[38px] md:h-12 w-auto object-contain transition-all duration-500"
            />
          </Link>

          <nav className="hidden md:flex items-center gap-8 relative" aria-label={t("primaryNavigation")}>
            <Link
              href={`${localePfx}/`}
              className={`relative text-[13px] tracking-[0.14em] uppercase font-medium py-1.5 transition-colors duration-300 after:absolute after:left-0 after:right-0 after:bottom-0 after:h-px after:bg-ochre after:scale-x-0 after:origin-left after:transition-transform after:duration-300 hover:after:scale-x-100 ${
                transparent ? "text-cream" : "text-ink"
              } ${pathname === `${localePfx}/` || pathname === "/" ? "after:scale-x-100" : ""}`}
            >
              {t("home")}
            </Link>
            <NavTours currentPath={pathname} transparent={transparent} />
            <Link
              href={`${localePfx}/transportation`}
              className={`relative text-[13px] tracking-[0.14em] uppercase font-medium py-1.5 transition-colors duration-300 after:absolute after:left-0 after:right-0 after:bottom-0 after:h-px after:bg-ochre after:scale-x-0 after:origin-left after:transition-transform after:duration-300 hover:after:scale-x-100 ${
                transparent ? "text-cream" : "text-ink"
              } ${pathname.includes("/transportation") ? "after:scale-x-100" : ""}`}
            >
              {t("driver")}
            </Link>
            <NavHotel currentPath={pathname} transparent={transparent} />
          </nav>

          {/* Desktop CTA + Language switcher */}
          <div className="hidden md:flex items-center gap-4">
            <LanguageSwitcher transparent={transparent} />
            <a
              href={genericMessage()}
              target="_blank"
              rel="noopener noreferrer"
              style={{ backgroundColor: "#0b1a2e", color: "#c99a3f" }}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-[12px] tracking-[0.14em] uppercase font-semibold transition-all duration-300 hover:scale-[1.02] shadow-[0_4px_20px_-6px_rgba(11,26,46,0.4)]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo-whatsapp.svg"
                alt=""
                aria-hidden="true"
                width="14"
                height="14"
                style={{
                  filter:
                    "brightness(0) saturate(100%) invert(68%) sepia(50%) saturate(500%) hue-rotate(5deg) brightness(95%)",
                }}
              />
              <span>{t("whatsapp")}</span>
            </a>
          </div>

          <div className="md:hidden flex items-center gap-3">
            <LanguageSwitcher transparent={transparent} />
            <button
              className={`flex flex-col gap-[6px] p-3 transition-colors duration-200 ${
                transparent ? "text-cream" : "text-black"
              }`}
              aria-label={menuOpen ? t("closeMenu") : t("openMenu")}
              onClick={() => setMenuOpen((o) => !o)}
            >
              <span
                className={`w-[26px] h-px bg-current block transition-all duration-300 origin-center ${
                  menuOpen ? "translate-y-[7px] rotate-45" : ""
                }`}
              />
              <span
                className={`w-[26px] h-px bg-current block transition-all duration-300 ${
                  menuOpen ? "opacity-0 scale-x-0" : ""
                }`}
              />
              <span
                className={`w-[26px] h-px bg-current block transition-all duration-300 origin-center ${
                  menuOpen ? "-translate-y-[7px] -rotate-45" : ""
                }`}
              />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile overlay — slides in from right, sits below the header bar */}
      <div
        className={`md:hidden fixed top-21.5 bottom-0 right-0 left-0 bg-navy text-cream z-60 flex flex-col p-6 transition-transform duration-460 ease-[cubic-bezier(0.22,0.61,0.36,1)] ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-hidden={!menuOpen}
      >
        <nav className="flex flex-col gap-2 flex-1 overflow-y-auto">
          {[
            { href: "/", label: t("home") },
            { href: "/transportation", label: t("driver") },
          ].map((item, i) => (
            <Link
              key={item.href}
              href={`${localePfx}${item.href}`}
              className="font-display text-[clamp(36px,9vw,64px)] leading-[1.05] tracking-[-0.02em] transition-opacity duration-300 hover:text-ochre"
              style={{
                opacity: menuOpen ? 1 : 0,
                transform: menuOpen ? "translateX(0)" : "translateX(40px)",
                transition: `opacity 500ms cubic-bezier(0.22,0.61,0.36,1) ${
                  100 + i * 60
                }ms, transform 500ms cubic-bezier(0.22,0.61,0.36,1) ${
                  100 + i * 60
                }ms`,
              }}
            >
              {item.label}
            </Link>
          ))}
          {/* Tours */}
          <div
            style={{
              opacity: menuOpen ? 1 : 0,
              transform: menuOpen ? "translateX(0)" : "translateX(40px)",
              transition: `opacity 500ms cubic-bezier(0.22,0.61,0.36,1) ${
                100 + NAV_ITEMS.length * 60
              }ms, transform 500ms cubic-bezier(0.22,0.61,0.36,1) ${
                100 + NAV_ITEMS.length * 60
              }ms`,
            }}
          >
            <p className="font-display text-[clamp(36px,9vw,64px)] leading-[1.05] tracking-[-0.02em] text-cream/40 mb-2">
              {t("tours")}
            </p>
            <div className="flex flex-col gap-1 pl-2 border-l border-cream/20">
              {[
                { href: "/tours/fixed-dates", labelKey: "fixedDatePackages" as const },
                { href: "/tours/daily-packages", labelKey: "dailyPackages" as const },
                { href: "/tours/custom-packages", labelKey: "customDealPackages" as const },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={`${localePfx}${item.href}`}
                  className="text-[13px] tracking-[0.14em] uppercase font-medium text-cream/70 hover:text-ochre transition-colors duration-200 py-0.5"
                >
                  {t(item.labelKey)}
                </Link>
              ))}
            </div>
          </div>
          {/* Hotel / Regions */}
          <div
            style={{
              opacity: menuOpen ? 1 : 0,
              transform: menuOpen ? "translateX(0)" : "translateX(40px)",
              transition: `opacity 500ms cubic-bezier(0.22,0.61,0.36,1) ${
                160 + NAV_ITEMS.length * 60
              }ms, transform 500ms cubic-bezier(0.22,0.61,0.36,1) ${
                160 + NAV_ITEMS.length * 60
              }ms`,
            }}
          >
            <p className="font-display text-[clamp(36px,9vw,64px)] leading-[1.05] tracking-[-0.02em] text-cream/40 mb-2">
              {t("hotels")}
            </p>
            <div className="flex flex-col gap-1 pl-2 border-l border-cream/20">
              {REGIONS.map((region) => (
                <Link
                  key={region}
                  href={`${localePfx}/regions/${REGION_SLUGS[region]}`}
                  className="text-[13px] tracking-[0.14em] uppercase font-medium text-cream/70 hover:text-ochre transition-colors duration-200 py-0.5"
                >
                  {region}
                </Link>
              ))}
            </div>
          </div>
        </nav>
        <div className="border-t border-cream/20 pt-6 flex flex-col gap-4">
          <a
            href={genericMessage()}
            target="_blank"
            rel="noopener noreferrer"
            style={{ backgroundColor: "#0b1a2e", color: "#c99a3f" }}
            className="inline-flex items-center gap-3 px-6 py-4 text-[13px] tracking-[0.16em] uppercase font-semibold w-fit shadow-[0_4px_24px_-6px_rgba(11,26,46,0.45)]"
          >
            {t("reserveViaWhatsapp")}
          </a>
          <p className="text-cream/50 text-[13px] tracking-[0.12em]">
            {t("locationCity")}
          </p>
        </div>
      </div>
    </>
  );
}
