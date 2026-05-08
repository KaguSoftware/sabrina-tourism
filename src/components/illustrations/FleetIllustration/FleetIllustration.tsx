import type { FleetIllustrationProps } from "./types";
import { VIEWBOX } from "./constants";

function SedanSVG() {
  return (
    <>
      {/* Body */}
      <path d="M30 80 L30 58 Q32 44 60 40 L140 40 Q168 44 170 58 L170 80Z" fill="#1b4d5c" />
      {/* Roof */}
      <path d="M60 40 Q68 26 100 24 Q132 26 140 40Z" fill="#162b47" />
      {/* Windows */}
      <path d="M64 40 Q70 30 100 28 Q130 30 136 40Z" fill="#a8c8e1" opacity="0.6" />
      <line x1="100" y1="28" x2="100" y2="40" stroke="#1b4d5c" strokeWidth="1.5" />
      {/* Wheels */}
      <circle cx="62" cy="82" r="16" fill="#0b1a2e" />
      <circle cx="62" cy="82" r="10" fill="#2a3a50" />
      <circle cx="62" cy="82" r="4" fill="#c99a3f" />
      <circle cx="138" cy="82" r="16" fill="#0b1a2e" />
      <circle cx="138" cy="82" r="10" fill="#2a3a50" />
      <circle cx="138" cy="82" r="4" fill="#c99a3f" />
      {/* Headlight */}
      <rect x="162" y="62" width="10" height="8" rx="2" fill="#c99a3f" opacity="0.8" />
      <rect x="28" y="62" width="10" height="8" rx="2" fill="#c99a3f" opacity="0.5" />
      {/* Ground shadow */}
      <ellipse cx="100" cy="98" rx="72" ry="5" fill="#1b4d5c" opacity="0.2" />
    </>
  );
}

function SUVSVG() {
  return (
    <>
      {/* Taller body */}
      <path d="M22 82 L22 54 Q25 38 58 34 L142 34 Q175 38 178 54 L178 82Z" fill="#1b4d5c" />
      {/* Roof */}
      <path d="M58 34 Q64 22 100 20 Q136 22 142 34Z" fill="#162b47" />
      {/* Windows */}
      <path d="M62 34 Q68 26 100 24 Q132 26 138 34Z" fill="#a8c8e1" opacity="0.6" />
      <line x1="100" y1="24" x2="100" y2="34" stroke="#1b4d5c" strokeWidth="1.5" />
      {/* Roof rack */}
      <rect x="62" y="19" width="76" height="4" rx="1" fill="#c99a3f" opacity="0.7" />
      {/* Wheels — bigger */}
      <circle cx="58" cy="84" r="18" fill="#0b1a2e" />
      <circle cx="58" cy="84" r="11" fill="#2a3a50" />
      <circle cx="58" cy="84" r="4.5" fill="#c99a3f" />
      <circle cx="142" cy="84" r="18" fill="#0b1a2e" />
      <circle cx="142" cy="84" r="11" fill="#2a3a50" />
      <circle cx="142" cy="84" r="4.5" fill="#c99a3f" />
      <rect x="170" y="58" width="10" height="10" rx="2" fill="#c99a3f" opacity="0.8" />
      <ellipse cx="100" cy="102" rx="78" ry="5" fill="#1b4d5c" opacity="0.2" />
    </>
  );
}

function VanSVG() {
  return (
    <>
      {/* Boxy van body */}
      <path d="M18 85 L18 42 Q20 30 42 28 L158 28 Q180 30 182 42 L182 85Z" fill="#1b4d5c" />
      {/* Windshield */}
      <path d="M42 28 Q44 16 62 14 Q82 12 90 28Z" fill="#a8c8e1" opacity="0.5" />
      {/* Side windows */}
      <rect x="95" y="34" width="30" height="22" rx="2" fill="#a8c8e1" opacity="0.4" />
      <rect x="132" y="34" width="30" height="22" rx="2" fill="#a8c8e1" opacity="0.4" />
      {/* Rear doors */}
      <line x1="165" y1="30" x2="165" y2="85" stroke="#162b47" strokeWidth="2" />
      {/* Wheels */}
      <circle cx="50" cy="87" r="17" fill="#0b1a2e" />
      <circle cx="50" cy="87" r="10" fill="#2a3a50" />
      <circle cx="50" cy="87" r="4" fill="#c99a3f" />
      <circle cx="150" cy="87" r="17" fill="#0b1a2e" />
      <circle cx="150" cy="87" r="10" fill="#2a3a50" />
      <circle cx="150" cy="87" r="4" fill="#c99a3f" />
      <rect x="174" y="58" width="10" height="12" rx="2" fill="#c99a3f" opacity="0.8" />
      <ellipse cx="100" cy="104" rx="82" ry="5" fill="#1b4d5c" opacity="0.2" />
    </>
  );
}

