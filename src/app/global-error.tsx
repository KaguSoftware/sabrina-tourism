"use client";

import { useEffect } from "react";

// This boundary catches errors that escape the root layout itself — it must
// render its own <html>/<body>. Keep dependencies minimal: no client hooks
// from app providers (NextIntl, Currency) since those may have crashed.
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surface to observability (Sentry/etc.); also useful in dev.
    // eslint-disable-next-line no-console
    console.error("global-error boundary:", error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0b1a2e",
          color: "#f5ede0",
          fontFamily: "system-ui, sans-serif",
          padding: "24px",
        }}
      >
        <div style={{ maxWidth: 560, textAlign: "center" }}>
          <p
            style={{
              color: "#c99a3f",
              textTransform: "uppercase",
              letterSpacing: "0.3em",
              fontSize: 12,
              marginBottom: 16,
            }}
          >
            Critical error
          </p>
          <h1 style={{ fontSize: 40, lineHeight: 1.05, margin: "0 0 24px" }}>
            We could not load the page
          </h1>
          <p style={{ opacity: 0.8, lineHeight: 1.6, marginBottom: 32 }}>
            Please reload, or try again in a moment. Our team has been notified.
          </p>
          {error.digest && (
            <p
              style={{
                fontFamily: "ui-monospace, monospace",
                fontSize: 11,
                opacity: 0.5,
                marginBottom: 24,
              }}
            >
              Ref: {error.digest}
            </p>
          )}
          <button
            type="button"
            onClick={() => reset()}
            style={{
              background: "#c99a3f",
              color: "#0b1a2e",
              padding: "12px 28px",
              fontWeight: 600,
              border: "none",
              borderRadius: 9999,
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
