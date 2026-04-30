import { FAB_LABEL } from "./constants";
import { genericMessage } from "@/lib/whatsapp/whatsapp";

export function WhatsAppFAB() {
  return (
    <a
      href={genericMessage()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={FAB_LABEL}
      className="fixed bottom-6 right-6 z-40 bg-ochre text-navy w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:bg-gold transition-colors duration-300 md:hidden"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/logo-whatsapp.svg" alt="" aria-hidden="true" width="24" height="24" style={{ filter: "brightness(0) saturate(100%) invert(12%) sepia(30%) saturate(900%) hue-rotate(162deg) brightness(90%)" }} />
    </a>
  );
}
