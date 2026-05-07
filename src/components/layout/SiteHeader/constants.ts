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
    ],
  },
  { href: "/transportation", label: "Driver" },
];

export const SCROLL_THRESHOLD = 40;
