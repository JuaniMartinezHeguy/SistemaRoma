import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Funnel, MapPin, WhatsappLogo } from "@phosphor-icons/react";

export default function Catalogo() {
  const [propiedades, setPropiedades] = useState<any[]>([]);
  const [filtroTipo, setFiltroTipo] = useState('Todos');
  const [filtroUbicacion, setFiltroUbicacion] = useState('Todas');

  useEffect(() => {
    const fetchPropiedades = async () => {
      let query = supabase.from('propiedades').select('*');
      
      if (filtroTipo !== 'Todos') query = query.eq('tipo_propiedad', filtroTipo);
      if (filtroUbicacion !== 'Todas') query = query.eq('ubicacion', filtroUbicacion);

      const { data } = await query;
      if (data) setPropiedades(data);
    };
    fetchPropiedades();
  }, [filtroTipo, filtroUbicacion]);

  return (
    <div className="bg-black min-h-screen pt-28 px-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">Catálogo de Inmuebles</h1>

        {/* BARRA DE FILTROS */}
        <div className="glass-panel p-6 rounded-3xl mb-12 flex flex-wrap gap-6 items-center border border-white/10">
          <div className="flex items-center gap-2 text-gray-400"><Funnel /> Filtros:</div>
          
          <select onChange={(e) => setFiltroTipo(e.target.value)} className="bg-white/5 border border-white/10 text-white p-2 rounded-xl outline-none focus:border-primary">
            <option value="Todos">Todos los tipos</option>
            <option value="Casa">Casas</option>
            <option value="Campo">Campos</option>
            <option value="Lote">Lotes</option>
          </select>

          <select onChange={(e) => setFiltroUbicacion(e.target.value)} className="bg-white/5 border border-white/10 text-white p-2 rounded-xl outline-none focus:border-primary">
            <option value="Todas">Todas las ubicaciones</option>
            <option value="Villalonga">Villalonga</option>
            <option value="Pedro Luro">Pedro Luro</option>
            <option value="Stroeder">Stroeder</option>
            <option value="San Blas">San Blas</option>
          </select>
        </div>

        {/* GRILLA DE RESULTADOS */}
        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6 pb-20">
          {propiedades.length > 0 ? propiedades.map((item) => (
            <div key={item.id} className="glass-panel rounded-2xl overflow-hidden border border-white/5 hover:border-primary/50 transition">
              <img src={item.imagen_url} className="h-40 w-full object-cover" />
              <div className="p-4">
                <div className="flex items-center gap-1 text-primary text-[10px] font-bold mb-1">
                  <MapPin size={12}/> {item.ubicacion}
                </div>
                <h4 className="text-white font-bold text-sm mb-3 line-clamp-1">{item.titulo}</h4>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-white">USD {item.precio.toLocaleString()}</span>
                  <a href={`https://wa.me/5492920123456?text=Hola, quiero más info de: ${item.titulo}`} target="_blank" className="bg-primary/20 p-2 rounded-full text-primary hover:bg-primary hover:text-black transition">
                    <WhatsappLogo size={20} />
                  </a>
                </div>
              </div>
            </div>
          )) : (
            <p className="text-gray-500 col-span-full text-center py-20">No se encontraron propiedades con esos filtros.</p>
          )}
        </div>
      </div>
    </div>
  );
}