"use client";
import { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { REGIONS, REGION_SLUGS } from "@/lib/packages/constants";
import { HOTELS } from "@/lib/regions/hotels";

interface NavHotelProps {
  currentPath: string;
}

export function NavHotel({ currentPath }: NavHotelProps) {
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

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <span
        className={`relative text-[13px] tracking-[0.14em] uppercase font-medium py-1.5 transition-colors duration-300 cursor-pointer select-none after:absolute after:left-0 after:right-0 after:bottom-0 after:h-px after:bg-ochre after:scale-x-0 after:origin-left after:transition-transform after:duration-300 hover:after:scale-x-100 text-black ${isActive || open ? "after:scale-x-100" : ""}`}
        role="button"
        aria-haspopup="true"
        aria-expanded={open}
      >
        Hotels
      </span>

      {open && (
        <div
          className="absolute top-full right-0 mt-3 bg-cream border border-rule shadow-[0_12px_48px_-8px_rgba(11,26,46,0.22)] z-50 w-170"
          role="menu"
        >
          {/* pointer bridge */}
          <div className="absolute -top-3 left-0 right-0 h-3" />

          <div className="grid grid-cols-3 divide-x divide-rule">
            {REGIONS.map((region) => {
              const hotelList = HOTELS[region];
              const first = hotelList[0];
              const remaining = hotelList.length - 1;

              return (
                <Link
                  key={region}
                  href={`/regions/${REGION_SLUGS[region]}`}
                  className="group flex flex-col gap-3 p-4 hover:bg-ochre/5 transition-colors duration-150"
                  role="menuitem"
                >
                  {/* Region label */}
                  <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted group-hover:text-ochre transition-colors duration-150">
                    {region}
                  </p>

                  {/* First hotel preview */}
                  <div className="flex items-center gap-3">
                    {/* Photo thumbnail */}
                    <div className="relative w-18 h-13 shrink-0 overflow-hidden border border-rule">
                      <Image
                        src={first.images[0]}
                        alt={first.name}
                        fill
                        className="object-cover"
                        sizes="72px"
                      />
                    </div>

                    {/* Hotel name + remaining count */}
                    <div className="min-w-0">
                      <p className="font-display font-normal text-[13px] leading-[1.2] tracking-tight text-ink group-hover:text-ochre transition-colors duration-150 truncate">
                        {first.name}
                      </p>
                      {remaining > 0 && (
                        <p className="font-mono text-[10px] tracking-[0.12em] uppercase text-muted mt-1">
                          & {remaining} other {remaining === 1 ? "hotel" : "hotels"}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Footer bar */}
          <div className="border-t border-rule px-4 py-2.5">
            <p className="font-mono text-[10px] tracking-[0.16em] uppercase text-muted">
              {REGIONS.reduce((sum, r) => sum + HOTELS[r].length, 0)} partnered properties across Türkiye
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
