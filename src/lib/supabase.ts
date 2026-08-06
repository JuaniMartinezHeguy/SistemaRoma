import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://jeznwwmynpozkjruuzcr.supabase.co';
const SUPABASE_KEY = 'sb_publishable_Ppf8yVnmYIaAiDuMxKCe0Q_s6l3Gw4Y';

// Si existen variables de entorno válidas, se usan; de lo contrario, usa la constante garantizada
const getEnvVar = (val?: any) => {
  if (!val) return '';
  return String(val).trim().replace(/^["']|["']$/g, '').trim();
};

const envUrl = getEnvVar(import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL);
const envKey = getEnvVar(
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  import.meta.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
);

const supabaseUrl = (envUrl.startsWith('http://') || envUrl.startsWith('https://')) ? envUrl : SUPABASE_URL;
const supabaseKey = (envKey.length > 5) ? envKey : SUPABASE_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);