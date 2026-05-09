import { DESTINATIONS } from "@/components/custom-tour/types";

interface TripMapSVGProps {
  destinations: string[];
  destinationDays: Record<string, string>;
  emptyLabel?: string;
  className?: string;
}

type LabelAnchor = "start" | "middle" | "end";

interface RegionAnchor {
  x: number;
  y: number;
  labelDx: number;
  labelDy: number;
  labelAnchor: LabelAnchor;
}

const VIEWBOX_W = 900;
const VIEWBOX_H = 620;

// Coordinates calibrated to the TURKEY_PATH below.
const REGION_ANCHORS: Record<string, RegionAnchor> = {
  Istanbul:           { x: 175, y: 240, labelDx:   0, labelDy: -44, labelAnchor: "middle" },
  "Black Sea":        { x: 500, y: 230, labelDx:   0, labelDy: -42, labelAnchor: "middle" },
  Cappadocia:         { x: 500, y: 360, labelDx:   0, labelDy: -42, labelAnchor: "middle" },
  "Eastern Anatolia": { x: 735, y: 340, labelDx:   0, labelDy:  72, labelAnchor: "middle" },
  Aegean:             { x: 175, y: 395, labelDx:   0, labelDy:  46, labelAnchor: "middle" },
  Mediterranean:      { x: 410, y: 470, labelDx:   0, labelDy:  46, labelAnchor: "middle" },
};

// More recognizable Turkey outline.
// Walks clockwise from the Thrace peninsula (NW) → Black Sea coast (N, slight bulge) →
// Eastern highlands (E, broader) → Hatay finger (SE) → Mediterranean coast with Antalya bay
// → Aegean coast (W, jagged gulfs) → Sea of Marmara → back to Thrace.
const TURKEY_PATH = [
  // Thrace peninsula (top-left)
  "M 70 215",
  "L 130 200",
  "L 165 205",
  // Bosphorus / Sea of Marmara indent
  "L 190 220",
  "L 175 235",
  "L 200 245",
  // Black Sea coast — gentle arc with a small Sinop bulge
  "Q 280 195, 360 200",
  "Q 420 205, 470 215",
  "Q 530 222, 580 215",   // Sinop bulge dipping slightly south
  "Q 640 210, 700 215",
  // Eastern Black Sea / Caucasus border (NE corner)
  "L 760 230",
  "L 800 250",
  "L 815 280",
  // Eastern border (Iran/Armenia) — slightly jagged
  "L 800 320",
  "L 815 350",
  "L 790 380",
  // SE corner / Hatay finger pointing south
  "L 760 395",
  "L 720 405",
  "L 690 395",
  "L 660 415",
  "L 645 445",            // Hatay tip
  "L 625 440",
  "L 615 410",
  // Mediterranean coast — Antalya bay indent
  "L 560 425",
  "Q 510 460, 460 455",   // Antalya bay (concave dip into the country)
  "Q 420 450, 380 460",
  "L 320 470",
  "L 270 460",
  // Aegean coast — jagged gulfs (Fethiye / Bodrum / İzmir)
  "L 230 445",
  "L 210 455",            // Fethiye gulf
  "L 195 440",
  "L 180 460",            // Bodrum gulf
  "L 160 435",
  "L 150 415",
  "L 130 400",            // İzmir gulf
  "L 115 380",
  "L 105 350",
  "L 100 320",
  "L 90 290",
  "L 95 260",
  // Sea of Marmara / Dardanelles back to start
  "L 110 240",
  "L 130 250",
  "L 145 235",
  "L 130 220",
  "L 95 215",
  "Z",
].join(" ");

// Suggestive neighbor land hints (kept off the main silhouette so they read as foreign).
const NEIGHBORS = {
  greece: "M 30 280 C 50 240, 60 215, 70 215 L 70 350 C 50 340, 30 320, 30 280 Z",
  cyprus: "M 380 555 q 20 -8 36 0 q 18 8 0 16 q -22 8 -36 -2 z",
  caucasus: "M 845 145 C 860 125, 880 125, 895 145 L 895 230 C 880 220, 860 200, 845 185 Z",
};

