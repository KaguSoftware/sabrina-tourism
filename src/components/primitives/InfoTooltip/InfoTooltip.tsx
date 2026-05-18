"use client";
import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

const TOOLTIP_W = 200;
const GAP = 10;

export function InfoTooltip({ text }: { text: string }) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const btnRef = useRef<HTMLButtonElement>(null);

  function calcPos() {
    if (!btnRef.current) return;
    const r = btnRef.current.getBoundingClientRect();
    const top = r.top - GAP;
    const idealLeft = r.left + r.width / 2 - TOOLTIP_W / 2;
    const clampedLeft = Math.min(
      Math.max(idealLeft, 8),
      window.innerWidth - TOOLTIP_W - 8
    );
    setPos({ top, left: clampedLeft });
  }

  useEffect(() => {
    if (!open) return;
    calcPos();
    function handleOutside(e: MouseEvent | TouchEvent) {
      if (btnRef.current && !btnRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("touchstart", handleOutside);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("touchstart", handleOutside);
    };
  }, [open]);

  const arrowLeft = Math.min(
    Math.max((btnRef.current?.getBoundingClientRect().left ?? 0) + (btnRef.current?.getBoundingClientRect().width ?? 0) / 2 - pos.left - 5, 8),
    TOOLTIP_W - 18
  );

  return (
    <span className="relative inline-flex items-center">
      <button
        ref={btnRef}
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
      {open && typeof document !== "undefined" && createPortal(
        <span
          style={{ top: pos.top, left: pos.left, width: TOOLTIP_W, transform: "translateY(calc(-100% - 10px))" }}
          className="fixed z-[9999] px-3 py-2.5 rounded bg-navy text-cream text-[12px] font-sans font-normal normal-case tracking-normal leading-relaxed shadow-xl pointer-events-none"
        >
          {text}
          <span
            style={{ left: arrowLeft }}
            className="absolute top-full w-0 h-0 border-x-[5px] border-x-transparent border-t-[5px] border-t-navy"
          />
        </span>,
        document.body
      )}
    </span>
  );
}
