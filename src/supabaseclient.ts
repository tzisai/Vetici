import { createClient } from '@supabase/supabase-js'

// Usamos variables de entorno para mayor seguridad
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase URL or Anon Key are missing. Make sure to set them in your .env file and restart the server.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
