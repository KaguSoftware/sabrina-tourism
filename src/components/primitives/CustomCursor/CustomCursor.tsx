"use client";
import { useEffect, useRef, useState } from "react";
import { CURSOR_LERP, INTERACTIVE_SELECTORS } from "./constants";

export function CustomCursor() {
  const cursorRef = useRef<SVGSVGElement>(null);
  const target = useRef({ x: -100, y: -100 });
  const current = useRef({ x: -100, y: -100 });
  const rafRef = useRef(0);
  const [isHover, setIsHover] = useState(false);
  const [isPress, setIsPress] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(true);

  useEffect(() => {
    setIsTouchDevice(window.matchMedia("(hover: none)").matches);

    const onMove = (e: MouseEvent) => {
      target.current = { x: e.clientX, y: e.clientY };
    };

    const onOver = (e: MouseEvent) => {
      const el = e.target as Element;
      setIsHover(!!el.closest(INTERACTIVE_SELECTORS));
    };

    const onDown = () => setIsPress(true);
    const onUp = () => setIsPress(false);

    const tick = () => {
      const c = current.current;
      const t = target.current;
      c.x += (t.x - c.x) * CURSOR_LERP;
      c.y += (t.y - c.y) * CURSOR_LERP;

      const el = cursorRef.current;
      if (el) {
        const rot = isPress ? -12 : isHover ? -3 : -8;
        const scale = isPress ? 0.9 : isHover ? 1.15 : 1;
        el.style.transform = `translate(${c.x}px, ${c.y}px) translate(-50%, -50%) rotate(${rot}deg) scale(${scale})`;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover", onOver);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      cancelAnimationFrame(rafRef.current);
    };
  }, [isHover, isPress]);

  if (isTouchDevice) return null;

  return (
    <svg
      ref={cursorRef}
      aria-hidden="true"
      viewBox="0 0 60 40"
      width="60"
      height="40"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        pointerEvents: "none",
        zIndex: 9999,
        transition: "transform 80ms ease-out",
      }}
    >
      {/* luggage tag */}
      <line x1="2" y1="6" x2="14" y2="14" stroke="#1b4d5c" strokeWidth="1.5" />
      <circle cx="2" cy="6" r="2" fill="#1b4d5c" />
      <rect x="14" y="6" width="40" height="28" rx="4" fill="#c99a3f" stroke="#1b4d5c" strokeWidth="1.8" />
      <circle cx="20" cy="20" r="2.2" fill="#1b4d5c" />
      <line x1="28" y1="14" x2="48" y2="14" stroke="#1b4d5c" strokeWidth="1.4" opacity="0.6" />
      <line x1="28" y1="20" x2="42" y2="20" stroke="#1b4d5c" strokeWidth="1.4" opacity="0.6" />
      <line x1="28" y1="26" x2="46" y2="26" stroke="#1b4d5c" strokeWidth="1.4" opacity="0.6" />
    </svg>
  );
}
