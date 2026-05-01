import type { ReactNode } from "react";

type ButtonVariant = "solid" | "ghost" | "ghost-light" | "danger" | "ghost-quiet";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  children: ReactNode;
  href?: string;
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  solid:
    "bg-ochre text-navy border border-ochre hover:bg-gold hover:border-gold hover:shadow-sm active:scale-[0.97]",
  ghost:
    "bg-transparent text-ink border border-ink/30 hover:border-ochre hover:text-ochre hover:shadow-sm active:scale-[0.97]",
  "ghost-light":
    "bg-transparent text-cream border border-ochre hover:bg-ochre hover:text-navy hover:shadow-sm active:scale-[0.97]",
  danger:
    "bg-transparent text-terracotta border border-terracotta/60 hover:bg-terracotta hover:text-cream hover:border-terracotta hover:shadow-sm active:scale-[0.97]",
  "ghost-quiet":
    "bg-transparent text-ink-soft border-0 hover:text-ink active:scale-[0.97] px-0",
};

const BASE =
  "inline-flex items-center gap-2 px-5 py-2.5 font-mono text-[11px] tracking-[0.16em] uppercase font-medium transition-all duration-200 cursor-pointer";

export function Button({
  variant = "solid",
  children,
  className = "",
  href,
  ...props
}: ButtonProps) {
  const classes = `${BASE} ${VARIANT_CLASSES[variant]} ${className}`;

  if (href) {
    return (
      <a href={href} className={classes}>
        {children}
      </a>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
