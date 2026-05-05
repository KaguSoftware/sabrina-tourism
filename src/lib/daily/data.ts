import type { DailyPackage } from "./types";

export const DAILY_PACKAGES: DailyPackage[] = [
  {
    id: "old-city-full-day",
    name: "Old City Full Day Tour",
    date: "2026-06-13",
    startTime: "09:00",
    endTime: "22:00",
    heroImage: "/istanbul-hero1.png",
    cardImage: "/istanbul-ifr1.png",
    groupImages: [
      "/istanbul-ifr1.png",
      "/istanbul-ifr2.png",
      "/istanbul-ifr3.png",
      "/istanbul-ifr4.png",
    ],
    vehicle: "Mercedes-Benz V-Class",
    driver: "Ahmet Yılmaz",
    price: 280,
    currency: "USD",
    shortDescription:
      "Hagia Sophia, Blue Mosque, Grand Bazaar and a Bosphorus sunset — all in one legendary day.",
    region: "Istanbul",
    stops: [
      {
        time: "09:00",
        place: "Hotel Pickup",
        description: "Your chauffeur meets you at the lobby.",
      },
      {
        time: "09:30",
        place: "Hagia Sophia",
        description:
          "Explore the Byzantine marvel that has stood for nearly 1,500 years.",
      },
      {
        time: "11:00",
        place: "Blue Mosque (Sultanahmet)",
        description:
          "Admire the six minarets and the cascading domes of this Ottoman masterpiece.",
      },
      {
        time: "12:30",
        place: "Topkapi Palace",
        description:
          "Walk through the courts and treasury of the Ottoman sultans.",
      },
      {
        time: "14:30",
        place: "Grand Bazaar",
        description: "Free time to wander 4,000 shops under a vaulted ceiling.",
      },
      {
        time: "16:30",
        place: "Spice Bazaar",
        description: "Colours, aromas, and the best Turkish delight in the city.",
      },
      {
        time: "18:00",
        place: "Bosphorus Cruise",
        description:
          "A private sunset cruise between two continents.",
      },
      {
        time: "20:00",
        place: "Dinner — Karaköy",
        description:
          "Reservation at a waterfront restaurant with Bosphorus views.",
      },
      {
        time: "22:00",
        place: "Hotel Drop-off",
        description: "Safe return to your accommodation.",
      },
    ],
    included: [
      "Private Mercedes-Benz V-Class with professional driver",
      "Licensed English-speaking guide",
      "All entrance fees",
      "Sunset Bosphorus cruise tickets",
      "Dinner reservation",
      "Bottled water throughout the day",
    ],
  },
  {
    id: "cappadocia-highlights",
    name: "Cappadocia Highlights Day",
    date: "2026-06-20",
    startTime: "08:00",
    endTime: "21:00",
    heroImage: "/capadocia-hero.png",
    cardImage: "/cappadocia-ifr1.png",
    groupImages: [
      "/cappadocia-ifr1.png",
      "/cappadocia-ifr2.png",
      "/cappadocia-ifr3.png",
      "/cappadocia-ifr4.png",
    ],
    vehicle: "Toyota Land Cruiser",
    driver: "Mehmet Demir",
    price: 320,
    currency: "USD",
    shortDescription:
      "Fairy chimneys, underground cities, and valley hikes — the best of Cappadocia in a single day.",
    region: "Cappadocia",
    stops: [
      {
        time: "08:00",
        place: "Hotel Pickup — Göreme",
        description: "Early start to beat the crowds.",
      },
      {
        time: "08:30",
        place: "Göreme Open Air Museum",
        description:
          "Rock-cut churches adorned with Byzantine frescoes.",
      },
      {
        time: "10:30",
        place: "Devrent Valley",
        description: "Surreal rock formations that resemble animals and figures.",
      },
      {
        time: "12:00",
        place: "Avanos — Pottery Workshop",
        description: "Try your hand at traditional Hittite pottery on the wheel.",
      },
      {
        time: "13:30",
        place: "Lunch — Ürgüp",
        description: "Traditional Cappadocian cuisine at a cave restaurant.",
      },
      {
        time: "15:00",
        place: "Derinkuyu Underground City",
        description:
          "Descend eight storeys into an ancient subterranean city.",
      },
      {
        time: "17:00",
        place: "Rose Valley Sunset Hike",
        description: "A gentle walk as the pink tufa glows in golden hour.",
      },
      {
        time: "19:30",
        place: "Turkish Night Dinner",
        description: "Folk music and regional dishes at a local venue.",
      },
      {
        time: "21:00",
        place: "Hotel Drop-off",
        description: "Return to your accommodation in Göreme.",
      },
    ],
    included: [
      "Private Toyota Land Cruiser with professional driver",
      "Licensed English-speaking guide",
      "All entrance fees (museum + underground city)",
      "Pottery workshop session",
      "Lunch and dinner",
      "Bottled water throughout the day",
    ],
  },
  {
    id: "antalya-coast-day",
    name: "Antalya Coast & Ruins Day",
    date: "2026-07-05",
    startTime: "09:00",
    endTime: "21:30",
    heroImage: "/Antalya-hero.png",
    cardImage: "/antalya-ifr1.png",
    groupImages: [
      "/antalya-ifr1.png",
      "/antalya-ifr2.png",
      "/antalya-ifr3.png",
      "/antalya-ifr4.png",
    ],
    vehicle: "Mercedes-Benz Sprinter",
    driver: "Ali Kaya",
    price: 260,
    currency: "USD",
    shortDescription:
      "Roman ruins, turquoise waterfalls, and a Mediterranean dinner — the Turquoise Coast at its finest.",
    region: "Mediterranean",
    stops: [
      {
        time: "09:00",
        place: "Hotel Pickup — Antalya",
        description: "Comfortable departure from your hotel.",
      },
      {
        time: "09:45",
        place: "Aspendos Theatre",
        description:
          "One of the best-preserved Roman theatres in the world (2nd century AD).",
      },
      {
        time: "11:30",
        place: "Köprülü Canyon",
        description: "Walk a Roman bridge over turquoise rapids.",
      },
      {
        time: "13:00",
        place: "Lunch — Riverside",
        description: "Fresh trout lunch at a traditional restaurant on the river.",
      },
      {
        time: "14:30",
        place: "Manavgat Waterfall",
        description: "Wide, thundering falls just minutes from the Mediterranean.",
      },
      {
        time: "16:00",
        place: "Side Ancient City",
        description:
          "Stroll among Roman columns steps from the beach.",
      },
      {
        time: "18:30",
        place: "Kaleiçi — Old City",
        description: "Ottoman mansions, harbour views, and the Hadrian's Gate.",
      },
      {
        time: "19:30",
        place: "Dinner — Harbour",
        description: "Seafood dinner at a harbour-front restaurant.",
      },
      {
        time: "21:30",
        place: "Hotel Drop-off",
        description: "Return to your accommodation.",
      },
    ],
    included: [
      "Private Mercedes-Benz Sprinter with professional driver",
      "Licensed English-speaking guide",
      "All entrance fees",
      "Riverside lunch and harbour dinner",
      "Bottled water throughout the day",
    ],
  },
];
