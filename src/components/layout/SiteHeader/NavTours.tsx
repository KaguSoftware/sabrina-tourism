"use client";
import { useState, useRef } from "react";
import Link from "next/link";

const TOUR_ITEMS = [
  {
    href: "/tours/fixed-dates",
    label: "Fixed-Date Tours",
    tag: "Scheduled",
    description:
      "Departure dates set in advance. Join a small group, everything arranged — guides, transport, and handpicked hotels included.",
    detail: "8 upcoming departures",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
        <line x1="8" y1="15" x2="8" y2="15" strokeWidth="2" />
        <line x1="12" y1="15" x2="12" y2="15" strokeWidth="2" />
        <line x1="16" y1="15" x2="16" y2="15" strokeWidth="2" />
      </svg>
    ),
  },
  {
    href: "/tours/daily-packages",
    label: "Daily Packages",
    tag: "1-Day",
    description:
      "Single-day excursions to Türkiye's most iconic sites. Ideal for travellers short on time or adding a day trip to a longer stay.",
    detail: "Cappadocia · Ephesus · Istanbul",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <polyline points="12 7 12 12 15.5 15.5" />
      </svg>
    ),
  },
  {
    href: "/tours/custom-packages",
    label: "Custom Packages",
    tag: "Bespoke",
    description:
      "Your itinerary, your pace, your dates. We design a private programme around your group — from boutique routes to off-road escapes.",
    detail: "Private · Fully flexible",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20h9" />
        <path d="M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 19.635a2 2 0 0 1-.855.506l-2.872.861a.5.5 0 0 1-.62-.62l.86-2.873a2 2 0 0 1 .506-.854z" />
      </svg>
    ),
  },
];

interface NavToursProps {
  currentPath: string;
  transparent: boolean;
}

export function NavTours({ currentPath, transparent }: NavToursProps) {
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
    currentPath.startsWith("/tours") || currentPath.startsWith("/packages");

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <span
        className={`relative text-[13px] tracking-[0.14em] uppercase font-medium py-1.5 transition-colors duration-300 cursor-pointer select-none after:absolute after:left-0 after:right-0 after:bottom-0 after:h-px after:bg-ochre after:scale-x-0 after:origin-left after:transition-transform after:duration-300 hover:after:scale-x-100 ${
          transparent ? "text-cream" : "text-ink"
        } ${isActive || open ? "after:scale-x-100" : ""}`}
        role="button"
        aria-haspopup="true"
        aria-expanded={open}
      >
        Tours
      </span>

      {open && (
        <div
          className="absolute top-full right-0 mt-3 bg-cream border border-rule shadow-[0_16px_56px_-10px_rgba(11,26,46,0.28)] z-50 w-[420px]"
          role="menu"
        >
          <div className="absolute -top-3 left-0 right-0 h-3" />

          <div className="px-5 pt-4 pb-3 border-b border-rule">
            <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-muted">
              Choose your travel style
            </p>
          </div>

          <div className="flex flex-col divide-y divide-rule">
            {TOUR_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group flex items-start gap-4 px-5 py-4 hover:bg-ochre/5 transition-colors duration-150"
                role="menuitem"
              >
                <div className="mt-0.5 shrink-0 w-10 h-10 flex items-center justify-center border border-rule bg-cream group-hover:border-ochre group-hover:text-ochre text-ink/40 transition-colors duration-150 rounded-xl">
                  {item.icon}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-[13px] tracking-[0.06em] uppercase font-semibold text-ink group-hover:text-ochre transition-colors duration-150">
                      {item.label}
                    </p>
                    <span className="font-mono text-[9px] tracking-[0.18em] uppercase text-ochre/70 border border-ochre/30 px-1.5 py-0.5 leading-none">
                      {item.tag}
                    </span>
                  </div>
                  <p className="text-[12px] leading-relaxed text-ink/55 mb-1.5">
                    {item.description}
                  </p>
                  <p className="font-mono text-[10px] tracking-[0.14em] uppercase text-muted">
                    {item.detail}
                  </p>
                </div>

                <svg
                  className="mt-1 shrink-0 text-ink/20 group-hover:text-ochre translate-x-0 transition-all duration-150 group-hover:translate-x-0.5"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
