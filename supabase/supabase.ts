import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { Database } from '../types'


export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
export const supabaseAnonKey = import.meta.env.VITE_SUPABASE_API;
console.log("Supabase URL:", import.meta.env.VITE_SUPABASE_URL);
console.log("Supabase URL:", import.meta.env.VITE_SUPABASE_API);
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);