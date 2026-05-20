"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error("admin error:", error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-6 py-20">
      <div className="max-w-md text-center">
        <p className="text-ochre uppercase tracking-[0.24em] text-[11px] mb-3 font-mono">
          Admin error
        </p>
        <h1 className="font-display text-3xl mb-4">Something went wrong</h1>
        <p className="text-ink-soft mb-2">
          The admin panel hit an unexpected error.
        </p>
        {error.digest && (
          <p className="font-mono text-[11px] text-muted mb-6">
            Ref: {error.digest}
          </p>
        )}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex items-center justify-center bg-navy text-ochre px-6 py-3 font-mono text-[12px] tracking-[0.16em] uppercase font-semibold"
          >
            Try again
          </button>
          <Link
            href="/admin"
            className="inline-flex items-center justify-center border border-rule px-6 py-3 font-mono text-[12px] tracking-[0.16em] uppercase text-ink"
          >
            Back to dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
