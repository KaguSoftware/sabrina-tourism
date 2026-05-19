"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";
import { DEFAULT_PARALLAX_AMOUNT } from "./constants";
import type { ParallaxImageProps } from "./types";

export function ParallaxImage({
  src,
  alt,
  className = "",
  amount = DEFAULT_PARALLAX_AMOUNT,
  objectPosition = "center",
  priority = false,
}: ParallaxImageProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    // Respect reduced-motion: skip parallax entirely, no listener attached.
    if (prefersReduced) return;

    const wrap = wrapRef.current;
    if (!wrap) return;

    let raf = 0;
    let scrollAttached = false;

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const wrapEl = wrapRef.current;
        const img = imgRef.current;
        if (!wrapEl || !img) return;
        const rect = wrapEl.getBoundingClientRect();
        const vh = window.innerHeight;
        const center = rect.top + rect.height / 2;
        const progress = (center - vh / 2) / (vh + rect.height);
        const ty = -progress * 100 * amount;
        img.style.transform = `translate3d(0, ${ty}%, 0) scale(1.12)`;
      });
    };

    const attachScroll = () => {
      if (scrollAttached) return;
      window.addEventListener("scroll", onScroll, { passive: true });
      scrollAttached = true;
      onScroll();
    };

    const detachScroll = () => {
      if (!scrollAttached) return;
      window.removeEventListener("scroll", onScroll);
      scrollAttached = false;
      if (raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    };

    // Only attach the scroll handler while the element is near/within the
    // viewport. rootMargin warms it up before it becomes visible.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          attachScroll();
        } else {
          detachScroll();
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(wrap);

    return () => {
      observer.disconnect();
      detachScroll();
    };
  }, [amount]);

  return (
    <div ref={wrapRef} className={`parallax-wrap ${className}`}>
      <div
        ref={imgRef}
        style={{
          position: "absolute",
          inset: "-15% 0",
          transform: "translate3d(0,0,0) scale(1.12)",
          willChange: "transform",
        }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          loading={priority ? "eager" : "lazy"}
          priority={priority}
          style={{ objectFit: "cover", objectPosition }}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
    </div>
  );
}
