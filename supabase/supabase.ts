import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { Database } from '../types'

// 🛑 Replace with your own Supabase project URL and anon key
// You can find these in your Supabase project settings -> API
export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
export const supabaseAnonKey = import.meta.env.VITE_SUPABASE_API;
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);