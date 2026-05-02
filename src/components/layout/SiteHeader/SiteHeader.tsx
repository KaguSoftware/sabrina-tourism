"use client";
import { useState, useEffect, useLayoutEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS, SCROLL_THRESHOLD } from "./constants";
import { genericMessage } from "@/lib/whatsapp/whatsapp";
import Image from "next/image";

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useLayoutEffect(() => {
    const threshold = pathname.startsWith("/packages/")
      ? window.innerHeight * 0.8
      : pathname === "/packages"
      ? window.innerHeight * 0.3
      : pathname === "/transportation"
      ? window.innerHeight * 0.3
      : SCROLL_THRESHOLD;
    const onScroll = () => setScrolled(window.scrollY > threshold);
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

  const isHeroPage =
    pathname === "/" ||
    pathname.startsWith("/packages") ||
    pathname === "/transportation";
  const transparent = isHeroPage && !scrolled;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          transparent
            ? "bg-transparent border-transparent"
            : "bg-cream/95 backdrop-blur-sm border-b border-rule"
        }`}
      >
        <div className="max-w-[1320px] mx-auto px-[clamp(20px,4vw,56px)] py-6 md:py-4 flex items-center justify-between gap-6">
          {/* Brand */}
          <Link
            href="/"
            className="inline-flex items-center group"
            aria-label="Sabrina Turizm — home"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <Image
              src="/sabrina_logo_cropped.png"
              alt="Sabrina Turizm"
              width="140"
              height="48"
              className="h-[38px] md:h-12 w-auto object-contain transition-all duration-500"
              style={
                transparent
                  ? {}
                  : {
                      filter:
                        "brightness(0) saturate(100%) invert(18%) sepia(40%) saturate(800%) hue-rotate(162deg) brightness(85%)",
                    }
              }
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex gap-8" aria-label="Primary navigation">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`relative text-[13px] tracking-[0.14em] uppercase font-medium py-1.5 transition-colors duration-300 after:absolute after:left-0 after:right-0 after:bottom-0 after:h-px after:bg-ochre after:scale-x-0 after:origin-left after:transition-transform after:duration-300 hover:after:scale-x-100 ${
                  transparent ? "text-cream" : "text-ink"
                } ${pathname === item.href ? "after:scale-x-100" : ""}`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href={genericMessage()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-ochre text-navy px-4 py-2.5 text-[12px] tracking-[0.14em] uppercase font-medium transition-colors duration-300 hover:bg-gold"
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
                    "brightness(0) saturate(100%) invert(12%) sepia(30%) saturate(900%) hue-rotate(162deg) brightness(90%)",
                }}
              />
              <span>WhatsApp</span>
            </a>
          </div>

          {/* Burger */}
          <button
            className={`md:hidden flex flex-col gap-[6px] p-3 ${
              transparent ? "text-cream" : "text-ink"
            }`}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
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
      </header>

      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 bg-navy text-cream z-[60] flex flex-col p-6 transition-transform duration-[460ms] ease-[cubic-bezier(0.22,0.61,0.36,1)] ${
          menuOpen ? "translate-y-0 visible" : "-translate-y-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-hidden={!menuOpen}
      >
        <div className="flex justify-between items-center pb-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <Image
            src="/sabrina_logo_cropped.png"
            alt="Sabrina Turizm"
            width="140"
            height="48"
            className="h-7 w-auto object-contain brightness-0 invert"
          />
          <button
            className="text-3xl leading-none"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
          >
            ×
          </button>
        </div>
        <nav className="flex flex-col gap-2 flex-1">
          {NAV_ITEMS.map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              className="font-display text-[clamp(36px,9vw,64px)] leading-[1.05] tracking-[-0.02em] transition-opacity duration-300 hover:text-ochre"
              style={{
                opacity: menuOpen ? 1 : 0,
                transform: menuOpen ? "translateY(0)" : "translateY(20px)",
                transition: `opacity 600ms cubic-bezier(0.22,0.61,0.36,1) ${
                  100 + i * 60
                }ms, transform 600ms cubic-bezier(0.22,0.61,0.36,1) ${
                  100 + i * 60
                }ms`,
              }}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-cream/20 pt-6 flex flex-col gap-4">
          <a
            href={genericMessage()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-ochre text-navy px-6 py-4 text-[13px] tracking-[0.16em] uppercase font-medium w-fit"
          >
            Reserve via WhatsApp
          </a>
          <p className="text-cream/50 text-[13px] tracking-[0.12em]">
            Istanbul
          </p>
        </div>
      </div>
    </>
  );
}
