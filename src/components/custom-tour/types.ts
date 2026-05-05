export interface CustomTourState {
  startDate: string;
  endDate: string;
  destinations: string[];
  people: number;
  hotelId: string | null;
  vehicleId: string | null;
}

export const INITIAL_STATE: CustomTourState = {
  startDate: "",
  endDate: "",
  destinations: [],
  people: 2,
  hotelId: null,
  vehicleId: null,
};

export interface Hotel {
  id: string;
  name: string;
  location: string;
  stars: number;
  image: string;
  description: string;
}

export const SAMPLE_HOTELS: Hotel[] = [
  {
    id: "museum-hotel",
    name: "Museum Hotel",
    location: "Cappadocia",
    stars: 5,
    image: "/cappadocia-ifr1.png",
    description: "Cave-carved luxury with panoramic valley views and Michelin-recognised cuisine.",
  },
  {
    id: "four-seasons-bosphorus",
    name: "Four Seasons Bosphorus",
    location: "Istanbul",
    stars: 5,
    image: "/istanbul-hero1.png",
    description: "Former Ottoman palace on the Bosphorus waterfront in the heart of the city.",
  },
];

export const DESTINATIONS = [
  { id: "Istanbul", label: "Istanbul", image: "/istanbul-hero1.png" },
  { id: "Cappadocia", label: "Cappadocia", image: "/capadocia-hero.png" },
  { id: "Aegean", label: "Aegean Coast", image: "/Pamukkale-hero.png" },
  { id: "Mediterranean", label: "Antalya", image: "/Antalya-hero.png" },
  { id: "Black Sea", label: "Black Sea", image: "/black-sea-hero.png" },
  { id: "Eastern Anatolia", label: "Eastern Anatolia", image: "/Eastern-hero.png" },
];
