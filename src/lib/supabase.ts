import { createClient } from '@supabase/supabase-js';

const clean = (val?: any): string => {
  if (!val) return '';
  return String(val).trim().replace(/^["']|["']$/g, '').trim();
};

// Compatible tanto con Vite (VITE_) como con Next.js (NEXT_PUBLIC_)
const urlFromEnv = clean(import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL);
const keyFromEnv = clean(
  import.meta.env.VITE_SUPABASE_ANON_KEY || 
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 
  import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 
  import.meta.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
);

const supabaseUrl = (urlFromEnv.startsWith('http://') || urlFromEnv.startsWith('https://'))
  ? urlFromEnv
  : 'https://jeznwwmynpozkjruuzcr.supabase.co';

const supabaseKey = (keyFromEnv.length > 5)
  ? keyFromEnv
  : 'sb_publishable_Ppf8yVnmYIaAiDuMxKCe0Q_s6l3Gw4Y';

export const supabase = createClient(supabaseUrl, supabaseKey);