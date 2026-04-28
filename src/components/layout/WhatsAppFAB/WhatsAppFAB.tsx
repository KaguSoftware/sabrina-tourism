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
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M20.5 3.5A11 11 0 0 0 3.6 17.6L2 22l4.5-1.5A11 11 0 1 0 20.5 3.5zm-8.5 18a8.9 8.9 0 0 1-4.6-1.3l-.3-.2-2.7.9.9-2.6-.2-.3a8.9 8.9 0 1 1 6.9 3.5zm5-6.7c-.3-.1-1.6-.8-1.9-.9-.3-.1-.4-.1-.6.1l-.9 1c-.2.2-.3.2-.6.1a7.3 7.3 0 0 1-2.1-1.3 8 8 0 0 1-1.4-1.8c-.1-.3 0-.4.1-.5l.4-.5c.1-.1.2-.3.3-.5 0-.2 0-.3-.1-.5l-.8-2c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.4 3 3 0 0 0-.9 2.2c0 1.3.9 2.5 1 2.7.1.2 1.9 2.9 4.5 4 1.1.5 2 .8 2.7.9a3.3 3.3 0 0 0 1.5-.1c.4-.1 1.6-.7 1.8-1.3.2-.7.2-1.2.2-1.3-.1-.1-.3-.2-.6-.3z" />
      </svg>
    </a>
  );
}
