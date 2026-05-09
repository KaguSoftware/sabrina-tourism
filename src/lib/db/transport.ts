import { unstable_cache } from 'next/cache';
import { createAnonClient } from '@/lib/supabase/server';
import { tags } from '@/lib/cache/tags';
import type { TransportAirportRow, TransportVehicleRow } from '@/lib/supabase/types';

const REVALIDATE_SECONDS = 60 * 60 * 24 * 30; // 30 days

async function _getAirports(): Promise<TransportAirportRow[]> {
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

async function _getVehicles(): Promise<TransportVehicleRow[]> {
  const supabase = createAnonClient();

  const { data, error } = await supabase
    .from('transport_vehicles')
    .select('*')
    .order('sort_order');

  if (error) {
    console.error('[db/transport] getVehicles error:', error);
    return [];
  }

  return (data ?? []) as TransportVehicleRow[];
}

export async function getAirports(): Promise<TransportAirportRow[]> {
  return unstable_cache(
    _getAirports,
    ['transport:airports'],
    { tags: [tags.transport.airports()], revalidate: REVALIDATE_SECONDS },
  )();
}

export async function getVehicles(): Promise<TransportVehicleRow[]> {
  return unstable_cache(
    _getVehicles,
    ['transport:vehicles'],
    { tags: [tags.transport.vehicles()], revalidate: REVALIDATE_SECONDS },
  )();
}
