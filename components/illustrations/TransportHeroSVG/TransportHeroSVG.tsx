import type { TransportHeroSVGProps } from "./types";

// Project palette: cream #f5ede0 | teal-deep #1b4d5c | terracotta #c46b4f | ochre #c99a3f | sky-soft #a8c8e1

export function TransportHeroSVG({ className = "" }: TransportHeroSVGProps) {
  return (
    <svg
      viewBox="0 0 1440 560"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`w-full h-full ${className}`}
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id="tr-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1b4d5c" />
          <stop offset="55%" stopColor="#2a6a7e" />
          <stop offset="100%" stopColor="#3d8a9e" />
        </linearGradient>
        <linearGradient id="tr-asphalt" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2a3040" />
          <stop offset="100%" stopColor="#1a2030" />
        </linearGradient>
      </defs>

      {/* Sky */}
      <rect width="1440" height="560" fill="url(#tr-sky)" />

      {/* Stars */}
      {[80,180,300,460,640,820,1010,1180,1360].map((x, i) => (
        <circle key={i} cx={x} cy={20 + (i % 5) * 16} r="1.4" fill="#f5ede0" opacity={0.3 + (i % 3) * 0.2} />
      ))}

      {/* Moon crescent */}
      <circle cx="1260" cy="80" r="30" fill="#c99a3f" opacity="0.88" />
      <circle cx="1274" cy="73" r="23" fill="#1b4d5c" />

      {/* Distant hill silhouette */}
      <path d="M0 310 Q120 270 260 285 Q400 300 520 278 Q660 256 800 272 Q940 288 1080 262 Q1220 236 1360 255 Q1400 260 1440 252 L1440 420 L0 420Z" fill="#162b47" />
      <path d="M0 340 Q200 318 400 330 Q600 342 800 322 Q1000 302 1200 318 Q1340 330 1440 318 L1440 440 L0 440Z" fill="#0f2030" />

      {/* Road — perspective trapezoid */}
      <path d="M560 560 L680 340 L760 340 L880 560Z" fill="url(#tr-asphalt)" />
      {/* Road surface extension at bottom */}
      <path d="M440 560 L560 560 L680 340 L760 340 L880 560 L1000 560Z" fill="#1e2838" />
      {/* Road edges (white lines) */}
      <line x1="562" y1="560" x2="681" y2="340" stroke="#f5ede0" strokeWidth="2" opacity="0.25" />
      <line x1="878" y1="560" x2="759" y2="340" stroke="#f5ede0" strokeWidth="2" opacity="0.25" />
      {/* Centre dashes */}
      {[560,500,440,380,360].map((y, i) => {
        const t = (y - 340) / 220;
        const cx = 720;
        const x1 = cx - 4 * t;
        const x2 = cx + 4 * t;
        return <line key={i} x1={x1} y1={y} x2={x2} y2={y + 16} stroke="#c99a3f" strokeWidth="2" opacity="0.55" strokeLinecap="round" />;
      })}

      {/* Foreground ground */}
      <path d="M0 430 Q300 415 600 425 Q900 435 1200 420 Q1360 412 1440 416 L1440 560 L0 560Z" fill="#0b1a2e" />

      {/* Mercedes E-Class — flat side view, facing right */}
      <g transform="translate(530 390)">
        {/* Shadow */}
        <ellipse cx="90" cy="52" rx="92" ry="7" fill="#000" opacity="0.25" />
        {/* Body */}
        <path d="M0 32 Q2 18 18 14 L52 8 Q80 2 110 6 L158 14 Q170 18 172 30 L172 44 Q120 48 84 48 Q50 48 0 44Z" fill="#0f2030" />
        {/* Roof */}
        <path d="M36 14 Q48 2 78 0 Q108 -2 130 6 L152 14Z" fill="#162b47" />
        {/* Windows */}
        <path d="M40 13 Q52 3 78 1 Q104 -1 126 7 L146 13Z" fill="#a8c8e1" opacity="0.4" />
        <line x1="85" y1="0" x2="82" y2="14" stroke="#0b1a2e" strokeWidth="1.5" opacity="0.6" />
        {/* Ochre trim line */}
        <line x1="2" y1="36" x2="170" y2="36" stroke="#c99a3f" strokeWidth="1.2" opacity="0.55" />
        {/* Headlight */}
        <path d="M162 22 L172 20 L172 28 L162 28Z" fill="#c99a3f" opacity="0.9" />
        <path d="M172 18 L184 16 L184 30 L172 28Z" fill="#f5ede0" opacity="0.55" />
        {/* Tail light */}
        <rect x="0" y="24" width="6" height="10" rx="1" fill="#c46b4f" opacity="0.8" />
        {/* Wheels */}
        <circle cx="36" cy="46" r="12" fill="#0d0d14" />
        <circle cx="36" cy="46" r="8" fill="#1a2030" />
        <circle cx="36" cy="46" r="3" fill="#c99a3f" />
        <circle cx="136" cy="46" r="12" fill="#0d0d14" />
        <circle cx="136" cy="46" r="8" fill="#1a2030" />
        <circle cx="136" cy="46" r="3" fill="#c99a3f" />
        {/* Chauffeur silhouette */}
        <ellipse cx="62" cy="8" rx="9" ry="10" fill="#0b1a2e" />
        <rect x="55" y="7" width="18" height="7" rx="3" fill="#1b4d5c" />
      </g>

      {/* Cypress trees */}
      {[440, 490, 870, 920].map((x, i) => (
        <g key={i} transform={`translate(${x} ${365 + (i % 2) * 10})`}>
          <rect x="-4" y="0" width="8" height="55" rx="2" fill="#0d2a1a" />
          <path d="M-14 4 L0 -36 L14 4Z" fill="#142a14" />
          <path d="M-10 -18 L0 -52 L10 -18Z" fill="#1a3a1a" />
        </g>
      ))}

      {/* Distant city glow dots */}
      {[120, 220, 340, 1060, 1160, 1300].map((x, i) => (
        <circle key={i} cx={x} cy={250 + (i % 3) * 12} r="2.5" fill="#c99a3f" opacity="0.35" />
      ))}
    </svg>
  );
}
