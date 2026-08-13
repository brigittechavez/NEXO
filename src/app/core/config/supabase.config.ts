import type { SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';

const PLACEHOLDERS = [
  'YOUR_SUPABASE_URL',
  'YOUR_SUPABASE_PUBLISHABLE_KEY',
  '',
];

/**
 * The browser-safe Supabase key.
 *
 * Supabase's current name for this is the **publishable key**
 * (`sb_publishable_…`); older projects call it the anon key. Only this key
 * belongs in frontend code — it grants exactly what Row Level Security allows.
 * Secret and service-role keys must never reach the client.
 */
function getPublishableKey(): string {
  return environment.supabase.publishableKey?.trim() ?? '';
}

/**
 * Whether real Supabase credentials are present.
 *
 * The project ships with placeholders so it can be cloned and run without any
 * backend. While they are in place NEXO uses its local demo adapter instead of
 * trying (and failing) to reach Supabase.
 */
export const isSupabaseConfigured = (): boolean => {
  const url = environment.supabase.url?.trim() ?? '';
  const key = getPublishableKey();

  return !PLACEHOLDERS.includes(url) && !PLACEHOLDERS.includes(key) && URL.canParse(url);
};

let client: SupabaseClient | null = null;

/**
 * The shared Supabase client, or `null` when the project is unconfigured.
 *
 * The SDK is imported dynamically for two reasons: `createClient` throws on an
 * invalid URL, so building it at module load would break the app for anyone
 * without credentials; and a static import pulls ~200 kB of SDK into the initial
 * bundle through the auth guard, even in demo mode where it is never used.
 */
export async function getSupabaseClient(): Promise<SupabaseClient | null> {
  if (!isSupabaseConfigured()) return null;

  if (!client) {
    const { createClient } = await import('@supabase/supabase-js');

    client = createClient(environment.supabase.url, getPublishableKey(), {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  }

  return client;
}
