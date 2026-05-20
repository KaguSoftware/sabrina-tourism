"use client";
import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { usePathname } from "next/navigation";
import { m, AnimatePresence } from "framer-motion";
import { genericMessage } from "@/lib/whatsapp/whatsapp";

export function WhatsAppFAB() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const [bodyLocked, setBodyLocked] = useState(false);

  // Hide on routes that have their own sticky CTA at the bottom to prevent
  // FAB-overlapping-primary-CTA collisions reported in the mobile audit.
  const suppressedByRoute =
    /\/packages\/[^/]+$/.test(pathname) ||
    /\/tours\/(premade|daily)\/[^/]+$/.test(pathname) ||
    /\/regions\/[^/]+\/[^/]+$/.test(pathname);

  useEffect(() => {
    if (typeof document === "undefined") return;

    const checkLocked = () => {
      setBodyLocked(document.body.style.overflow === "hidden");
    };

    checkLocked();

    const observer = new MutationObserver(checkLocked);
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["style"],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <AnimatePresence>
      {!bodyLocked && !suppressedByRoute && (
        <m.a
          href={genericMessage(locale)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t("whatsapp")}
          initial={{ opacity: 0, scale: 0.6, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 12 }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          transition={{ type: "spring", stiffness: 320, damping: 22 }}
          className="fixed bottom-6 right-6 z-40 bg-ochre text-navy w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:bg-gold md:hidden"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo-whatsapp.svg"
            alt=""
            aria-hidden="true"
            width="24"
            height="24"
            style={{
              filter:
                "brightness(0) saturate(100%) invert(12%) sepia(30%) saturate(900%) hue-rotate(162deg) brightness(90%)",
            }}
          />
        </m.a>
      )}
    </AnimatePresence>
  );
}
