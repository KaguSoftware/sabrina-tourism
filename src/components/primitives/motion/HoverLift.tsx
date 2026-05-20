"use client";

import { m } from "framer-motion";
import type { ReactNode } from "react";

interface HoverLiftProps {
  children: ReactNode;
  className?: string;
  lift?: number;
  scale?: number;
}

export function HoverLift({ children, className = "", lift = 4, scale = 1.02 }: HoverLiftProps) {
  return (
    <m.div
      className={className}
      whileHover={{ y: -lift, scale }}
      whileTap={{ scale: scale - 0.01 }}
      transition={{ type: "spring", stiffness: 300, damping: 24, mass: 0.6 }}
    >
      {children}
    </m.div>
  );
}
