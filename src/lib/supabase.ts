import { createClient } from '@supabase/supabase-js';

const rawUrl = import.meta.env.VITE_SUPABASE_URL;
const rawKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  rawUrl &&
  rawKey &&
  !rawUrl.includes('PASTE_YOUR_') &&
  !rawKey.includes('PASTE_YOUR_') &&
  rawUrl.startsWith('http')
);

// Fallback to dummy endpoint if unconfigured to prevent createClient throwing on startup
const effectiveUrl = isSupabaseConfigured ? rawUrl : 'https://placeholder-project.supabase.co';
const effectiveKey = isSupabaseConfigured ? rawKey : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.placeholder';

export const supabase = createClient(effectiveUrl, effectiveKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});
