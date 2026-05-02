import type { FooterLinkGroup } from "./types";

export const FOOTER_GROUPS: FooterLinkGroup[] = [
  {
    heading: "Itineraries",
    links: [
      { label: "Istanbul", href: "/packages?region=Istanbul" },
      { label: "Cappadocia", href: "/packages?region=Cappadocia" },
      { label: "Aegean", href: "/packages?region=Aegean" },
      { label: "Mediterranean", href: "/packages?region=Mediterranean" },
      { label: "Black Sea", href: "/packages?region=Black%20Sea" },
      { label: "Eastern Anatolia", href: "/packages?region=Eastern%20Anatolia" },
    ],
  },
  {
    heading: "Services",
    links: [
      { label: "Airport transfer", href: "/transportation" },
      { label: "Custom chauffeur", href: "/transportation" },
      { label: "All packages", href: "/packages" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms & Conditions", href: "/terms" },
      { label: "Cancellation Policy", href: "/cancellation" },
    ],
  },
];
