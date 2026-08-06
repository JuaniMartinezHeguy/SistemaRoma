import { createClient } from '@supabase/supabase-js';

const rawUrl = import.meta.env.VITE_SUPABASE_URL;
const rawKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabaseUrl = (typeof rawUrl === 'string' && rawUrl.trim()) ? rawUrl.trim() : 'https://jeznwwmynpozkjruuzcr.supabase.co';
const supabaseKey = (typeof rawKey === 'string' && rawKey.trim()) ? rawKey.trim() : 'sb_publishable_Ppf8yVnmYIaAiDuMxKCe0Q_s6l3Gw4Y';

export const supabase = createClient(supabaseUrl, supabaseKey);