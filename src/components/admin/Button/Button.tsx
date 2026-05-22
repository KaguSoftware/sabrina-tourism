import type { ReactNode } from "react";

type ButtonVariant =
  | "solid"
  | "ghost"
  | "ghost-light"
  | "danger"
  | "ghost-quiet"
  | "icon"
  | "icon-danger";
type ButtonShape = "square" | "pill";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  shape?: ButtonShape;
  children: ReactNode;
  href?: string;
  tooltip?: string;
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  solid:
    "bg-ochre text-navy border border-ochre hover:bg-gold hover:border-gold hover:shadow-sm active:opacity-80 px-5 py-2.5",
  ghost:
    "bg-transparent text-ink border border-ink/30 hover:border-ochre hover:text-ochre hover:shadow-sm active:opacity-80 px-5 py-2.5",
  "ghost-light":
    "bg-transparent text-cream border border-ochre hover:bg-ochre hover:text-navy hover:shadow-sm active:opacity-80 px-5 py-2.5",
  danger:
    "bg-transparent text-terracotta border border-terracotta/60 hover:bg-terracotta hover:text-cream hover:border-terracotta hover:shadow-sm active:opacity-80 px-5 py-2.5",
  "ghost-quiet":
    "bg-transparent text-ink-soft border-0 hover:text-ink active:opacity-80",
  icon:
    "bg-cream-warm/60 text-ink-soft border border-rule hover:border-ochre hover:bg-cream-deep hover:text-ink active:opacity-80 p-2",
  "icon-danger":
    "bg-cream-warm/60 text-ink-soft border border-rule hover:border-terracotta hover:bg-terracotta hover:text-cream active:opacity-80 p-2",
};

const BASE =
  "inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.16em] uppercase font-medium transition-all duration-200 cursor-pointer";

export function Button({
  variant = "solid",
  shape = "square",
  children,
  className = "",
  href,
  tooltip,
  ...props
}: ButtonProps) {
  const shapeClass = shape === "pill" ? "rounded-full" : "";
  const classes = `${BASE} ${shapeClass} ${VARIANT_CLASSES[variant]} ${className}`.trim();
  const title = tooltip ?? props.title;
  const ariaLabel =
    (props as { "aria-label"?: string })["aria-label"] ?? tooltip;

  if (href) {
    return (
      <a href={href} className={classes} title={title} aria-label={ariaLabel}>
        {children}
      </a>
    );
  }

  return (
    <button
      className={classes}
      title={title}
      aria-label={ariaLabel}
      {...props}
    >
      {children}
    </button>
  );
}
