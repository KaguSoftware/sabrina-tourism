import type { FleetIllustrationProps } from "./types";
import { VIEWBOX } from "./constants";

const GOLD = "#b89050";
const OCHRE = "#f5c842";
const NAVY = "#0b1a2e";
const BLUE = "#1b4d5c";
const BLUE_DARK = "#162b47";
const BLUE_MID = "#2a3a50";
const WINDOW = "#a8c8e1";

type IconProps = {
  selected: boolean;
  variant: "default" | "custom";
};

function palette({ selected, variant }: IconProps, defaultBody = BLUE) {
  const isCustomSelected = variant === "custom" && selected;
  return {
    body: isCustomSelected ? GOLD : defaultBody,
    roof: isCustomSelected ? BLUE : BLUE_DARK,
    detail: isCustomSelected ? BLUE : OCHRE,
    divider: isCustomSelected ? BLUE : NAVY,
    tyreOuter: variant === "custom" ? BLUE_MID : NAVY,
    tyreInner: variant === "custom" ? NAVY : BLUE_MID,
  };
}

function CarSVG(props: IconProps) {
  const c = palette(props);

  return (
    <>
      <path d="M24 82 L24 58 Q28 46 56 42 L144 42 Q172 46 176 58 L176 82Z" fill={c.body} />
      <path d="M56 42 Q66 24 100 22 Q134 24 144 42Z" fill={c.roof} />
      <path d="M62 42 Q70 30 100 28 Q130 30 138 42Z" fill={WINDOW} opacity="0.6" />
      <line x1="100" y1="28" x2="100" y2="42" stroke={BLUE} strokeWidth="1.5" />
      <line x1="100" y1="42" x2="100" y2="74" stroke={c.divider} strokeWidth="1" opacity="0.6" />
      <line x1="28" y1="70" x2="172" y2="70" stroke={c.detail} strokeWidth="1.2" opacity="0.55" />
      <circle cx="58" cy="84" r="16" fill={c.tyreOuter} />
      <circle cx="58" cy="84" r="10" fill={c.tyreInner} />
      <circle cx="58" cy="84" r="4" fill={GOLD} />
      <circle cx="142" cy="84" r="16" fill={c.tyreOuter} />
      <circle cx="142" cy="84" r="10" fill={c.tyreInner} />
      <circle cx="142" cy="84" r="4" fill={GOLD} />
      <rect x="168" y="62" width="10" height="8" rx="2" fill={c.detail} opacity="0.85" />
      <rect x="22" y="62" width="10" height="8" rx="2" fill={c.detail} opacity="0.55" />
      <ellipse cx="100" cy="100" rx="76" ry="5" fill={BLUE} opacity="0.22" />
    </>
  );
}

function SedanSVG(props: IconProps) {
  const c = palette(props);

  return (
    <>
      <path d="M30 80 L30 58 Q32 44 60 40 L140 40 Q168 44 170 58 L170 80Z" fill={c.body} />
      <path d="M60 40 Q68 26 100 24 Q132 26 140 40Z" fill={c.roof} />
      <path d="M64 40 Q70 30 100 28 Q130 30 136 40Z" fill={WINDOW} opacity="0.6" />
      <line x1="100" y1="28" x2="100" y2="40" stroke={BLUE} strokeWidth="1.5" />
      <circle cx="62" cy="82" r="16" fill={c.tyreOuter} />
      <circle cx="62" cy="82" r="10" fill={c.tyreInner} />
      <circle cx="62" cy="82" r="4" fill={GOLD} />
      <circle cx="138" cy="82" r="16" fill={c.tyreOuter} />
      <circle cx="138" cy="82" r="10" fill={c.tyreInner} />
      <circle cx="138" cy="82" r="4" fill={GOLD} />
      <rect x="162" y="62" width="10" height="8" rx="2" fill={c.detail} opacity="0.9" />
      <rect x="28" y="62" width="10" height="8" rx="2" fill={c.detail} opacity="0.6" />
      <ellipse cx="100" cy="98" rx="72" ry="5" fill={BLUE} opacity="0.2" />
    </>
  );
}

