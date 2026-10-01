import Image from "next/image";

// Same box as HeroPanorama, so nothing jumps when the real hero streams in.
// The background image is the real one (server rendered, high priority) and the
// text blocks are pulsing placeholders: no "Loading" copy on screen.
export function HeroSkeleton() {
  return (
    <section
      role="status"
      aria-busy="true"
      aria-label="Loading"
      className="relative min-h-160 md:min-h-0 md:aspect-[1716/917] max-h-screen w-full flex items-start pt-32 md:pt-[clamp(100px,15vw,170px)] pb-16 px-[clamp(20px,4vw,56px)] overflow-hidden"
    >
      <div className="absolute inset-0 z-[-1] overflow-hidden">
        <Image
          src="/Istanbul_Alternative1.webp"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-center"
          priority
          fetchPriority="high"
          quality={85}
        />
        <div className="absolute inset-0 bg-cream/50" aria-hidden="true" />
      </div>

      <div className="relative z-5 w-full max-w-200" aria-hidden="true">
        <div className="motion-safe:animate-pulse space-y-5">
          <div className="h-[clamp(40px,6vw,84px)] w-4/5 rounded bg-navy/15" />
          <div className="h-[clamp(40px,6vw,84px)] w-3/5 rounded bg-ochre/30" />
          <div className="mt-6 h-4 w-full max-w-130 rounded bg-navy/10" />
          <div className="h-4 w-4/5 max-w-130 rounded bg-navy/10" />
          <div className="mt-8 flex gap-4">
            <div className="h-12 w-44 rounded bg-ochre/35" />
            <div className="h-12 w-44 rounded border border-navy/20" />
          </div>
        </div>
      </div>
    </section>
  );
}
