export const environment = {
  production: true,
  supabase: {
    url: 'YOUR_SUPABASE_URL',
    /**
     * Supabase publishable key (`sb_publishable_…`) — the current name for what
     * used to be the anon key. Safe to ship in the browser: it only grants what
     * Row Level Security allows. Never put a secret or service-role key here.
     */
    publishableKey: 'YOUR_SUPABASE_PUBLISHABLE_KEY',
  },
};
