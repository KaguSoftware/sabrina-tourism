import Image from "next/image";

interface KenBurnsImageProps {
  src: string;
  alt: string;
}

// Pure-CSS Ken Burns — no framer-motion wrapper, so the LCP image paints
// without waiting for client JS hydration. Respects prefers-reduced-motion via
// the `motion-safe:` modifier (Tailwind's reduced-motion media query).
export function KenBurnsImage({ src, alt }: KenBurnsImageProps) {
  return (
    <div className="absolute inset-0 motion-safe:animate-[ken-burns_18s_ease-in-out_infinite_alternate] will-change-transform">
      <Image
        src={src}
        alt={alt}
        fill
        sizes="100vw"
        className="object-cover object-center"
        priority
        fetchPriority="high"
        quality={85}
      />
    </div>
  );
}
