import { supabase } from '@/lib/supabase';

/**
 * Palabras clave y nombres conocidos para identificar si una ciudad pertenece a Río Negro.
 */
const NOMBRES_RIO_NEGRO = [
  'viedma',
  'las grutas',
  'grutas',
  'san antonio oeste',
  'san antonio este',
  'sao',
  'general conesa',
  'conesa',
  'guardia mitre',
  'san javier',
  'cubanea',
  'bariloche',
  'san carlos de bariloche',
  'general roca',
  'roca',
  'cipolletti',
  'el bolson',
  'el bolsón',
  'choele choel',
  'cinco saltos',
  'allen',
  'villa regina',
  'catriel',
  'valcheta',
  'sierra grande',
  'playas doradas',
  'dina huapi',
];

/**
 * Determina si una ciudad pertenece a Río Negro por su nombre o coincidencias conocidas.
 */
export function esCiudadRioNegro(ciudad: string): boolean {
  if (!ciudad) return false;
  const c = ciudad.trim().toLowerCase();
  return NOMBRES_RIO_NEGRO.some(rn => c === rn || c.includes(rn));
}

/**
 * Separa y organiza ÚNICAMENTE las ciudades existentes que el usuario tiene cargadas,
 * sin inventar ni agregar localidades por defecto que no estén en la base de datos.
 */
export function separarUbicacionesPorProvincia(
  ubicacionesTotales: string[] = [],
  guardadasBsAs: string[] = [],
  guardadasRN: string[] = []
): { buenosAires: string[]; rioNegro: string[] } {
  const rnSet = new Set<string>();
  const baSet = new Set<string>();

  // 1. Procesar ciudades guardadas en Río Negro
  guardadasRN.forEach(c => {
    if (c && c.trim()) rnSet.add(c.trim());
  });

  // 2. Procesar ciudades guardadas en Buenos Aires
  guardadasBsAs.forEach(c => {
    if (!c || !c.trim()) return;
    const cTrim = c.trim();
    if (esCiudadRioNegro(cTrim)) {
      rnSet.add(cTrim);
    } else {
      baSet.add(cTrim);
    }
  });

  // 3. Procesar lista global / legacy de ubicaciones existentes
  ubicacionesTotales.forEach(ciudad => {
    if (!ciudad || !ciudad.trim()) return;
    const cTrim = ciudad.trim();

    const inRN = Array.from(rnSet).some(r => r.toLowerCase() === cTrim.toLowerCase());
    const inBA = Array.from(baSet).some(b => b.toLowerCase() === cTrim.toLowerCase());

    if (esCiudadRioNegro(cTrim)) {
      if (!inRN) rnSet.add(cTrim);
      // Si estaba en Buenos Aires, removerla
      Array.from(baSet).forEach(b => {
        if (b.toLowerCase() === cTrim.toLowerCase()) baSet.delete(b);
      });
    } else {
      if (!inBA && !inRN) {
        baSet.add(cTrim);
      }
    }
  });

  return {
    buenosAires: Array.from(baSet),
    rioNegro: Array.from(rnSet),
  };
}

/**
 * Verifica si la ciudad de una propiedad ya está registrada en la configuración de filtros.
 * Si no está cargada, la agrega automáticamente al contenedor de la provincia correspondiente.
 */
export async function sincronizarCiudadEnFiltros(ciudad?: string, provincia?: string) {
  if (!ciudad || !ciudad.trim()) return;

  const ciudadLimpia = ciudad.trim();
  const esRN = (provincia?.toLowerCase().includes('rio') || provincia?.toLowerCase().includes('río')) || esCiudadRioNegro(ciudadLimpia);

  try {
    const { data, error } = await supabase
      .from('configuracion_filtros')
      .select('opciones')
      .eq('id', 1)
      .single();

    if (error || !data) {
      console.warn('No se pudo obtener la configuración de filtros para sincronizar ciudad:', error);
      return;
    }

    const opciones = data.opciones || {};
    const separated = separarUbicacionesPorProvincia(
      opciones.ubicaciones || [],
      opciones.ubicacionesBuenosAires || [],
      opciones.ubicacionesRioNegro || []
    );

    const bsAs = [...separated.buenosAires];
    const rNegro = [...separated.rioNegro];

    let huboCambios = false;

    if (esRN) {
      const existe = rNegro.some(c => c.trim().toLowerCase() === ciudadLimpia.toLowerCase());
      if (!existe) {
        rNegro.push(ciudadLimpia);
        huboCambios = true;
      }
      // Asegurarse de que no esté duplicada en Buenos Aires
      const idxBA = bsAs.findIndex(c => c.trim().toLowerCase() === ciudadLimpia.toLowerCase());
      if (idxBA !== -1) {
        bsAs.splice(idxBA, 1);
        huboCambios = true;
      }
    } else {
      const existe = bsAs.some(c => c.trim().toLowerCase() === ciudadLimpia.toLowerCase());
      if (!existe) {
        bsAs.push(ciudadLimpia);
        huboCambios = true;
      }
    }

    if (huboCambios) {
      const nuevoPayload = {
        ...opciones,
        ubicacionesBuenosAires: bsAs,
        ubicacionesRioNegro: rNegro,
        ubicaciones: Array.from(new Set([...bsAs, ...rNegro])),
      };

      const { error: updateError } = await supabase
        .from('configuracion_filtros')
        .update({ opciones: nuevoPayload })
        .eq('id', 1);

      if (updateError) {
        console.error('Error al actualizar configuración de filtros con la nueva ciudad:', updateError);
      }
    }
  } catch (err) {
    console.error('Error inesperado en sincronizarCiudadEnFiltros:', err);
  }
}
