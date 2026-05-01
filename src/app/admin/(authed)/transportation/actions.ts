"use server";

import { revalidatePath } from "next/cache";
import { createServiceClient } from "@/lib/supabase/server";
import {
  transportHeroSchema,
  fleetSchema,
  type TransportHeroFormValues,
  type FleetFormValues,
} from "./schema";

export async function saveTransportHero(raw: TransportHeroFormValues): Promise<{ error?: string }> {
  const parsed = transportHeroSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Validation failed" };

  const supabase = createServiceClient();

  const { error } = await (supabase.from("site_content") as any)
    .upsert({ id: "transport_hero", data: parsed.data }, { onConflict: "id" });

  if (error) return { error: error.message };

  revalidatePath("/transportation");
  return {};
}

export async function saveFleet(raw: FleetFormValues): Promise<{ error?: string }> {
  const parsed = fleetSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Validation failed" };

  const { airports, vehicles } = parsed.data;
  const supabase = (createServiceClient()) as any;

  // ── Airports ─────────────────────────────────────────────────────────────
  // Fetch current IDs
  const { data: existingAirports } = await supabase
    .from("transport_airports")
    .select("id");

  const submittedAirportIds = new Set(airports.map((a) => a.id).filter(Boolean));
  const toDeleteAirports = (existingAirports ?? [])
    .map((r: any) => r.id)
    .filter((id: string) => !submittedAirportIds.has(id));

  if (toDeleteAirports.length > 0) {
    const { error } = await supabase
      .from("transport_airports")
      .delete()
      .in("id", toDeleteAirports);
    if (error) return { error: error.message };
  }

  for (const airport of airports) {
    const payload: any = {
      code: airport.code,
      label: airport.label,
      sort_order: airport.sort_order,
    };
    if (airport.id) {
      const { error } = await supabase
        .from("transport_airports")
        .update(payload)
        .eq("id", airport.id);
      if (error) return { error: error.message };
    } else {
      const { error } = await supabase
        .from("transport_airports")
        .insert(payload);
      if (error) return { error: error.message };
    }
  }

  // ── Vehicles ─────────────────────────────────────────────────────────────
  const { data: existingVehicles } = await supabase
    .from("transport_vehicles")
    .select("id");

  const submittedVehicleIds = new Set(vehicles.map((v) => v.id).filter(Boolean));
  const toDeleteVehicles = (existingVehicles ?? [])
    .map((r: any) => r.id)
    .filter((id: string) => !submittedVehicleIds.has(id));

  if (toDeleteVehicles.length > 0) {
    const { error } = await supabase
      .from("transport_vehicles")
      .delete()
      .in("id", toDeleteVehicles);
    if (error) return { error: error.message };
  }

  for (const vehicle of vehicles) {
    const payload: any = {
      vehicle_id: vehicle.vehicle_id,
      label: vehicle.label,
      capacity: vehicle.capacity,
      note: vehicle.note,
      from_price: vehicle.from_price,
      sort_order: vehicle.sort_order,
    };
    if (vehicle.id) {
      const { error } = await supabase
        .from("transport_vehicles")
        .update(payload)
        .eq("id", vehicle.id);
      if (error) return { error: error.message };
    } else {
      const { error } = await supabase
        .from("transport_vehicles")
        .insert(payload);
      if (error) return { error: error.message };
    }
  }

  revalidatePath("/transportation");
  return {};
}
