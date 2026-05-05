import type { NavItem } from "./types";

export const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Home" },
  {
    href: "/packages",
    label: "Tours",
    children: [
      { href: "/packages", label: "All Itineraries" },
      { href: "/tours/custom-packages", label: "Custom Deal Packages" },
      { href: "/tours/fixed-dates", label: "Fixed-Date Packages" },
      { href: "/tours/daily-packages", label: "Daily Packages" },
      { href: "/tours/premade", label: "Premade Packages" },
      { href: "/tours/daily", label: "Daily Tours" },
      { href: "/packages/custom", label: "Custom Tour" },
    ],
  },
  { href: "/transportation", label: "Chauffeur" },
];

export const SCROLL_THRESHOLD = 40;
