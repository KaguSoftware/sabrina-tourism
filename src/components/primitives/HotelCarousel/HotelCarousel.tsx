"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import type { RoomType } from "@/lib/regions/hotels";

interface HotelCarouselProps {
  images: string[];
  hotelName: string;
  roomTypes?: RoomType[];
  activeRoomIndex?: number;
}

export function HotelCarousel({ images, hotelName, roomTypes, activeRoomIndex }: HotelCarouselProps) {
  const [current, setCurrent] = useState(0);
  const prevRef = useRef(activeRoomIndex);

  // When parent selects a room type, jump to its image
  useEffect(() => {
    if (
      activeRoomIndex !== undefined &&
      activeRoomIndex !== prevRef.current &&
      roomTypes?.[activeRoomIndex] !== undefined
    ) {
      const idx = roomTypes[activeRoomIndex].imageIndex;
      if (idx < images.length) setCurrent(idx);
      prevRef.current = activeRoomIndex;
    }
  }, [activeRoomIndex, roomTypes, images.length]);

  const prev = useCallback(() => setCurrent((i) => (i === 0 ? images.length - 1 : i - 1)), [images.length]);
  const next = useCallback(() => setCurrent((i) => (i === images.length - 1 ? 0 : i + 1)), [images.length]);

  if (images.length === 0) return null;

  const IMAGE_LABELS = ["Exterior", "Bedroom", "Bathroom", "View", "Detail", "Common Area"];

  return (
    <div className="w-full">
      {/* Main image */}
      <div className="relative w-full aspect-16/10 overflow-hidden border border-rule">
        {images.map((src, i) => (
          <div
            key={src}
            className="absolute inset-0 transition-opacity duration-500"
            style={{ opacity: i === current ? 1 : 0, zIndex: i === current ? 1 : 0 }}
          >
            <Image
              src={src}
              alt={`${hotelName} — ${IMAGE_LABELS[i] ?? `photo ${i + 1}`}`}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 55vw"
              priority={i === 0}
            />
          </div>
        ))}

        {/* Label */}
        <span className="absolute bottom-4 left-4 z-10 bg-ink/70 text-cream font-mono text-[10px] tracking-[0.18em] uppercase px-3 py-1.5 backdrop-blur-sm">
          {IMAGE_LABELS[current] ?? `Photo ${current + 1}`}
        </span>

        {/* Counter */}
        <span className="absolute bottom-4 right-4 z-10 bg-ink/70 text-cream font-mono text-[10px] tracking-[0.14em] px-3 py-1.5 backdrop-blur-sm">
          {current + 1} / {images.length}
        </span>

        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              aria-label="Previous image"
              style={{ backgroundColor: "rgba(11,26,46,0.6)", color: "#ffffff" }}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 flex items-center justify-center shadow-xl transition-opacity duration-200 hover:opacity-90"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
            </button>
            <button
              onClick={next}
              aria-label="Next image"
              style={{ backgroundColor: "rgba(11,26,46,0.6)", color: "#ffffff" }}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 flex items-center justify-center shadow-xl transition-opacity duration-200 hover:opacity-90"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
          </>
        )}
      </div>

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div className="flex gap-2 mt-2">
          {images.map((src, i) => (
            <button
              key={src}
              onClick={() => setCurrent(i)}
              aria-label={`View ${IMAGE_LABELS[i] ?? `photo ${i + 1}`}`}
              className={`relative flex-1 aspect-4/3 overflow-hidden border transition-all duration-200 ${
                i === current ? "border-ochre" : "border-rule opacity-60 hover:opacity-90"
              }`}
            >
              <Image
                src={src}
                alt={IMAGE_LABELS[i] ?? `Photo ${i + 1}`}
                fill
                className="object-cover"
                sizes="120px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
