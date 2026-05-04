import type { RegionHeroSVGProps } from "./types";
import { VIEWBOX } from "./constants";

function IstanbulScene() {
  return (
    <>
      <defs>
        <linearGradient id="ist-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0d2535" />
          <stop offset="100%" stopColor="#1b4d5c" />
        </linearGradient>
        <linearGradient id="ist-water" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a6b66" />
          <stop offset="100%" stopColor="#0a3040" />
        </linearGradient>
      </defs>
      <rect width="1440" height="560" fill="url(#ist-sky)" />
      <rect y="390" width="1440" height="170" fill="url(#ist-water)" />
      {/* moon */}
      <circle cx="200" cy="100" r="38" fill="#c99a3f" />
      <circle cx="214" cy="92" r="30" fill="#1b4d5c" />
      {/* stars */}
      {[130,280,450,620,800,1000,1150,1300].map((x, i) => (
        <circle key={i} cx={x} cy={40 + (i % 3) * 20} r="1.5" fill="#f5ede0" opacity="0.6" />
      ))}
      {/* Hagia Sophia */}
      <g>
        <rect x="380" y="290" width="120" height="110" fill="#7a8a4e" />
        <ellipse cx="440" cy="290" rx="62" ry="48" fill="#1b4d5c" />
        <ellipse cx="380" cy="326" rx="32" ry="26" fill="#0f2238" />
        <ellipse cx="500" cy="326" rx="32" ry="26" fill="#0f2238" />
        <rect x="356" y="230" width="14" height="100" fill="#7a8a4e" />
        <path d="M356 230 L363 210 L370 230Z" fill="#c99a3f" />
        <rect x="490" y="230" width="14" height="100" fill="#7a8a4e" />
        <path d="M490 230 L497 210 L504 230Z" fill="#c99a3f" />
        <ellipse cx="440" cy="288" rx="20" ry="9" fill="#0d4a50" opacity="0.7" />
        <circle cx="440" cy="242" r="9" fill="#c99a3f" />
        <circle cx="445" cy="238" r="7" fill="#1b4d5c" />
      </g>
      {/* Blue Mosque */}
      <g>
        <rect x="560" y="310" width="100" height="90" fill="#0f2238" />
        <ellipse cx="610" cy="310" rx="52" ry="40" fill="#7a8a4e" />
        <rect x="536" y="258" width="12" height="92" fill="#8B9A5B" />
        <path d="M536 258 L542 240 L548 258Z" fill="#c99a3f" />
        <rect x="662" y="258" width="12" height="92" fill="#8B9A5B" />
        <path d="M662 258 L668 240 L674 258Z" fill="#c99a3f" />
        <rect x="548" y="270" width="12" height="80" fill="#8B9A5B" />
        <rect x="650" y="270" width="12" height="80" fill="#8B9A5B" />
      </g>
      {/* Galata Tower */}
      <g>
        <rect x="820" y="255" width="34" height="135" fill="#0d2535" />
        <ellipse cx="837" cy="255" rx="17" ry="12" fill="#7a8a4e" />
        <path d="M824 247 L837 226 L850 247Z" fill="#c99a3f" />
        <rect x="830" y="288" width="16" height="20" rx="8" fill="#1a6b66" opacity="0.5" />
      </g>
      {/* Bosphorus boat */}
      <g>
        <path d="M900 410 Q960 393 1020 403 Q1040 405 1060 412 L1040 428 Q980 433 920 426 Z" fill="#c46b4f" />
        <rect x="930" y="396" width="6" height="44" fill="#efe4d2" opacity="0.7" />
        <path d="M933 396 Q946 388 942 416 Z" fill="#f5ede0" opacity="0.6" />
        <rect x="980" y="401" width="42" height="20" rx="3" fill="#1b4d5c" />
      </g>
      {/* Cityscape silhouette */}
      <path d="M0 400 Q300 382 600 392 Q900 402 1200 388 Q1320 383 1440 390 L1440 420 L0 420Z" fill="#8B9A5B" opacity="0.8" />
      {/* Foreground */}
      <path d="M0 430 Q360 420 720 432 Q1080 444 1440 428 L1440 560 L0 560Z" fill="#08131f" />
    </>
  );
}

