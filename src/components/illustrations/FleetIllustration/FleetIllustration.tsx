import type { FleetIllustrationProps } from "./types";
import { VIEWBOX } from "./constants";

const GOLD = "#b89050";
const OCHRE = "#f5c842";
const NAVY = "#0b1a2e";
const BLUE = "#1b4d5c";
const BLUE_DARK = "#162b47";
const BLUE_MID = "#2a3a50";
const WINDOW = "#a8c8e1";

function SedanSVG({ selected, variant }: { selected: boolean; variant: "default" | "custom" }) {
  const isCustomSelected = variant === "custom" && selected;
  const body = isCustomSelected ? GOLD : BLUE;
  const roof = isCustomSelected ? BLUE : BLUE_DARK;
  const headlight = isCustomSelected ? BLUE : "#c99a3f";
  const tyreOuter = variant === "custom" ? BLUE_MID : NAVY;
  const tyreInner = variant === "custom" ? NAVY : BLUE_MID;
  return (
    <>
      <path d="M30 80 L30 58 Q32 44 60 40 L140 40 Q168 44 170 58 L170 80Z" fill={body} />
      <path d="M60 40 Q68 26 100 24 Q132 26 140 40Z" fill={roof} />
      <path d="M64 40 Q70 30 100 28 Q130 30 136 40Z" fill={WINDOW} opacity="0.6" />
      <line x1="100" y1="28" x2="100" y2="40" stroke={BLUE} strokeWidth="1.5" />
      <circle cx="62" cy="82" r="16" fill={tyreOuter} />
      <circle cx="62" cy="82" r="10" fill={tyreInner} />
      <circle cx="62" cy="82" r="4" fill={GOLD} />
      <circle cx="138" cy="82" r="16" fill={tyreOuter} />
      <circle cx="138" cy="82" r="10" fill={tyreInner} />
      <circle cx="138" cy="82" r="4" fill={GOLD} />
      <rect x="162" y="62" width="10" height="8" rx="2" fill={headlight} opacity="0.9" />
      <rect x="28" y="62" width="10" height="8" rx="2" fill={headlight} opacity="0.6" />
      <ellipse cx="100" cy="98" rx="72" ry="5" fill={BLUE} opacity="0.2" />
    </>
  );
}

function SUVSVG({ selected, variant }: { selected: boolean; variant: "default" | "custom" }) {
  const isCustomSelected = variant === "custom" && selected;
  const body = isCustomSelected ? GOLD : BLUE;
  const roof = isCustomSelected ? BLUE : BLUE_DARK;
  const rack = isCustomSelected ? BLUE : "#c99a3f";
  const headlight = isCustomSelected ? BLUE : "#c99a3f";
  const tyreOuter = variant === "custom" ? BLUE_MID : NAVY;
  const tyreInner = variant === "custom" ? NAVY : BLUE_MID;
  return (
    <>
      <path d="M22 82 L22 54 Q25 38 58 34 L142 34 Q175 38 178 54 L178 82Z" fill={body} />
      <path d="M58 34 Q64 22 100 20 Q136 22 142 34Z" fill={roof} />
      <path d="M62 34 Q68 26 100 24 Q132 26 138 34Z" fill={WINDOW} opacity="0.6" />
      <line x1="100" y1="24" x2="100" y2="34" stroke={BLUE} strokeWidth="1.5" />
      <rect x="62" y="19" width="76" height="4" rx="1" fill={rack} opacity="0.8" />
      <circle cx="58" cy="84" r="18" fill={tyreOuter} />
      <circle cx="58" cy="84" r="11" fill={tyreInner} />
      <circle cx="58" cy="84" r="4.5" fill={GOLD} />
      <circle cx="142" cy="84" r="18" fill={tyreOuter} />
      <circle cx="142" cy="84" r="11" fill={tyreInner} />
      <circle cx="142" cy="84" r="4.5" fill={GOLD} />
      <rect x="170" y="58" width="10" height="10" rx="2" fill={headlight} opacity="0.9" />
      <ellipse cx="100" cy="102" rx="78" ry="5" fill={BLUE} opacity="0.2" />
    </>
  );
}