function SUVSVG(props: IconProps) {
  const c = palette(props);

  return (
    <>
      <path d="M22 82 L22 54 Q25 38 58 34 L142 34 Q175 38 178 54 L178 82Z" fill={c.body} />
      <path d="M58 34 Q64 22 100 20 Q136 22 142 34Z" fill={c.roof} />
      <path d="M62 34 Q68 26 100 24 Q132 26 138 34Z" fill={WINDOW} opacity="0.6" />
      <line x1="100" y1="24" x2="100" y2="34" stroke={BLUE} strokeWidth="1.5" />
      <rect x="62" y="19" width="76" height="4" rx="1" fill={c.detail} opacity="0.8" />
      <circle cx="58" cy="84" r="18" fill={c.tyreOuter} />
      <circle cx="58" cy="84" r="11" fill={c.tyreInner} />
      <circle cx="58" cy="84" r="4.5" fill={GOLD} />
      <circle cx="142" cy="84" r="18" fill={c.tyreOuter} />
      <circle cx="142" cy="84" r="11" fill={c.tyreInner} />
      <circle cx="142" cy="84" r="4.5" fill={GOLD} />
      <rect x="170" y="58" width="10" height="10" rx="2" fill={c.detail} opacity="0.9" />
      <ellipse cx="100" cy="102" rx="78" ry="5" fill={BLUE} opacity="0.2" />
    </>
  );
}

function VanSVG(props: IconProps) {
  const c = palette(props);

  return (
    <>
      <path d="M18 85 L18 42 Q20 30 42 28 L158 28 Q180 30 182 42 L182 85Z" fill={c.body} />
      <path d="M42 28 Q44 16 62 14 Q82 12 90 28Z" fill={WINDOW} opacity="0.5" />
      <rect x="95" y="34" width="30" height="22" rx="2" fill={WINDOW} opacity="0.4" />
      <rect x="132" y="34" width="30" height="22" rx="2" fill={WINDOW} opacity="0.4" />
      <line x1="165" y1="30" x2="165" y2="85" stroke={c.divider} strokeWidth="1" />
      <circle cx="50" cy="87" r="17" fill={c.tyreOuter} />
      <circle cx="50" cy="87" r="10" fill={c.tyreInner} />
      <circle cx="50" cy="87" r="4" fill={GOLD} />
      <circle cx="150" cy="87" r="17" fill={c.tyreOuter} />
      <circle cx="150" cy="87" r="10" fill={c.tyreInner} />
      <circle cx="150" cy="87" r="4" fill={GOLD} />
      <rect x="174" y="58" width="10" height="12" rx="2" fill={c.detail} opacity="0.9" />
      <ellipse cx="100" cy="104" rx="82" ry="5" fill={BLUE} opacity="0.2" />
    </>
  );
}

function MiniBusSVG(props: IconProps) {
  const c = palette(props);

  return (
    <>
      <path d="M14 88 L14 32 Q16 22 36 20 L164 20 Q184 22 186 32 L186 88Z" fill={c.body} />
      <rect x="14" y="20" width="172" height="6" fill={c.roof} />
      <path d="M36 22 Q38 14 56 12 Q76 12 80 22Z" fill={WINDOW} opacity="0.55" />
      <rect x="84" y="28" width="22" height="20" rx="2" fill={WINDOW} opacity="0.5" />
      <rect x="110" y="28" width="22" height="20" rx="2" fill={WINDOW} opacity="0.5" />
      <rect x="136" y="28" width="22" height="20" rx="2" fill={WINDOW} opacity="0.5" />
      <rect x="162" y="28" width="20" height="20" rx="2" fill={WINDOW} opacity="0.5" />
      <rect x="58" y="50" width="22" height="34" rx="1" fill={c.roof} />
      <line x1="69" y1="52" x2="69" y2="82" stroke={NAVY} strokeWidth="1" />
      <line x1="14" y1="76" x2="186" y2="76" stroke={c.detail} strokeWidth="1.4" opacity="0.65" />
      <circle cx="46" cy="92" r="16" fill={c.tyreOuter} />
      <circle cx="46" cy="92" r="9" fill={c.tyreInner} />
      <circle cx="46" cy="92" r="3.5" fill={GOLD} />
      <circle cx="154" cy="92" r="16" fill={c.tyreOuter} />
      <circle cx="154" cy="92" r="9" fill={c.tyreInner} />
      <circle cx="154" cy="92" r="3.5" fill={GOLD} />
      <rect x="178" y="58" width="8" height="10" rx="1.5" fill={c.detail} opacity="0.85" />
      <ellipse cx="100" cy="110" rx="86" ry="4.5" fill={BLUE} opacity="0.22" />
    </>
  );
}