function LuxurySVG() {
  return (
    <>
      {/* Mercedes Vito — boxy premium MPV body */}
      <path d="M20 82 L20 48 Q22 34 48 30 L152 30 Q178 34 180 48 L180 82Z" fill="#0b1a2e" />
      {/* Flat high roof */}
      <rect x="48" y="22" width="104" height="10" rx="3" fill="#162b47" />
      {/* Windshield */}
      <path d="M48 30 Q50 22 65 22 L100 22 L100 30Z" fill="#a8c8e1" opacity="0.55" />
      {/* Passenger windows */}
      <rect x="108" y="34" width="28" height="18" rx="2" fill="#a8c8e1" opacity="0.45" />
      <rect x="142" y="34" width="24" height="18" rx="2" fill="#a8c8e1" opacity="0.45" />
      {/* B-pillar */}
      <rect x="136" y="30" width="4" height="22" fill="#0b1a2e" />
      {/* Gold chrome beltline */}
      <path d="M20 58 L180 58" stroke="#c99a3f" strokeWidth="1.5" opacity="0.55" />
      {/* Front grille bar */}
      <rect x="170" y="52" width="10" height="3" rx="1" fill="#c99a3f" opacity="0.8" />
      {/* Slim LED headlight strip */}
      <rect x="170" y="44" width="11" height="5" rx="1.5" fill="#c99a3f" opacity="0.9" />
      {/* Tail light */}
      <rect x="19" y="50" width="8" height="10" rx="2" fill="#c99a3f" opacity="0.5" />
      {/* Wheels */}
      <circle cx="58" cy="84" r="17" fill="#0d0d14" />
      <circle cx="58" cy="84" r="10" fill="#1a1a28" />
      <circle cx="58" cy="84" r="4.5" fill="#c99a3f" />
      <circle cx="148" cy="84" r="17" fill="#0d0d14" />
      <circle cx="148" cy="84" r="10" fill="#1a1a28" />
      <circle cx="148" cy="84" r="4.5" fill="#c99a3f" />
      {/* Ground shadow */}
      <ellipse cx="100" cy="101" rx="82" ry="4" fill="#0b1a2e" opacity="0.22" />
    </>
  );
}

function SprinterSVG() {
  return (
    <>
      {/* Sprinter minibus — tall long body */}
      <path d="M14 86 L14 36 Q16 22 36 18 L170 18 Q188 22 188 36 L188 86Z" fill="#1b4d5c" />
      {/* High roof */}
      <rect x="36" y="10" width="132" height="10" rx="3" fill="#162b47" />
      {/* Windshield — tall cab glass */}
      <path d="M36 18 Q38 10 55 10 L90 10 L90 18Z" fill="#a8c8e1" opacity="0.5" />
      {/* Side passenger windows row */}
      <rect x="95"  y="24" width="22" height="16" rx="2" fill="#a8c8e1" opacity="0.4" />
      <rect x="122" y="24" width="22" height="16" rx="2" fill="#a8c8e1" opacity="0.4" />
      <rect x="149" y="24" width="22" height="16" rx="2" fill="#a8c8e1" opacity="0.4" />
      {/* Roof AC unit */}
      <rect x="110" y="8" width="50" height="5" rx="1.5" fill="#c99a3f" opacity="0.5" />
      {/* Rear door line */}
      <line x1="174" y1="20" x2="174" y2="86" stroke="#162b47" strokeWidth="2.5" />
      {/* Gold beltline stripe */}
      <path d="M14 54 L188 54" stroke="#c99a3f" strokeWidth="1.5" opacity="0.5" />
      {/* Headlight */}
      <rect x="179" y="34" width="10" height="8" rx="2" fill="#c99a3f" opacity="0.85" />
      {/* Rear light */}
      <rect x="13" y="44" width="8" height="12" rx="2" fill="#c99a3f" opacity="0.5" />
      {/* Wheels */}
      <circle cx="48"  cy="88" r="18" fill="#0b1a2e" />
      <circle cx="48"  cy="88" r="11" fill="#2a3a50" />
      <circle cx="48"  cy="88" r="4.5" fill="#c99a3f" />
      <circle cx="158" cy="88" r="18" fill="#0b1a2e" />
      <circle cx="158" cy="88" r="11" fill="#2a3a50" />
      <circle cx="158" cy="88" r="4.5" fill="#c99a3f" />
      {/* Ground shadow */}
      <ellipse cx="100" cy="106" rx="88" ry="5" fill="#1b4d5c" opacity="0.2" />
    </>
  );
}

export function FleetIllustration({ vehicleId, className = "" }: FleetIllustrationProps) {
  return (
    <svg
      viewBox={VIEWBOX}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {vehicleId === "sedan" && <SedanSVG />}
      {vehicleId === "suv" && <SUVSVG />}
      {vehicleId === "van" && <VanSVG />}
      {vehicleId === "luxury" && <LuxurySVG />}
      {vehicleId === "minibus" && <SprinterSVG />}
    </svg>
  );
}
