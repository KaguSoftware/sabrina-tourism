"use client";
import { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { REGIONS, REGION_SLUGS } from "@/lib/packages/constants";
import { HOTELS } from "@/lib/regions/hotels";

interface NavHotelProps {
  currentPath: string;
  transparent: boolean;
}

export function NavHotel({ currentPath, transparent }: NavHotelProps) {
  const locale = useLocale();
  const t = useTranslations("nav");
  const pfx = locale === "en" ? "" : `/${locale}`;
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleMouseEnter() {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpen(true);
  }

  function handleMouseLeave() {
    timeoutRef.current = setTimeout(() => setOpen(false), 120);
  }

  const isActive = currentPath.startsWith("/regions");
  const totalProperties = REGIONS.reduce((sum, r) => sum + HOTELS[r].length, 0);

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link
        href={`${pfx}/regions`}
        className={`relative text-[13px] tracking-[0.14em] uppercase font-medium py-1.5 transition-colors duration-300 select-none after:absolute after:left-0 after:right-0 after:bottom-0 after:h-px after:bg-ochre after:scale-x-0 after:origin-left after:transition-transform after:duration-300 hover:after:scale-x-100 ${
          transparent ? "text-cream" : "text-ink"
        } ${isActive || open ? "after:scale-x-100" : ""}`}
        aria-haspopup="true"
        aria-expanded={open}
      >
        {t("hotels")}
      </Link>

      <div
        data-open={open}
        className="absolute top-full right-0 mt-3 z-50 w-[840px] pointer-events-none opacity-0 -translate-y-1 transition-[opacity,transform] duration-200 ease-[cubic-bezier(0.22,0.61,0.36,1)] data-[open=true]:pointer-events-auto data-[open=true]:opacity-100 data-[open=true]:translate-y-0 motion-reduce:transition-none motion-reduce:translate-y-0"
        role="menu"
        aria-hidden={!open}
      >
        {/* hover bridge */}
        <div className="absolute -top-3 left-0 right-0 h-3" />

        <div className="relative bg-cream border border-rule shadow-[0_12px_48px_-8px_rgba(11,26,46,0.22)] overflow-hidden">
          {/* Header band */}
          <div className="relative flex items-start justify-between gap-6 px-7 pt-6 pb-5 border-b border-rule">
            <div>
              <div className="flex items-center gap-3">
                <span aria-hidden className="block h-px w-6 bg-ochre" />
                <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-muted">
                  {t("hotelsMenuKicker")}
                </p>
              </div>
              <p className="mt-2 font-display font-light text-[clamp(20px,1.6vw,24px)] text-navy leading-[1.15] tracking-tight">
                {t("hotelsMenuHeading")}
              </p>
            </div>
            <svg
              aria-hidden
              width="72"
              height="24"
              viewBox="0 0 72 24"
              className="hidden md:block shrink-0 mt-1.5 text-ochre/40"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
            >
              <path d="M0 18 L10 6 L20 18 L30 6 L40 18 L50 6 L60 18 L70 6" />
              <circle cx="68" cy="12" r="1.5" fill="currentColor" stroke="none" />
            </svg>
          </div>

          {/* Six region cards in a 3×2 grid */}
          <div className="grid grid-cols-3 divide-x divide-y divide-rule">
            {REGIONS.map((region) => {
              const hotelList = HOTELS[region];
              const first = hotelList[0];
              const remaining = hotelList.length - 1;

              return (
                <Link
                  key={region}
                  href={`${pfx}/regions/${REGION_SLUGS[region]}`}
                  className="group relative flex flex-col gap-3 p-5 hover:bg-ochre/5 transition-colors duration-300 ease-[cubic-bezier(0.22,0.61,0.36,1)]"
                  role="menuitem"
                >
                  <div className="relative w-full aspect-16/10 overflow-hidden border border-rule">
                    <Image
                      src={first.images[0]}
                      alt={first.name}
                      fill
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                      sizes="240px"
                    />
                  </div>

                  <div>
                    <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted group-hover:text-ochre transition-colors duration-300">
                      {region}
                    </p>
                    <p className="relative inline-block mt-1.5 font-display font-normal text-[15px] leading-[1.2] tracking-tight text-ink group-hover:text-ochre transition-colors duration-300 truncate after:absolute after:left-0 after:right-0 after:-bottom-0.5 after:h-px after:bg-ochre after:scale-x-0 after:origin-left after:transition-transform after:duration-300 group-hover:after:scale-x-100">
                      {first.name}
                    </p>
                    {remaining > 0 && (
                      <p className="mt-1 font-mono text-[10px] tracking-[0.12em] uppercase text-muted">
                        {remaining === 1
                          ? t("otherHotel", { count: remaining })
                          : t("otherHotels", { count: remaining })}
                      </p>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Footer band */}
          <div className="border-t border-rule px-7 py-3">
            <p className="font-mono text-[10px] tracking-[0.16em] uppercase text-muted">
              {t("partneredPropertiesAcrossTurkey", { count: totalProperties })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
