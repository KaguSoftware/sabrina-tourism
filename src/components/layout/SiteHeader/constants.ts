import type { NavItem } from "./types";

export const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Home" },
  {
    href: "/packages",
    label: "Tours",
    children: [
      { href: "/packages", label: "All Itineraries" },
      { href: "/tours/premade", label: "Premade Packages" },
      { href: "/tours/daily", label: "Daily Tours" },
    ],
  },
  { href: "/transportation", label: "Chauffeur" },
];

export const SCROLL_THRESHOLD = 40;
