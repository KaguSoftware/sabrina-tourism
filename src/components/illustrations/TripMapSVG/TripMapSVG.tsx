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
  Istanbul:           { x: 165, y: 215, labelDx:   0, labelDy: -42, labelAnchor: "middle" },
  "Black Sea":        { x: 510, y: 195, labelDx:   0, labelDy: -38, labelAnchor: "middle" },
  Cappadocia:         { x: 510, y: 355, labelDx:  34, labelDy:   6, labelAnchor: "start"  },
  "Eastern Anatolia": { x: 745, y: 350, labelDx:   0, labelDy:  56, labelAnchor: "middle" },
  Aegean:             { x: 195, y: 395, labelDx:   0, labelDy:  44, labelAnchor: "middle" },
  Mediterranean:      { x: 380, y: 480, labelDx:   0, labelDy:  44, labelAnchor: "middle" },
};

// Hand-tuned simplified Turkey outline (rectangular-ish landmass).
const TURKEY_PATH =
  "M 90 230 " +
  "C 130 170, 200 145, 260 158 " +
  "C 310 170, 360 162, 410 145 " +
  "C 470 125, 560 125, 625 152 " +
  "C 680 172, 745 172, 805 195 " +
  "C 845 210, 860 245, 840 290 " +
  "C 820 330, 805 370, 775 400 " +
  "C 730 432, 670 432, 615 418 " +
  "C 560 405, 500 425, 445 450 " +
  "C 395 478, 345 502, 290 502 " +
  "C 240 502, 200 475, 160 442 " +
  "C 115 400, 90 350, 80 305 " +
  "C 75 275, 78 245, 90 230 Z";

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
        height="auto"
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
          x={380}
          y={290}
          textAnchor="middle"
          fontFamily="Georgia, serif"
          fontSize="22"
          fontWeight="700"
          fill="#2f4a18"
          fillOpacity="0.35"
          letterSpacing="8"
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
          const pillW = dayText.length * 8 + 18;
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
                  x={labelAnchor === "start" ? -6 : labelAnchor === "end" ? -(pillW - 6) : -pillW / 2}
                  y={-14}
                  width={pillW}
                  height={22}
                  rx={11}
                  fill="#fffaf0"
                  stroke="#4d6f2a"
                  strokeWidth="1.4"
                  opacity="0.97"
                />
                <text
                  textAnchor={labelAnchor}
                  fill="#1f1a14"
                  fontSize="13"
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
