import { z } from "zod";

export const transportHeroSchema = z.object({
  hero_heading_top: z.string().min(1, "Heading top is required"),
  hero_heading_em: z.string().min(1, "Heading em is required"),
  hero_sub: z.string().min(1, "Sub is required"),
  fleet_heading: z.string().min(1, "Fleet heading is required"),
  hero_image: z.string().nullable().optional(),
});

export type TransportHeroFormValues = z.infer<typeof transportHeroSchema>;

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
