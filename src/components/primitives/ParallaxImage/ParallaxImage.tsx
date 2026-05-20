"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";
import { DEFAULT_PARALLAX_AMOUNT } from "./constants";
import type { ParallaxImageProps } from "./types";

// One shared scroll/rAF loop coordinates every ParallaxImage on the page.
// framer-motion's useScroll/useTransform attached one listener + one layout
// read per instance, which added up to real scroll cost. Here a single rAF
// reads viewport once and updates every visible parallax layer.
interface Entry {
  wrap: HTMLDivElement;
  inner: HTMLDivElement;
  amount: number;
  visible: boolean;
  rectTop: number;
  rectHeight: number;
}

const entries = new Set<Entry>();
let rafId = 0;
let io: IntersectionObserver | null = null;

function measureAll() {
  for (const e of entries) {
    if (!e.visible) continue;
    const r = e.wrap.getBoundingClientRect();
    e.rectTop = r.top;
    e.rectHeight = r.height;
  }
}

function update() {
  rafId = 0;
  const vh = window.innerHeight;
  for (const e of entries) {
    if (!e.visible) continue;
    // Recompute against last cached rect — measureAll() syncs rects when the
    // browser is idle (scroll handler doesn't read layout).
    const total = e.rectHeight + vh;
    const passed = vh - e.rectTop;
    const progress = total > 0 ? Math.min(1, Math.max(0, passed / total)) : 0;
    const range = 50 * e.amount;
    const y = range - progress * range * 2; // [+range%, -range%]
    e.inner.style.transform = `translate3d(0, ${y.toFixed(2)}%, 0) scale(1.12)`;
  }
}

function onScroll() {
  // Update all cached rectTops cheaply: rectTop changes by -scrollDelta, but
  // we don't track delta — measureAll() runs once on each rAF instead.
  measureAll();
  if (!rafId) rafId = requestAnimationFrame(update);
}

function ensureGlobals() {
  if (io) return;
  io = new IntersectionObserver(
    (ioEntries) => {
      for (const ioe of ioEntries) {
        for (const e of entries) {
          if (e.wrap === ioe.target) {
            e.visible = ioe.isIntersecting;
            if (e.visible) {
              const r = e.wrap.getBoundingClientRect();
              e.rectTop = r.top;
              e.rectHeight = r.height;
            }
          }
        }
      }
      if (!rafId) rafId = requestAnimationFrame(update);
    },
    { rootMargin: "100px 0px 100px 0px" },
  );
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", () => {
    measureAll();
    if (!rafId) rafId = requestAnimationFrame(update);
  });
}

export function ParallaxImage({
  src,
  alt,
  className = "",
  amount = DEFAULT_PARALLAX_AMOUNT,
  objectPosition = "center",
  priority = false,
}: ParallaxImageProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const inner = innerRef.current;
    if (!wrap || !inner) return;
    ensureGlobals();
    const entry: Entry = {
      wrap,
      inner,
      amount,
      visible: false,
      rectTop: 0,
      rectHeight: 0,
    };
    entries.add(entry);
    io!.observe(wrap);
    return () => {
      io!.unobserve(wrap);
      entries.delete(entry);
    };
  }, [amount]);

  return (
    <div ref={wrapRef} className={`parallax-wrap ${className}`}>
      <div
        ref={innerRef}
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
