import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
const { data, error } = await supabase.from('propiedades').update({
  tipo_propiedad: 'Casa',
  atributos_especificos: { habitaciones: 2, banos: 1 }
}).eq('id', 14);
console.log("DB Updated:", error || "Success");
