"use client";
import { useState } from "react";

type PresetImage = { url: string; label?: string };
type PresetArea = { id: string; label: string; images: PresetImage[] };

interface Props {
  value: string;
  onChange: (url: string) => void;
}

const PRESET_AREAS: PresetArea[] = [
  {
    id: "istanbul",
    label: "Istanbul",
    images: [
      { url: "/istanbul-hero1.png", label: "Classic" },
      { url: "/Istanbul_Alternative1.webp", label: "Alt 1" },
      { url: "/Istanbul_Alternative2.png", label: "Alt 2" },
      { url: "/Istanbul_Alternative3.png", label: "Alt 3" },
    ],
  },
  {
    id: "cappadocia",
    label: "Cappadocia",
    images: [
      { url: "/capadocia-hero.png", label: "Classic" },
      { url: "/Cappadocia_Alternative1.png", label: "Alt 1" },
      { url: "/Cappadocia_Alternative2.png", label: "Alt 2" },
      { url: "/Cappadocia_Alternative3.png", label: "Alt 3" },
    ],
  },
  {
    id: "antalya",
    label: "Antalya",
    images: [
      { url: "/Antalya-hero.png", label: "Classic" },
      { url: "/Antalya_Alternative1.png", label: "Alt 1" },
      { url: "/Antalya_Alternative2.png", label: "Alt 2" },
      { url: "/Antalya_Alternative3.png", label: "Alt 3" },
      { url: "/Antalya_Alternative4.png", label: "Alt 4" },
    ],
  },
  {
    id: "trabzon",
    label: "Trabzon / Rize",
    images: [
      { url: "/TrabzonRize_alternative1.png", label: "Alt 1" },
      { url: "/TrabzonRize_alternative2.png", label: "Alt 2" },
      { url: "/TrabzonRize_alternative3.png", label: "Alt 3" },
      { url: "/TrabzonRize_alternative4.png", label: "Alt 4" },
    ],
  },
  { id: "pamukkale", label: "Pamukkale", images: [{ url: "/Pamukkale-hero.png", label: "Classic" }] },
  { id: "blacksea", label: "Black Sea", images: [{ url: "/black-sea-hero.png", label: "Classic" }] },
  { id: "eastern", label: "Eastern", images: [{ url: "/Eastern-hero.png", label: "Classic" }] },
  {
    id: "generic",
    label: "Generic",
    images: [
      { url: "/Hero_alternative1.png", label: "Hero alt 1" },
      { url: "/Hero_alternative2.png", label: "Hero alt 2" },
      { url: "/Hero_alternative3.png", label: "Hero alt 3" },
      { url: "/Hero_Flat_Alternative1.png", label: "Hero flat" },
    ],
  },
];

export function ImagePresetPicker({ value, onChange }: Props) {
  const initialArea =
    PRESET_AREAS.find((a) => a.images.some((i) => i.url === value))?.id ??
    PRESET_AREAS[0].id;
  const [activeArea, setActiveArea] = useState(initialArea);
  const area = PRESET_AREAS.find((a) => a.id === activeArea)!;

  return (
    <div className="mt-3 space-y-3">
      <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-muted">
        Quick select — preset library
      </p>

      <div className="flex flex-wrap gap-1.5">
        {PRESET_AREAS.map((a) => {
          const active = a.id === activeArea;
          return (
            <button
              key={a.id}
              type="button"
              onClick={() => setActiveArea(a.id)}
              className={`px-3 py-1.5 font-mono text-[10px] tracking-[0.14em] uppercase transition-all duration-150 border ${
                active
                  ? "bg-navy text-cream border-navy"
                  : "bg-cream-deep text-ink-soft border-rule hover:border-ochre/60"
              }`}
            >
              {a.label}
              <span className="ml-1.5 opacity-60">{a.images.length}</span>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-4 gap-2">
        {area.images.map((p) => {
          const active = value === p.url;
          return (
            <button
              key={p.url}
              type="button"
              onClick={() => onChange(p.url)}
              className={`relative aspect-video overflow-hidden border-2 transition-all duration-150 ${
                active ? "border-ochre" : "border-transparent hover:border-ochre/50"
              }`}
              title={p.label ?? p.url}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.url} alt={p.label ?? ""} className="w-full h-full object-cover" />
              {p.label && (
                <span
                  className={`absolute inset-x-0 bottom-0 font-mono text-[9px] tracking-[0.12em] uppercase px-1 py-0.5 text-center truncate ${
                    active ? "bg-ochre text-navy" : "bg-navy/60 text-cream"
                  }`}
                >
                  {p.label}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
