"use client";

import { toast } from "sonner";

/**
 * Opens a WhatsApp deep-link in a new tab. If popup blocking or any other
 * navigation failure happens, copies the URL to clipboard and toasts a
 * fallback message so the user can recover.
 */
export function openWhatsApp(href: string, fallbackLabel = "Link copied — open WhatsApp manually") {
  try {
    const win = window.open(href, "_blank", "noopener,noreferrer");
    if (win) return;
    // Popup blocked. Try clipboard, then toast.
    void navigator.clipboard?.writeText(href).catch(() => undefined);
    toast.info(fallbackLabel, {
      action: {
        label: "Open",
        onClick: () => {
          window.location.href = href;
        },
      },
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn("openWhatsApp failed:", e);
    toast.error("Could not open WhatsApp. Please try again or copy the link.");
  }
}
