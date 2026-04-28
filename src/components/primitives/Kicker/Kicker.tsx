import {
  KICKER_BASE_CLASS,
  KICKER_DARK_CLASS,
  KICKER_LIGHT_CLASS,
  KICKER_DASH_CLASS,
} from "./constants";
import type { KickerProps } from "./types";

export function Kicker({ children, light = false, className = "" }: KickerProps) {
  const colorClass = light ? KICKER_LIGHT_CLASS : KICKER_DARK_CLASS;
  return (
    <span className={`${KICKER_BASE_CLASS} ${colorClass} ${className}`}>
      <span className={KICKER_DASH_CLASS} aria-hidden="true" />
      {children}
    </span>
  );
}