const ISLANDS = [
  "M 75 470 q 14 -6 26 0 q 10 5 0 11 q -12 6 -26 -1 z",
  "M 215 530 q 11 -5 20 0 q 7 4 0 8 q -10 5 -20 -1 z",
  "M 50 410 q 9 -4 16 0 q 6 3 0 6 q -8 4 -16 -1 z",
  "M 850 75 q 12 -5 22 0 q 8 4 0 9 q -11 5 -22 -2 z",
];

function markerRadius(daysStr: string | undefined): number {
  const parsed = parseInt(daysStr ?? "", 10);
  const days = Number.isFinite(parsed) ? Math.min(Math.max(parsed, 1), 10) : 1;
  return 14 + days * 2.2;
}

export function TripMapSVG({
  destinations,
  destinationDays,
  emptyLabel,
  className,
}: TripMapSVGProps) {
  const stops = destinations
    .map((id) => {
      const anchor = REGION_ANCHORS[id];
      if (!anchor) return null;
      const label = DESTINATIONS.find((d) => d.id === id)?.label ?? id;
      const days = destinationDays?.[id];
      return { id, anchor, label, days };
    })
    .filter((stop): stop is NonNullable<typeof stop> => stop !== null);

  const polylinePoints = stops.map((s) => `${s.anchor.x},${s.anchor.y}`).join(" ");

  return (
    <div className={className}>
      <svg
        viewBox={`0 0 ${VIEWBOX_W} ${VIEWBOX_H}`}
        width="100%"
        style={{ height: "auto" }}
        role="img"
        aria-label="Trip route map of Turkey"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="tm-sea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#bcdcef" />
            <stop offset="55%" stopColor="#7fb1d4" />
            <stop offset="100%" stopColor="#4f86a8" />
          </linearGradient>
          <linearGradient id="tm-land" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#b9d68d" />
            <stop offset="55%" stopColor="#90b86b" />
            <stop offset="100%" stopColor="#6c9249" />
          </linearGradient>
          <linearGradient id="tm-neighbor" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#cfd8b8" />
            <stop offset="100%" stopColor="#a8b794" />
          </linearGradient>
          <pattern id="tm-grid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#ffffff" strokeOpacity="0.18" strokeWidth="0.6" />
          </pattern>
        </defs>

        {/* Sea + grid */}
        <rect x="0" y="0" width={VIEWBOX_W} height={VIEWBOX_H} rx="20" fill="url(#tm-sea)" />
        <rect x="0" y="0" width={VIEWBOX_W} height={VIEWBOX_H} rx="20" fill="url(#tm-grid)" />

        {/* Bathymetry wave hints — placed clear of sea labels and bottom UI */}
        <g stroke="#1b4d5c" strokeOpacity="0.22" strokeWidth="1.1" fill="none" strokeLinecap="round">
          <path d="M 200 555 Q 260 547, 320 555 T 440 555" />
          <path d="M 470 105 Q 530 97, 590 105" />
          <path d="M 110 60 Q 150 52, 190 60" />
        </g>

        {/* Sea labels — placed to clear pin label zones */}
        <g fill="#1b4d5c" fillOpacity="0.55" fontFamily="Georgia, serif" fontStyle="italic">
          <text x="700" y="60" textAnchor="middle" fontSize="20" letterSpacing="6">BLACK SEA</text>
          <text x="32" y="500" transform="rotate(-78 32 500)" fontSize="14" letterSpacing="3">AEGEAN SEA</text>
          <text x="660" y="585" textAnchor="middle" fontSize="14" letterSpacing="3">MEDITERRANEAN SEA</text>
        </g>

        {/* Neighbor landmasses */}
        <g fill="url(#tm-neighbor)" stroke="#7d8a64" strokeWidth="1.2" strokeLinejoin="round">
          <path d={NEIGHBORS.greece} />
          <path d={NEIGHBORS.cyprus} />
          <path d={NEIGHBORS.caucasus} />
        </g>

        {/* Decorative islands */}
        <g fill="#9bbf73" stroke="#5d8038" strokeWidth="0.9" strokeLinejoin="round">
          {ISLANDS.map((d, i) => (
            <path key={i} d={d} />
          ))}
        </g>

        {/* Turkey drop shadow */}
        <path d={TURKEY_PATH} fill="#000" opacity="0.10" transform="translate(5, 8)" />

        {/* Turkey landmass */}
        <path
          d={TURKEY_PATH}
          fill="url(#tm-land)"
          stroke="#4d6f2a"
          strokeWidth="2"
          strokeLinejoin="round"
        />

        {/* Subtle terrain shading: forest/hill blobs to suggest topography */}
        <g style={{ mixBlendMode: "multiply" }}>
          <ellipse cx="320" cy="220" rx="80" ry="22" fill="#4d6f2a" opacity="0.18" />
          <ellipse cx="600" cy="245" rx="95" ry="26" fill="#4d6f2a" opacity="0.20" />
          <ellipse cx="745" cy="290" rx="70" ry="24" fill="#3d5e1f" opacity="0.28" />
          <ellipse cx="240" cy="380" rx="55" ry="18" fill="#4d6f2a" opacity="0.16" />
          <ellipse cx="450" cy="400" rx="60" ry="18" fill="#4d6f2a" opacity="0.16" />
        </g>

        {/* Mountain glyphs (eastern highlands hint) */}
        <g fill="#3d5e1f" opacity="0.7">
          <path d="M 700 295 l 12 -16 l 8 11 l 8 -14 l 14 19 z" />
          <path d="M 740 300 l 10 -12 l 6 8 l 8 -12 l 12 16 z" />
          <path d="M 660 280 l 9 -11 l 6 7 l 6 -10 l 11 14 z" />
        </g>

        {/* Rivers */}
        <g fill="none" stroke="#5896b8" strokeWidth="1.6" strokeLinecap="round" opacity="0.85">
          <path d="M 745 320 Q 660 360, 580 380 Q 500 400, 420 420" />
          <path d="M 720 340 Q 660 400, 600 425" />
        </g>

        {/* Region color blooms (very subtle, real-map style) */}
        <g style={{ mixBlendMode: "multiply" }} opacity="0.18">
          <circle cx={REGION_ANCHORS.Istanbul.x} cy={REGION_ANCHORS.Istanbul.y} r="55" fill="#c46b4f" />
          <circle cx={REGION_ANCHORS["Black Sea"].x} cy={REGION_ANCHORS["Black Sea"].y} r="65" fill="#2f7d4f" />
          <circle cx={REGION_ANCHORS.Cappadocia.x} cy={REGION_ANCHORS.Cappadocia.y} r="60" fill="#c99a3f" />
          <circle cx={REGION_ANCHORS["Eastern Anatolia"].x} cy={REGION_ANCHORS["Eastern Anatolia"].y} r="60" fill="#8a5a35" />
          <circle cx={REGION_ANCHORS.Aegean.x} cy={REGION_ANCHORS.Aegean.y} r="55" fill="#3a8fbf" />
          <circle cx={REGION_ANCHORS.Mediterranean.x} cy={REGION_ANCHORS.Mediterranean.y} r="60" fill="#e0a83a" />
        </g>

        {/* Country label — placed in the gap between the western pin row and the central pin row */}
        <text
          x={325}
          y={285}
          textAnchor="middle"
          fontFamily="Georgia, serif"
          fontSize="20"
          fontWeight="700"
          fill="#2f4a18"
          fillOpacity="0.32"
          letterSpacing="6"
        >
          TÜRKİYE
        </text>

        {/* Compass rose — top right, clear of all pin labels */}
        <g transform={`translate(${VIEWBOX_W - 50}, 60)`}>
          <circle r="26" fill="#fffaf0" stroke="#4d6f2a" strokeWidth="1.2" opacity="0.95" />
          <path d="M 0 -20 L 5 0 L 0 20 L -5 0 Z" fill="#0b1a2e" />
          <path d="M 0 -20 L 5 0 L 0 0 Z" fill="#c46b4f" />
          <text y="-30" textAnchor="middle" fontSize="11" fontFamily="Georgia, serif" fill="#1f1a14" fontWeight="700">N</text>
        </g>

        {/* Scale bar — bottom left, clear of Aegean and Mediterranean pin labels */}
        <g transform={`translate(40, ${VIEWBOX_H - 30})`}>
          <rect x="0" y="0" width="60" height="6" fill="#1f1a14" />
          <rect x="60" y="0" width="60" height="6" fill="#fffaf0" stroke="#1f1a14" strokeWidth="1" />
          <text x="0" y="-4" fontSize="10" fontFamily="Georgia, serif" fill="#1f1a14">0</text>
          <text x="120" y="-4" fontSize="10" fontFamily="Georgia, serif" fill="#1f1a14" textAnchor="middle">300 km</text>
        </g>

        {/* Route polyline — white halo + dashed line on top */}
        {stops.length >= 2 && (
          <>
            <polyline
              points={polylinePoints}
              fill="none"
              stroke="#ffffff"
              strokeWidth="7"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeOpacity="0.7"
            />
            <polyline
              points={polylinePoints}
              fill="none"
              stroke="#c46b4f"
              strokeWidth="3.5"
              strokeDasharray="7 6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </>
        )}

        {/* Markers + labels */}
        {stops.map((stop, i) => {
          const r = markerRadius(stop.days);
          const { x, y, labelDx, labelDy, labelAnchor } = stop.anchor;
          const dayText = stop.days ? `${stop.label} · ${stop.days}d` : stop.label;
          const pillW = dayText.length * 11 + 22;
          return (
            <g key={stop.id}>
              {/* Pin shadow */}
              <ellipse cx={x} cy={y + r + 3} rx={r * 0.75} ry={r * 0.2} fill="#000" opacity="0.22" />

              {/* Halo */}
              <circle cx={x} cy={y} r={r + 7} fill="#c46b4f" fillOpacity="0.18" />

              {/* Outer pin */}
              <circle cx={x} cy={y} r={r} fill="#c46b4f" stroke="#fffaf0" strokeWidth="3" />

              {/* Inner core */}
              <circle cx={x} cy={y} r={r - 5} fill="#8a3f25" />

              {/* Number */}
              <text
                x={x}
                y={y + 5}
                textAnchor="middle"
                fill="#fffaf0"
                fontSize="14"
                fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
                fontWeight="700"
              >
                {i + 1}
              </text>

              {/* Label pill */}
              <g transform={`translate(${x + labelDx}, ${y + labelDy})`}>
                <rect
                  x={labelAnchor === "start" ? -8 : labelAnchor === "end" ? -(pillW - 8) : -pillW / 2}
                  y={-18}
                  width={pillW}
                  height={28}
                  rx={14}
                  fill="#fffaf0"
                  stroke="#4d6f2a"
                  strokeWidth="1.6"
                  opacity="0.97"
                />
                <text
                  textAnchor={labelAnchor}
                  fill="#1f1a14"
                  fontSize="18"
                  fontFamily="Georgia, serif"
                  fontWeight="600"
                >
                  {dayText}
                </text>
              </g>
            </g>
          );
        })}

        {/* Empty state */}
        {stops.length === 0 && emptyLabel && (
          <text
            x={VIEWBOX_W / 2}
            y={VIEWBOX_H - 30}
            textAnchor="middle"
            fill="#1f1a14"
            fillOpacity="0.65"
            fontSize="16"
            fontFamily="Georgia, serif"
            fontStyle="italic"
          >
            {emptyLabel}
          </text>
        )}
      </svg>
    </div>
  );
}
