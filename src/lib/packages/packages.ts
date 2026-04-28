import type { Package, Tier } from "./types";

function tierEssential(overrides: Partial<Tier> = {}): Tier {
  return {
    name: "Essential",
    vehicleClass: "Premium sedan or shared van",
    accommodation: "3★ boutique",
    groupSize: "Small group up to 8",
    guideLanguages: ["English"],
    mealsIncluded: "Daily breakfast",
    highlights: [
      "All transfers in air-conditioned vehicles",
      "Curated city walks with a licensed guide",
      "Hand-picked local restaurant recommendations",
    ],
    ...overrides,
  };
}

function tierSignature(overrides: Partial<Tier> = {}): Tier {
  return {
    name: "Signature",
    vehicleClass: "Mercedes V-Class with private driver",
    accommodation: "4★ design hotels",
    groupSize: "Private — up to 6",
    guideLanguages: ["English", "French"],
    mealsIncluded: "Breakfast + 3 curated dinners",
    highlights: [
      "Skip-the-line entry to all major sites",
      "Private licensed historian & guide",
      "Two reserved tastings at chef-led restaurants",
    ],
    ...overrides,
  };
}

function tierPrivate(overrides: Partial<Tier> = {}): Tier {
  return {
    name: "Private",
    vehicleClass: "Mercedes S-Class with chauffeur",
    accommodation: "5★ heritage & cave suites",
    groupSize: "Strictly private — your party only",
    guideLanguages: ["English", "French", "Arabic", "German"],
    mealsIncluded: "Breakfast + all dinners, hosted",
    highlights: [
      "Private after-hours museum & monument access",
      "Personal concierge available 24/7 in-country",
      "Helicopter or private boat transfers where relevant",
    ],
    ...overrides,
  };
}

