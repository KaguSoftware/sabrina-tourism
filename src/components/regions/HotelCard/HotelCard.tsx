import { HotelSVG, type HotelSVGVariant } from "@/components/illustrations/HotelSVG/HotelSVG";

export interface HotelCardData {
  id: string;
  name: string;
  description: string;
  tags: [string, string];
  svgVariant: HotelSVGVariant;
}

export function HotelCard({ hotel }: { hotel: HotelCardData }) {
  return (
    <div className="group bg-[#fcf5ec] border border-rule shadow-[4px_6px_0_-1px_#1b4d5c] sm:shadow-none transition-all duration-380 ease-out hover:transform-[perspective(1000px)_rotateY(-4deg)_rotateX(3deg)_translateY(-6px)] hover:[box-shadow:14px_20px_0_-2px_#1b4d5c]">
      {/* Illustration */}
      <div className="relative aspect-[4/3.2] overflow-hidden bg-navy-soft">
        <HotelSVG variant={hotel.svgVariant} className="absolute inset-0" />
        {/* Tags badge */}
        <span className="absolute top-4 left-4 bg-navy/78 text-cream font-mono text-[11px] tracking-[0.2em] uppercase px-3 py-1.5 backdrop-blur-sm">
          {hotel.tags[0]}
        </span>
        <span className="absolute top-4 right-4 bg-ochre/90 text-navy font-mono text-[11px] tracking-[0.2em] uppercase px-3 py-1.5">
          {hotel.tags[1]}
        </span>
      </div>

      {/* Body */}
      <div className="pt-5 pb-5 px-4">
        <p className="font-mono text-[11px] tracking-[0.18em] uppercase text-muted mb-2.5">
          Partnered Hotel
          <span className="mx-1.5 text-rule">·</span>
          <em className="text-ochre not-italic">Curated Stay</em>
        </p>
        <h3 className="font-display font-normal text-[clamp(22px,2.4vw,30px)] tracking-[-0.012em] leading-[1.1] mb-2.5">
          {hotel.name}
        </h3>
        <p className="text-[15px] text-ink-soft leading-[1.55] mb-4 max-w-[38ch]">
          {hotel.description}
        </p>
        <span className="inline-block font-mono text-[12px] tracking-[0.16em] uppercase border-b border-ochre pb-0.5 transition-colors duration-200 group-hover:text-ochre">
          Enquire via WhatsApp{" "}
          <em className="not-italic inline-block transition-transform duration-300 group-hover:translate-x-1">
            →
          </em>
        </span>
      </div>
    </div>
  );
}
