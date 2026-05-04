import type { HeroPanoramaSVGProps } from "./types";

// Palette used: cream #f5ede0 | cream-warm #efe4d2 | cream-deep #e8dac8
//               navy #8B9A5B | navy-soft #7a8a4e | teal-deep #1b4d5c
//               ochre #c99a3f | terracotta #c46b4f

export function HeroPanoramaSVG({ className = "" }: HeroPanoramaSVGProps) {
  return (
    <svg
      viewBox="0 0 1440 560"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`w-full h-full ${className}`}
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
    >
      {/* Sky — cream */}
      <rect width="1440" height="560" fill="#f5ede0" />

      {/* Sun */}
      <circle cx="1200" cy="110" r="52" fill="#c99a3f" opacity="0.85" />
      <g stroke="#c99a3f" strokeWidth="3" strokeLinecap="round" style={{ transformOrigin: "1200px 110px", animation: "rays 40s linear infinite" }}>
        <line x1="1200" y1="38" x2="1200" y2="22" />
        <line x1="1200" y1="198" x2="1200" y2="214" />
        <line x1="1128" y1="110" x2="1112" y2="110" />
        <line x1="1272" y1="110" x2="1288" y2="110" />
        <line x1="1149" y1="59" x2="1137" y2="47" />
        <line x1="1251" y1="161" x2="1263" y2="173" />
        <line x1="1149" y1="161" x2="1137" y2="173" />
        <line x1="1251" y1="59" x2="1263" y2="47" />
      </g>

      {/* Clouds — cream-warm so they read against cream sky */}
      <g style={{ animation: "drift 28s ease-in-out infinite alternate" }}>
        <path d="M80 100 Q60 100 64 84 Q68 72 84 74 Q88 60 106 64 Q120 54 136 68 Q154 64 160 78 Q178 78 180 96 Q186 108 168 108 H88 Q72 108 80 100Z" fill="#e8dac8" opacity="0.9" />
      </g>
      <g style={{ animation: "drift 38s ease-in-out infinite alternate-reverse" }}>
        <path d="M520 68 Q504 68 507 57 Q510 47 522 50 Q524 40 538 43 Q547 36 558 46 Q570 43 575 53 Q586 53 588 66 Q592 74 580 74 H528 Q516 74 520 68Z" fill="#e8dac8" opacity="0.75" />
      </g>
      <g style={{ animation: "drift 24s ease-in-out infinite alternate" }}>
        <path d="M950 50 Q938 50 940 42 Q942 34 951 36 Q953 28 963 31 Q971 25 980 33 Q990 30 993 39 Q1002 39 1003 49 Q1006 55 997 55 H957 Q948 55 950 50Z" fill="#e8dac8" opacity="0.7" />
      </g>

      {/* Balloon 1 — navy body, ochre band */}
      <g style={{ animation: "float-y 8s ease-in-out infinite" }}>
        <ellipse cx="240" cy="180" rx="44" ry="56" fill="#8B9A5B" />
        <path d="M240 124 L266 180 L240 236 L214 180Z" fill="#efe4d2" opacity="0.12" />
        <path d="M196 180 L240 158 L284 180 L240 202Z" fill="#efe4d2" opacity="0.08" />
        <path d="M196 172 Q196 182 240 186 Q284 182 284 172 Q284 162 240 158 Q196 162 196 172Z" fill="#c99a3f" opacity="0.75" />
        <line x1="222" y1="234" x2="228" y2="248" stroke="#8B9A5B" strokeWidth="1.5" opacity="0.5" />
        <line x1="258" y1="234" x2="252" y2="248" stroke="#8B9A5B" strokeWidth="1.5" opacity="0.5" />
        <line x1="232" y1="234" x2="240" y2="250" stroke="#8B9A5B" strokeWidth="1.5" opacity="0.5" />
        <line x1="248" y1="234" x2="240" y2="250" stroke="#8B9A5B" strokeWidth="1.5" opacity="0.5" />
        <rect x="230" y="248" width="20" height="14" rx="3" fill="#1b4d5c" stroke="#8B9A5B" strokeWidth="1.5" />
      </g>

      {/* Balloon 2 — terracotta body, cream panels */}
      <g style={{ animation: "float-y 10s ease-in-out infinite 1.5s" }}>
        <ellipse cx="610" cy="140" rx="50" ry="62" fill="#c46b4f" />
        <path d="M560 140 Q560 110 610 102 L610 140Z" fill="#efe4d2" opacity="0.45" />
        <path d="M560 140 Q560 170 610 178 L610 140Z" fill="#efe4d2" opacity="0.45" />
        <line x1="610" y1="78" x2="610" y2="202" stroke="#8B9A5B" strokeWidth="1.5" opacity="0.2" />
        <line x1="560" y1="140" x2="660" y2="140" stroke="#8B9A5B" strokeWidth="1.5" opacity="0.2" />
        <line x1="590" y1="200" x2="595" y2="215" stroke="#8B9A5B" strokeWidth="1.5" opacity="0.5" />
        <line x1="630" y1="200" x2="625" y2="215" stroke="#8B9A5B" strokeWidth="1.5" opacity="0.5" />
        <line x1="600" y1="202" x2="610" y2="218" stroke="#8B9A5B" strokeWidth="1.5" opacity="0.5" />
        <line x1="620" y1="202" x2="610" y2="218" stroke="#8B9A5B" strokeWidth="1.5" opacity="0.5" />
        <rect x="598" y="216" width="24" height="16" rx="3" fill="#8B9A5B" stroke="#8B9A5B" strokeWidth="1.5" />
      </g>

      {/* Balloon 3 — ochre body, navy stripes */}
      <g style={{ animation: "float-y 12s ease-in-out infinite 3s" }}>
        <ellipse cx="960" cy="160" rx="46" ry="58" fill="#c99a3f" />
        <line x1="932" y1="102" x2="932" y2="218" stroke="#8B9A5B" strokeWidth="6" opacity="0.18" />
        <line x1="946" y1="102" x2="946" y2="218" stroke="#8B9A5B" strokeWidth="6" opacity="0.18" />
        <line x1="960" y1="102" x2="960" y2="218" stroke="#8B9A5B" strokeWidth="6" opacity="0.18" />
        <line x1="974" y1="102" x2="974" y2="218" stroke="#8B9A5B" strokeWidth="6" opacity="0.18" />
        <line x1="988" y1="102" x2="988" y2="218" stroke="#8B9A5B" strokeWidth="6" opacity="0.18" />
        <line x1="940" y1="216" x2="944" y2="230" stroke="#8B9A5B" strokeWidth="1.5" opacity="0.6" />
        <line x1="980" y1="216" x2="976" y2="230" stroke="#8B9A5B" strokeWidth="1.5" opacity="0.6" />
        <line x1="950" y1="218" x2="960" y2="232" stroke="#8B9A5B" strokeWidth="1.5" opacity="0.6" />
        <line x1="970" y1="218" x2="960" y2="232" stroke="#8B9A5B" strokeWidth="1.5" opacity="0.6" />
        <rect x="949" y="230" width="22" height="15" rx="3" fill="#1b4d5c" stroke="#8B9A5B" strokeWidth="1.5" />
      </g>

      {/* Balloon 4 — cream-warm body, navy detail */}
      <g style={{ animation: "float-y 9s ease-in-out infinite 0.8s" }}>
        <ellipse cx="1260" cy="190" rx="40" ry="52" fill="#efe4d2" />
        <path d="M1220 190 Q1220 160 1260 152 L1260 190Z" fill="#8B9A5B" opacity="0.12" />
        <path d="M1300 190 Q1300 160 1260 152 L1260 190Z" fill="#8B9A5B" opacity="0.08" />
        <path d="M1220 190 Q1220 220 1260 228 L1260 190Z" fill="#c99a3f" opacity="0.5" />
        <path d="M1300 190 Q1300 220 1260 228 L1260 190Z" fill="#c99a3f" opacity="0.35" />
        <line x1="1242" y1="240" x2="1246" y2="253" stroke="#8B9A5B" strokeWidth="1.5" opacity="0.6" />
        <line x1="1278" y1="240" x2="1274" y2="253" stroke="#8B9A5B" strokeWidth="1.5" opacity="0.6" />
        <line x1="1252" y1="242" x2="1260" y2="256" stroke="#8B9A5B" strokeWidth="1.5" opacity="0.6" />
        <line x1="1268" y1="242" x2="1260" y2="256" stroke="#8B9A5B" strokeWidth="1.5" opacity="0.6" />
        <rect x="1248" y="254" width="24" height="15" rx="3" fill="#8B9A5B" stroke="#8B9A5B" strokeWidth="1.5" />
      </g>

      {/* Balloon 5 — navy body, terracotta stripe */}
      <g style={{ animation: "float-y 11s ease-in-out infinite 2.2s" }}>
        <ellipse cx="60" cy="310" rx="38" ry="50" fill="#7a8a4e" />
        <path d="M22 310 Q22 280 60 272 L60 310Z" fill="#c46b4f" opacity="0.6" />
        <path d="M98 310 Q98 280 60 272 L60 310Z" fill="#c46b4f" opacity="0.4" />
        <rect x="49" y="358" width="22" height="14" rx="3" fill="#8B9A5B" stroke="#8B9A5B" strokeWidth="1.5" />
        <line x1="53" y1="358" x2="49" y2="348" stroke="#efe4d2" strokeWidth="1.5" opacity="0.5" />
        <line x1="71" y1="358" x2="75" y2="348" stroke="#efe4d2" strokeWidth="1.5" opacity="0.5" />
      </g>

      {/* Ground / hills — cream tones only */}
      <path d="M0 430 Q200 405 400 418 Q600 432 720 422 Q900 410 1100 420 Q1280 430 1440 412 L1440 560 L0 560Z" fill="#e8dac8" />
      <path d="M0 462 Q300 445 580 458 Q860 472 1100 453 Q1280 438 1440 450 L1440 560 L0 560Z" fill="#d6cab5" />
      <path d="M0 492 Q360 478 720 490 Q1080 503 1440 485 L1440 560 L0 560Z" fill="#efe4d2" />
    </svg>
  );
}
