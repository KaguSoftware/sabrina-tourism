export type HotelSVGVariant =
  | "ottoman"
  | "cave"
  | "aegean"
  | "coastal"
  | "chalet"
  | "mansion";

function OttomanBoutique() {
  return (
    <>
      <rect width="400" height="260" fill="#f5ede0" />
      {/* Thin decorative top border */}
      <rect x="0" y="0" width="400" height="4" fill="#c99a3f" />
      {/* Garden ground */}
      <rect x="0" y="230" width="400" height="30" fill="#2a5a1a" opacity="0.55" />
      <rect x="0" y="238" width="400" height="22" fill="#1e4214" opacity="0.6" />
      {/* Building body */}
      <rect x="55" y="52" width="290" height="182" fill="#efe4d2" />
      {/* Ornate roof cornice */}
      <rect x="45" y="42" width="310" height="16" fill="#0b1a2e" />
      <rect x="50" y="46" width="300" height="6" fill="#c99a3f" opacity="0.85" />
      {/* Decorative battlements */}
      {[55, 95, 135, 175, 215, 255, 295].map((x, i) => (
        <rect key={i} x={x} y={34} width={22} height={14} fill="#0b1a2e" />
      ))}
      {/* Ground floor — arched central door */}
      <rect x="176" y="162" width="48" height="72" fill="#0b1a2e" rx="2" />
      <ellipse cx="200" cy="162" rx="24" ry="16" fill="#0b1a2e" />
      <rect x="181" y="167" width="38" height="67" fill="#162b3e" />
      <ellipse cx="200" cy="167" rx="18" ry="12" fill="#162b3e" />
      {/* Door handle */}
      <circle cx="215" cy="198" r="3" fill="#c99a3f" />
      {/* Ground floor arched windows */}
      {[88, 264].map((x, i) => (
        <g key={i}>
          <rect x={x} y={165} width="48" height="52" fill="#0b1a2e" rx="2" />
          <ellipse cx={x + 24} cy={165} rx="24" ry="14" fill="#0b1a2e" />
          <rect x={x + 5} y={169} width="38" height="44" fill="#a8c8e1" opacity="0.5" />
          <ellipse cx={x + 24} cy={169} rx="18" ry="10" fill="#a8c8e1" opacity="0.5" />
          {/* Window cross */}
          <line x1={x + 24} y1={169} x2={x + 24} y2={217} stroke="#0b1a2e" strokeWidth="1.5" />
          <line x1={x + 5} y1={190} x2={x + 43} y2={190} stroke="#0b1a2e" strokeWidth="1.5" />
        </g>
      ))}
      {/* First floor windows */}
      {[88, 170, 264].map((x, i) => (
        <g key={i}>
          <rect x={x} y={108} width="48" height="42" fill="#a8c8e1" opacity="0.45" stroke="#0b1a2e" strokeWidth="2" rx="2" />
          <rect x={x} y={106} width="48" height="6" fill="#0b1a2e" />
          <line x1={x + 24} y1={108} x2={x + 24} y2={150} stroke="#0b1a2e" strokeWidth="1.5" />
        </g>
      ))}
      {/* Second floor windows — smaller */}
      {[100, 182, 276].map((x, i) => (
        <rect key={i} x={x} y={68} width="36" height="28" fill="#a8c8e1" opacity="0.35" stroke="#0b1a2e" strokeWidth="1.5" rx="1" />
      ))}
      {/* Decorative band between floors */}
      <rect x="55" y="100" width="290" height="5" fill="#0b1a2e" opacity="0.25" />
      <rect x="55" y="155" width="290" height="5" fill="#0b1a2e" opacity="0.25" />
      {/* Front steps */}
      <rect x="155" y="230" width="90" height="7" fill="#d6c8a8" />
      <rect x="143" y="237" width="114" height="7" fill="#c8b890" />
      {/* Shrubs */}
      {[68, 110, 280, 322].map((x, i) => (
        <ellipse key={i} cx={x} cy={232} rx={12} ry={10} fill="#2a6a1a" opacity={0.8} />
      ))}
    </>
  );
}

