import type { Step } from "./types";

export const SECTION_HEADING = "Three steps. One conversation.";

export const STEPS: Step[] = [
  {
    num: "01",
    heading: "Browse",
    body: "Read the itineraries the way you would a magazine. Filter by region, dates, group size — or simply by curiosity.",
    icon: "compass",
  },
  {
    num: "02",
    heading: "Select",
    body: "Pick a package and a tier — Essential, Signature, or Private. Or describe the journey you have in mind, and we will draw it.",
    icon: "suitcase",
  },
  {
    num: "03",
    heading: "Confirm via WhatsApp",
    body: "A real person on our team replies within the hour, in your language. We confirm dates, send a quote, and hold the booking.",
    icon: "whatsapp",
  },
];
