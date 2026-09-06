import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { separarUbicacionesPorProvincia, esCiudadRioNegro } from '@/lib/filtrosHelper';

interface OpcionesFiltros {
  tipos: string[];
  ubicaciones: string[];
  ubicacionesBuenosAires: string[];
  ubicacionesRioNegro: string[];
  provincias: string[];
  operaciones: string[];
  habitaciones: number[];
  tiposCampo: string[];
  loading: boolean;
}

export default function useOpcionesFiltros(): OpcionesFiltros {
  const [opciones, setOpciones] = useState<OpcionesFiltros>({
    tipos: [],
    ubicaciones: [],
    ubicacionesBuenosAires: [],
    ubicacionesRioNegro: [],
    provincias: ['Buenos Aires', 'Río Negro'],
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

      const raw = data.opciones || {};
      const separated = separarUbicacionesPorProvincia(
        raw.ubicaciones || [],
        raw.ubicacionesBuenosAires || raw.ubicaciones_buenos_aires || [],
        raw.ubicacionesRioNegro || raw.ubicaciones_rio_negro || []
      );

      const bsAs = [...separated.buenosAires];
      const rNegro = [...separated.rioNegro];

      // Incluir también ciudades de propiedades existentes que no hayan sido agregadas manualmente
      try {
        const { data: propsData } = await supabase
          .from('propiedades')
          .select('ubicacion, provincia')
          .not('ubicacion', 'is', null);

        if (propsData) {
          propsData.forEach((p: any) => {
            if (!p.ubicacion || !p.ubicacion.trim()) return;
            const u = p.ubicacion.trim();
            const esRN = (p.provincia?.toLowerCase().includes('rio') || p.provincia?.toLowerCase().includes('río')) || esCiudadRioNegro(u);
            
            if (esRN) {
              if (!rNegro.some(x => x.toLowerCase() === u.toLowerCase())) {
                rNegro.push(u);
              }
              // Quitar de Buenos Aires si por error estaba ahí
              const idxBA = bsAs.findIndex(x => x.toLowerCase() === u.toLowerCase());
              if (idxBA !== -1) {
                bsAs.splice(idxBA, 1);
              }
            } else {
              if (!bsAs.some(x => x.toLowerCase() === u.toLowerCase())) {
                bsAs.push(u);
              }
            }
          });
        }
      } catch (err) {
        console.warn('Error obteniendo ubicaciones de propiedades:', err);
      }

      const allUbicaciones = Array.from(new Set([...bsAs, ...rNegro]));

      const provs: string[] = [];
      if (bsAs.length > 0) provs.push('Buenos Aires');
      if (rNegro.length > 0) provs.push('Río Negro');
      if (provs.length === 0) provs.push('Buenos Aires', 'Río Negro');

      setOpciones({
        tipos: raw.tipos || [],
        ubicaciones: allUbicaciones,
        ubicacionesBuenosAires: bsAs,
        ubicacionesRioNegro: rNegro,
        provincias: provs,
        operaciones: raw.operaciones || [],
        habitaciones: raw.habitaciones || [],
        tiposCampo: raw.tiposCampo || [],
        loading: false,
      });
    };

    fetchOpciones();
  }, []);

  return opciones;
}
