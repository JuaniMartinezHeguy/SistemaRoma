import { createClient } from '@supabase/supabase-js';

// Limpieza estricta de variables de entorno para evitar cabeceras HTTP inválidas en fetch/Headers
const getEnvVar = (val?: any) => {
  if (!val) return '';
  return String(val)
    .replace(/[\r\n\t]/g, '') // Elimina saltos de línea y tabulaciones
    .replace(/^["']|["']$/g, '') // Elimina comillas al inicio/final
    .replace(/[^\x20-\x7E]/g, '') // Elimina caracteres no imprimibles (fuera de ASCII válido para HTTP headers)
    .trim();
};

const supabaseUrl = getEnvVar(import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL);
const supabaseKey = getEnvVar(
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  import.meta.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
);

if (!supabaseUrl || !supabaseKey) {
  console.warn('[Supabase] Variables de entorno VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY no configuradas.');
}

export const supabase = createClient(supabaseUrl || 'https://placeholder.supabase.co', supabaseKey || 'placeholder');