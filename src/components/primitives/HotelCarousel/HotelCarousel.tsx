"use client";

import { useState, useCallback } from "react";
import Image from "next/image";

const LABELS = ["Exterior", "Bedroom", "Bathroom", "View"];

interface HotelCarouselProps {
  images: string[];
  hotelName: string;
}

export function HotelCarousel({ images, hotelName }: HotelCarouselProps) {
  const [current, setCurrent] = useState(0);

  const prev = useCallback(() => {
    setCurrent((i) => (i === 0 ? images.length - 1 : i - 1));
  }, [images.length]);

  const next = useCallback(() => {
    setCurrent((i) => (i === images.length - 1 ? 0 : i + 1));
  }, [images.length]);

  if (images.length === 0) return null;

  return (
    <div className="relative aspect-4/3 overflow-hidden max-w-120 border border-rule">
      {images.map((src, i) => (
        <div
          key={src}
          className="absolute inset-0 transition-opacity duration-500"
          style={{ opacity: i === current ? 1 : 0, zIndex: i === current ? 1 : 0 }}
        >
          <Image
            src={src}
            alt={`${hotelName} — photo ${i + 1}`}
            fill
            className="object-cover"
            sizes="480px"
            priority={i === 0}
          />
        </div>
      ))}

      {/* Overlay label */}
      <span className="absolute bottom-3 left-3 z-10 bg-ink/70 text-cream font-mono text-[10px] tracking-[0.18em] uppercase px-2.5 py-1 backdrop-blur-sm">
        {LABELS[current] ?? `Photo ${current + 1}`}
      </span>

      {/* Counter */}
      <span className="absolute bottom-3 right-3 z-10 bg-ink/70 text-cream font-mono text-[10px] tracking-[0.14em] px-2.5 py-1 backdrop-blur-sm">
        {current + 1} / {images.length}
      </span>

      {/* Prev / Next */}
      {images.length > 1 && (
        <>
          <button
            onClick={prev}
            aria-label="Previous image"
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center bg-ink/60 text-cream backdrop-blur-sm hover:bg-ink/80 transition-colors duration-200"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <button
            onClick={next}
            aria-label="Next image"
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center bg-ink/60 text-cream backdrop-blur-sm hover:bg-ink/80 transition-colors duration-200"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
          </button>

          {/* Dot indicators */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                aria-label={`Go to photo ${i + 1}`}
                className="w-1.5 h-1.5 rounded-full transition-all duration-200"
                style={{ backgroundColor: i === current ? "#c99a3f" : "rgba(255,255,255,0.45)" }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
