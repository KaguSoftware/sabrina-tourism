import { STAMP_SIZE } from "./constants";
import type { PassportStampProps } from "./types";

export function PassportStamp({ label, rotation = -3, visible = false }: PassportStampProps) {
  return (
    <svg
      viewBox={`0 0 ${STAMP_SIZE} ${STAMP_SIZE}`}
      width={STAMP_SIZE}
      height={STAMP_SIZE}
      aria-hidden="true"
      style={{
        "--stamp-rotation": `${rotation}deg`,
        opacity: visible ? 1 : 0,
        transform: `rotate(${rotation}deg)`,
        animation: visible ? "stamp-in 400ms cubic-bezier(0.22,0.61,0.36,1) forwards" : "none",
      } as React.CSSProperties}
    >
      <circle
        cx={STAMP_SIZE / 2}
        cy={STAMP_SIZE / 2}
        r={STAMP_SIZE / 2 - 4}
        fill="none"
        stroke="#c99a3f"
        strokeWidth="2"
        strokeDasharray="4 3"
      />
      <circle
        cx={STAMP_SIZE / 2}
        cy={STAMP_SIZE / 2}
        r={STAMP_SIZE / 2 - 10}
        fill="none"
        stroke="#c99a3f"
        strokeWidth="1"
      />
      <defs>
        <path
          id={`stamp-arc-${label}`}
          d={`M ${STAMP_SIZE / 2 - 26},${STAMP_SIZE / 2} a 26,26 0 0 1 52,0`}
        />
      </defs>
      <text
        fontSize="7"
        fontFamily="var(--font-jetbrains, monospace)"
        fontWeight="500"
        letterSpacing="3"
        fill="#c99a3f"
        textAnchor="middle"
      >
        <textPath href={`#stamp-arc-${label}`} startOffset="50%">
          {label} · 2026
        </textPath>
      </text>
      <text
        x={STAMP_SIZE / 2}
        y={STAMP_SIZE / 2 + 6}
        textAnchor="middle"
        fontSize="9"
        fontFamily="var(--font-fraunces, serif)"
        fontStyle="italic"
        fill="#c99a3f"
      >
        M&Co
      </text>
    </svg>
  );
}
