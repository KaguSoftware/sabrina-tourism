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
  const AnyTag = Tag as React.ElementType;

  return (
    <AnyTag
      ref={ref}
      className={className}
      style={{ transitionDelay: delay ? `${delay}ms` : undefined }}
    >
      {children}
    </AnyTag>
  );
}
