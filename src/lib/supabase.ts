import { createClient } from '@supabase/supabase-js';

const clean = (val?: string) => {
  if (!val || typeof val !== 'string') return '';
  return val.trim().replace(/^["']|["']$/g, '');
};

const supabaseUrl = clean(import.meta.env.VITE_SUPABASE_URL) || 'https://jeznwwmynpozkjruuzcr.supabase.co';
const supabaseKey = clean(import.meta.env.VITE_SUPABASE_ANON_KEY) || 'sb_publishable_Ppf8yVnmYIaAiDuMxKCe0Q_s6l3Gw4Y';

export const supabase = createClient(supabaseUrl, supabaseKey);