function CappadociaScene() {
  return (
    <>
      <defs>
        <linearGradient id="cap-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3a1f0a" />
          <stop offset="40%" stopColor="#c46b4f" />
          <stop offset="100%" stopColor="#e8a87c" />
        </linearGradient>
      </defs>
      <rect width="1440" height="560" fill="url(#cap-sky)" />
      {/* Fairy chimneys */}
      {[120, 280, 420, 580, 740, 900, 1060, 1220, 1360].map((x, i) => {
        const h = 80 + (i % 4) * 30;
        const w = 22 + (i % 3) * 8;
        return (
          <g key={i}>
            <rect x={x - w / 2} y={400 - h} width={w} height={h} fill={i % 2 === 0 ? "#c46b4f" : "#a8512f"} />
            <ellipse cx={x} cy={400 - h} rx={w / 2 + 4} ry={w / 2} fill={i % 2 === 0 ? "#b8603e" : "#8a3f1e"} />
          </g>
        );
      })}
      {/* Balloons */}
      {[{ cx: 400, cy: 130, fill: "#c46b4f", r: 44 }, { cx: 700, cy: 160, fill: "#1b4d5c", r: 32 }, { cx: 960, cy: 110, fill: "#c99a3f", r: 38 }].map((b, i) => (
        <g key={i} style={{ animation: `float-y ${8 + i * 2}s ease-in-out infinite ${i}s` }}>
          <ellipse cx={b.cx} cy={b.cy} rx={b.r} ry={b.r * 1.3} fill={b.fill} />
          <path d={`M${b.cx - b.r} ${b.cy} Q${b.cx} ${b.cy + b.r * 0.4} ${b.cx + b.r} ${b.cy}`} fill="#1b4d5c" opacity="0.3" />
          <rect x={b.cx - 10} y={b.cy + b.r * 1.3} width="20" height="13" rx="2" fill="#c99a3f" stroke="#1b4d5c" strokeWidth="1.5" />
          <line x1={b.cx - 6} y1={b.cy + b.r * 1.3} x2={b.cx - b.r * 0.6} y2={b.cy + b.r * 0.9} stroke="#c99a3f" strokeWidth="1" opacity="0.7" />
          <line x1={b.cx + 6} y1={b.cy + b.r * 1.3} x2={b.cx + b.r * 0.6} y2={b.cy + b.r * 0.9} stroke="#c99a3f" strokeWidth="1" opacity="0.7" />
        </g>
      ))}
      {/* Ground */}
      <path d="M0 395 Q360 385 720 398 Q1080 410 1440 392 L1440 560 L0 560Z" fill="#6b3a1f" />
      <path d="M0 430 Q360 420 720 432 Q1080 444 1440 428 L1440 560 L0 560Z" fill="#4a2410" />
    </>
  );
}

