export interface CustomTourState {
  startDate: string;
  endDate: string;
  destinations: string[];
  destinationDays: Record<string, string>;
  people: number;
  hotelId: string | null;
  hotelIds: Record<string, string>;
  /** vehicleId → count. Empty means no vehicle chosen yet. */
  vehicleSelections: Record<string, number>;
  noDriverNeeded: boolean;
  airportTransferOnly: boolean;
  flightArrivalDate: string;
  flightArrivalTime: string;
  guideNeeded: boolean;
  guideType: "assistant" | "certified guide";
  guideLanguage: string;
}

export const INITIAL_STATE: CustomTourState = {
  startDate: "",
  endDate: "",
  destinations: [],
  destinationDays: {},
  people: 2,
  hotelId: null,
  hotelIds: {},
  vehicleSelections: {},
  noDriverNeeded: false,
  airportTransferOnly: false,
  flightArrivalDate: "",
  flightArrivalTime: "",
  guideNeeded: false,
  guideType: "assistant",
  guideLanguage: "English",
};

export const CUSTOM_TOUR_DRAFT_KEY = "sabrina-custom-tour-draft";

export const DESTINATIONS = [
  { id: "Istanbul", label: "Istanbul", image: "/istanbul-hero1.png" },
  { id: "Cappadocia", label: "Cappadocia", image: "/capadocia-hero.png" },
  { id: "Aegean", label: "Aegean Coast", image: "/Pamukkale-hero.png" },
  { id: "Mediterranean", label: "Antalya", image: "/Antalya-hero.png" },
  { id: "Black Sea", label: "Black Sea", image: "/black-sea-hero.png" },
  { id: "Eastern Anatolia", label: "Eastern Anatolia", image: "/Eastern-hero.png" },
];
