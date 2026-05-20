"use client";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { AnimatePresence, m } from "framer-motion";

export function PackageLightbox({
  gallery,
  index,
  onClose,
  onPrev,
  onNext,
}: {
  gallery: string[];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const touchStartX = useRef<number | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const previousActiveRef = useRef<HTMLElement | null>(null);

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 50) {
      if (dx < 0) onNext();
      else onPrev();
    }
    touchStartX.current = null;
  }

  // Capture the element that opened the lightbox, return focus on close.
  useEffect(() => {
    previousActiveRef.current = document.activeElement as HTMLElement | null;
    closeBtnRef.current?.focus();
    const prev = previousActiveRef.current;
    return () => {
      prev?.focus?.();
    };
  }, []);

  // Lock body scroll while open.
  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, []);

  // Trap focus inside the dialog.
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key !== "Tab") return;
      const root = overlayRef.current;
      if (!root) return;
      const focusable = root.querySelectorAll<HTMLElement>(
        'button, [href], input, [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <AnimatePresence>
      <m.div
        ref={overlayRef}
        className="fixed inset-0 bg-navy/96 z-200 flex items-center justify-center p-4 md:p-14"
        role="dialog"
        aria-modal="true"
        aria-label="Image gallery"
        onClick={onClose}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.24, ease: [0.22, 0.61, 0.36, 1] }}
      >
        <button
          ref={closeBtnRef}
          className="absolute top-3 right-3 md:top-6 md:right-7 text-cream text-3xl leading-none w-11 h-11 border border-cream/30 bg-navy/60 backdrop-blur-sm flex items-center justify-center hover:border-ochre hover:text-ochre transition-colors"
          aria-label="Close lightbox"
          onClick={onClose}
        >
          ×
        </button>
        <button
          className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 text-cream text-[36px] md:text-[48px] leading-none w-11 h-11 md:w-14 md:h-14 border border-cream/20 bg-navy/60 backdrop-blur-sm flex items-center justify-center hover:border-ochre hover:text-ochre transition-colors"
          aria-label="Previous image"
          onClick={(e) => { e.stopPropagation(); onPrev(); }}
        >
          ‹
        </button>
        <m.div
          key={index}
          className="relative max-h-full max-w-full"
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.28, ease: [0.22, 0.61, 0.36, 1] }}
        >
          <Image
            src={gallery[index]}
            alt={`Gallery image ${index + 1} of ${gallery.length}`}
            width={1200}
            height={800}
            className="object-contain max-h-[80vh]"
            priority
          />
        </m.div>
        <button
          className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 text-cream text-[36px] md:text-[48px] leading-none w-11 h-11 md:w-14 md:h-14 border border-cream/20 bg-navy/60 backdrop-blur-sm flex items-center justify-center hover:border-ochre hover:text-ochre transition-colors"
          aria-label="Next image"
          onClick={(e) => { e.stopPropagation(); onNext(); }}
        >
          ›
        </button>
        <span className="absolute bottom-7 left-1/2 -translate-x-1/2 font-display italic text-cream text-[14px] tracking-widest">
          {String(index + 1).padStart(2, "0")} / {String(gallery.length).padStart(2, "0")}
        </span>
      </m.div>
    </AnimatePresence>
  );
}
