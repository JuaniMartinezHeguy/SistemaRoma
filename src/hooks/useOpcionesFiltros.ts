import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface OpcionesFiltros {
  tipos: string[];
  ubicaciones: string[];
  operaciones: string[];
  habitaciones: number[];
  tiposCampo: string[];
  loading: boolean;
}

export default function useOpcionesFiltros(): OpcionesFiltros {
  const [opciones, setOpciones] = useState<OpcionesFiltros>({
    tipos: [],
    ubicaciones: [],
    operaciones: [],
    habitaciones: [],
    tiposCampo: [],
    loading: true,
  });

  useEffect(() => {
    const fetchOpciones = async () => {
      const { data, error } = await supabase
        .from('configuracion_filtros')
        .select('opciones')
        .eq('id', 1)
        .single();

      if (error || !data) {
        console.error('Error fetching filter options from config:', error);
        setOpciones(prev => ({ ...prev, loading: false }));
        return;
      }

      setOpciones({
        tipos: data.opciones.tipos || [],
        ubicaciones: data.opciones.ubicaciones || [],
        operaciones: data.opciones.operaciones || [],
        habitaciones: data.opciones.habitaciones || [],
        tiposCampo: data.opciones.tiposCampo || [],
        loading: false,
      });
    };

    fetchOpciones();
  }, []);

  return opciones;
}
