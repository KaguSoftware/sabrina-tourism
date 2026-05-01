"use client";
import Image from "next/image";
import { Kicker } from "@/components/primitives/Kicker/Kicker";
import { GoldUnderlineHeading } from "@/components/primitives/GoldUnderlineHeading/GoldUnderlineHeading";
import { Reveal } from "@/components/primitives/Reveal/Reveal";
import { GALLERY_SPAN_CLASSES } from "./constants";

export function PackageGallery({
  gallery,
  onOpen,
}: {
  gallery: string[];
  onOpen: (index: number) => void;
}) {
  return (
    <section className="relative z-10 max-w-[1320px] mx-auto px-[clamp(20px,4vw,56px)] pb-[clamp(80px,10vw,130px)]">
      <div className="mb-14">
        <Reveal><Kicker>In photographs</Kicker></Reveal>
        <Reveal delay={120}>
          <GoldUnderlineHeading as="h2" className="text-[clamp(32px,4.6vw,64px)] mt-4 tracking-[-0.02em]">
            Images from the route.
          </GoldUnderlineHeading>
        </Reveal>
      </div>
      <div className="grid grid-cols-6 auto-rows-[180px] gap-3">
        {gallery.map((src, i) => (
          <button
            key={i}
            className={`relative overflow-hidden bg-navy-soft cursor-zoom-in group ${GALLERY_SPAN_CLASSES[i % GALLERY_SPAN_CLASSES.length]}`}
            onClick={() => onOpen(i)}
            aria-label={`View image ${i + 1}`}
          >
            <Image
              src={src}
              alt=""
              fill
              loading="lazy"
              className="object-cover transition-transform duration-1200 ease-out group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, 33vw"
            />
            <span className="absolute bottom-2.5 left-3 font-display italic text-cream text-[14px] drop-shadow">
              {String(i + 1).padStart(2, "0")}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
