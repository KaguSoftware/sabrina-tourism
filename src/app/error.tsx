"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-screen bg-navy text-cream flex items-center justify-center px-6 py-24">
      <div className="max-w-xl text-center">
        <p className="text-ochre uppercase tracking-[0.3em] text-xs mb-4">
          Error
        </p>
        <h1 className="font-display text-5xl sm:text-6xl mb-6">
          Something went wrong
        </h1>
        <p className="text-cream/80 text-lg mb-10">
          A small detour on the journey. Please try again, or return home and we
          will get you back on track.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex items-center justify-center rounded-full bg-ochre px-6 py-3 text-ink font-medium hover:bg-ochre/90 transition-colors"
          >
            Try again
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-cream/30 px-6 py-3 text-cream hover:bg-cream/10 transition-colors"
          >
            Back home
          </Link>
        </div>
      </div>
    </main>
  );
}
