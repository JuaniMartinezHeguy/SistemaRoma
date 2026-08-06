import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://jeznwwmynpozkjruuzcr.supabase.co';
const SUPABASE_KEY = 'sb_publishable_Ppf8yVnmYIaAiDuMxKCe0Q_s6l3Gw4Y';

// Limpieza estricta de variables de entorno para evitar cabeceras HTTP inválidas en fetch/Headers
const getEnvVar = (val?: any) => {
  if (!val) return '';
  return String(val)
    .replace(/[\r\n\t]/g, '') // Elimina saltos de línea y tabulaciones
    .replace(/^["']|["']$/g, '') // Elimina comillas al inicio/final
    .replace(/[^\x20-\x7E]/g, '') // Elimina caracteres no imprimibles (fuera de ASCII válido para HTTP headers)
    .trim();
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