function CaveSuite() {
  return (
    <>
      {/* Warm amber sky */}
      <defs>
        <linearGradient id="cave-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c46b4f" />
          <stop offset="60%" stopColor="#e8a87c" />
          <stop offset="100%" stopColor="#f5d090" />
        </linearGradient>
        <linearGradient id="cave-rock" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c8a870" />
          <stop offset="100%" stopColor="#8a5c30" />
        </linearGradient>
      </defs>
      <rect width="400" height="260" fill="url(#cave-sky)" />
      {/* Far fairy chimneys */}
      {[30, 340, 370].map((x, i) => (
        <g key={i}>
          <rect x={x} y={120 + i * 10} width={18 + i * 4} height={100} fill="#b89060" opacity={0.5} />
          <ellipse cx={x + 9 + i * 2} cy={120 + i * 10} rx={12 + i * 2} ry={10} fill="#a07850" opacity={0.5} />
        </g>
      ))}
      {/* Main cliff face */}
      <path d="M0 80 Q60 60 120 75 Q180 90 240 70 Q300 50 360 65 Q390 72 400 68 L400 260 L0 260Z" fill="url(#cave-rock)" />
      {/* Rock texture lines */}
      <path d="M0 110 Q100 100 200 108 Q300 116 400 105" stroke="#a07840" strokeWidth="1.5" fill="none" opacity="0.4" />
      <path d="M0 145 Q80 138 160 143 Q240 148 400 140" stroke="#a07840" strokeWidth="1.5" fill="none" opacity="0.3" />
      {/* Cave openings — ground level */}
      {[60, 160, 265].map((x, i) => (
        <g key={i}>
          {/* Carved arch */}
          <rect x={x} y={160 + i * 5} width={60} height={70} fill="#3a2010" rx="30" />
          <rect x={x + 5} y={164 + i * 5} width={50} height={65} fill="#1e1008" rx="25" />
          {/* Warm interior glow */}
          <rect x={x + 8} y={167 + i * 5} width={44} height={60} fill="#c99a3f" opacity="0.15" rx="22" />
          {/* Wooden door frame */}
          <rect x={x + 12} y={190 + i * 5} width={36} height={44} fill="#6a3a18" />
          <rect x={x + 14} y={192 + i * 5} width={32} height={40} fill="#4a2810" />
          <circle cx={x + 38} cy={213 + i * 5} r={3} fill="#c99a3f" />
        </g>
      ))}
      {/* Cave windows — upper level */}
      {[80, 185, 290].map((x, i) => (
        <g key={i}>
          <ellipse cx={x} cy={130 + i * 8} rx={22} ry={18} fill="#3a2010" />
          <ellipse cx={x} cy={130 + i * 8} rx={18} ry={14} fill="#1e1008" />
          <ellipse cx={x} cy={130 + i * 8} rx={14} ry={10} fill="#c99a3f" opacity={0.2} />
        </g>
      ))}
      {/* Terrace ledge */}
      <rect x="40" y="155" width="320" height="10" fill="#a07840" />
      <rect x="40" y="152" width="320" height="6" fill="#c8a060" />
      {/* Terrace railing posts */}
      {Array.from({ length: 14 }, (_, i) => (
        <rect key={i} x={45 + i * 23} y={130} width="3" height="28" fill="#8a6030" />
      ))}
      {/* Railing bar */}
      <rect x="42" y="130" width="316" height="4" fill="#a07840" />
      {/* Foreground ground */}
      <path d="M0 240 Q200 232 400 240 L400 260 L0 260Z" fill="#6a4020" />
      {/* Vegetation on clifftop */}
      {[20, 80, 160, 240, 320, 380].map((x, i) => (
        <ellipse key={i} cx={x} cy={65 + (i % 2) * 12} rx={18 + (i % 3) * 6} ry={14} fill="#2a5a18" opacity={0.7} />
      ))}
    </>
  );
}

