import type { HotelSVGVariant } from "@/components/illustrations/HotelSVG/HotelSVG";
import type { REGIONS } from "@/lib/packages/constants";

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
    },
  ],
};
