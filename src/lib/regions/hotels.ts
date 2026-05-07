import type { HotelSVGVariant } from "@/components/illustrations/HotelSVG/HotelSVG";
import type { REGIONS } from "@/lib/packages/constants";

export interface RoomType {
  name: string;
  capacity: number; // max guests
  beds: string;     // e.g. "1 king bed" or "2 twin beds"
  size: string;     // e.g. "28 m²"
  imageIndex: number; // which index in hotel.images this room maps to
  highlights: string[];
}

export interface HotelProperties {
  freeWifi: boolean;
  bedrooms: number;
  bathrooms: number;
  distanceKm: number;
  freeCancellation: boolean;
  freeParking: boolean;
  bedBreakfast: boolean;
  balcony: boolean;
  washer: boolean;
  ac: boolean;
  tv: boolean;
}

export interface HotelCardData {
  id: string;
  slug: string;
  name: string;
  description: string;
  longDescription: string;
  tags: [string, string];
  svgVariant: HotelSVGVariant;
  amenities: string[];
  location: string;
  bedroomImage: string;
  images: string[];
  roomTypes: RoomType[];
  checkInTime: string;
  checkOutTime: string;
  languages: string[];
  properties: HotelProperties;
}

export const HOTELS: Record<(typeof REGIONS)[number], HotelCardData[]> = {
  Istanbul: [
    {
      id: "ist-1",
      slug: "bosphorus-manor",
      name: "Bosphorus Manor",
      description:
        "An 1890s Ottoman mansion overlooking the strait, restored to its original grandeur with a private hammam and terrace suites facing the water.",
      longDescription:
        "Perched above the shimmering Bosphorus strait, this meticulously restored Ottoman mansion dates to 1893. Original marble floors, hand-carved walnut screens, and stained-glass transoms have been preserved alongside discreetly modern comforts. Each suite faces the water; at dawn, the twin minarets of the Asian shore emerge from the mist across the channel. A private hammam occupies the former caretaker's quarters, and the terrace is set for breakfast from the moment the first ferries cross.",
      tags: ["Boutique", "Waterfront"],
      svgVariant: "ottoman",
      amenities: ["Private Hammam", "Terrace Suites", "Bosphorus Views", "Butler Service", "Airport Transfer"],
      location: "Beşiktaş, Istanbul",
      bedroomImage: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200&q=80",
      images: [
        // Exterior — Bosphorus waterfront hotel facade
        "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&q=80",
        // Bedroom — Ottoman-styled luxury room
        "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200&q=80",
        // Bathroom — marble luxury bathroom
        "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=1200&q=80",
        // View — Bosphorus strait at dusk
        "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=1200&q=80",
      ],
      roomTypes: [
        { name: "Bosphorus Suite", capacity: 2, beds: "1 king bed", size: "42 m²", imageIndex: 1, highlights: ["Strait view", "Private hammam access", "Butler service"] },
        { name: "Terrace Room", capacity: 2, beds: "1 queen bed", size: "30 m²", imageIndex: 0, highlights: ["Private terrace", "Garden view", "Breakfast included"] },
      ],
      checkInTime: "15:00",
      checkOutTime: "12:00",
      languages: ["English", "Turkish", "Arabic"],
      properties: {
        freeWifi: true, bedrooms: 1, bathrooms: 1, distanceKm: 6,
        freeCancellation: true, freeParking: false, bedBreakfast: true,
        balcony: true, washer: false, ac: true, tv: true,
      },
    },
    {
      id: "ist-2",
      slug: "sultanahmet-residences",
      name: "Sultanahmet Residences",
      description:
        "Steps from the Blue Mosque, these converted Byzantine townhouses marry thousand-year-old stone walls with quietly modern comforts.",
      longDescription:
        "Set within a cluster of converted Byzantine townhouses in the heart of the old city, the Sultanahmet Residences place guests within a five-minute walk of the Blue Mosque, Hagia Sophia, and the Grand Bazaar. Thousand-year-old stone walls enclose rooms of calm linen, dark timber, and hand-thrown ceramics. Mornings begin on the shared rooftop terrace as the call to prayer drifts across the domes and the city stirs below.",
      tags: ["Heritage", "Old City"],
      svgVariant: "mansion",
      amenities: ["Rooftop Terrace", "Heritage Architecture", "Walking Distance to Monuments", "Concierge", "Hammam Access"],
      location: "Sultanahmet, Istanbul",
      bedroomImage: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=1200&q=80",
      images: [
        // Exterior — Sultanahmet historic townhouse
        "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=1200&q=80",
        // Bedroom — stone-walled heritage room
        "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=1200&q=80",
        // Bathroom — boutique stone bathroom
        "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=1200&q=80",
        // View — Blue Mosque rooftop view
        "https://images.unsplash.com/photo-1527838832700-5059252407fa?w=1200&q=80",
      ],
      roomTypes: [
        { name: "Heritage Double", capacity: 2, beds: "1 double bed", size: "26 m²", imageIndex: 1, highlights: ["Stone-walled room", "Rooftop terrace access", "Near Blue Mosque"] },
        { name: "Family Suite", capacity: 4, beds: "2 double beds", size: "48 m²", imageIndex: 0, highlights: ["Two bedrooms", "Panoramic old-city view", "Washing machine"] },
      ],
      checkInTime: "14:00",
      checkOutTime: "11:00",
      languages: ["English", "Turkish", "German"],
      properties: {
        freeWifi: true, bedrooms: 2, bathrooms: 1, distanceKm: 1,
        freeCancellation: false, freeParking: false, bedBreakfast: false,
        balcony: false, washer: true, ac: true, tv: false,
      },
    },
  ],
  Cappadocia: [
    {
      id: "cap-1",
      slug: "goreme-cave-lodge",
      name: "Göreme Cave Lodge",
      description:
        "Hand-carved suites set directly into volcanic tuff, each opening onto a private terrace that faces the valley as the first balloons rise at dawn.",
      longDescription:
        "Each suite at Göreme Cave Lodge was carved by hand from the pale volcanic tuff that defines this extraordinary landscape. The walls hold a natural warmth in winter and a cool stillness in summer. Private terraces open directly onto the Rose Valley, and at 5:30 each morning the first balloons lift from the fields below — a sight that never loses its wonder. Dinner is served in a rock-cut dining room lit entirely by candlelight.",
      tags: ["Cave Suite", "Valley View"],
      svgVariant: "cave",
      amenities: ["Private Terraces", "Balloon Views", "Rock-Cut Dining", "Sunrise Breakfast", "Hot Tub"],
      location: "Göreme, Cappadocia",
      bedroomImage: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=1200&q=80",
      images: [
        // Exterior — Cappadocia cave hotel carved into tuff
        "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=1200&q=80",
        // Bedroom — cave suite interior
        "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=1200&q=80",
        // Bathroom — stone cave bathroom
        "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1200&q=80",
        // View — hot air balloons over Göreme valley
        "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=1200&q=80",
      ],
      roomTypes: [
        { name: "Cave Suite", capacity: 2, beds: "1 king bed", size: "35 m²", imageIndex: 1, highlights: ["Hand-carved tuff walls", "Valley-facing terrace", "Sunrise balloon views"] },
        { name: "Standard Cave Room", capacity: 2, beds: "2 twin beds", size: "22 m²", imageIndex: 2, highlights: ["Natural cave cooling", "Breakfast included", "Hot tub access"] },
      ],
      checkInTime: "15:00",
      checkOutTime: "11:00",
      languages: ["English", "Turkish"],
      properties: {
        freeWifi: true, bedrooms: 1, bathrooms: 1, distanceKm: 3,
        freeCancellation: true, freeParking: true, bedBreakfast: true,
        balcony: true, washer: false, ac: false, tv: true,
      },
    },
    {
      id: "cap-2",
      slug: "uchisar-cliff-suites",
      name: "Uçhisar Cliff Suites",
      description:
        "Cantilevered over the highest natural outcrop in Cappadocia, these suites offer a 360° panorama of the fairy chimney valleys below.",
      longDescription:
        "Uçhisar Cliff Suites occupies the summit of the highest natural rock formation in Cappadocia. Glass-fronted suites cantilever over the edge, delivering a 360° panorama of the fairy chimney valleys, the distant volcano of Erciyes, and a sky that turns amber, rose, and violet at dusk. A heated infinity pool sits at the cliff edge, seemingly suspended above the valley floor sixty metres below.",
      tags: ["Clifftop", "Panoramic"],
      svgVariant: "cave",
      amenities: ["Cliff-Edge Pool", "360° Panorama", "Heated Suites", "Guided Valley Walks", "Wine Cellar"],
      location: "Uçhisar, Cappadocia",
      bedroomImage: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200&q=80",
      images: [
        // Exterior — Uçhisar rock castle and cliff hotel
        "https://images.unsplash.com/photo-1533104816931-20fa691ff6ca?w=1200&q=80",
        // Bedroom — panoramic glass-fronted suite
        "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200&q=80",
        // Bathroom — cliff-side luxury bathroom
        "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=1200&q=80",
        // View — Cappadocia fairy chimneys at sunset
        "https://images.unsplash.com/photo-1526392060635-9d6019884377?w=1200&q=80",
      ],
      roomTypes: [
        { name: "Panorama Suite", capacity: 2, beds: "1 king bed", size: "50 m²", imageIndex: 1, highlights: ["Glass-fronted cliff views", "Heated suite", "360° panorama"] },
        { name: "Cliff Studio", capacity: 2, beds: "1 queen bed", size: "32 m²", imageIndex: 0, highlights: ["Valley & volcano views", "Infinity pool access", "Wine cellar access"] },
        { name: "Twin Terrace", capacity: 3, beds: "1 double + 1 single", size: "38 m²", imageIndex: 3, highlights: ["Shared terrace", "Guided walks", "Mountain views"] },
      ],
      checkInTime: "16:00",
      checkOutTime: "12:00",
      languages: ["English", "Turkish", "French"],
      properties: {
        freeWifi: false, bedrooms: 2, bathrooms: 2, distanceKm: 7,
        freeCancellation: true, freeParking: true, bedBreakfast: false,
        balcony: true, washer: true, ac: true, tv: false,
      },
    },
  ],
  Aegean: [
    {
      id: "aeg-1",
      slug: "alacati-stone-house",
      name: "Alaçatı Stone House",
      description:
        "A 19th-century Greek stone house in the famous windmill village, with a courtyard plunge pool, lavender garden, and wind-swept terraces.",
      longDescription:
        "Built by a Greek merchant family in 1887, this stone house sits at the quiet end of Alaçatı's famous cobblestone bazaar street. The courtyard, shaded by a centuries-old fig tree, holds a plunge pool surrounded by lavender beds in full bloom from May through August. The prevailing meltemi wind keeps terraces cool all summer. The village's celebrated restaurants and boutiques are within a five-minute stroll.",
      tags: ["Boutique", "Village"],
      svgVariant: "aegean",
      amenities: ["Courtyard Pool", "Lavender Garden", "Stone Architecture", "Village Location", "Bicycle Hire"],
      location: "Alaçatı, İzmir",
      bedroomImage: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&q=80",
      images: [
        // Exterior — Aegean stone house courtyard
        "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=1200&q=80",
        // Bedroom — whitewashed Aegean room
        "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&q=80",
        // Bathroom — Mediterranean stone bathroom
        "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1200&q=80",
        // View — Alaçatı windmills and village
        "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=1200&q=80",
      ],
      roomTypes: [
        { name: "Courtyard Room", capacity: 2, beds: "1 double bed", size: "24 m²", imageIndex: 0, highlights: ["Plunge pool access", "Lavender garden", "Breakfast included"] },
        { name: "Garden Suite", capacity: 3, beds: "1 queen + 1 sofa bed", size: "38 m²", imageIndex: 1, highlights: ["Private garden access", "Bicycle hire", "Village views"] },
      ],
      checkInTime: "15:00",
      checkOutTime: "11:00",
      languages: ["English", "Turkish", "Greek"],
      properties: {
        freeWifi: true, bedrooms: 1, bathrooms: 1, distanceKm: 12,
        freeCancellation: true, freeParking: true, bedBreakfast: true,
        balcony: false, washer: true, ac: true, tv: true,
      },
    },
    {
      id: "aeg-2",
      slug: "bodrum-harbour-suites",
      name: "Bodrum Harbour Suites",
      description:
        "Whitewashed terraces step down the hillside to the Aegean marina, with the medieval Knights' Castle rising behind every rooftop.",
      longDescription:
        "A cascade of whitewashed terraces descend from the hillside to the water's edge at Bodrum harbour. Every suite has an uninterrupted view of the medieval Castle of St Peter, glowing amber each evening as the sun sets over the Aegean. Gulets bob in the marina below; private boat excursions to the surrounding bays and sea caves can be arranged daily. The pedestrian harbour promenade — Bodrum's finest stretch for dining and people-watching — begins at the hotel gate.",
      tags: ["Waterfront", "Marina"],
      svgVariant: "coastal",
      amenities: ["Marina Views", "Private Boat Hire", "Sea-Facing Terraces", "Beach Club Access", "Castle Views"],
      location: "Bodrum, Muğla",
      bedroomImage: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200&q=80",
      images: [
        // Exterior — Bodrum whitewashed hotel with marina
        "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1200&q=80",
        // Bedroom — sea-view suite
        "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200&q=80",
        // Bathroom — coastal luxury bathroom
        "https://images.unsplash.com/photo-1600566752447-5f6cd58e9f89?w=1200&q=80",
        // View — Bodrum Castle and marina at sunset
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80",
      ],
      roomTypes: [
        { name: "Harbour Suite", capacity: 2, beds: "1 king bed", size: "45 m²", imageIndex: 1, highlights: ["Castle & marina views", "Private balcony", "Boat excursion priority"] },
        { name: "Sea-View Double", capacity: 2, beds: "1 double bed", size: "28 m²", imageIndex: 3, highlights: ["Aegean views", "Beach club access", "Promenade access"] },
        { name: "Family Terrace", capacity: 4, beds: "2 double beds", size: "55 m²", imageIndex: 0, highlights: ["Two terraces", "Two bathrooms", "Castle panorama"] },
      ],
      checkInTime: "14:00",
      checkOutTime: "12:00",
      languages: ["English", "Turkish", "Italian"],
      properties: {
        freeWifi: true, bedrooms: 2, bathrooms: 1, distanceKm: 4,
        freeCancellation: false, freeParking: false, bedBreakfast: false,
        balcony: true, washer: false, ac: true, tv: true,
      },
    },
  ],
  Mediterranean: [
    {
      id: "med-1",
      slug: "kalkan-bay-lodge",
      name: "Kalkan Bay Lodge",
      description:
        "Cascading in white terraces down a clifftop above the bay, each suite comes with its own infinity plunge pool and an uninterrupted sea horizon.",
      longDescription:
        "Kalkan Bay Lodge is built into the cliff above one of the Mediterranean coast's most beautiful small bays. Each of the twelve suites has its own private infinity plunge pool, positioned so that the water appears to merge seamlessly with the deep blue sea sixty metres below. The old quarter of Kalkan — cobblestoned streets, rooftop fish restaurants, and a small yacht harbour — is a ten-minute walk through the terraced hillside.",
      tags: ["Clifftop", "Infinity Pool"],
      svgVariant: "coastal",
      amenities: ["Private Plunge Pool", "Sea-View Suites", "Clifftop Location", "Daily Boat Trips", "Gourmet Dining"],
      location: "Kalkan, Antalya",
      bedroomImage: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=1200&q=80",
      images: [
        // Exterior — clifftop infinity pool overlooking Mediterranean
        "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=1200&q=80",
        // Bedroom — white Mediterranean suite
        "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=1200&q=80",
        // Bathroom — open-air luxury bathroom with sea view
        "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&q=80",
        // View — Kalkan bay turquoise water
        "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=1200&q=80",
      ],
      roomTypes: [
        { name: "Infinity Suite", capacity: 2, beds: "1 king bed", size: "55 m²", imageIndex: 1, highlights: ["Private plunge pool", "Cliff-edge position", "Breakfast included"] },
        { name: "Bay View Room", capacity: 2, beds: "1 queen bed", size: "32 m²", imageIndex: 3, highlights: ["Sea horizon views", "Pool access", "Daily boat trips"] },
      ],
      checkInTime: "15:00",
      checkOutTime: "11:00",
      languages: ["English", "Turkish", "Russian"],
      properties: {
        freeWifi: true, bedrooms: 1, bathrooms: 1, distanceKm: 9,
        freeCancellation: true, freeParking: true, bedBreakfast: true,
        balcony: true, washer: true, ac: true, tv: false,
      },
    },
    {
      id: "med-2",
      slug: "kas-harbour-inn",
      name: "Kaş Harbour Inn",
      description:
        "A boutique harbour hotel built directly above Roman ruins, with direct access to some of the most celebrated dive sites on the coast.",
      longDescription:
        "In the narrow lanes of Kaş, a Lycian sarcophagus sits in the middle of a crossroads and a Roman theatre overlooks the Greek island of Meis — this is that kind of town. The Harbour Inn is built directly above a Roman cistern, its foundations intertwined with two thousand years of history. From the dive pontoon ten minutes by boat lie the sunken city of Kekova and some of the finest wreck and wall diving in the Mediterranean.",
      tags: ["Boutique", "Dive Base"],
      svgVariant: "aegean",
      amenities: ["Dive Centre", "Roman Ruins On-Site", "Sea Terrace", "Snorkelling Trips", "Rooftop Bar"],
      location: "Kaş, Antalya",
      bedroomImage: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=1200&q=80",
      images: [
        // Exterior — Kaş harbour boutique hotel terrace
        "https://images.unsplash.com/photo-1602002418082-a4443e081dd1?w=1200&q=80",
        // Bedroom — boutique coastal room
        "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=1200&q=80",
        // Bathroom — boutique tiled bathroom
        "https://images.unsplash.com/photo-1604709177225-055f99402ea3?w=1200&q=80",
        // View — Kaş harbour and Greek island of Meis
        "https://images.unsplash.com/photo-1548013146-72479768bada?w=1200&q=80",
      ],
      roomTypes: [
        { name: "Sea Terrace Room", capacity: 2, beds: "1 double bed", size: "26 m²", imageIndex: 1, highlights: ["Harbour views", "Rooftop bar access", "Dive centre priority"] },
        { name: "Ruins Suite", capacity: 2, beds: "1 king bed", size: "40 m²", imageIndex: 0, highlights: ["Above Roman cistern", "Historic setting", "Snorkelling trips"] },
      ],
      checkInTime: "15:00",
      checkOutTime: "11:00",
      languages: ["English", "Turkish"],
      properties: {
        freeWifi: false, bedrooms: 1, bathrooms: 1, distanceKm: 2,
        freeCancellation: true, freeParking: false, bedBreakfast: false,
        balcony: true, washer: false, ac: true, tv: true,
      },
    },
  ],
  "Black Sea": [
    {
      id: "bs-1",
      slug: "rize-tea-plateau-lodge",
      name: "Rize Tea Plateau Lodge",
      description:
        "A restored Ottoman farmhouse perched on the mist-covered tea terraces above Rize, with a wood-burning fireplace suite and panoramic highland views.",
      longDescription:
        "The tea terraces above Rize are among the most intensely green landscapes in the world — every hillside a dense, manicured cascade of tea plants disappearing into low cloud. This restored Ottoman farmhouse sits among them at 800 metres altitude, its wide timber veranda looking out over successive ridges to the Black Sea far below. Evenings are spent beside the wood-burning fireplace with a glass of local çay; mornings smell of woodsmoke and fresh bread from the kitchen below.",
      tags: ["Highland", "Farmhouse"],
      svgVariant: "chalet",
      amenities: ["Wood Fireplace", "Highland Views", "Tea Terrace Walks", "Farm Breakfast", "Black Sea Panorama"],
      location: "Rize Highlands",
      bedroomImage: "https://images.unsplash.com/photo-1464146072230-91cabc968266?w=1200&q=80",
      images: [
        // Exterior — Black Sea highland wooden farmhouse
        "https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=1200&q=80",
        // Bedroom — cosy timber chalet room
        "https://images.unsplash.com/photo-1464146072230-91cabc968266?w=1200&q=80",
        // Bathroom — rustic chalet bathroom
        "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=1200&q=80",
        // View — Rize tea terraces and Black Sea
        "https://images.unsplash.com/photo-1586105251261-72a756497a11?w=1200&q=80",
      ],
      roomTypes: [
        { name: "Fireplace Room", capacity: 2, beds: "1 double bed", size: "28 m²", imageIndex: 1, highlights: ["Wood-burning fireplace", "Highland views", "Farm breakfast"] },
        { name: "Highland Suite", capacity: 4, beds: "2 twin beds + loft", size: "52 m²", imageIndex: 0, highlights: ["Panoramic veranda", "Black Sea view", "Tea terrace walks"] },
      ],
      checkInTime: "15:00",
      checkOutTime: "10:00",
      languages: ["English", "Turkish"],
      properties: {
        freeWifi: true, bedrooms: 2, bathrooms: 1, distanceKm: 18,
        freeCancellation: true, freeParking: true, bedBreakfast: true,
        balcony: false, washer: true, ac: false, tv: true,
      },
    },
    {
      id: "bs-2",
      slug: "sinop-fortress-inn",
      name: "Sinop Fortress Inn",
      description:
        "Rooms carved into the walls of a Byzantine sea fortress at the northernmost point of Türkiye, where the Black Sea stretches to the horizon.",
      longDescription:
        "Sinop is the northernmost city in Türkiye, a natural harbour enclosed by a headland that juts into the Black Sea. The Fortress Inn occupies rooms carved directly into the Byzantine sea walls, their thick stone keeping the interior cool even on August afternoons. Outside, the Black Sea stretches to an unbroken horizon. The town itself is one of the least-visited and most well-preserved historic settlements on the northern coast — quiet, unhurried, and genuinely local.",
      tags: ["Heritage", "Fortress"],
      svgVariant: "mansion",
      amenities: ["Byzantine Architecture", "Sea Views", "Stone-Walled Rooms", "Harbour Access", "Historic Town"],
      location: "Sinop",
      bedroomImage: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200&q=80",
      images: [
        // Exterior — Black Sea fortress harbour
        "https://images.unsplash.com/photo-1611048267451-e6ed903d4a38?w=1200&q=80",
        // Bedroom — stone-walled fortress room
        "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200&q=80",
        // Bathroom — stone heritage bathroom
        "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&q=80",
        // View — Black Sea horizon from fortress walls
        "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=1200&q=80",
      ],
      roomTypes: [
        { name: "Fortress Room", capacity: 2, beds: "1 double bed", size: "22 m²", imageIndex: 1, highlights: ["Byzantine stone walls", "Sea views", "Breakfast included"] },
        { name: "Sea Wall Suite", capacity: 2, beds: "1 king bed", size: "38 m²", imageIndex: 3, highlights: ["Panoramic Black Sea", "Historic fortress access", "Balcony"] },
      ],
      checkInTime: "14:00",
      checkOutTime: "11:00",
      languages: ["English", "Turkish"],
      properties: {
        freeWifi: false, bedrooms: 1, bathrooms: 1, distanceKm: 5,
        freeCancellation: false, freeParking: true, bedBreakfast: true,
        balcony: true, washer: false, ac: false, tv: true,
      },
    },
  ],
  "Eastern Anatolia": [
    {
      id: "ea-1",
      slug: "lake-van-konak",
      name: "Lake Van Konak",
      description:
        "A beautifully restored Armenian mansion on the shores of the world's largest soda lake, with views across the water to the island church of Akdamar.",
      longDescription:
        "Lake Van is the largest lake in Türkiye and one of the largest soda lakes in the world — its waters a striking shade of turquoise-blue, too alkaline for most fish but home to the endemic pearl mullet. The konak, a restored Armenian mansion built in 1904, sits directly on the southern shore. From the waterfront terrace, the island church of Akdamar is visible on clear days, its 10th-century khachkars still sharp against the sky after eleven centuries.",
      tags: ["Lakeside", "Heritage"],
      svgVariant: "mansion",
      amenities: ["Lake Terrace", "Boat to Akdamar", "Armenian Architecture", "Sunrise Views", "Regional Cuisine"],
      location: "Van, Eastern Anatolia",
      bedroomImage: "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=1200&q=80",
      images: [
        // Exterior — lakeside mansion Eastern Anatolia
        "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=1200&q=80",
        // Bedroom — heritage mansion room
        "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=1200&q=80",
        // Bathroom — ornate heritage bathroom
        "https://images.unsplash.com/photo-1600607686527-6fb886090705?w=1200&q=80",
        // View — Lake Van turquoise water
        "https://images.unsplash.com/photo-1631049552057-403cdb8f0658?w=1200&q=80",
      ],
      roomTypes: [
        { name: "Lakeside Room", capacity: 2, beds: "1 king bed", size: "36 m²", imageIndex: 1, highlights: ["Lake Van views", "Boat to Akdamar", "Armenian architecture"] },
        { name: "Family Suite", capacity: 4, beds: "2 double beds", size: "60 m²", imageIndex: 0, highlights: ["Two bedrooms", "Sunrise lake views", "Regional cuisine"] },
      ],
      checkInTime: "15:00",
      checkOutTime: "12:00",
      languages: ["English", "Turkish", "Kurdish"],
      properties: {
        freeWifi: true, bedrooms: 2, bathrooms: 2, distanceKm: 11,
        freeCancellation: true, freeParking: true, bedBreakfast: false,
        balcony: true, washer: true, ac: true, tv: true,
      },
    },
    {
      id: "ea-2",
      slug: "mardin-tas-konagi",
      name: "Mardin Taş Konağı",
      description:
        "A hand-carved limestone konağ perched in the old city of Mardin, with a roof terrace overlooking the golden Mesopotamian plain at sunset.",
      longDescription:
        "Mardin is carved from honey-coloured limestone on a ridge above the Mesopotamian plain — one of the most visually arresting old cities in the Middle East. The Taş Konağı occupies a 19th-century mansion whose every surface is hand-carved with geometric and floral motifs by local Syriac craftsmen. The roof terrace, open from sundown, looks out over a plain that stretches flat and golden to the Syrian border, the last light catching the distant tells of ancient settlements.",
      tags: ["Boutique", "Rooftop"],
      svgVariant: "ottoman",
      amenities: ["Rooftop Terrace", "Hand-Carved Stone", "Mesopotamian Views", "Old City Location", "Syriac Heritage"],
      location: "Mardin, Eastern Anatolia",
      bedroomImage: "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=1200&q=80",
      images: [
        // Exterior — Mardin honey limestone old city
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&q=80",
        // Bedroom — carved stone boutique room
        "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=1200&q=80",
        // Bathroom — stone carved ornate bathroom
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&q=80",
        // View — Mesopotamian plain from Mardin rooftop
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80",
      ],
      roomTypes: [
        { name: "Stone Room", capacity: 2, beds: "1 double bed", size: "24 m²", imageIndex: 1, highlights: ["Hand-carved stone décor", "Old city location", "Breakfast included"] },
        { name: "Rooftop Suite", capacity: 2, beds: "1 king bed", size: "40 m²", imageIndex: 3, highlights: ["Private rooftop terrace", "Mesopotamian plain views", "Syriac heritage"] },
      ],
      checkInTime: "15:00",
      checkOutTime: "12:00",
      languages: ["English", "Turkish", "Arabic", "Syriac"],
      properties: {
        freeWifi: true, bedrooms: 1, bathrooms: 1, distanceKm: 8,
        freeCancellation: false, freeParking: false, bedBreakfast: true,
        balcony: true, washer: true, ac: true, tv: false,
      },
    },
  ],
};
