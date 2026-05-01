import { createServerClient as _createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import type { Database } from './types';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url) throw new Error('Missing env: NEXT_PUBLIC_SUPABASE_URL');
if (!anonKey) throw new Error('Missing env: NEXT_PUBLIC_SUPABASE_ANON_KEY');

export async function createServerClient() {
  const cookieStore = await cookies();

  return _createServerClient<Database>(url!, anonKey!, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        for (const { name, value, options } of cookiesToSet) {
          cookieStore.set(name, value, options);
        }
      },
    },
  });
}

export function createServiceClient() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) throw new Error('Missing env: SUPABASE_SERVICE_ROLE_KEY');

  return createClient<Database>(url!, serviceKey, {
    auth: { persistSession: false },
  });
}
