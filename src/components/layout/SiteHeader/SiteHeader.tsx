"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { NAV_ITEMS } from "./constants";
import { NavHotel, type Region } from "./NavHotel";
import { NavTours } from "./NavTours";
import { REGIONS, REGION_SLUGS } from "@/lib/packages/constants";
import type { HotelPublic } from "@/lib/db/hotels";
import { genericMessage } from "@/lib/whatsapp/whatsapp";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher/LanguageSwitcher";
import { CurrencySwitcher } from "@/components/layout/CurrencySwitcher/CurrencySwitcher";
import Image from "next/image";

export function SiteHeader({
  hotelsByRegion,
}: {
  hotelsByRegion: Record<Region, HotelPublic[]>;
}) {
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations("nav");
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const hamburgerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 1);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setMenuOpen(false);
        requestAnimationFrame(() => hamburgerRef.current?.focus());
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const localePfx = locale === "en" ? "" : `/${locale}`;
  const NO_HERO_PATHS = [`${localePfx}/tours/custom-packages`];
  const transparent =
    !scrolled && !NO_HERO_PATHS.includes(pathname) && !menuOpen;
  const isRTL = ["ar", "he", "fa"].includes(locale);
  const menuSlideOffset = isRTL ? "-40px" : "40px";

  // Drawer item animation: stagger-in on open, uniform fast fade on close so the
  // close feels in sync with the drawer slide rather than each item dragging behind.
  const drawerItem = (i: number): React.CSSProperties => {
    const delayMs = menuOpen ? 80 + i * 50 : 0;
    const durMs = menuOpen ? 420 : 180;
    return {
      opacity: menuOpen ? 1 : 0,
      transform: menuOpen ? "translateX(0)" : `translateX(${menuSlideOffset})`,
      transition: `opacity ${durMs}ms cubic-bezier(0.22,0.61,0.36,1) ${delayMs}ms, transform ${durMs}ms cubic-bezier(0.22,0.61,0.36,1) ${delayMs}ms`,
      willChange: "opacity, transform",
    };
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 ${
          menuOpen ? "z-70" : "z-50"
        } transition-[background-color,backdrop-filter,border-color] duration-400 ease-[cubic-bezier(0.22,0.61,0.36,1)] ${
          transparent
            ? "bg-transparent backdrop-blur-0 border-b border-transparent"
            : "bg-cream/95 backdrop-blur-sm border-b border-rule"
        }`}
      >
        {/* Top gradient veil — its own layer so we can crossfade it instead of swapping bg classes */}
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-0 bg-linear-to-b from-navy/55 via-navy/25 to-transparent transition-opacity duration-400 ease-[cubic-bezier(0.22,0.61,0.36,1)] ${
            transparent ? "opacity-100" : "opacity-0"
          }`}
        />
        <div className="w-full max-w-[1800px] mx-auto px-[clamp(20px,4vw,56px)] py-4 md:py-2.5 flex items-center justify-between gap-6">
          {/* Brand */}
          <Link
            href={`${localePfx}/`}
            className="inline-flex w-24 md:w-35 shrink-0 flex-col items-center group ml-8 md:ml-0"
            aria-label={t("homeAriaLabel")}
          >
            <span className="relative inline-block h-8 md:h-12 w-auto">
              <Image
                src="/logo_1_sabrina_cropped.png"
                alt="Sabrina Turizm"
                width="140"
                height="48"
                className={`h-8 md:h-12 w-auto object-contain transition-opacity duration-400 ease-[cubic-bezier(0.22,0.61,0.36,1)] ${
                  transparent ? "opacity-100" : "opacity-0"
                }`}
                priority
              />
              <Image
                src="/logo_2_sabrina_cropped.png"
                alt=""
                aria-hidden="true"
                width="140"
                height="48"
                className={`absolute inset-0 h-8 md:h-12 w-auto object-contain transition-opacity duration-400 ease-[cubic-bezier(0.22,0.61,0.36,1)] ${
                  transparent ? "opacity-0" : "opacity-100"
                }`}
              />
            </span>
          </Link>

          <nav
            className="hidden md:flex items-center gap-9 lg:gap-10 relative"
            aria-label={t("primaryNavigation")}
          >
            <Link
              href={`${localePfx}/`}
              className={`relative text-[14px] lg:text-[15px] tracking-[0.16em] uppercase font-medium py-1.5 transition-colors duration-300 after:absolute after:left-0 after:right-0 after:bottom-0 after:h-px after:bg-ochre after:scale-x-0 after:origin-left rtl:after:origin-right after:transition-transform after:duration-300 hover:after:scale-x-100 ${
                transparent ? "text-cream" : "text-ink"
              } ${
                pathname === `${localePfx}/` || pathname === "/"
                  ? "after:scale-x-100"
                  : ""
              }`}
            >
              {t("home")}
            </Link>
            <NavTours currentPath={pathname} transparent={transparent} />
            <Link
              href={`${localePfx}/transportation`}
              className={`relative text-[14px] lg:text-[15px] tracking-[0.16em] uppercase font-medium py-1.5 transition-colors duration-300 after:absolute after:left-0 after:right-0 after:bottom-0 after:h-px after:bg-ochre after:scale-x-0 after:origin-left rtl:after:origin-right after:transition-transform after:duration-300 hover:after:scale-x-100 ${
                transparent ? "text-cream" : "text-ink"
              } ${
                pathname.includes("/transportation") ? "after:scale-x-100" : ""
              }`}
            >
              {t("driver")}
            </Link>
            <NavHotel
              currentPath={pathname}
              transparent={transparent}
              hotelsByRegion={hotelsByRegion}
            />
          </nav>

          {/* Desktop CTA + Language switcher */}
          <div className="hidden md:flex items-center gap-4">
            <LanguageSwitcher transparent={transparent} />
            <CurrencySwitcher transparent={transparent} />
            <a
              href={genericMessage(locale)}
              target="_blank"
              rel="noopener noreferrer"
              style={{ backgroundColor: "#0b1a2e", color: "#c99a3f" }}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-[12px] tracking-[0.14em] uppercase font-semibold transition-transform duration-200 ease-out hover:scale-[1.02] active:scale-[0.99] shadow-[0_4px_20px_-6px_rgba(11,26,46,0.4)]"
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
            <CurrencySwitcher transparent={transparent} />
            <button
              ref={hamburgerRef}
              className={`flex flex-col gap-[6px] p-3 transition-colors duration-200 ${
                transparent ? "text-cream" : "text-black"
              }`}
              aria-label={menuOpen ? t("closeMenu") : t("openMenu")}
              aria-expanded={menuOpen}
              aria-controls="mobile-nav-drawer"
              onClick={() => setMenuOpen((o) => !o)}
            >
              <span
                className={`w-[26px] h-[2px] bg-current block transition-transform duration-300 ease-[cubic-bezier(0.22,0.61,0.36,1)] origin-center ${
                  menuOpen ? "translate-y-[8px] rotate-45" : ""
                }`}
              />
              <span
                className={`w-[26px] h-[2px] bg-current block transition-[opacity,transform] duration-200 ease-out ${
                  menuOpen ? "opacity-0 scale-x-0" : ""
                }`}
              />
              <span
                className={`w-[26px] h-[2px] bg-current block transition-transform duration-300 ease-[cubic-bezier(0.22,0.61,0.36,1)] origin-center ${
                  menuOpen ? "-translate-y-[8px] -rotate-45" : ""
                }`}
              />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile overlay — slides in from the end edge (right in LTR, left in RTL). */}
      {/* Items stagger-in when opening; on close they ride out with the drawer (uniform short fade) */}
      <div
        id="mobile-nav-drawer"
        className={`md:hidden fixed top-16 md:top-[78px] bottom-0 right-0 left-0 bg-navy text-cream z-60 flex flex-col p-6 transition-transform duration-400 ease-[cubic-bezier(0.32,0.72,0.24,1)] will-change-transform ${
          menuOpen
            ? "translate-x-0"
            : "ltr:translate-x-full rtl:-translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-hidden={!menuOpen}
        inert={!menuOpen}
      >
        <nav className="flex flex-col gap-2 flex-1 overflow-y-auto">
          {[
            { href: "/", label: t("home") },
            { href: "/transportation", label: t("driver") },
          ].map((item, i) => (
            <Link
              key={item.href}
              href={`${localePfx}${item.href}`}
              className="font-display text-[clamp(36px,9vw,64px)] leading-[1.05] tracking-[-0.02em] hover:text-ochre"
              style={drawerItem(i)}
            >
              {item.label}
            </Link>
          ))}
          {/* Tours */}
          <div style={drawerItem(NAV_ITEMS.length)}>
            <p className="font-display text-[clamp(36px,9vw,64px)] leading-[1.05] tracking-[-0.02em] text-cream/40 mb-2">
              {t("tours")}
            </p>
            <div className="flex flex-col gap-1 pl-2 border-l border-cream/20">
              {[
                {
                  href: "/tours/fixed-dates",
                  labelKey: "fixedDatePackages" as const,
                },
                {
                  href: "/tours/daily-packages",
                  labelKey: "dailyPackages" as const,
                },
                {
                  href: "/tours/custom-packages",
                  labelKey: "customDealPackages" as const,
                },
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
          <div style={drawerItem(NAV_ITEMS.length + 1)}>
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
        <div
          className="border-t border-cream/20 pt-6 flex flex-col gap-4"
          style={drawerItem(NAV_ITEMS.length + 2)}
        >
          <a
            href={genericMessage(locale)}
            target="_blank"
            rel="noopener noreferrer"
            style={{ backgroundColor: "#0b1a2e", color: "#c99a3f" }}
            className="inline-flex items-center gap-3 px-6 py-4 text-[13px] tracking-[0.16em] uppercase font-semibold w-fit shadow-[0_4px_24px_-6px_rgba(11,26,46,0.45)] transition-transform duration-200 hover:scale-[1.02] active:scale-[0.99]"
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
