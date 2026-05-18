"use client";
import { useState, useRef, useEffect } from "react";

export function InfoTooltip({ text }: { text: string }) {
  const [open, setOpen] = useState(false);
  const [align, setAlign] = useState<"center" | "left" | "right">("center");
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!open || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const tooltipW = 200;
    const spaceLeft = rect.left;
    const spaceRight = window.innerWidth - rect.right;
    if (spaceLeft < tooltipW / 2) setAlign("left");
    else if (spaceRight < tooltipW / 2) setAlign("right");
    else setAlign("center");
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function handleOutside(e: MouseEvent | TouchEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("touchstart", handleOutside);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("touchstart", handleOutside);
    };
  }, [open]);

  const popoverPos =
    align === "left"
      ? "left-0"
      : align === "right"
      ? "right-0"
      : "left-1/2 -translate-x-1/2";

  const arrowPos =
    align === "left"
      ? "left-3"
      : align === "right"
      ? "right-3"
      : "left-1/2 -translate-x-1/2";

  return (
    <span ref={ref} className="relative inline-flex items-center">
      <button
        type="button"
        aria-label="More information"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
        onTouchEnd={(e) => { e.preventDefault(); e.stopPropagation(); setOpen((o) => !o); }}
        className="w-4.5 h-4.5 rounded-full flex items-center justify-center shrink-0 transition-all duration-200 hover:scale-110"
        style={{ backgroundColor: "#0b1a2e", border: "1px solid #c99a3f" }}
      >
        <svg viewBox="0 0 12 12" fill="none" className="w-2.5 h-2.5" aria-hidden>
          <circle cx="6" cy="3.2" r="1.1" fill="#c99a3f" />
          <rect x="5.05" y="5.2" width="1.9" height="4.2" rx="0.95" fill="#c99a3f" />
        </svg>
      </button>
      {open && (
        <span className={`absolute bottom-full ${popoverPos} mb-2.5 z-50 w-50 max-w-[calc(100vw-2rem)] px-3 py-2.5 rounded bg-navy text-cream text-[12px] font-sans font-normal normal-case tracking-normal leading-relaxed shadow-xl pointer-events-none animate-in fade-in duration-150`}>
          {text}
          <span className={`absolute top-full ${arrowPos} w-0 h-0 border-x-[5px] border-x-transparent border-t-[5px] border-t-navy`} />
        </span>
      )}
    </span>
  );
}
