export interface PremadeAccommodation {
  name: string;
  description: string;
  images: [string, string];
}

export interface PremadePackage {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  destinations: string[];
  heroImage: string;
  cardImage: string;
  accommodation: PremadeAccommodation;
  vehicle: {
    model: string;
    features: string[];
  };
  gallery: string[];
  shortDescription: string;
}

export const PREMADE_PACKAGES: PremadePackage[] = [
  {
    id: "istanbul-cappadocia-classic",
    name: "Istanbul & Cappadocia Classic",
    startDate: "2025-07-10",
    endDate: "2025-07-17",
    destinations: ["Istanbul", "Cappadocia"],
    heroImage:
      "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=1400&q=80",
    cardImage:
      "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800&q=80",
    shortDescription:
      "Seven days spanning the Bosphorus and the fairy chimneys of Göreme, with a private chauffeur at every turn.",
    accommodation: {
      name: "Argos in Cappadocia",
      description:
        "A boutique cave hotel carved into the volcanic tuff of Uçhisar, Argos blends ancient stone rooms with modern comfort. Guests wake to panoramic valley views and candlelit corridors connecting centuries-old chambers.",
      images: [
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80",
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
      ],
    },
    vehicle: {
      model: "Mercedes-Benz V-Class",
      features: [
        "Up to 7 passengers",
        "Premium leather seating",
        "Climate control",
        "Complimentary water & Wi-Fi",
        "English-speaking chauffeur",
      ],
    },
    gallery: [
      "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=800&q=80",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
      "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800&q=80",
      "https://images.unsplash.com/photo-1604999333679-b86d54738315?w=800&q=80",
    ],
  },
  {
    id: "aegean-coast-escape",
    name: "Aegean Coast Escape",
    startDate: "2025-08-04",
    endDate: "2025-08-11",
    destinations: ["Bodrum", "Ephesus", "Pamukkale"],
    heroImage:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1400&q=80",
    cardImage:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
    shortDescription:
      "Ancient ruins, turquoise coves, and cotton-white terraces — eight days along Türkiye's Aegean jewel.",
    accommodation: {
      name: "Macakizi Hotel",
      description:
        "Set on a private peninsula in Bodrum, Macakizi is a design-forward retreat with direct sea access. Its open-air terraces, lush gardens, and Aegean-blue pool make it the definitive Bodrum address.",
      images: [
        "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80",
        "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80",
      ],
    },
    vehicle: {
      model: "Toyota Land Cruiser",
      features: [
        "Up to 5 passengers",
        "4WD off-road capable",
        "Premium sound system",
        "Cooler box with refreshments",
        "Bilingual chauffeur",
      ],
    },
    gallery: [
      "https://images.unsplash.com/photo-1542992015-4a0b729b1385?w=800&q=80",
      "https://images.unsplash.com/photo-1573166953836-06864dc3db7c?w=800&q=80",
      "https://images.unsplash.com/photo-1584556326561-b3ea4b6e4b1d?w=800&q=80",
      "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=800&q=80",
    ],
  },
  {
    id: "eastern-anatolia-discovery",
    name: "Eastern Anatolia Discovery",
    startDate: "2025-09-15",
    endDate: "2025-09-23",
    destinations: ["Trabzon", "Erzurum", "Van", "Doğubayazıt"],
    heroImage:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1400&q=80",
    cardImage:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
    shortDescription:
      "Nine days into the wild east — alpine plateaus, volcanic lakes, and Seljuk stonework far from the tourist trail.",
    accommodation: {
      name: "Büyük Vanlı Hotel",
      description:
        "Perched above the shores of Lake Van, this lakeside retreat offers sweeping views of Akdamar Island at sunset. Locally sourced breakfast spreads and stone-walled rooms give it an authentic eastern character.",
      images: [
        "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80",
        "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800&q=80",
      ],
    },
    vehicle: {
      model: "Mercedes-Benz Sprinter",
      features: [
        "Up to 12 passengers",
        "Panoramic windows",
        "Reclining seats",
        "Onboard luggage space",
        "Satellite navigation",
      ],
    },
    gallery: [
      "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800&q=80",
      "https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=800&q=80",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80",
      "https://images.unsplash.com/photo-1519583272095-6433daf26b6e?w=800&q=80",
    ],
  },
];

export function getPremadePackageById(id: string): PremadePackage | undefined {
  return PREMADE_PACKAGES.find((p) => p.id === id);
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