function AegeanWhite() {
  return (
    <>
      <defs>
        <linearGradient id="aeg-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#87ceeb" />
          <stop offset="70%" stopColor="#c8e8f8" />
          <stop offset="100%" stopColor="#e8f4fc" />
        </linearGradient>
        <linearGradient id="aeg-sea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5aadcf" />
          <stop offset="100%" stopColor="#1b6b8a" />
        </linearGradient>
      </defs>
      <rect width="400" height="260" fill="url(#aeg-sky)" />
      <rect y="200" width="400" height="60" fill="url(#aeg-sea)" />
      {/* Sea shimmer */}
      <path d="M0 215 Q100 210 200 216 Q300 222 400 214" stroke="#a8d8f0" strokeWidth="2" fill="none" opacity="0.5" />
      {/* Hillside */}
      <path d="M0 180 Q80 165 160 172 Q240 178 320 168 Q370 163 400 168 L400 210 L0 210Z" fill="#c8a860" />
      {/* Back cube */}
      <rect x="220" y="100" width="100" height="90" fill="#f0f0f0" />
      <rect x="220" y="96" width="100" height="8" fill="#e0e0dc" />
      {/* Back cube windows with blue shutters */}
      {[234, 274].map((x, i) => (
        <g key={i}>
          <rect x={x} y={115} width="26" height="34" fill="#f8f8f8" stroke="#c8c0b0" strokeWidth="1" />
          <rect x={x} y={115} width="12" height="34" fill="#1b4d5c" opacity={0.8} />
          <rect x={x + 14} y={115} width="12" height="34" fill="#1b4d5c" opacity={0.8} />
        </g>
      ))}
      {/* Back cube dome */}
      <ellipse cx="270" cy="96" rx="28" ry="14" fill="#e0e0dc" />
      <ellipse cx="270" cy="96" rx="20" ry="9" fill="#1b4d5c" opacity="0.6" />
      {/* Main front cube */}
      <rect x="80" y="120" width="150" height="100" fill="#f8f8f8" />
      <rect x="76" y="116" width="158" height="8" fill="#ede8e0" />
      {/* Main cube windows */}
      {[96, 150, 98 + 54, 152].map((x, i) =>
        i < 2 ? (
          <g key={i}>
            <rect x={x} y={140} width="30" height="38" fill="#f0f0f0" stroke="#c8c0b0" strokeWidth="1.5" />
            <rect x={x} y={140} width="14" height="38" fill="#1b4d5c" opacity="0.75" />
            <rect x={x + 16} y={140} width="14" height="38" fill="#1b4d5c" opacity="0.75" />
          </g>
        ) : null
      )}
      {/* Lower level arch door */}
      <rect x="142" y="178" width="36" height="42" fill="#1b4d5c" rx="18" />
      <rect x="146" y="182" width="28" height="38" fill="#162b3e" rx="14" />
      {/* Bougainvillea splash */}
      {[82, 96, 108, 95, 88].map((x, i) => (
        <ellipse key={i} cx={x} cy={120 + i * 6} rx={14} ry={10} fill="#c46b4f" opacity={0.7 - i * 0.08} />
      ))}
      {/* Terrace/roof railing */}
      <rect x="76" y="113" width="158" height="4" fill="#1b4d5c" opacity="0.4" />
      {Array.from({ length: 12 }, (_, i) => (
        <rect key={i} x={80 + i * 13} y={98} width="2" height="18" fill="#1b4d5c" opacity="0.5" />
      ))}
      <rect x="76" y="95" width="158" height="4" fill="#1b4d5c" opacity="0.5" />
      {/* Sun */}
      <circle cx="360" cy="52" r="28" fill="#c99a3f" opacity="0.75" />
      {/* Foreground path */}
      <path d="M0 205 Q200 200 400 205" stroke="#b89850" strokeWidth="2" fill="none" opacity="0.4" />
    </>
  );
}

