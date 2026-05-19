export type GoldButtonVariant = "solid" | "ghost" | "ghost-light" | "ghost-navy";

export interface GoldButtonProps {
  href?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => void;
  variant?: GoldButtonVariant;
  children: React.ReactNode;
  className?: string;
  target?: string;
  rel?: string;
  type?: "button" | "submit";
  "aria-label"?: string;
  "aria-disabled"?: boolean;
  tabIndex?: number;
  disabled?: boolean;
}
