"use client";
import Image from "next/image";

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
  return (
    <div
      className="fixed inset-0 bg-navy/96 z-200 flex items-center justify-center p-14"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      style={{ animation: "fadeIn 240ms ease-out" }}
    >
      <button
        className="absolute top-6 right-7 text-cream text-3xl leading-none w-11 h-11 border border-cream/30 flex items-center justify-center hover:border-ochre hover:text-ochre transition-colors"
        aria-label="Close lightbox"
        onClick={onClose}
      >
        ×
      </button>
      <button
        className="absolute left-6 top-1/2 -translate-y-1/2 text-cream text-[48px] leading-none w-14 h-14 border border-cream/20 flex items-center justify-center hover:border-ochre hover:text-ochre transition-colors"
        aria-label="Previous image"
        onClick={(e) => { e.stopPropagation(); onPrev(); }}
      >
        ‹
      </button>
      <div className="relative max-h-full max-w-full" onClick={(e) => e.stopPropagation()}>
        <Image src={gallery[index]} alt="" width={1200} height={800} className="object-contain max-h-[80vh]" priority />
      </div>
      <button
        className="absolute right-6 top-1/2 -translate-y-1/2 text-cream text-[48px] leading-none w-14 h-14 border border-cream/20 flex items-center justify-center hover:border-ochre hover:text-ochre transition-colors"
        aria-label="Next image"
        onClick={(e) => { e.stopPropagation(); onNext(); }}
      >
        ›
      </button>
      <span className="absolute bottom-7 left-1/2 -translate-x-1/2 font-display italic text-cream text-[14px] tracking-widest">
        {String(index + 1).padStart(2, "0")} / {String(gallery.length).padStart(2, "0")}
      </span>
    </div>
  );
}
