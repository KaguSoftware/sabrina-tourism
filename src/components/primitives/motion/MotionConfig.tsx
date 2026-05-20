"use client";

import { LazyMotion, MotionConfig as FramerMotionConfig, domAnimation } from "framer-motion";
import type { ReactNode } from "react";

export function MotionConfig({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <FramerMotionConfig reducedMotion="user">{children}</FramerMotionConfig>
    </LazyMotion>
  );
}
