import { createBrowserClient as _createBrowserClient } from '@supabase/ssr';
import type { Database } from './types';

export function createBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url) throw new Error('Missing env: NEXT_PUBLIC_SUPABASE_URL');
  if (!anonKey) throw new Error('Missing env: NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY');
  return _createBrowserClient<Database>(url, anonKey);
}
