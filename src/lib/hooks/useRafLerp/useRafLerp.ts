"use client";
import { useEffect, useRef, useCallback } from "react";
import { DEFAULT_LERP_FACTOR } from "./constants";
import type { RafLerpState } from "./types";

export function useRafLerp(
  onUpdate: (current: RafLerpState) => void,
  factor = DEFAULT_LERP_FACTOR
) {
  const target = useRef<RafLerpState>({ x: 0, y: 0 });
  const current = useRef<RafLerpState>({ x: 0, y: 0 });
  const rafRef = useRef(0);

  const tick = useCallback(() => {
    current.current.x += (target.current.x - current.current.x) * factor;
    current.current.y += (target.current.y - current.current.y) * factor;
    onUpdate({ ...current.current });
    rafRef.current = requestAnimationFrame(tick);
  }, [onUpdate, factor]);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [tick]);

  const setTarget = useCallback((x: number, y: number) => {
    target.current = { x, y };
  }, []);

  return setTarget;
}
