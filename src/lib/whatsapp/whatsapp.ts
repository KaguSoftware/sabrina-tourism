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

export function genericMessage(): string {
  return waLink(
    "Hey Sabrina — I'd like to start a conversation about a trip to Türkiye."
  );
}

export function packageMessage(ctx: PackageMessageContext): string {
  return waLink(
    `Hey Sabrina — I'd like to reserve "${ctx.name}" at the ${ctx.tier} tier for ${ctx.count} guest(s), starting ${ctx.date}. Could you confirm availability?`
  );
}

export function transferMessage(ctx: TransferMessageContext): string {
  const direction =
    ctx.direction === "pickup" ? "pickup from" : "drop-off to";
  const extras = [
    ctx.flightNumber ? `Flight: ${ctx.flightNumber}` : "",
    ctx.luggage ? `Luggage: ${ctx.luggage} bag(s)` : "",
    ctx.childSeat ? "Child seat required" : "",
    ctx.meetAndGreet ? "Meet & greet requested" : "",
    ctx.notes ? `Note: ${ctx.notes}` : "",
  ].filter(Boolean).join(". ");
  return waLink(
    `Hey Sabrina — I'd like a ${direction} ${ctx.airport} on ${ctx.date} at ${ctx.time} for ${ctx.passengers} passenger(s), ${ctx.vehicleClass}. Area / Hotel: ${ctx.destination || "—"}.${extras ? ` ${extras}.` : ""} Could you quote?`
  );
}

export function chauffeurMessage(ctx: ChauffeurMessageContext): string {
  const dates = ctx.endDate
    ? `${ctx.startDate} to ${ctx.endDate}`
    : ctx.startDate;
  return waLink(
    `Hey Sabrina — I'd like a private chauffeur. Pickup: ${ctx.pickup}.${ctx.pickupTime ? ` Pickup time: ${ctx.pickupTime}.` : ""} Destinations: ${ctx.destinations}. Dates: ${dates}. Passengers: ${ctx.passengers}.${ctx.luggage ? ` Luggage: ${ctx.luggage} bag(s).` : ""} Vehicle: ${ctx.vehicleClass}.${ctx.notes ? ` Note: ${ctx.notes}` : ""} Could you quote?`
  );
}
