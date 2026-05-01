"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createServerClient } from "@/lib/supabase/server";

// ---------------------------------------------------------------------------
// Hero
// ---------------------------------------------------------------------------

export const transportHeroSchema = z.object({
  hero_heading_top: z.string().min(1, "Heading top is required"),
  hero_heading_em: z.string().min(1, "Heading em is required"),
  hero_sub: z.string().min(1, "Sub is required"),
  fleet_heading: z.string().min(1, "Fleet heading is required"),
  hero_image: z.string().nullable().optional(),
});

export type TransportHeroFormValues = z.infer<typeof transportHeroSchema>;

export async function saveTransportHero(raw: TransportHeroFormValues): Promise<{ error?: string }> {
  const parsed = transportHeroSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Validation failed" };

  const supabase = await createServerClient();

  const { error } = await (supabase.from("site_content") as any)
    .upsert({ id: "transport_hero", data: parsed.data }, { onConflict: "id" });

  if (error) return { error: error.message };

  revalidatePath("/transportation");
  return {};
}

// ---------------------------------------------------------------------------
// Fleet & airports
// ---------------------------------------------------------------------------

export const airportRowSchema = z.object({
  id: z.string().optional(),
  code: z.string().min(1, "Code required").max(6).toUpperCase(),
  label: z.string().min(1, "Label required"),
  sort_order: z.number().int(),
});

export const vehicleRowSchema = z.object({
  id: z.string().optional(),
  vehicle_id: z.string().min(1, "Vehicle ID required"),
  label: z.string().min(1, "Label required"),
  capacity: z.string().min(1, "Capacity required"),
  note: z.string(),
  from_price: z.string().min(1, "Price required"),
  sort_order: z.number().int(),
});

export const fleetSchema = z.object({
  airports: z.array(airportRowSchema),
  vehicles: z.array(vehicleRowSchema),
});

export type FleetFormValues = z.infer<typeof fleetSchema>;

export async function saveFleet(raw: FleetFormValues): Promise<{ error?: string }> {
  const parsed = fleetSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Validation failed" };

  const { airports, vehicles } = parsed.data;
  const supabase = (await createServerClient()) as any;

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