function LuxurySVG(props: IconProps) {
  const c = palette(props, NAVY);

  return (
    <>
      <path
        d="M14 86 L14 60 Q16 54 26 52 L40 52 Q44 38 60 34 L168 34 Q184 36 186 50 L186 86 Z"
        fill={c.body}
      />
      <path d="M60 34 L168 34 Q184 36 186 50 L186 56 L60 56 Z" fill={c.roof} />
      <path d="M44 52 Q48 40 64 38 L78 38 L78 52 Z" fill={WINDOW} opacity="0.6" />
      <rect x="84" y="40" width="58" height="16" rx="1.5" fill={WINDOW} opacity="0.55" />
      <line x1="113" y1="40" x2="113" y2="56" stroke={c.divider} strokeWidth="1.5" />
      <path d="M148 40 L178 40 Q182 42 182 50 L182 56 L148 56 Z" fill={WINDOW} opacity="0.55" />
      <line x1="80" y1="60" x2="146" y2="60" stroke={c.roof} strokeWidth="1" opacity="0.7" />
      <line x1="14" y1="74" x2="186" y2="74" stroke={c.detail} strokeWidth="1.5" opacity="0.7" />
      <circle cx="22" cy="64" r="4" fill={c.detail} opacity="0.9" />
      <path d="M22 60 L22 68 M18.5 62 L25.5 66 M25.5 62 L18.5 66" stroke={NAVY} strokeWidth="0.9" />
      <circle cx="50" cy="88" r="16" fill={c.tyreOuter} />
      <circle cx="50" cy="88" r="10" fill={c.tyreInner} />
      <circle cx="50" cy="88" r="4.5" fill={GOLD} />
      <circle cx="150" cy="88" r="16" fill={c.tyreOuter} />
      <circle cx="150" cy="88" r="10" fill={c.tyreInner} />
      <circle cx="150" cy="88" r="4.5" fill={GOLD} />
      <path d="M14 60 L26 60 L26 68 L14 68 Z" fill={c.detail} opacity="0.85" />
      <ellipse cx="100" cy="106" rx="86" ry="4.5" fill={NAVY} opacity="0.28" />
    </>
  );
}

export function FleetIllustration({
  vehicleId,
  className = "",
  selected = false,
  variant = "default",
}: FleetIllustrationProps) {
  const props = { selected, variant };

  const renderIcon = () => {
    switch (vehicleId) {
      case "car":
        return <CarSVG {...props} />;
      case "minibus":
        return <MiniBusSVG {...props} />;
      case "luxury":
        return <LuxurySVG {...props} />;
      case "sedan":
        return <SedanSVG {...props} />;
      case "suv":
        return <SUVSVG {...props} />;
      case "van":
        return <VanSVG {...props} />;
      default:
        return <CarSVG {...props} />;
    }
  };

  return (
    <svg
      viewBox={VIEWBOX}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ transition: "fill 0.3s ease, stroke 0.3s ease" }}
      aria-hidden="true"
    >
      {renderIcon()}
    </svg>
  );
}
