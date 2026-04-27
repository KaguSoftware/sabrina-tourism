"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { PassportStamp } from "@/components/primitives/PassportStamp/PassportStamp";
import { DEFAULT_SECTIONS, STAMP_ROTATIONS } from "./constants";
import type { PassportStampTrackerProps } from "./types";

export function PassportStampTracker({ sections = DEFAULT_SECTIONS }: PassportStampTrackerProps) {
  const [stamped, setStamped] = useState<boolean[]>(() => sections.map(() => false));
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const prevPath = useRef(pathname);

  // Reset stamps on page navigation
  useEffect(() => {
    if (prevPath.current !== pathname) {
      prevPath.current = pathname;
      setStamped(sections.map(() => false));
    }
  }, [pathname, sections]);

  // Observe h2/section elements that contain section name text
  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    sections.forEach((name, i) => {
      // Look for any element whose text content includes the section name
      const candidates = Array.from(
        document.querySelectorAll("section[data-section], h1, h2, h3")
      ).filter((el) =>
        el.textContent?.toLowerCase().includes(name.toLowerCase())
      );

      if (candidates.length === 0) return;

      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setStamped((prev) => {
              if (prev[i]) return prev;
              const next = [...prev];
              next[i] = true;
              return next;
            });
            obs.disconnect();
          }
        },
        { threshold: 0.3 }
      );

      candidates.forEach((el) => obs.observe(el));
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [pathname, sections]);

  const count = stamped.filter(Boolean).length;
  const total = sections.length;

  if (total === 0) return null;

  return (
    <div
      className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3"
      role="region"
      aria-label="Passport stamp progress"
    >
      {/* Stamp panel */}
      <div
        className={`transition-all duration-500 ease-out origin-bottom-right overflow-hidden ${
          open ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-90 pointer-events-none"
        }`}
        style={{ maxHeight: open ? "500px" : "0" }}
      >
        <div className="bg-navy/92 backdrop-blur-sm border border-ochre/20 p-4 rounded-sm shadow-2xl">
          <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-ochre mb-3 text-center">
            Meridian Passport
          </p>
          <div className="grid grid-cols-3 gap-1">
            {sections.map((name, i) => (
              <div key={name} className="flex flex-col items-center gap-1">
                <PassportStamp
                  label={name.toUpperCase().slice(0, 10)}
                  rotation={STAMP_ROTATIONS[i % STAMP_ROTATIONS.length]}
                  visible={stamped[i]}
                />
                <span
                  className={`font-mono text-[8px] tracking-[0.15em] uppercase transition-colors duration-300 ${
                    stamped[i] ? "text-ochre" : "text-cream/25"
                  }`}
                >
                  {name}
                </span>
              </div>
            ))}
          </div>
          <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-cream/40 mt-3 text-center">
            {count} / {total} collected
          </p>
        </div>
      </div>

      {/* Toggle button */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? "Close passport" : "Open passport stamps"}
        className="relative w-12 h-12 bg-navy border border-ochre/40 shadow-lg hover:border-ochre transition-colors duration-200 flex items-center justify-center group"
      >
        {/* Passport book icon */}
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden="true">
          <rect x="4" y="3" width="13" height="18" rx="1.5" fill="#162b47" stroke="#c99a3f" strokeWidth="1.2" />
          <rect x="4" y="3" width="4" height="18" rx="1" fill="#0b1a2e" />
          <circle cx="13.5" cy="12" r="3" stroke="#c99a3f" strokeWidth="0.9" fill="none" />
          <circle cx="13.5" cy="12" r="1" fill="#c99a3f" />
        </svg>
        {/* Badge count */}
        {count > 0 && (
          <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-ochre text-navy font-mono text-[9px] font-bold flex items-center justify-center leading-none">
            {count}
          </span>
        )}
      </button>
    </div>
  );
}