function AegeanScene() {
  return (
    <>
      <defs>
        <linearGradient id="ae-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a8c8e1" />
          <stop offset="60%" stopColor="#d4e8f5" />
          <stop offset="100%" stopColor="#efe4d2" />
        </linearGradient>
        <linearGradient id="ae-water" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5aadcf" />
          <stop offset="100%" stopColor="#1b6b8a" />
        </linearGradient>
      </defs>
      <rect width="1440" height="560" fill="url(#ae-sky)" />
      <rect y="370" width="1440" height="190" fill="url(#ae-water)" />
      {/* Travertine terraces */}
      {[0, 1, 2, 3, 4].map((i) => (
        <path key={i}
          d={`M${i * 120} ${300 + i * 20} Q${i * 120 + 60} ${290 + i * 20} ${i * 120 + 120} ${300 + i * 20} L${i * 120 + 120} ${360 + i * 20} Q${i * 120 + 60} ${370 + i * 20} ${i * 120} ${360 + i * 20} Z`}
          fill="#f5ede0"
          opacity={0.9 - i * 0.1}
        />
      ))}
      {/* Ionic column */}
      <g>
        <rect x="900" y="280" width="22" height="120" fill="#efe4d2" />
        <path d="M890 280 Q911 266 922 280Z" fill="#e8dac8" />
        <path d="M922 280 Q933 266 944 280Z" fill="#e8dac8" />
        <rect x="888" y="278" width="56" height="7" rx="1" fill="#e8dac8" />
        <rect x="884" y="398" width="60" height="7" fill="#e8dac8" />
        <line x1="908" y1="282" x2="908" y2="398" stroke="#d6cab5" strokeWidth="1.2" />
        <line x1="917" y1="282" x2="917" y2="398" stroke="#d6cab5" strokeWidth="1.2" />
        <line x1="926" y1="282" x2="926" y2="398" stroke="#d6cab5" strokeWidth="1.2" />
      </g>
      {/* Second column */}
      <g>
        <rect x="980" y="310" width="18" height="90" fill="#efe4d2" />
        <rect x="970" y="308" width="48" height="6" rx="1" fill="#e8dac8" />
        <rect x="966" y="398" width="52" height="6" fill="#e8dac8" />
      </g>
      {/* Sun */}
      <circle cx="1200" cy="100" r="50" fill="#c99a3f" opacity="0.85" />
      {/* Olive trees */}
      {[200, 380, 560, 760, 1100, 1280].map((x, i) => (
        <g key={i}>
          <rect x={x - 3} y={340} width="6" height={50 + i * 5} fill="#4a3018" />
          <ellipse cx={x} cy={330} rx={22 + i * 3} ry={28} fill="#2a5a1a" opacity="0.85" />
        </g>
      ))}
      {/* Ground */}
      <path d="M0 370 Q360 360 720 372 Q1080 384 1440 365 L1440 420 L0 420Z" fill="#c8b48a" />
      <path d="M0 420 Q360 410 720 422 Q1080 434 1440 418 L1440 560 L0 560Z" fill="#a89060" />
    </>
  );
}

function MediterraneanScene() {
  return (
    <>
      <defs>
        <linearGradient id="med-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1b4d5c" />
          <stop offset="50%" stopColor="#2e7a8a" />
          <stop offset="100%" stopColor="#a8c8e1" />
        </linearGradient>
        <linearGradient id="med-sea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4a9fbe" />
          <stop offset="100%" stopColor="#1b6b8a" />
        </linearGradient>
      </defs>
      <rect width="1440" height="560" fill="url(#med-sky)" />
      <rect y="340" width="1440" height="220" fill="url(#med-sea)" />
      {/* Gulet / wooden boat */}
      <g>
        <path d="M520 360 Q640 342 760 352 Q800 355 830 362 L810 385 Q720 392 620 386 Z" fill="#c46b4f" />
        <rect x="570" y="342" width="8" height="60" fill="#efe4d2" opacity="0.8" />
        <path d="M574 342 Q600 330 596 370 Z" fill="#f5ede0" opacity="0.75" />
        <path d="M578 342 Q614 326 612 375 Z" fill="#f5ede0" opacity="0.5" />
        <rect x="660" y="346" width="56" height="28" rx="4" fill="#1b4d5c" />
        <rect x="666" y="350" width="12" height="16" rx="2" fill="#2e7a8a" />
        <rect x="684" y="350" width="12" height="16" rx="2" fill="#2e7a8a" />
        {/* Mast flag */}
        <path d="M574 342 L596 348 L574 354Z" fill="#c99a3f" opacity="0.8" />
      </g>
      {/* Lycian rock tomb */}
      <g>
        <rect x="1050" y="230" width="120" height="160" fill="#8a7060" />
        <path d="M1050 230 Q1110 200 1170 230Z" fill="#c46b4f" opacity="0.7" />
        <rect x="1068" y="290" width="30" height="40" rx="2" fill="#5a4030" />
        <rect x="1112" y="290" width="30" height="40" rx="2" fill="#5a4030" />
        <rect x="1068" y="350" width="74" height="8" fill="#7a6050" />
      </g>
      {/* Pine cliffs */}
      <path d="M0 330 Q200 310 400 325 Q600 340 720 330 L720 380 Q500 390 240 385 Q120 382 0 376Z" fill="#1a4a1a" />
      {/* Sun / sky elements */}
      <circle cx="1300" cy="120" r="46" fill="#c99a3f" opacity="0.8" />
      {/* Water reflections */}
      <path d="M0 380 Q360 370 720 382 Q1080 394 1440 376 L1440 400 Q1080 412 720 400 Q360 388 0 400Z" fill="#3a8cb0" opacity="0.4" />
      {/* Cliff coast right */}
      <path d="M1200 300 Q1280 260 1350 290 Q1400 310 1440 295 L1440 380 Q1380 370 1300 375 Q1240 360 1200 350Z" fill="#c8a878" />
      {/* Foreground */}
      <path d="M0 395 Q360 385 720 397 Q1080 409 1440 393 L1440 560 L0 560Z" fill="#1a3a4a" />
    </>
  );
}

