import { createAnonClient } from '@/lib/supabase/server';
import type { TransportAirportRow, TransportVehicleRow } from '@/lib/supabase/types';

export async function getAirports(): Promise<TransportAirportRow[]> {
  const supabase = createAnonClient();

  const { data, error } = await supabase
    .from('transport_airports')
    .select('*')
    .order('sort_order');

  if (error) {
    console.error('[db/transport] getAirports error:', error);
    return [];
  }

  return data ?? [];
}

export async function getVehicles(): Promise<TransportVehicleRow[]> {
  const supabase = createAnonClient();

  const { data, error } = await supabase
    .from('transport_vehicles')
    .select('*')
    .order('sort_order');

  if (error) {
    console.error('[db/transport] getVehicles error:', error);
    return [];
  }

  return data ?? [];
}
