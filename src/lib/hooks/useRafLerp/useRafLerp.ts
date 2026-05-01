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
  const onUpdateRef = useRef(onUpdate);
  const factorRef = useRef(factor);

  useEffect(() => { onUpdateRef.current = onUpdate; }, [onUpdate]);
  useEffect(() => { factorRef.current = factor; }, [factor]);

  useEffect(() => {
    function tick() {
      current.current.x += (target.current.x - current.current.x) * factorRef.current;
      current.current.y += (target.current.y - current.current.y) * factorRef.current;
      onUpdateRef.current({ ...current.current });
      rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const setTarget = useCallback((x: number, y: number) => {
    target.current = { x, y };
  }, []);

  return setTarget;
}