function CoastalModern() {
  return (
    <>
      <defs>
        <linearGradient id="mod-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0b2a3a" />
          <stop offset="50%" stopColor="#1b4d5c" />
          <stop offset="100%" stopColor="#2e7a8a" />
        </linearGradient>
        <linearGradient id="mod-sea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3a8cb0" />
          <stop offset="100%" stopColor="#1a5a78" />
        </linearGradient>
      </defs>
      <rect width="400" height="260" fill="url(#mod-bg)" />
      {/* Stars */}
      {[40, 120, 200, 300, 370, 80, 260, 340].map((x, i) => (
        <circle key={i} cx={x} cy={20 + (i % 4) * 14} r="1.2" fill="#f5ede0" opacity={0.5 + (i % 3) * 0.15} />
      ))}
      {/* Sea */}
      <rect y="195" width="400" height="65" fill="url(#mod-sea)" />
      <path d="M0 200 Q100 195 200 201 Q300 207 400 198" stroke="#a8d8f0" strokeWidth="1.5" fill="none" opacity="0.4" />
      {/* Cliff base */}
      <path d="M0 170 Q60 158 120 165 L120 210 L0 210Z" fill="#3a3028" />
      <path d="M280 158 Q340 148 400 155 L400 210 L280 210Z" fill="#3a3028" />
      {/* Building — main body lower level */}
      <rect x="80" y="145" width="240" height="58" fill="#2a2a28" />
      {/* Lower level glass facade */}
      {[88, 134, 180, 226, 272].map((x, i) => (
        <rect key={i} x={x} y={152} width="36" height="44" fill="#a8d8f0" opacity={0.18 + (i % 2) * 0.08} />
      ))}
      {/* Building — upper cantilevered level */}
      <rect x="60" y="92" width="280" height="58" fill="#242422" />
      {/* Upper level glass facade */}
      {[68, 120, 172, 224, 276, 328].map((x, i) => (
        <rect key={i} x={x} y={100} width="40" height="44" fill="#a8d8f0" opacity={0.22 + (i % 2) * 0.1} />
      ))}
      {/* Upper floor warm interior lights */}
      {[68, 120, 172, 224].map((x, i) => (
        <rect key={i} x={x + 2} y={102} width={36} height={38} fill="#c99a3f" opacity={0.08} />
      ))}
      {/* Cantilever shadow line */}
      <rect x="60" y="148" width="280" height="4" fill="#0b1a2e" opacity="0.6" />
      {/* Roof deck with railing */}
      <rect x="55" y="88" width="290" height="6" fill="#2a2a28" />
      {Array.from({ length: 20 }, (_, i) => (
        <rect key={i} x={60 + i * 14} y={72} width="2" height="18" fill="#4a4a48" />
      ))}
      <rect x="55" y="70" width="290" height="3" fill="#4a4a48" />
      {/* Infinity pool */}
      <rect x="100" y="200" width="200" height="14" fill="#3ab0d0" opacity="0.5" />
      <rect x="100" y="211" width="200" height="3" fill="#5ac8e8" opacity="0.4" />
      {/* Pool-sea merge glow */}
      <rect x="95" y="198" width="210" height="4" fill="#a8e8f8" opacity="0.2" />
      {/* Moon */}
      <circle cx="340" cy="40" r="22" fill="#efe4d2" opacity="0.9" />
      <circle cx="348" cy="35" r="17" fill="#1b4d5c" />
    </>
  );
}

