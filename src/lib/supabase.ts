import { createClient } from '@supabase/supabase-js';

const clean = (val?: any): string => {
  if (!val) return '';
  const str = String(val).trim();
  return str.replace(/^["']|["']$/g, '').trim();
};

const urlFromEnv = clean(import.meta.env.VITE_SUPABASE_URL);
const keyFromEnv = clean(import.meta.env.VITE_SUPABASE_ANON_KEY);

const supabaseUrl = urlFromEnv || 'https://jeznwwmynpozkjruuzcr.supabase.co';
const supabaseKey = keyFromEnv || 'sb_publishable_Ppf8yVnmYIaAiDuMxKCe0Q_s6l3Gw4Y';

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  global: {
    headers: {
      'apikey': supabaseKey,
    },
  },
});