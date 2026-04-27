import type { TransportHeroSVGProps } from "./types";
import { VIEWBOX } from "./constants";

export function TransportHeroSVG({ className = "" }: TransportHeroSVGProps) {
  return (
    <svg
      viewBox={VIEWBOX}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`w-full h-full ${className}`}
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id="tr-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0b1a2e" />
          <stop offset="60%" stopColor="#1b4d5c" />
          <stop offset="100%" stopColor="#2e7a8a" />
        </linearGradient>
        <linearGradient id="tr-road" x1="0.5" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor="#1a2a1a" />
          <stop offset="100%" stopColor="#2a3a2a" />
        </linearGradient>
      </defs>

      {/* Sky */}
      <rect width="1440" height="560" fill="url(#tr-sky)" />

      {/* Stars */}
      {[80, 200, 360, 540, 720, 900, 1080, 1240, 1380].map((x, i) => (
        <circle key={i} cx={x} cy={25 + (i % 4) * 18} r="1.2" fill="#f5ede0" opacity="0.5" />
      ))}

      {/* Moon */}
      <circle cx="1300" cy="90" r="32" fill="#c99a3f" opacity="0.85" />
      <circle cx="1314" cy="82" r="25" fill="#1b4d5c" />

      {/* Rolling hills */}
      <path d="M0 340 Q180 290 360 310 Q540 330 720 300 Q900 268 1080 295 Q1260 320 1440 285 L1440 420 L0 420Z" fill="#1a3a1a" />
      <path d="M0 360 Q240 330 480 345 Q720 360 960 335 Q1200 308 1440 330 L1440 440 L0 440Z" fill="#142a14" />

      {/* Winding road */}
      <path d="M580 560 Q620 500 680 460 Q740 420 760 380 Q780 340 820 310 Q860 280 900 260" stroke="url(#tr-road)" strokeWidth="60" fill="none" strokeLinecap="round" />
      <path d="M580 560 Q620 500 680 460 Q740 420 760 380 Q780 340 820 310 Q860 280 900 260" stroke="#2a3a2a" strokeWidth="58" fill="none" strokeLinecap="round" />
      {/* Road center line */}
      <path d="M650 510 Q700 470 740 440 Q780 410 800 370 Q820 330 850 300 Q880 270 910 255" stroke="#c99a3f" strokeWidth="2" fill="none" strokeDasharray="20 16" strokeLinecap="round" opacity="0.6" />
      {/* Road edges */}
      <path d="M560 560 Q600 498 660 458 Q720 418 742 378 Q762 338 802 308 Q842 278 882 258" stroke="#efe4d2" strokeWidth="2" fill="none" opacity="0.3" />
      <path d="M598 560 Q638 502 698 462 Q758 422 778 382 Q798 342 838 312 Q878 282 918 262" stroke="#efe4d2" strokeWidth="2" fill="none" opacity="0.3" />

      {/* Mercedes S-Class on road */}
      <g transform="translate(665, 440) rotate(-18)">
        {/* Body */}
        <path d="M0 28 L0 12 Q2 4 20 2 L100 2 Q118 4 120 12 L120 28Z" fill="#0b1a2e" />
        {/* Roof */}
        <path d="M20 2 Q28 -8 60 -10 Q92 -8 100 2Z" fill="#162b47" />
        {/* Windows */}
        <path d="M24 2 Q30 -6 60 -8 Q90 -6 96 2Z" fill="#a8c8e1" opacity="0.45" />
        <line x1="60" y1="-8" x2="60" y2="2" stroke="#0b1a2e" strokeWidth="1" />
        {/* Gold trim */}
        <path d="M0 22 L120 22" stroke="#c99a3f" strokeWidth="1" opacity="0.5" />
        {/* Headlights */}
        <path d="M112 14 L120 14 L120 18 L112 17Z" fill="#c99a3f" opacity="0.9" />
        <path d="M112 14 L124 12 L124 20 L112 18Z" fill="#f5ede0" opacity="0.6" />
        {/* Wheels */}
        <circle cx="22" cy="30" r="10" fill="#0d0d14" />
        <circle cx="22" cy="30" r="6" fill="#1a1a28" />
        <circle cx="22" cy="30" r="2.5" fill="#c99a3f" />
        <circle cx="98" cy="30" r="10" fill="#0d0d14" />
        <circle cx="98" cy="30" r="6" fill="#1a1a28" />
        <circle cx="98" cy="30" r="2.5" fill="#c99a3f" />
        {/* Chauffeur silhouette */}
        <ellipse cx="38" cy="0" rx="7" ry="9" fill="#0b1a2e" />
        <rect x="32" y="-1" width="14" height="5" rx="2" fill="#1b4d5c" />
      </g>

      {/* Distant city lights */}
      {[100, 200, 320, 1100, 1220, 1340].map((x, i) => (
        <circle key={i} cx={x} cy={260 + (i % 3) * 15} r="2" fill="#c99a3f" opacity="0.4" />
      ))}

      {/* Cypress trees along road */}
      {[560, 610, 900, 950].map((x, i) => (
        <g key={i} transform={`translate(${x},${340 + i * 5})`}>
          <rect x="-3" y="0" width="6" height="50" fill="#1a3a10" />
          <path d={`M-10 0 L0 -40 L10 0Z`} fill="#1a4a10" />
          <path d={`M-8 -20 L0 -56 L8 -20Z`} fill="#1a5a10" />
        </g>
      ))}

      {/* Foreground road surface at bottom */}
      <path d="M520 560 L640 400 L800 400 L920 560Z" fill="#1a2a1a" opacity="0.8" />
      <path d="M0 480 L0 560 L1440 560 L1440 480Z" fill="#0e1a0e" />
    </svg>
  );
}
