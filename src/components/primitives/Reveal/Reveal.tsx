"use client";

import { m, type Variants } from "framer-motion";
import type { RevealProps } from "./types";

const buildVariants = (delay: number): Variants => ({
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: delay / 1000, ease: [0.22, 0.61, 0.36, 1] },
  },
});

export function Reveal({
  children,
  delay = 0,
  className = "",
  as = "div",
}: RevealProps) {
  const variants = buildVariants(delay);
  const viewport = { once: true, margin: "-10% 0px -10% 0px" } as const;

  const common = {
    className,
    initial: "hidden" as const,
    whileInView: "visible" as const,
    viewport,
    variants,
  };

  switch (as) {
    case "li":
      return <m.li {...common}>{children}</m.li>;
    case "ul":
      return <m.ul {...common}>{children}</m.ul>;
    case "ol":
      return <m.ol {...common}>{children}</m.ol>;
    case "section":
      return <m.section {...common}>{children}</m.section>;
    case "article":
      return <m.article {...common}>{children}</m.article>;
    case "aside":
      return <m.aside {...common}>{children}</m.aside>;
    case "header":
      return <m.header {...common}>{children}</m.header>;
    case "footer":
      return <m.footer {...common}>{children}</m.footer>;
    case "main":
      return <m.main {...common}>{children}</m.main>;
    case "nav":
      return <m.nav {...common}>{children}</m.nav>;
    case "span":
      return <m.span {...common}>{children}</m.span>;
    case "p":
      return <m.p {...common}>{children}</m.p>;
    default:
      return <m.div {...common}>{children}</m.div>;
  }
}
