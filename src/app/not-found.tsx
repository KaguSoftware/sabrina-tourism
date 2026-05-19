import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-navy text-cream flex items-center justify-center px-6 py-24">
      <div className="max-w-xl text-center">
        <p className="text-ochre uppercase tracking-[0.3em] text-xs mb-4">
          404
        </p>
        <h1 className="font-display text-5xl sm:text-6xl mb-6">
          Page not found
        </h1>
        <p className="text-cream/80 text-lg mb-10">
          The page you are looking for has wandered off the itinerary. Let us
          guide you back to familiar ground.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full bg-ochre px-6 py-3 text-ink font-medium hover:bg-ochre/90 transition-colors"
          >
            Back to home
          </Link>
          <Link
            href="/packages"
            className="inline-flex items-center justify-center rounded-full border border-cream/30 px-6 py-3 text-cream hover:bg-cream/10 transition-colors"
          >
            Browse tours
          </Link>
        </div>
      </div>
    </main>
  );
}
