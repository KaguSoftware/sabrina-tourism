import { HAIRLINE_BASE, HAIRLINE_GOLD, HAIRLINE_RULE } from "./constants";
import type { HairlineProps } from "./types";

export function Hairline({ className = "", gold = false }: HairlineProps) {
  return (
    <div
      className={`${HAIRLINE_BASE} ${gold ? HAIRLINE_GOLD : HAIRLINE_RULE} ${className}`}
      role="separator"
    />
  );
}