function BlackSeaScene() {
  return (
    <>
      <defs>
        <linearGradient id="bs-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c8e0b0" />
          <stop offset="60%" stopColor="#e8f0d8" />
          <stop offset="100%" stopColor="#d4e8c0" />
        </linearGradient>
        <linearGradient id="bs-mist" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f5f5f0" stopOpacity="0" />
          <stop offset="100%" stopColor="#e8f0e0" stopOpacity="0.6" />
        </linearGradient>
      </defs>
      <rect width="1440" height="560" fill="url(#bs-sky)" />
      {/* Misty mountains */}
      <path d="M0 320 Q200 240 400 260 Q600 280 720 250 Q860 220 1000 255 Q1200 285 1440 240 L1440 400 L0 400Z" fill="#4a7a30" opacity="0.7" />
      <path d="M0 340 Q200 275 440 290 Q640 305 760 275 Q940 245 1100 280 Q1300 310 1440 265 L1440 420 L0 420Z" fill="#3a6020" opacity="0.85" />
      {/* Mist overlay */}
      <rect y="300" width="1440" height="120" fill="url(#bs-mist)" />
      {/* Sumela Monastery on cliff */}
      <g>
        {/* Cliff face */}
        <path d="M620 140 L600 400 L700 400 L680 140Z" fill="#7a6a50" />
        {/* Monastery structure */}
        <rect x="600" y="200" width="80" height="140" rx="2" fill="#efe4d2" />
        <rect x="600" y="200" width="80" height="20" rx="2" fill="#c46b4f" />
        {[0,1,2].map(i => (
          <g key={i}>
            <rect x={608 + i * 24} y={228} width="16" height="22" rx="2" fill="#1b4d5c" />
            <rect x={608 + i * 24} y={266} width="16" height="22" rx="2" fill="#1b4d5c" />
          </g>
        ))}
        <rect x="600" y="320" width="80" height="6" fill="#c99a3f" opacity="0.6" />
        {/* Access path */}
        <path d="M640 340 Q660 360 680 400" stroke="#d6cab5" strokeWidth="3" fill="none" strokeDasharray="4 4" />
      </g>
      {/* Trees */}
      {[80, 200, 340, 460, 820, 960, 1100, 1260, 1380].map((x, i) => (
        <g key={i}>
          <rect x={x - 4} y={320} width="8" height={60 + (i % 3) * 15} fill="#3a4a20" />
          <path d={`M${x - 20 - (i%2)*5} ${320} L${x} ${260 - (i%3)*10} L${x + 20 + (i%2)*5} ${320}Z`} fill="#2a5a18" />
        </g>
      ))}
      {/* Tea plantation rows */}
      {[0,1,2,3].map(i => (
        <path key={i} d={`M${100 + i * 60} 420 Q720 ${415 + i*3} ${1340 - i * 60} 420`} stroke="#4a7a30" strokeWidth="3" fill="none" opacity="0.6" />
      ))}
      {/* Foreground */}
      <path d="M0 420 Q360 410 720 422 Q1080 434 1440 418 L1440 560 L0 560Z" fill="#2a4a18" />
    </>
  );
}

