import { HeroSkeleton } from "@/components/home/HeroPanorama/HeroSkeleton";

// Shown while a page streams in. A hero-shaped skeleton instead of a spinner
// with the word "Loading", so the first paint already looks like the page.
export default function Loading() {
  return (
    <>
      <HeroSkeleton />
      <div className="px-[clamp(20px,4vw,56px)] py-16" aria-hidden="true">
        <div className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-3 motion-safe:animate-pulse">
          {[0, 1, 2].map((i) => (
            <div key={i} className="aspect-[4/5] rounded bg-navy/8" />
          ))}
        </div>
      </div>
    </>
  );
}
