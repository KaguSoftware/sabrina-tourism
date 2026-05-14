// Curated catalog of icons used for inclusion/exclusion rows and PDF facts.
// Each entry's `key` is what gets stored in the DB (package_inclusions.icon)
// and what the PDF and public renderers look up.
//
// Names match lucide-react icon names exactly so admin/public can render
// via `import { Plane } from 'lucide-react'` and PDF can map to SVG paths.

export interface InclusionIconDef {
  key: string;          // stored value
  label: string;        // shown in the picker
  lucide: string;       // lucide-react component name
  keywords: string[];   // for auto-detect fallback
}

export const INCLUSION_ICONS: InclusionIconDef[] = [
  { key: "plane",            label: "Flight",            lucide: "Plane",            keywords: ["flight", "fly", "airfare", "airline"] },
  { key: "plane-takeoff",    label: "Departure",         lucide: "PlaneTakeoff",     keywords: ["departure", "takeoff", "leave"] },
  { key: "plane-landing",    label: "Arrival",           lucide: "PlaneLanding",     keywords: ["arrival", "landing", "arrive"] },
  { key: "hotel",            label: "Hotel / Stay",      lucide: "Hotel",            keywords: ["hotel", "stay", "accommodation", "lodging", "night", "cabin"] },
  { key: "bed",              label: "Bed & Breakfast",   lucide: "BedDouble",        keywords: ["bed", "breakfast", "room"] },
  { key: "utensils",         label: "Meals",             lucide: "Utensils",         keywords: ["meal", "food", "dinner", "lunch", "breakfast"] },
  { key: "coffee",           label: "Coffee / Drinks",   lucide: "Coffee",           keywords: ["coffee", "tea", "drink"] },
  { key: "map-pin",          label: "Destination",       lucide: "MapPin",           keywords: ["region", "destination", "location", "place"] },
  { key: "map",              label: "Excursion",         lucide: "Map",              keywords: ["excursion", "tour", "trip"] },
  { key: "compass",          label: "Guide / Tour",      lucide: "Compass",          keywords: ["guide", "tour", "guided"] },
  { key: "bus",              label: "Bus / Coach",       lucide: "Bus",              keywords: ["bus", "coach", "shuttle"] },
  { key: "car",              label: "Car / Transfer",    lucide: "Car",              keywords: ["car", "vehicle", "transfer"] },
  { key: "car-front",        label: "Airport transfer",  lucide: "CarFront",         keywords: ["airport transfer", "pickup", "drop-off"] },
  { key: "ship",             label: "Boat / Cruise",     lucide: "Ship",             keywords: ["boat", "cruise", "ferry", "ship"] },
  { key: "train-front",      label: "Train",             lucide: "TrainFront",       keywords: ["train", "rail"] },
  { key: "ticket",           label: "Entrance ticket",   lucide: "Ticket",           keywords: ["entrance", "ticket", "admission", "entry"] },
  { key: "users",            label: "Group / People",    lucide: "Users",            keywords: ["group", "people", "private", "guests"] },
  { key: "user",             label: "Per person",        lucide: "User",             keywords: ["person", "individual", "solo"] },
  { key: "baby",             label: "Baby / Infant",     lucide: "Baby",             keywords: ["baby", "infant", "child"] },
  { key: "clock",            label: "Duration",          lucide: "Clock",            keywords: ["duration", "time", "hours", "days"] },
  { key: "calendar",         label: "Date",              lucide: "Calendar",         keywords: ["date", "calendar", "schedule"] },
  { key: "camera",           label: "Photos",            lucide: "Camera",           keywords: ["photo", "camera", "picture"] },
  { key: "wifi",             label: "Wi-Fi",             lucide: "Wifi",             keywords: ["wifi", "internet"] },
  { key: "shield-check",     label: "Insurance",         lucide: "ShieldCheck",      keywords: ["insurance", "covered", "protection"] },
  { key: "wallet",           label: "Personal expenses", lucide: "Wallet",           keywords: ["personal expenses", "wallet", "money", "tip", "gratuity"] },
];

const KEY_MAP = new Map(INCLUSION_ICONS.map((i) => [i.key, i]));

export function getInclusionIcon(key: string | null | undefined): InclusionIconDef | null {
  if (!key) return null;
  return KEY_MAP.get(key) ?? null;
}

export function suggestIconForText(text: string): string | null {
  const t = text.toLowerCase();
  for (const icon of INCLUSION_ICONS) {
    if (icon.keywords.some((kw) => t.includes(kw))) {
      return icon.key;
    }
  }
  return null;
}
