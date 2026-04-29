"use client";
import { useState, useEffect, useLayoutEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS, SCROLL_THRESHOLD } from "./constants";
import { genericMessage } from "@/lib/whatsapp/whatsapp";

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useLayoutEffect(() => {
    const threshold = pathname.startsWith("/packages/")
      ? window.innerHeight * 0.8
      : pathname === "/packages"
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
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const isHeroPage =
    pathname === "/" || pathname.startsWith("/packages");
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
        <div
          className="max-w-[1320px] mx-auto px-[clamp(20px,4vw,56px)] py-4 flex items-center justify-between gap-6"
        >
          {/* Brand */}
          <Link
            href="/"
            className="inline-flex items-center gap-3 group"
            aria-label="Meridian & Co. — home"
          >
            <span
              className={`font-display italic text-[22px] w-9 h-9 rounded-full border flex items-center justify-center tracking-tight transition-colors duration-300 ${
                transparent
                  ? "border-ochre text-ochre"
                  : "border-ochre text-ochre"
              }`}
            >
              M
            </span>
            <span
              className={`font-display text-[20px] tracking-tight transition-colors duration-300 ${
                transparent ? "text-cream" : "text-ink"
              }`}
            >
              Meridian{" "}
              <span className="text-ochre italic">&amp;</span> Co.
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex gap-8" aria-label="Primary navigation">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`relative text-[13px] tracking-[0.14em] uppercase font-medium py-1.5 transition-colors duration-300 after:absolute after:left-0 after:right-0 after:bottom-0 after:h-px after:bg-ochre after:scale-x-0 after:origin-left after:transition-transform after:duration-300 hover:after:scale-x-100 ${
                  transparent ? "text-cream" : "text-ink"
                } ${
                  pathname === item.href ? "after:scale-x-100" : ""
                }`}
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
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M20.5 3.5A11 11 0 0 0 3.6 17.6L2 22l4.5-1.5A11 11 0 1 0 20.5 3.5zm-8.5 18a8.9 8.9 0 0 1-4.6-1.3l-.3-.2-2.7.9.9-2.6-.2-.3a8.9 8.9 0 1 1 6.9 3.5zm5-6.7c-.3-.1-1.6-.8-1.9-.9-.3-.1-.4-.1-.6.1l-.9 1c-.2.2-.3.2-.6.1a7.3 7.3 0 0 1-2.1-1.3 8 8 0 0 1-1.4-1.8c-.1-.3 0-.4.1-.5l.4-.5c.1-.1.2-.3.3-.5 0-.2 0-.3-.1-.5l-.8-2c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.4 3 3 0 0 0-.9 2.2c0 1.3.9 2.5 1 2.7.1.2 1.9 2.9 4.5 4 1.1.5 2 .8 2.7.9a3.3 3.3 0 0 0 1.5-.1c.4-.1 1.6-.7 1.8-1.3.2-.7.2-1.2.2-1.3-.1-.1-.3-.2-.6-.3z" />
              </svg>
              <span>WhatsApp</span>
            </a>
          </div>

          {/* Burger */}
          <button
            className={`md:hidden flex flex-col gap-[5px] p-2 ${transparent ? "text-cream" : "text-ink"}`}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((o) => !o)}
          >
            <span className="w-[22px] h-px bg-current block transition-all duration-300" />
            <span className="w-[22px] h-px bg-current block transition-all duration-300" />
            <span className="w-[22px] h-px bg-current block transition-all duration-300" />
          </button>
        </div>
      </header>

      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 bg-navy text-cream z-[60] flex flex-col p-6 transition-transform duration-[460ms] ease-[cubic-bezier(0.22,0.61,0.36,1)] ${
          menuOpen ? "translate-y-0 visible" : "-translate-y-full invisible"
        }`}
        role="dialog"
        aria-modal="true"
        aria-hidden={!menuOpen}
      >
        <div className="flex justify-between items-center pb-10">
          <span className="font-display text-[20px]">
            Meridian <span className="text-ochre italic">&amp;</span> Co.
          </span>
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
                transition: `opacity 600ms cubic-bezier(0.22,0.61,0.36,1) ${100 + i * 60}ms, transform 600ms cubic-bezier(0.22,0.61,0.36,1) ${100 + i * 60}ms`,
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
            concierge@meridianandco.tr · Istanbul
          </p>
        </div>
      </div>
    </>
  );
}