function EasternAnatoliaScene() {
  return (
    <>
      <defs>
        <linearGradient id="ea-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a0a02" />
          <stop offset="30%" stopColor="#6b2a08" />
          <stop offset="70%" stopColor="#c46b4f" />
          <stop offset="100%" stopColor="#e8a878" />
        </linearGradient>
      </defs>
      <rect width="1440" height="560" fill="url(#ea-sky)" />
      {/* Stars */}
      {[80,220,360,500,660,820,1000,1160,1300].map((x, i) => (
        <circle key={i} cx={x} cy={30 + (i%3)*25} r="1.5" fill="#f5ede0" opacity="0.7" />
      ))}
      {/* Mount Nemrut plateau */}
      <path d="M400 200 Q600 150 700 200 Q800 240 900 200 Q1000 160 1100 200 L1100 400 L400 400Z" fill="#6b4a30" />
      {/* Colossal stone heads (silhouettes) */}
      {[460, 580, 700, 820, 940].map((x, i) => (
        <g key={i}>
          {/* Head */}
          <ellipse cx={x} cy={i % 2 === 0 ? 300 : 310} rx={24} ry={28} fill="#4a3020" />
          {/* Crown/headdress */}
          <path d={`M${x - 24} ${i % 2 === 0 ? 300 : 310} Q${x} ${i % 2 === 0 ? 256 : 268} ${x + 24} ${i % 2 === 0 ? 300 : 310}Z`} fill="#5a3a28" />
          {/* Broken at neck - tilted */}
          <rect x={x - 14} y={i % 2 === 0 ? 328 : 338} width="28" height="40"
            fill="#3a2018"
            style={{ transform: `rotate(${i % 2 === 0 ? 12 : -8}deg)`, transformOrigin: `${x}px ${i % 2 === 0 ? 328 : 338}px` }}
          />
        </g>
      ))}
      {/* Lake Van */}
      <path d="M0 380 Q360 365 720 375 Q1080 385 1440 368 L1440 440 Q1080 455 720 445 Q360 435 0 448Z" fill="#1b4d5c" opacity="0.85" />
      {/* Water shimmer */}
      <path d="M100 398 Q720 388 1340 402" stroke="#a8c8e1" strokeWidth="2" fill="none" opacity="0.4" />
      {/* Akdamar church silhouette */}
      <g>
        <rect x="680" y="340" width="80" height="50" fill="#0d2535" />
        <path d="M680 340 Q720 318 760 340Z" fill="#1b4d5c" />
        <rect x="712" y="316" width="16" height="30" fill="#0d2535" />
        <path d="M712 316 L720 300 L728 316Z" fill="#c99a3f" />
      </g>
      {/* Steppe foreground */}
      <path d="M0 400 Q360 390 720 402 Q1080 414 1440 398 L1440 460 L0 460Z" fill="#8a6040" />
      <path d="M0 450 Q360 440 720 452 Q1080 464 1440 448 L1440 560 L0 560Z" fill="#5a3a20" />
    </>
  );
}

export function RegionHeroSVG({ region, className = "" }: RegionHeroSVGProps) {
  return (
    <svg
      viewBox={VIEWBOX}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`w-full h-full ${className}`}
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
    >
      {region === "Istanbul" && <IstanbulScene />}
      {region === "Cappadocia" && <CappadociaScene />}
      {region === "Aegean" && <AegeanScene />}
      {region === "Mediterranean" && <MediterraneanScene />}
      {region === "Black Sea" && <BlackSeaScene />}
      {region === "Eastern Anatolia" && <EasternAnatoliaScene />}
    </svg>
  );
}
