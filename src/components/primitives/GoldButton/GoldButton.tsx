import { BTN_BASE, BTN_VARIANTS } from "./constants";
import type { GoldButtonProps } from "./types";

export function GoldButton({
  href,
  onClick,
  variant = "solid",
  children,
  className = "",
  target,
  rel,
  type = "button",
  "aria-label": ariaLabel,
}: GoldButtonProps) {
  const classes = `${BTN_BASE} ${BTN_VARIANTS[variant]} ${className}`;
  const inlineStyle = variant === "solid"
    ? { backgroundColor: "#c99a3f", color: "#0b1a2e", borderColor: "#c99a3f" }
    : variant === "ghost-navy"
    ? { backgroundColor: "#0b1a2e", color: "#c99a3f" }
    : undefined;

  const inner = (
    <>
      <span className="relative z-10">{children}</span>
      <span
        className="relative z-10 transition-transform duration-300 group-hover:translate-x-1 text-base leading-none"
        aria-hidden="true"
      ></span>
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        className={classes}
        style={inlineStyle}
        target={target}
        rel={rel}
        aria-label={ariaLabel}
      >
        {inner}
      </a>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      className={classes}
      style={inlineStyle}
      aria-label={ariaLabel}
    >
      {inner}
    </button>
  );
}
