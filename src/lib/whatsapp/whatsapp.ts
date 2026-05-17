import { WA_BASE, WA_PHONE } from "./constants";
import type {
  PackageMessageContext,
  TransferMessageContext,
  ChauffeurMessageContext,
} from "./types";

function waLink(message: string): string {
  const num = WA_PHONE.replace(/[^\d+]/g, "");
  return `${WA_BASE}${encodeURIComponent(num)}?text=${encodeURIComponent(message)}`;
}

const GENERIC_MESSAGES: Record<string, string> = {
  en: "Hey Sabrina — I'd like to start a conversation about a trip to Türkiye.",
  tr: "Merhaba Sabrina — Türkiye'ye bir seyahat hakkında konuşmak istiyorum.",
  ar: "مرحباً سابرينا — أود البدء في الحديث عن رحلة إلى تركيا.",
  es: "Hola Sabrina — Me gustaría empezar una conversación sobre un viaje a Türkiye.",
  it: "Ciao Sabrina — Vorrei iniziare una conversazione su un viaggio in Türkiye.",
  fr: "Bonjour Sabrina — J'aimerais commencer une conversation sur un voyage en Türkiye.",
  de: "Hallo Sabrina — Ich möchte gerne über eine Reise in die Türkiye sprechen.",
  ru: "Привет, Сабрина — я хотел бы поговорить о поездке в Турцию.",
  zh: "你好，Sabrina — 我想聊聊去土耳其旅行的事情。",
  ja: "こんにちは、Sabrina — トルコへの旅行についてご相談したいです。",
};

export function genericMessage(locale = "en"): string {
  const msg = GENERIC_MESSAGES[locale] ?? GENERIC_MESSAGES.en;
  return waLink(msg);
}

export function packageMessage(ctx: PackageMessageContext): string {
  const childrenSuffix =
    ctx.childrenAges && ctx.childrenAges.length > 0
      ? `, with ${ctx.childrenAges.length} child(ren) (ages ${ctx.childrenAges.join(", ")})`
      : "";
  const singleRoomSuffix = ctx.singleRoom ? ", single-room occupancy" : "";
  return waLink(
    `Hey Sabrina — I'd like to reserve "${ctx.name}" at the ${ctx.tier} tier for ${ctx.count} guest(s)${childrenSuffix}${singleRoomSuffix}, starting ${ctx.date}. Could you confirm availability?`
  );
}

export function transferMessage(ctx: TransferMessageContext): string {
  const extras = [
    ctx.luggage ? `Luggage: ${ctx.luggage} bag(s)` : "",
    ctx.childSeat ? "Child seat required" : "",
    ctx.meetAndGreet ? "Meet & greet requested" : "",
    ctx.guideNeeded
      ? `Travel guide: ${ctx.guideType ?? "assistant"} in ${ctx.guideLanguage ?? "English"}`
      : "",
    ctx.notes ? `Note: ${ctx.notes}` : "",
  ].filter(Boolean).join(". ");

  if (ctx.direction === "both") {
    const pickupLine = `Pick-up from ${ctx.airport} on ${ctx.date} at ${ctx.time}${ctx.flightNumber ? ` (Flight: ${ctx.flightNumber})` : ""}.`;
    const dropoffLine = `Drop-off to ${ctx.airport} on ${ctx.returnDate || "—"} at ${ctx.returnTime || "—"}${ctx.returnFlightNumber ? ` (Flight: ${ctx.returnFlightNumber})` : ""}.`;
    return waLink(
      `Hey Sabrina — I'd like a both-ways airport transfer at ${ctx.airport} for ${ctx.passengers} passenger(s), ${ctx.vehicleClass}. Area / Hotel: ${ctx.destination || "—"}. ${pickupLine} ${dropoffLine}${extras ? ` ${extras}.` : ""} Could you quote?`
    );
  }

  const direction = ctx.direction === "pickup" ? "pickup from" : "drop-off to";
  const flightLine = ctx.flightNumber ? `Flight: ${ctx.flightNumber}` : "";
  const allExtras = [flightLine, extras].filter(Boolean).join(". ");
  return waLink(
    `Hey Sabrina — I'd like a ${direction} ${ctx.airport} on ${ctx.date} at ${ctx.time} for ${ctx.passengers} passenger(s), ${ctx.vehicleClass}. Area / Hotel: ${ctx.destination || "—"}.${allExtras ? ` ${allExtras}.` : ""} Could you quote?`
  );
}

export function chauffeurMessage(ctx: ChauffeurMessageContext): string {
  const dates = ctx.endDate
    ? `${ctx.startDate} to ${ctx.endDate}`
    : ctx.startDate;
  const guide = ctx.guideNeeded
    ? ` Travel guide: ${ctx.guideType ?? "assistant"} in ${ctx.guideLanguage ?? "English"}.`
    : "";
  return waLink(
    `Hey Sabrina — I'd like a private chauffeur. Pickup: ${ctx.pickup}.${ctx.pickupTime ? ` Pickup time: ${ctx.pickupTime}.` : ""} Destinations: ${ctx.destinations}. Dates: ${dates}. Passengers: ${ctx.passengers}.${ctx.luggage ? ` Luggage: ${ctx.luggage} bag(s).` : ""} Vehicle: ${ctx.vehicleClass}.${guide}${ctx.notes ? ` Note: ${ctx.notes}` : ""} Could you quote?`
  );
}
