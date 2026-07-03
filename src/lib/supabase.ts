import { createClient } from '@supabase/supabase-js';

// Access Supabase environment variables from import.meta.env
// Prefix with VITE_ to expose them to the client-side code
const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

if (!isSupabaseConfigured) {
  console.info(
    'Supabase environment variables are missing (VITE_SUPABASE_URL & VITE_SUPABASE_ANON_KEY). Using fallback local storage and seed data.'
  );
}

// Initialize the Supabase client
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
