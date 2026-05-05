export interface NavItem {
  href: string;
  label: string;
  children?: { href: string; label: string }[];
}

export interface SiteHeaderProps {}