function MountainChalet() {
  return (
    <>
      <defs>
        <linearGradient id="ch-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7ab0c8" />
          <stop offset="100%" stopColor="#c8e0f0" />
        </linearGradient>
        <linearGradient id="ch-mtn" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e8e8e8" />
          <stop offset="40%" stopColor="#d0d0cc" />
          <stop offset="100%" stopColor="#4a7a30" />
        </linearGradient>
      </defs>
      <rect width="400" height="260" fill="url(#ch-sky)" />
      {/* Mountain backdrop */}
      <path d="M0 160 Q80 80 160 120 Q240 160 320 80 Q360 58 400 90 L400 220 L0 220Z" fill="url(#ch-mtn)" />
      {/* Snow caps */}
      <path d="M80 80 Q100 64 120 80 Q100 72 80 80Z" fill="white" opacity="0.9" />
      <path d="M320 80 Q340 58 360 78 Q340 66 320 80Z" fill="white" opacity="0.9" />
      {/* Meadow ground */}
      <rect x="0" y="215" width="400" height="45" fill="#3a6a18" />
      <rect x="0" y="225" width="400" height="35" fill="#2a5210" />
      {/* Building — stone base */}
      <rect x="95" y="155" width="210" height="80" fill="#8a7a6a" />
      {/* Stone texture */}
      {[0, 1, 2].map((row) =>
        [0, 1, 2, 3, 4].map((col) => (
          <rect key={`${row}-${col}`} x={98 + col * 42} y={158 + row * 26} width={40} height={24} fill="none" stroke="#6a5a4a" strokeWidth="1" opacity="0.5" />
        ))
      )}
      {/* Timber upper story */}
      <rect x="90" y="100" width="220" height="60" fill="#4a3018" />
      {/* Timber horizontal planks */}
      {[0, 1, 2].map((i) => (
        <rect key={i} x={90} y={100 + i * 20} width={220} height={2} fill="#3a2010" />
      ))}
      {/* Roof — steep pitch */}
      <path d="M60 100 L200 40 L340 100Z" fill="#2a1a0a" />
      {/* Roof ridge cap */}
      <path d="M70 100 L200 44 L330 100" stroke="#1a0a00" strokeWidth="3" fill="none" />
      {/* Chimney */}
      <rect x="230" y="44" width="20" height="52" fill="#8a7a6a" />
      <rect x="225" y="40" width="30" height="8" fill="#6a5a4a" />
      {/* Chimney smoke */}
      <path d="M240 40 Q248 28 244 20 Q238 12 246 4" stroke="#c8c8c0" strokeWidth="2.5" fill="none" opacity="0.5" strokeLinecap="round" />
      {/* Windows — upper timber */}
      {[105, 175, 245].map((x, i) => (
        <g key={i}>
          <rect x={x} y={110} width="44" height="38" fill="#c99a3f" opacity="0.3" stroke="#3a2010" strokeWidth="2" />
          <rect x={x} y={108} width="44" height="6" fill="#3a2010" />
          <line x1={x + 22} y1={110} x2={x + 22} y2={148} stroke="#3a2010" strokeWidth="1.5" />
        </g>
      ))}
      {/* Windows glow */}
      {[105, 175, 245].map((x, i) => (
        <rect key={i} x={x + 2} y={112} width={40} height={34} fill="#c99a3f" opacity={0.1} />
      ))}
      {/* Lower windows in stone */}
      {[110, 235].map((x, i) => (
        <rect key={i} x={x} y={168} width="54" height="44" fill="#a8c8e1" opacity="0.3" stroke="#6a5a4a" strokeWidth="2" />
      ))}
      {/* Front door */}
      <rect x="178" y="178" width="44" height="57" fill="#3a2010" rx="2" />
      <rect x="182" y="182" width="36" height="53" fill="#2a1808" rx="1" />
      <circle cx="210" cy="210" r="3" fill="#c99a3f" />
      {/* Pine trees */}
      {[28, 58, 340, 370].map((x, i) => (
        <g key={i}>
          <rect x={x - 3} y={170} width="6" height={45} fill="#3a2a18" />
          <path d={`M${x - 20} 195 L${x} 155 L${x + 20} 195Z`} fill="#1e4a14" />
          <path d={`M${x - 16} 175 L${x} 142 L${x + 16} 175Z`} fill="#2a5a1a" />
        </g>
      ))}
      {/* Snow on roof */}
      <path d="M62 100 L200 44 L338 100 L320 100 L200 52 L80 100Z" fill="white" opacity="0.35" />
    </>
  );
}

