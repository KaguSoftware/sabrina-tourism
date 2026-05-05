import type { HotelCardData } from "@/components/regions/HotelCard/HotelCard";
import type { REGIONS } from "@/lib/packages/constants";

export const HOTELS: Record<(typeof REGIONS)[number], HotelCardData[]> = {
  Istanbul: [
    {
      id: "ist-1",
      name: "Bosphorus Manor",
      description:
        "An 1890s Ottoman mansion overlooking the strait, restored to its original grandeur with a private hammam and terrace suites facing the water.",
      tags: ["Boutique", "Waterfront"],
      svgVariant: "ottoman",
    },
    {
      id: "ist-2",
      name: "Sultanahmet Residences",
      description:
        "Steps from the Blue Mosque, these converted Byzantine townhouses marry thousand-year-old stone walls with quietly modern comforts.",
      tags: ["Heritage", "Old City"],
      svgVariant: "mansion",
    },
    {
      id: "ist-3",
      name: "Galata Merchant House",
      description:
        "A 19th-century trading house deep in Beyoğlu, meticulously restored with a rooftop terrace commanding views across the Golden Horn.",
      tags: ["Boutique", "Rooftop"],
      svgVariant: "ottoman",
    },
    {
      id: "ist-4",
      name: "Pera Grand Konak",
      description:
        "Set in the old European quarter, this Neoclassical konak blends Ottoman ornament with contemporary interiors and a celebrated mezze table.",
      tags: ["Grand", "Cultural Quarter"],
      svgVariant: "mansion",
    },
  ],
  Cappadocia: [
    {
      id: "cap-1",
      name: "Göreme Cave Lodge",
      description:
        "Hand-carved suites set directly into volcanic tuff, each opening onto a private terrace that faces the valley as the first balloons rise at dawn.",
      tags: ["Cave Suite", "Valley View"],
      svgVariant: "cave",
    },
    {
      id: "cap-2",
      name: "Uçhisar Cliff Suites",
      description:
        "Cantilevered over the highest natural outcrop in Cappadocia, these suites offer a 360° panorama of the fairy chimney valleys below.",
      tags: ["Clifftop", "Panoramic"],
      svgVariant: "cave",
    },
    {
      id: "cap-3",
      name: "Balloon View Retreat",
      description:
        "Wake to the low rumble of burners as dozens of hot-air balloons drift past your window in the cool, amber-lit morning air.",
      tags: ["Cave Suite", "Balloon Views"],
      svgVariant: "cave",
    },
    {
      id: "cap-4",
      name: "Avanos Pottery House",
      description:
        "A restored craftsman's estate on the banks of the Red River, where every room is lined with locally thrown ceramics and kilim rugs.",
      tags: ["Boutique", "Riverside"],
      svgVariant: "ottoman",
    },
  ],
  Aegean: [
    {
      id: "aeg-1",
      name: "Alaçatı Stone House",
      description:
        "A 19th-century Greek stone house in the famous windmill village, with a courtyard plunge pool, lavender garden, and wind-swept terraces.",
      tags: ["Boutique", "Village"],
      svgVariant: "aegean",
    },
    {
      id: "aeg-2",
      name: "Ephesus Terrace Hotel",
      description:
        "Surrounded by ancient olive groves, set just minutes from the marble colonnades of Ephesus and the turquoise waters of Pamucak beach.",
      tags: ["Heritage", "Olive Grove"],
      svgVariant: "aegean",
    },
    {
      id: "aeg-3",
      name: "Bodrum Harbour Suites",
      description:
        "Whitewashed terraces step down the hillside to the Aegean marina, with the medieval Knights' Castle rising behind every rooftop.",
      tags: ["Waterfront", "Marina"],
      svgVariant: "coastal",
    },
    {
      id: "aeg-4",
      name: "Çeşme Windmill Lodge",
      description:
        "Restored Ottoman windmill towers converted into intimate suites, perched on a headland where the Aegean breeze is constant and the sunsets legendary.",
      tags: ["Unique Stay", "Headland"],
      svgVariant: "aegean",
    },
  ],
  Mediterranean: [
    {
      id: "med-1",
      name: "Kalkan Bay Lodge",
      description:
        "Cascading in white terraces down a clifftop above the bay, each suite comes with its own infinity plunge pool and an uninterrupted sea horizon.",
      tags: ["Clifftop", "Infinity Pool"],
      svgVariant: "coastal",
    },
    {
      id: "med-2",
      name: "Patara Cedar Retreat",
      description:
        "A restored caravan lodge shaded by ancient cedar forest, set beside the longest uninterrupted sand beach in Türkiye.",
      tags: ["Nature", "Beachside"],
      svgVariant: "chalet",
    },
    {
      id: "med-3",
      name: "Kaş Harbour Inn",
      description:
        "A boutique harbour hotel built directly above Roman ruins, with direct access to some of the most celebrated dive sites on the coast.",
      tags: ["Boutique", "Dive Base"],
      svgVariant: "aegean",
    },
    {
      id: "med-4",
      name: "Olympos Treehouse Camp",
      description:
        "Wooden platforms raised among the ruins of ancient Olympos and the eternal Chimaera flames — the most storied address on the Lycian Way.",
      tags: ["Unique Stay", "Ancient Ruins"],
      svgVariant: "chalet",
    },
  ],
  "Black Sea": [
    {
      id: "bs-1",
      name: "Rize Tea Plateau Lodge",
      description:
        "A restored Ottoman farmhouse perched on the mist-covered tea terraces above Rize, with a wood-burning fireplace suite and panoramic highland views.",
      tags: ["Highland", "Farmhouse"],
      svgVariant: "chalet",
    },
    {
      id: "bs-2",
      name: "Ayder Highland Chalet",
      description:
        "Timber chalets built beside a glacial waterfall deep in the Kaçkar mountains — the ideal base for alpine trekking, botanising, and total silence.",
      tags: ["Alpine", "Waterfall"],
      svgVariant: "chalet",
    },
    {
      id: "bs-3",
      name: "Sinop Fortress Inn",
      description:
        "Rooms carved into the walls of a Byzantine sea fortress at the northernmost point of Türkiye, where the Black Sea stretches to the horizon.",
      tags: ["Heritage", "Fortress"],
      svgVariant: "mansion",
    },
    {
      id: "bs-4",
      name: "Trabzon Konak Hotel",
      description:
        "A meticulously restored Ottoman konak in the old city, within walking distance of the Atatürk Villa and the spectacular Sümela Monastery valley.",
      tags: ["Heritage", "City Centre"],
      svgVariant: "ottoman",
    },
  ],
  "Eastern Anatolia": [
    {
      id: "ea-1",
      name: "Nemrut Plateau House",
      description:
        "A stone guesthouse at altitude, positioned to catch the extraordinary dawn and dusk light on the colossal stone heads of Mount Nemrut.",
      tags: ["Altitude", "Landmark View"],
      svgVariant: "chalet",
    },
    {
      id: "ea-2",
      name: "Lake Van Konak",
      description:
        "A beautifully restored Armenian mansion on the shores of the world's largest soda lake, with views across the water to the island church of Akdamar.",
      tags: ["Lakeside", "Heritage"],
      svgVariant: "mansion",
    },
    {
      id: "ea-3",
      name: "Mardin Taş Konağı",
      description:
        "A hand-carved limestone konağ perched in the old city of Mardin, with a roof terrace overlooking the golden Mesopotamian plain at sunset.",
      tags: ["Boutique", "Rooftop"],
      svgVariant: "ottoman",
    },
    {
      id: "ea-4",
      name: "Diyarbakır Basalt Lodge",
      description:
        "Rooms set within the thousand-year-old basalt city walls, overlooking the Tigris valley — the most dramatically sited address in eastern Türkiye.",
      tags: ["Heritage", "City Walls"],
      svgVariant: "mansion",
    },
  ],
};
