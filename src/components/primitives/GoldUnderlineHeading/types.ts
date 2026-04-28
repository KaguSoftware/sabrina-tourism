export type HeadingTag = "h1" | "h2" | "h3" | "h4";

export interface GoldUnderlineHeadingProps {
  as?: HeadingTag;
  children: React.ReactNode;
  className?: string;
}
