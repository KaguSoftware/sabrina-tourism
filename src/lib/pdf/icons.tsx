// react-pdf can't use lucide-react components directly (different renderer).
// This file renders lucide-style SVG icons inline using @react-pdf/renderer
// primitives (Svg, Path, Circle, Line). Path data is approximated from
// lucide.dev (24x24 viewBox, stroke-based, stroke-width 2, round caps/joins).
//
// Usage: <PdfIcon name="plane" size={10} color={C.ochre} />
//
// Keys match the `key` field in INCLUSION_ICONS (src/lib/icons/inclusion-icons.ts).

import React from "react";
import { Svg, Path, Circle, Line } from "@react-pdf/renderer";

// Each entry holds the SVG primitives to render inside <Svg viewBox="0 0 24 24">.
// Path data borrowed/approximated from lucide-static. Use `d` for <Path> elements.
// We keep them as plain strings so consumers don't pull in JSX trees per icon.
interface IconShape {
  paths?: string[];
  // For icons that need circles / lines we encode them as objects.
  circles?: Array<{ cx: number; cy: number; r: number }>;
  lines?: Array<{ x1: number; y1: number; x2: number; y2: number }>;
}

const ICONS: Record<string, IconShape> = {
  plane: {
    paths: [
      "M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z",
    ],
  },
  "plane-takeoff": {
    paths: [
      "M2 22h20",
      "M6.36 17.4 4 17l-2-4 1.1-.55a2 2 0 0 1 1.8 0l.17.1a2 2 0 0 0 1.8 0L8 12 5 6l.9-.45a2 2 0 0 1 2.09.2l4.02 3 7.65-2.05a2 2 0 0 1 2.46 2.45l-.4 1.5a2 2 0 0 1-1.41 1.41L6.35 17.4z",
    ],
  },
  "plane-landing": {
    paths: [
      "M2 22h20",
      "M3.77 10.77 2 9l2-4.5 1.1.55a2 2 0 0 1 1.1 1.79l-.01.7a2 2 0 0 0 1.1 1.8l4.65 2.32a2 2 0 0 0 1.6.1L19.93 9.6a2 2 0 0 1 2.05.32l.41.36a2 2 0 0 1 .58 2.06l-.45 1.5a2 2 0 0 1-1.51 1.41l-12.95 3.13a2 2 0 0 1-1.81-.61L3.77 10.77z",
    ],
  },
  hotel: {
    paths: [
      "M10 22v-6.57",
      "M12 11h.01",
      "M12 7h.01",
      "M14 15.43V22",
      "M15 16a5 5 0 0 0-6 0",
      "M16 11h.01",
      "M16 7h.01",
      "M8 11h.01",
      "M8 7h.01",
      "M3 22V2a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v20",
      "M2 22h20",
    ],
  },
  bed: {
    paths: [
      "M2 20v-8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8",
      "M4 10V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4",
      "M12 4v6",
      "M2 18h20",
    ],
  },
  utensils: {
    paths: [
      "M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2",
      "M7 2v20",
      "M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7",
    ],
  },
  coffee: {
    paths: [
      "M10 2v2",
      "M14 2v2",
      "M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h14a4 4 0 1 1 0 8h-1",
      "M6 2v2",
    ],
  },
  "map-pin": {
    paths: [
      "M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0",
    ],
    circles: [{ cx: 12, cy: 10, r: 3 }],
  },
  map: {
    paths: [
      "M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z",
      "M15 5.764v15",
      "M9 3.236v15",
    ],
  },
  compass: {
    paths: [
      "m16.24 7.76-1.804 5.411a2 2 0 0 1-1.265 1.265L7.76 16.24l1.804-5.411a2 2 0 0 1 1.265-1.265z",
    ],
    circles: [{ cx: 12, cy: 12, r: 10 }],
  },
  bus: {
    paths: [
      "M8 6v6",
      "M15 6v6",
      "M2 12h19.6",
      "M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3",
      "M2 12c0 .55.45 1 1 1H4M21 12h.5c.55 0 1 .45 1 1v.5",
    ],
    circles: [
      { cx: 7, cy: 18, r: 2 },
      { cx: 17, cy: 18, r: 2 },
    ],
  },
  car: {
    paths: [
      "M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2",
      "M14 17H9",
    ],
    circles: [
      { cx: 6.5, cy: 16.5, r: 2.5 },
      { cx: 16.5, cy: 16.5, r: 2.5 },
    ],
  },
  "car-front": {
    paths: [
      "M21 8 17.65 2.65A2 2 0 0 0 16.06 2H7.94a2 2 0 0 0-1.59.65L3 8",
      "M7 10h0",
      "M17 10h0",
      "m21 8-2 6c-.2.6-.7 1-1.4 1H6.4c-.7 0-1.2-.4-1.4-1L3 8",
      "M9 18v2",
      "M15 18v2",
      "M5 15v3a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-1",
      "M19 15v3a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-1",
    ],
  },
  ship: {
    paths: [
      "M12 10.189V14",
      "M12 2v3",
      "M19 13V7a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v6",
      "M19.38 20A11.6 11.6 0 0 0 21 14l-8.188-3.639a2 2 0 0 0-1.624 0L3 14a11.6 11.6 0 0 0 2.81 7.76",
      "M2 21c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1s1.2 1 2.5 1c2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1",
    ],
  },
  "train-front": {
    paths: [
      "M8 3.1V7a4 4 0 0 0 8 0V3.1",
      "m9 15-1-1",
      "m15 15 1-1",
      "M9 19c-2.8 0-5-2.2-5-5v-4a8 8 0 0 1 16 0v4c0 2.8-2.2 5-5 5Z",
      "m8 19-2 3",
      "m16 19 2 3",
    ],
  },
  ticket: {
    paths: [
      "M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z",
      "M13 5v2",
      "M13 17v2",
      "M13 11v2",
    ],
  },
  users: {
    paths: [
      "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",
      "M22 21v-2a4 4 0 0 0-3-3.87",
      "M16 3.13a4 4 0 0 1 0 7.75",
    ],
    circles: [{ cx: 9, cy: 7, r: 4 }],
  },
  "users-3": {
    paths: [
      "M9 21v-2a4 4 0 0 1 4-4h0a4 4 0 0 1 4 4v2",
      "M3 21v-2a4 4 0 0 1 3-3.87",
      "M21 21v-2a4 4 0 0 0-3-3.87",
      "M8 3.13a4 4 0 0 0 0 7.75",
      "M16 3.13a4 4 0 0 1 0 7.75",
    ],
    circles: [{ cx: 12, cy: 7, r: 4 }],
  },
  user: {
    paths: ["M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"],
    circles: [{ cx: 12, cy: 7, r: 4 }],
  },
  baby: {
    paths: [
      "M9 12h.01",
      "M15 12h.01",
      "M10 16c.5.3 1.2.5 2 .5s1.5-.2 2-.5",
      "M19 6.3a9 9 0 0 1 1.8 3.9 2 2 0 0 1 0 3.6 9 9 0 0 1-17.6 0 2 2 0 0 1 0-3.6A9 9 0 0 1 12 3c2 0 3.5 1.1 3.5 2.5s-.9 2.5-2 2.5c-.8 0-1.5-.4-1.5-1",
    ],
  },
  clock: {
    paths: ["M12 6v6l4 2"],
    circles: [{ cx: 12, cy: 12, r: 10 }],
  },
  calendar: {
    paths: [
      "M8 2v4",
      "M16 2v4",
      "M3 10h18",
      "M21 8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2z",
    ],
  },
  camera: {
    paths: [
      "M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z",
    ],
    circles: [{ cx: 12, cy: 13, r: 3 }],
  },
  wifi: {
    paths: [
      "M12 20h.01",
      "M2 8.82a15 15 0 0 1 20 0",
      "M5 12.859a10 10 0 0 1 14 0",
      "M8.5 16.429a5 5 0 0 1 7 0",
    ],
  },
  "shield-check": {
    paths: [
      "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
      "m9 12 2 2 4-4",
    ],
  },
  wallet: {
    paths: [
      "M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1",
      "M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4",
    ],
  },
  check: {
    paths: ["M20 6 9 17l-5-5"],
  },
  x: {
    paths: ["M18 6 6 18", "m6 6 12 12"],
  },
  "circle-plus": {
    paths: ["M8 12h8", "M12 8v8"],
    circles: [{ cx: 12, cy: 12, r: 10 }],
  },
  "circle-minus": {
    paths: ["M8 12h8"],
    circles: [{ cx: 12, cy: 12, r: 10 }],
  },
};

interface PdfIconProps {
  name: string | null | undefined;
  size?: number;
  color?: string;
}

/**
 * Render a lucide-style icon inside a react-pdf <Svg>.
 * Falls back to a small circle if the name isn't in the registry.
 */
export function PdfIcon({ name, size = 10, color = "#c99a3f" }: PdfIconProps) {
  const shape = name ? ICONS[name] : null;
  if (!shape) {
    // Fallback dot
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24">
        <Circle cx="12" cy="12" r="3" fill={color} />
      </Svg>
    );
  }
  const strokeWidth = 2;
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      {shape.paths?.map((d, i) => (
        <Path
          key={`p${i}`}
          d={d}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      ))}
      {shape.circles?.map((c, i) => (
        <Circle
          key={`c${i}`}
          cx={c.cx}
          cy={c.cy}
          r={c.r}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
        />
      ))}
      {shape.lines?.map((l, i) => (
        <Line
          key={`l${i}`}
          x1={l.x1}
          y1={l.y1}
          x2={l.x2}
          y2={l.y2}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
      ))}
    </Svg>
  );
}