function HistoricMansion() {
  return (
    <>
      <defs>
        <linearGradient id="man-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#b8ccd8" />
          <stop offset="100%" stopColor="#dce8f0" />
        </linearGradient>
      </defs>
      <rect width="400" height="260" fill="url(#man-sky)" />
      {/* Ground */}
      <rect x="0" y="228" width="400" height="32" fill="#4a6a20" opacity="0.7" />
      <rect x="0" y="236" width="400" height="24" fill="#3a5818" opacity="0.8" />
      {/* Building body — 5-bay classical */}
      <rect x="40" y="52" width="320" height="182" fill="#d8c8a8" />
      {/* Rusticated base */}
      <rect x="40" y="170" width="320" height="64" fill="#c8b898" />
      {[0, 1, 2, 3].map((row) =>
        [0, 1, 2, 3, 4, 5, 6, 7].map((col) => (
          <rect key={`${row}-${col}`} x={42 + col * 40} y={172 + row * 16} width={38} height={14} fill="none" stroke="#b0a888" strokeWidth="1" opacity="0.6" />
        ))
      )}
      {/* Pilasters */}
      {[40, 108, 188, 268, 326].map((x, i) => (
        <g key={i}>
          <rect x={x} y={52} width={14} height={182} fill="#ccbc9c" />
          {/* Capital */}
          <rect x={x - 4} y={50} width={22} height={8} fill="#c0b090" />
        </g>
      ))}
      {/* Entablature / frieze */}
      <rect x="36" y="42" width="328" height="14" fill="#c8b898" />
      <rect x="36" y="42" width="328" height="5" fill="#b8a880" />
      <rect x="40" y="40" width="320" height="4" fill="#d0c0a0" />
      {/* Pediment */}
      <path d="M100 40 L200 10 L300 40Z" fill="#ccbc9c" />
      <path d="M104 40 L200 14 L296 40" stroke="#b8a880" strokeWidth="2" fill="none" />
      {/* Pediment detail */}
      <ellipse cx="200" cy="30" rx="16" ry="12" fill="#c8b898" stroke="#b8a880" strokeWidth="1.5" />
      {/* Second floor windows — 5 bays */}
      {[58, 118, 188, 258, 308].map((x, i) => (
        <g key={i}>
          <rect x={x} y={68} width={40} height={60} fill="#a8c8e1" opacity="0.5" stroke="#a09070" strokeWidth="1.5" rx="2" />
          {/* Arched top */}
          <rect x={x} y={68} width={40} height={18} fill="#a8c8e1" opacity="0.3" rx="20" />
          {/* Shutters */}
          <rect x={x} y={68} width={18} height={60} fill="#0b1a2e" opacity="0.5" />
          <rect x={x + 22} y={68} width={18} height={60} fill="#0b1a2e" opacity="0.5" />
          {/* Decorative lintel */}
          <rect x={x - 2} y={64} width={44} height={6} fill="#c8b898" />
        </g>
      ))}
      {/* Ground floor — grand arched entrance */}
      <rect x="172" y="158" width="56" height="72" fill="#8a3a1e" rx="2" />
      <ellipse cx="200" cy="158" rx="28" ry="18" fill="#8a3a1e" />
      <rect x="177" y="163" width="46" height="67" fill="#6a2a0e" />
      <ellipse cx="200" cy="163" rx="22" ry="14" fill="#6a2a0e" />
      {/* Door surround */}
      <rect x="168" y="155" width="64" height="4" fill="#b8a880" />
      {/* Flanking ground floor windows */}
      {[60, 270].map((x, i) => (
        <g key={i}>
          <rect x={x} y={162} width="58" height="60" fill="#a8c8e1" opacity="0.4" stroke="#a09070" strokeWidth="1.5" />
          <rect x={x} y={162} width="58" height="20" fill="#a8c8e1" opacity="0.2" rx="29" />
          <line x1={x + 29} y1={162} x2={x + 29} y2={222} stroke="#a09070" strokeWidth="1.5" />
          <line x1={x} y1={190} x2={x + 58} y2={190} stroke="#a09070" strokeWidth="1.5" />
        </g>
      ))}
      {/* Balcony railings — second floor */}
      {[58, 118, 258, 308].map((x, i) => (
        <g key={i}>
          <rect x={x} y={126} width={40} height={4} fill="#0b1a2e" opacity="0.6" />
          {Array.from({ length: 5 }, (_, j) => (
            <rect key={j} x={x + 2 + j * 8} y={112} width="3" height="18" fill="#0b1a2e" opacity="0.5" />
          ))}
        </g>
      ))}
      {/* Front steps — grand staircase */}
      <rect x="148" y="228" width="104" height="8" fill="#c8b898" />
      <rect x="138" y="236" width="124" height="7" fill="#c0b090" />
      <rect x="126" y="243" width="148" height="7" fill="#b8a888" />
      {/* Gate posts */}
      {[50, 340].map((x, i) => (
        <g key={i}>
          <rect x={x} y={205} width={10} height={30} fill="#b8a880" />
          <rect x={x - 2} y={203} width={14} height={6} fill="#c8b898" />
          <circle cx={x + 5} cy={200} r={6} fill="#c99a3f" opacity={0.7} />
        </g>
      ))}
      {/* Iron fence */}
      {Array.from({ length: 16 }, (_, i) => (
        <rect key={i} x={62 + i * 18} y={210} width="3" height="22" fill="#0b1a2e" opacity="0.5" rx="1" />
      ))}
      <rect x="60" y="208" width="280" height="3" fill="#0b1a2e" opacity="0.4" />
      {/* Hedges */}
      {[72, 130, 260, 310].map((x, i) => (
        <ellipse key={i} cx={x} cy={228} rx={16} ry={10} fill="#2a5a18" opacity={0.75} />
      ))}
    </>
  );
}

export function HotelSVG({
  variant,
  className = "",
}: {
  variant: HotelSVGVariant;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 400 260"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`w-full h-full ${className}`}
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
    >
      {variant === "ottoman" && <OttomanBoutique />}
      {variant === "cave" && <CaveSuite />}
      {variant === "aegean" && <AegeanWhite />}
      {variant === "coastal" && <CoastalModern />}
      {variant === "chalet" && <MountainChalet />}
      {variant === "mansion" && <HistoricMansion />}
    </svg>
  );
}