export const PACKAGES: Package[] = [
  {
    slug: "istanbul-classics",
    name: "Istanbul, Classics",
    region: "Istanbul",
    duration: "5 days / 4 nights",
    durationDays: 5,
    shortDescription:
      "Hagia Sophia at first light, the Bosphorus at dusk, and the bazaars between.",
    overview: [
      "A measured, deliberate introduction to Istanbul — a city that does not reveal itself in a hurry. We move slowly through the old peninsula at the hours when the crowds are thin, then drift north along the Bosphorus to the quieter neighborhoods of Bebek and Arnavutköy.",
      "Mornings are spent inside the great monuments. Afternoons unfold over long lunches and walks through Karaköy and Galata. Evenings are reserved — a private dinner above the strait, a hammam at the Çemberlitaş, a final raki on a wooden boat.",
    ],
    heroImage:
      "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=2000&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1527838832700-5059252407fa?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1601999816901-e9b81e5547c5?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1589561084283-930aa7b1ce50?auto=format&fit=crop&w=1600&q=80",
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival & the Old City at dusk",
        description:
          "Private transfer from IST. Late-afternoon walk through Sultanahmet as the call to prayer crosses the rooftops. Welcome dinner at a meyhane in Karaköy.",
      },
      {
        day: 2,
        title: "Hagia Sophia, Cistern, Topkapı",
        description:
          "Skip-the-line morning entries with a licensed historian. Lunch at a chef-run kitchen in Eminönü. Afternoon at leisure in the Grand Bazaar.",
      },
      {
        day: 3,
        title: "The Bosphorus, properly",
        description:
          "Private wooden boat from Bebek to Anadolu Kavağı. Lunch on the Asian shore. Evening at a restored Ottoman mansion overlooking the strait.",
      },
      {
        day: 4,
        title: "Galata, Pera, the new Istanbul",
        description:
          "Coffee in Karaköy, a long walk through Galata. Afternoon at the Pera Museum and Istanbul Modern. Hammam at Çemberlitaş.",
      },
      {
        day: 5,
        title: "A long breakfast, then home",
        description: "Slow morning. Private transfer to the airport.",
      },
    ],
    tiers: [tierEssential(), tierSignature(), tierPrivate()],
    included: [
      "All private transfers in-country",
      "Licensed English-speaking guide",
      "All entry tickets to listed monuments",
      "Daily breakfast",
      "One welcome dinner",
    ],
    notIncluded: [
      "International flights",
      "Travel insurance",
      "Lunches and dinners not listed",
      "Personal expenses & gratuities",
    ],
    minPeople: 1,
    maxPeople: 6,
    availableFrom: "2026-03-01",
    availableTo: "2026-11-30",
  },
  {
    slug: "cappadocia-and-balloons",
    name: "Cappadocia & the Hot Air Balloons",
    region: "Cappadocia",
    duration: "4 days / 3 nights",
    durationDays: 4,
    shortDescription:
      "Sunrise above the fairy chimneys, then long afternoons in the valleys.",
    overview: [
      "Cappadocia is best understood from above and below. We rise before dawn for the balloons, then spend the rest of the day at ground level — walking the Rose and Red valleys, lunching in stone houses in Mustafapaşa, watching the light fall on Uçhisar.",
      "Accommodation is in restored cave suites, not hotels pretending to be caves. Each evening ends with dinner on a quiet terrace.",
    ],
    heroImage:
      "https://images.unsplash.com/photo-1641128324972-af3212f0f6bd?auto=format&fit=crop&w=2000&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1641128324972-af3212f0f6bd?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1570424638295-1d3a8d3a1226?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1570077188672-e3a9f6f9fdbf?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1605196560547-b2f7281b8355?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1599140785865-44c2dc7a6c1d?auto=format&fit=crop&w=1600&q=80",
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival in Göreme",
        description:
          "Private transfer from Kayseri. Settle into your cave suite. Sunset at Uçhisar Castle, dinner in a stone-walled cellar.",
      },
      {
        day: 2,
        title: "Balloons at first light",
        description:
          "Pre-dawn balloon flight over the valleys. Long breakfast on return. Afternoon walking tour of the Rose & Red valleys.",
      },
      {
        day: 3,
        title: "Underground cities & ceramic villages",
        description:
          "Morning in Derinkuyu's underground city. Lunch in Mustafapaşa. Visit to a working ceramic atelier in Avanos.",
      },
      {
        day: 4,
        title: "Slow morning, return",
        description:
          "Optional second balloon flight. Transfer to Kayseri or onward.",
      },
    ],
    tiers: [
      tierEssential({
        highlights: [
          "Group balloon flight (16 guests)",
          "Walking tour of Göreme valleys",
          "Cave hotel, 3★ category",
        ],
      }),
      tierSignature({
        highlights: [
          "Smaller balloon basket (8 guests)",
          "Private guide & vehicle throughout",
          "Restored boutique cave suite",
        ],
      }),
      tierPrivate({
        highlights: [
          "Private balloon for your party only",
          "Private chef dinner in a cave cellar",
          "5★ heritage cave suite with private terrace",
        ],
      }),
    ],
    included: [
      "Private transfers from/to Kayseri (ASR)",
      "One hot-air balloon flight (weather permitting)",
      "All entries to underground cities & monasteries",
      "Daily breakfast",
    ],
    notIncluded: [
      "Flights to/from Cappadocia",
      "Travel insurance",
      "Lunches and dinners not listed",
    ],
    minPeople: 1,
    maxPeople: 8,
    availableFrom: "2026-03-15",
    availableTo: "2026-11-15",
  },
  {
    slug: "pamukkale-and-ephesus",
    name: "Pamukkale & Ephesus",
    region: "Aegean",
    duration: "4 days / 3 nights",
    durationDays: 4,
    shortDescription:
      "White travertine terraces and the marble streets of an ancient capital.",
    overview: [
      "Two of Turkey's most photographed sites, walked at the right hours and read with the right voices. Ephesus is opened by a classical archaeologist; Pamukkale is timed for late afternoon, when the terraces glow.",
      "Between the two we lunch in Şirince, a hill village of stone houses and fruit wine, and sleep above the Aegean.",
    ],
    heroImage:
      "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?auto=format&fit=crop&w=2000&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1639390645789-1e2773574e58?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1589308078055-13b8e1f10dc1?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1599994758393-c2ce19f6cb1f?auto=format&fit=crop&w=1600&q=80",
    ],
    itinerary: [
      {
        day: 1,
        title: "Izmir & the road to Selçuk",
        description:
          "Arrival at ADB. Private transfer to a country hotel near Selçuk. Welcome dinner of Aegean meze.",
      },
      {
        day: 2,
        title: "Ephesus, with an archaeologist",
        description:
          "Early morning entry to Ephesus before the cruise crowds. Lunch in Şirince. Afternoon at the House of the Virgin Mary.",
      },
      {
        day: 3,
        title: "On to Pamukkale",
        description:
          "Drive inland through olive country. Late-afternoon walk on the travertines and a swim in the Cleopatra Pool. Dinner in Karahayıt.",
      },
      {
        day: 4,
        title: "Return",
        description:
          "Slow morning at Hierapolis necropolis. Transfer to Denizli or Izmir.",
      },
    ],
    tiers: [tierEssential(), tierSignature(), tierPrivate()],
    included: [
      "Private transfers throughout",
      "Licensed archaeologist for Ephesus",
      "All entry tickets",
      "Daily breakfast",
    ],
    notIncluded: ["Flights", "Lunches and dinners not listed"],
    minPeople: 1,
    maxPeople: 6,
    availableFrom: "2026-04-01",
    availableTo: "2026-10-31",
  },
  {
    slug: "antalya-coast",
    name: "Antalya & the Lycian Coast",
    region: "Mediterranean",
    duration: "6 days / 5 nights",
    durationDays: 6,
    shortDescription:
      "Old harbours, quiet coves, and the ruined cities of the Lycian shore.",
    overview: [
      "From Kaleiçi's stone alleys we move west along the coast — to the rock tombs of Myra, the sunken city of Kekova, and the long lunches that the Mediterranean demands.",
      "Hotels are small and well-chosen. Three of the days are spent on a private wooden gulet, anchoring in coves only locals know.",
    ],
    heroImage:
      "https://images.unsplash.com/photo-1589395937772-f67057e233df?auto=format&fit=crop&w=2000&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1589395937772-f67057e233df?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1605186049369-19ad36ce4c45?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1561129639-d5c2cd6d39d4?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1583959743893-7656f7e02e26?auto=format&fit=crop&w=1600&q=80",
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival in Antalya",
        description:
          "Private transfer from AYT. Settle into a Kaleiçi boutique hotel. Evening walk to the old harbour.",
      },
      {
        day: 2,
        title: "Perge & Aspendos",
        description:
          "Two of the great Roman sites, with a classical historian. Lunch on the river at Köprülü.",
      },
      {
        day: 3,
        title: "On to the gulet",
        description:
          "Drive west to Kaş. Board a private wooden gulet for three nights at sea.",
      },
      {
        day: 4,
        title: "Kekova & the sunken city",
        description:
          "Swimming over Lycian ruins. Lunch on board. Anchor in Üçağız for the evening.",
      },
      {
        day: 5,
        title: "Myra & the rock tombs",
        description:
          "Morning ashore at Myra. Afternoon at sea. Sunset anchor in a private cove.",
      },
      {
        day: 6,
        title: "Disembark & return",
        description:
          "Morning swim. Transfer to Antalya or Dalaman airport.",
      },
    ],
    tiers: [tierEssential(), tierSignature(), tierPrivate()],
    included: [
      "Private transfers",
      "Three nights on a private gulet",
      "All entry tickets",
      "All meals on board",
    ],
    notIncluded: ["Flights", "Lunches and dinners on land days"],
    minPeople: 2,
    maxPeople: 8,
    availableFrom: "2026-05-01",
    availableTo: "2026-10-15",
  },
  {
    slug: "black-sea-and-sumela",
    name: "Black Sea & Sumela Monastery",
    region: "Black Sea",
    duration: "5 days / 4 nights",
    durationDays: 5,
    shortDescription:
      "Cliffside monasteries, mountain plateaus, and the green of the Pontic Alps.",
    overview: [
      "The Black Sea coast is Turkey's quiet alternative — cooler, greener, and far from the cruise routes. We base in Trabzon and move inland to the Sumela Monastery and the high plateaus of Ayder.",
      "Tea is taken seriously here. So is hospitality.",
    ],
    heroImage:
      "https://images.unsplash.com/photo-1565008576549-57569a49371d?auto=format&fit=crop&w=2000&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1565008576549-57569a49371d?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1591018653372-3b3aabd00a93?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1601824516843-0c0d11d97a5e?auto=format&fit=crop&w=1600&q=80",
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival in Trabzon",
        description:
          "Private transfer. Walk through the old town and Atatürk Köşkü.",
      },
      {
        day: 2,
        title: "Sumela Monastery",
        description:
          "Drive into the Altındere valley. Walk up to the cliff-face monastery. Lunch of trout in Maçka.",
      },
      {
        day: 3,
        title: "Uzungöl & the high country",
        description:
          "Morning at the lake. Afternoon at a working tea plantation in Of.",
      },
      {
        day: 4,
        title: "Ayder plateau",
        description:
          "High mountain villages, wooden houses, and a hot spring at sundown.",
      },
      {
        day: 5,
        title: "Return",
        description: "Slow morning. Transfer to Trabzon airport.",
      },
    ],
    tiers: [tierEssential(), tierSignature(), tierPrivate()],
    included: [
      "Private transfers",
      "Licensed regional guide",
      "All entry tickets",
      "Daily breakfast",
    ],
    notIncluded: ["Flights to Trabzon", "Lunches and dinners not listed"],
    minPeople: 2,
    maxPeople: 6,
    availableFrom: "2026-05-15",
    availableTo: "2026-09-30",
  },
  {
    slug: "eastern-anatolia-nemrut-van",
    name: "Eastern Anatolia — Mount Nemrut & Lake Van",
    region: "Eastern Anatolia",
    duration: "7 days / 6 nights",
    durationDays: 7,
    shortDescription:
      "Toppled stone heads at sunrise, an inland sea, and the deep east.",
    overview: [
      "Eastern Anatolia is the Turkey few visitors see. We move from the colossal heads of Mount Nemrut to the Armenian churches on Akdamar Island, and on to the high citadel of Hoşap.",
      "Logistics here are the hardest part of any Turkey itinerary — which is why we plan it day-by-day with our most experienced fixers.",
    ],
    heroImage:
      "https://images.unsplash.com/photo-1610016302534-6f67f1c968d8?auto=format&fit=crop&w=2000&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1610016302534-6f67f1c968d8?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1626621934489-3aa3b9e91e4d?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1605649461784-edc01e3a6cf1?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1620109258569-4a30f3a04dee?auto=format&fit=crop&w=1600&q=80",
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival in Adıyaman",
        description: "Private transfer. Evening at leisure.",
      },
      {
        day: 2,
        title: "Mount Nemrut at sunrise",
        description:
          "Pre-dawn ascent to the eastern terrace. Breakfast at the summit. Visit Arsameia and the Cendere Bridge.",
      },
      {
        day: 3,
        title: "On to Şanlıurfa",
        description:
          "The pools of Abraham, Göbekli Tepe, and the bazaar at dusk.",
      },
      {
        day: 4,
        title: "Diyarbakır",
        description:
          "The black basalt walls and the great mosque. Long lunch in a stone-walled courtyard.",
      },
      {
        day: 5,
        title: "On to Lake Van",
        description:
          "Drive east. Evening swim in the lake; dinner with a local family.",
      },
      {
        day: 6,
        title: "Akdamar Island & Hoşap Castle",
        description:
          "Boat to the Armenian Church of the Holy Cross. Afternoon at Hoşap.",
      },
      {
        day: 7,
        title: "Return",
        description: "Transfer to Van airport (VAN).",
      },
    ],
    tiers: [tierEssential(), tierSignature(), tierPrivate()],
    included: [
      "Private transfers throughout",
      "Licensed regional guide",
      "All entries",
      "Daily breakfast",
      "Two hosted dinners",
    ],
    notIncluded: [
      "Domestic flights to/from Adıyaman & Van",
      "Lunches not listed",
    ],
    minPeople: 2,
    maxPeople: 6,
    availableFrom: "2026-04-15",
    availableTo: "2026-10-31",
  },
];

export function getPackageBySlug(slug: string): Package | undefined {
  return PACKAGES.find((p) => p.slug === slug);
}

export function getAllSlugs(): string[] {
  return PACKAGES.map((p) => p.slug);
}