function VanSVG({ selected, variant }: { selected: boolean; variant: "default" | "custom" }) {
  const isCustomSelected = variant === "custom" && selected;
  const body = isCustomSelected ? GOLD : BLUE;
  const doorLine = isCustomSelected ? BLUE : BLUE_DARK;
  const headlight = isCustomSelected ? BLUE : "#c99a3f";
  const tyreOuter = variant === "custom" ? BLUE_MID : NAVY;
  const tyreInner = variant === "custom" ? NAVY : BLUE_MID;
  return (
    <>
      <path d="M18 85 L18 42 Q20 30 42 28 L158 28 Q180 30 182 42 L182 85Z" fill={body} />
      <path d="M42 28 Q44 16 62 14 Q82 12 90 28Z" fill={WINDOW} opacity="0.5" />
      <rect x="95" y="34" width="30" height="22" rx="2" fill={WINDOW} opacity="0.4" />
      <rect x="132" y="34" width="30" height="22" rx="2" fill={WINDOW} opacity="0.4" />
      <line x1="165" y1="30" x2="165" y2="85" stroke={doorLine} strokeWidth="1" />
      <circle cx="50" cy="87" r="17" fill={tyreOuter} />
      <circle cx="50" cy="87" r="10" fill={tyreInner} />
      <circle cx="50" cy="87" r="4" fill={GOLD} />
      <circle cx="150" cy="87" r="17" fill={tyreOuter} />
      <circle cx="150" cy="87" r="10" fill={tyreInner} />
      <circle cx="150" cy="87" r="4" fill={GOLD} />
      <rect x="174" y="58" width="10" height="12" rx="2" fill={headlight} opacity="0.9" />
      <ellipse cx="100" cy="104" rx="82" ry="5" fill={BLUE} opacity="0.2" />
    </>
  );
}

function LuxurySVG({ selected, variant }: { selected: boolean; variant: "default" | "custom" }) {
  const isCustomSelected = variant === "custom" && selected;
  const body = isCustomSelected ? GOLD : NAVY;
  const roof = isCustomSelected ? BLUE : BLUE_DARK;
  const divider = isCustomSelected ? BLUE : NAVY;
  const trim = isCustomSelected ? BLUE : "#c99a3f";
  const headlight = isCustomSelected ? BLUE : "#c99a3f";
  const tyreOuter = variant === "custom" ? BLUE_MID : NAVY;
  const tyreInner = variant === "custom" ? NAVY : BLUE_MID;
  return (
    <>
      <path d="M18 80 L18 60 Q22 44 55 40 L145 40 Q178 44 182 60 L182 80Z" fill={body} />
      <path d="M55 40 Q65 28 100 26 Q135 28 145 40Z" fill={roof} />
      <path d="M60 40 Q68 32 100 30 Q132 32 140 40Z" fill={WINDOW} opacity="0.5" />
      <line x1="100" y1="30" x2="100" y2="40" stroke={divider} strokeWidth="1.5" />
      <path d="M18 72 L182 72" stroke={trim} strokeWidth="1.5" opacity="0.6" />
      <path d="M18 60 Q22 56 55 54 L145 54 Q178 56 182 60" stroke={trim} strokeWidth="1" opacity="0.4" fill="none" />
      <circle cx="55" cy="82" r="16" fill={tyreOuter} />
      <circle cx="55" cy="82" r="10" fill={tyreInner} />
      <circle cx="55" cy="82" r="5" fill={GOLD} />
      <circle cx="145" cy="82" r="16" fill={tyreOuter} />
      <circle cx="145" cy="82" r="10" fill={tyreInner} />
      <circle cx="145" cy="82" r="5" fill={GOLD} />
      <path d="M174 64 L182 64 L182 70 L174 68Z" fill={headlight} opacity="0.9" />
      <ellipse cx="100" cy="98" rx="82" ry="4" fill={BLUE} opacity="0.25" />
    </>
  );
}

export function FleetIllustration({ vehicleId, className = "", selected = false, variant = "default" }: FleetIllustrationProps) {
  return (
    <svg
      viewBox={VIEWBOX}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ transition: "fill 0.3s ease, stroke 0.3s ease" }}
      aria-hidden="true"
    >
      {vehicleId === "sedan" && <SedanSVG selected={selected} variant={variant} />}
      {vehicleId === "suv" && <SUVSVG selected={selected} variant={variant} />}
      {vehicleId === "van" && <VanSVG selected={selected} variant={variant} />}
      {vehicleId === "luxury" && <LuxurySVG selected={selected} variant={variant} />}
    </svg>
  );
}
