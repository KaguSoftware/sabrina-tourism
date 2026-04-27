import { VIEWBOX } from "./constants";
import type { HeroPanoramaSVGProps } from "./types";

export function HeroPanoramaSVG({ className = "" }: HeroPanoramaSVGProps) {
  return (
    <svg
      viewBox={VIEWBOX}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`w-full h-full ${className}`}
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
    >
      {/* Sky gradient */}
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1b4d5c" />
          <stop offset="100%" stopColor="#2e7a8a" />
        </linearGradient>
        <linearGradient id="water" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a6b66" />
          <stop offset="100%" stopColor="#0d4a50" />
        </linearGradient>
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
          <feBlend in="SourceGraphic" mode="multiply" result="blend" />
          <feComposite in="blend" in2="SourceGraphic" operator="in" />
        </filter>
      </defs>

      {/* Sky */}
      <rect width="1440" height="400" fill="url(#sky)" />

      {/* Water / Bosphorus */}
      <rect y="380" width="1440" height="180" fill="url(#water)" />
      {/* Water shimmer */}
      <path d="M0 400 Q360 388 720 400 Q1080 412 1440 400 L1440 560 L0 560 Z" fill="#0d4a50" opacity="0.5" />

      {/* Sun */}
      <circle cx="1200" cy="120" r="54" fill="#c99a3f" />
      {/* Sun rays */}
      <g stroke="#c99a3f" strokeWidth="3" strokeLinecap="round" style={{ transformOrigin: "1200px 120px", animation: "rays 40s linear infinite" }}>
        <line x1="1200" y1="46" x2="1200" y2="30" />
        <line x1="1200" y1="194" x2="1200" y2="210" />
        <line x1="1126" y1="120" x2="1110" y2="120" />
        <line x1="1274" y1="120" x2="1290" y2="120" />
        <line x1="1148" y1="68" x2="1136" y2="56" />
        <line x1="1252" y1="172" x2="1264" y2="184" />
        <line x1="1148" y1="172" x2="1136" y2="184" />
        <line x1="1252" y1="68" x2="1264" y2="56" />
      </g>

      {/* Clouds */}
      <g opacity="0.9" style={{ animation: "drift 28s ease-in-out infinite alternate" }}>
        <path d="M80 100 Q60 100 64 84 Q68 72 84 74 Q88 60 106 64 Q120 54 136 68 Q154 64 160 78 Q178 78 180 96 Q186 108 168 108 H88 Q72 108 80 100Z" fill="#f5ede0" opacity="0.5" />
      </g>
      <g opacity="0.8" style={{ animation: "drift 35s ease-in-out infinite alternate-reverse" }}>
        <path d="M400 70 Q384 70 387 58 Q390 48 402 50 Q405 40 418 43 Q428 36 440 46 Q453 43 458 53 Q470 53 472 67 Q476 76 464 76 H408 Q396 76 400 70Z" fill="#f5ede0" opacity="0.4" />
      </g>

      {/* Hagia Sophia dome */}
      <g>
        {/* Main dome */}
        <ellipse cx="320" cy="310" rx="55" ry="42" fill="#1b4d5c" />
        <rect x="268" y="310" width="104" height="80" fill="#1b4d5c" />
        {/* Half domes */}
        <ellipse cx="268" cy="340" rx="28" ry="22" fill="#162b47" />
        <ellipse cx="372" cy="340" rx="28" ry="22" fill="#162b47" />
        {/* Minarets */}
        <rect x="248" y="258" width="12" height="90" fill="#162b47" />
        <path d="M248 258 L254 240 L260 258Z" fill="#c99a3f" />
        <rect x="380" y="258" width="12" height="90" fill="#162b47" />
        <path d="M380 258 L386 240 L392 258Z" fill="#c99a3f" />
        {/* Windows */}
        <ellipse cx="320" cy="308" rx="18" ry="8" fill="#0d4a50" />
        <ellipse cx="320" cy="308" rx="14" ry="6" fill="#1a6b66" opacity="0.4" />
        {/* Crescent */}
        <circle cx="320" cy="268" r="8" fill="#c99a3f" />
        <circle cx="324" cy="265" r="6" fill="#1b4d5c" />
      </g>

      {/* Blue Mosque (right of Hagia Sophia) */}
      <g>
        <ellipse cx="520" cy="320" rx="40" ry="32" fill="#162b47" />
        <rect x="482" y="320" width="76" height="70" fill="#162b47" />
        <rect x="450" y="268" width="10" height="82" fill="#0d4a50" />
        <path d="M450 268 L455 252 L460 268Z" fill="#c99a3f" />
        <rect x="540" y="268" width="10" height="82" fill="#0d4a50" />
        <path d="M540 268 L545 252 L550 268Z" fill="#c99a3f" />
        <rect x="464" y="278" width="10" height="70" fill="#0d4a50" />
        <rect x="526" y="278" width="10" height="70" fill="#0d4a50" />
      </g>

      {/* Galata Tower */}
      <g>
        <rect x="680" y="270" width="30" height="120" fill="#0d4a50" />
        <ellipse cx="695" cy="270" rx="15" ry="10" fill="#162b47" />
        <path d="M684 264 L695 248 L706 264Z" fill="#c99a3f" />
        {/* windows */}
        <rect x="688" y="300" width="14" height="18" rx="7" fill="#1a6b66" opacity="0.5" />
        <rect x="688" y="330" width="14" height="18" rx="7" fill="#1a6b66" opacity="0.5" />
      </g>

      {/* Hot air balloon (Cappadocia) */}
      <g style={{ animation: "float-y 8s ease-in-out infinite" }}>
        <ellipse cx="860" cy="140" rx="36" ry="48" fill="#c46b4f" />
        <path d="M824 140 Q828 100 860 92 Q892 100 896 140Z" fill="#c99a3f" opacity="0.9" />
        <path d="M824 140 Q860 160 896 140" fill="#1b4d5c" opacity="0.4" />
        {/* Vertical stripes */}
        <line x1="860" y1="92" x2="854" y2="188" stroke="#1b4d5c" strokeWidth="1.5" opacity="0.4" />
        <line x1="860" y1="92" x2="866" y2="188" stroke="#1b4d5c" strokeWidth="1.5" opacity="0.4" />
        {/* Basket */}
        <rect x="851" y="186" width="18" height="12" rx="2" fill="#c99a3f" stroke="#1b4d5c" strokeWidth="1.5" />
        {/* Ropes */}
        <line x1="855" y1="186" x2="838" y2="175" stroke="#c99a3f" strokeWidth="1" opacity="0.7" />
        <line x1="869" y1="186" x2="882" y2="175" stroke="#c99a3f" strokeWidth="1" opacity="0.7" />
      </g>

      {/* Second balloon */}
      <g style={{ animation: "float-y 10s ease-in-out infinite 2s" }}>
        <ellipse cx="930" cy="170" rx="26" ry="34" fill="#1b4d5c" />
        <path d="M904 170 Q930 148 956 170Z" fill="#c99a3f" opacity="0.7" />
        <rect x="922" y="202" width="14" height="10" rx="2" fill="#c99a3f" stroke="#1b4d5c" strokeWidth="1.2" />
      </g>

      {/* Ionic column (Ephesus) */}
      <g>
        <rect x="1040" y="310" width="18" height="80" fill="#efe4d2" />
        {/* Capital */}
        <path d="M1032 310 Q1049 298 1058 310Z" fill="#e8dac8" />
        <path d="M1058 310 Q1067 298 1076 310Z" fill="#e8dac8" />
        <rect x="1032" y="308" width="44" height="6" rx="1" fill="#e8dac8" />
        {/* Base */}
        <rect x="1030" y="388" width="48" height="6" fill="#e8dac8" />
        <rect x="1034" y="394" width="40" height="4" fill="#d6cab5" />
        {/* Fluting lines */}
        <line x1="1045" y1="312" x2="1045" y2="388" stroke="#d6cab5" strokeWidth="1" />
        <line x1="1052" y1="312" x2="1052" y2="388" stroke="#d6cab5" strokeWidth="1" />
        <line x1="1059" y1="312" x2="1059" y2="388" stroke="#d6cab5" strokeWidth="1" />
      </g>

      {/* Wooden Bosphorus boat */}
      <g>
        <path d="M720 400 Q780 380 840 390 Q860 392 880 400 L860 420 Q800 425 740 420 Z" fill="#c46b4f" />
        <path d="M740 410 L740 370 L760 360 L760 410Z" fill="#efe4d2" opacity="0.8" />
        <line x1="750" y1="370" x2="750" y2="365" stroke="#c99a3f" strokeWidth="1.5" />
        {/* Sail */}
        <path d="M742 370 Q768 360 760 400 Z" fill="#f5ede0" opacity="0.7" />
        {/* Cabin */}
        <rect x="790" y="388" width="36" height="18" rx="2" fill="#1b4d5c" />
        <rect x="794" y="391" width="8" height="10" rx="1" fill="#2e7a8a" />
        <rect x="808" y="391" width="8" height="10" rx="1" fill="#2e7a8a" />
      </g>

      {/* Cityscape silhouette (distant hills) */}
      <path d="M0 390 Q200 370 400 382 Q600 392 720 385 Q840 378 1000 383 Q1200 388 1440 375 L1440 420 Q1200 408 1000 412 Q800 416 600 408 Q400 400 200 410 Q100 415 0 408 Z" fill="#0d4a50" opacity="0.7" />

      {/* Foreground ground */}
      <path d="M0 430 Q360 420 720 430 Q1080 440 1440 428 L1440 560 L0 560 Z" fill="#0b1a2e" />

      {/* Crescent moon */}
      <circle cx="180" cy="90" r="18" fill="#c99a3f" />
      <circle cx="188" cy="85" r="14" fill="#1b4d5c" />

      {/* Stars */}
      <circle cx="140" cy="50" r="1.5" fill="#f5ede0" opacity="0.8" />
      <circle cx="220" cy="40" r="1.5" fill="#f5ede0" opacity="0.6" />
      <circle cx="300" cy="60" r="1" fill="#f5ede0" opacity="0.7" />
      <circle cx="600" cy="35" r="1.5" fill="#f5ede0" opacity="0.5" />
      <circle cx="750" cy="55" r="1" fill="#f5ede0" opacity="0.6" />
      <circle cx="1000" cy="45" r="1.5" fill="#f5ede0" opacity="0.5" />
      <circle cx="1100" cy="30" r="1" fill="#f5ede0" opacity="0.7" />
      <circle cx="1350" cy="55" r="1.5" fill="#f5ede0" opacity="0.6" />

      {/* Grain overlay */}
      <rect width="1440" height="560" fill="transparent" filter="url(#grain)" opacity="0.04" />
    </svg>
  );
}
