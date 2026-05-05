import type { NavItem } from "./types";

export const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Home" },
  {
    href: "/packages",
    label: "Tours",
    children: [
      { href: "/packages", label: "All Itineraries" },
      { href: "/packages/custom", label: "Custom Tour" },
    ],
  },
  { href: "/transportation", label: "Chauffeur" },
];

export const SCROLL_THRESHOLD = 40;
