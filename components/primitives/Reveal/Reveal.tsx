"use client";
import { useReveal } from "@/lib/hooks/useReveal/useReveal";
import type { RevealProps } from "./types";

export function Reveal({
  children,
  delay = 0,
  className = "",
  as: Tag = "div",
}: RevealProps) {
  const ref = useReveal();

  return (
    <Tag
      ref={ref as React.RefObject<never>}
      className={className}
      style={{ transitionDelay: delay ? `${delay}ms` : undefined }}
    >
      {children}
    </Tag>
  );
}
