import type { Airport, Vehicle } from "./types";

export const AIRPORTS: Airport[] = [
  { code: "IST", label: "Istanbul Airport (IST)" },
  { code: "SAW", label: "Istanbul Sabiha Gökçen (SAW)" },
  { code: "AYT", label: "Antalya (AYT)" },
  { code: "ASR", label: "Cappadocia / Kayseri (ASR)" },
  { code: "ADB", label: "Izmir (ADB)" },
  { code: "BJV", label: "Bodrum (BJV)" },
  { code: "DLM", label: "Dalaman (DLM)" },
];

export const VEHICLES: Vehicle[] = [
  {
    id: "sedan",
    label: "Sedan",
    capacity: "1–3 guests",
    note: "Mercedes E-Class or equivalent",
    from: "from €70",
  },
  {
    id: "suv",
    label: "SUV",
    capacity: "1–4 guests",
    note: "Range Rover or equivalent",
    from: "from €110",
  },
  {
    id: "van",
    label: "Van",
    capacity: "1–7 guests",
    note: "Mercedes V-Class or Vito",
    from: "from €140",
  },
  {
    id: "luxury",
    label: "Luxury",
    capacity: "1–3 guests",
    note: "Mercedes S-Class with chauffeur",
    from: "from €220",
  },
];
