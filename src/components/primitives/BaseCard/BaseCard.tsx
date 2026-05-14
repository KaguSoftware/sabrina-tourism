import Link from "next/link";
import type { ReactNode } from "react";

interface BaseCardProps {
  href: string;
  image: ReactNode;
  children: ReactNode;
  ariaLabel?: string;
}

export function BaseCard({ href, image, children, ariaLabel }: BaseCardProps) {
  return (
    <Link
      href={href}
      aria-label={ariaLabel}
      className="group block bg-[#fcf5ec] border border-rule shadow-[4px_6px_0_-1px_#1b4d5c] sm:shadow-none transition-all duration-380 ease-out hover:transform-[perspective(1000px)_rotateY(-4deg)_rotateX(3deg)_translateY(-6px)] hover:[box-shadow:14px_20px_0_-2px_#1b4d5c] h-full"
    >
      <div className="flex h-full flex-col">
        <div className="relative aspect-[4/3.2] overflow-hidden bg-navy-soft">
          {image}
        </div>
        <div className="px-4 pt-5 pb-5 flex flex-col flex-1">{children}</div>
      </div>
    </Link>
  );
}
