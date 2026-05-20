"use client";

import { m, type Variants } from "framer-motion";
import type { ReactNode } from "react";

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  y?: number;
  duration?: number;
  once?: boolean;
}

const buildVariants = (y: number, duration: number, delay: number): Variants => ({
  hidden: { opacity: 0, y },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration, delay: delay / 1000, ease: [0.22, 0.61, 0.36, 1] },
  },
});

export function FadeIn({
  children,
  delay = 0,
  className = "",
  y = 20,
  duration = 0.7,
  once = true,
}: FadeInProps) {
  return (
    <m.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-10% 0px -10% 0px" }}
      variants={buildVariants(y, duration, delay)}
    >
      {children}
    </m.div>
  );
}
