import { createClient } from '@supabase/supabase-js';

// Usamos las variables de entorno o valores por defecto para producción
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://jeznwwmynpozkjruuzcr.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_Ppf8yVnmYIaAiDuMxKCe0Q_s6l3Gw4Y';

export const supabase = createClient(supabaseUrl, supabaseKey);