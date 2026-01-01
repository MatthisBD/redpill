import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not found. Using mock data.');
}

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export interface Coordinate {
  id: string;
  name: string;
  x: number;
  y: number;
  z: number;
  category: 'biome' | 'base' | 'resource';
  type: string;
  description?: string;
  added_by: string;
  created_at: string;
}
