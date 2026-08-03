"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Pencil, Trash2, Star, MapPin, Ruler, Search, AlertCircle, PlusCircle, Home, X } from "lucide-react";

interface Propiedad {
  id: number; titulo: string; descripcion: string; precio: number;
  tipo_propiedad: string; operacion: string; ubicacion: string;
  dimensiones: string; imagen_url?: string; imagenes?: string[]; media_urls?: string[]; destacada: boolean;
}

interface ListaProps {
  propiedades: Propiedad[];
  onEditar: (prop: Propiedad) => void;
  onBorrar: (id: number) => void;
  onAgregarNuevo: () => void;
}

export default function Lista({ propiedades, onEditar, onBorrar, onAgregarNuevo }: ListaProps) {
  const [busqueda, setBusqueda] = useState("");
  const [propiedadABorrar, setPropiedadABorrar] = useState<number | null>(null);
  const [propiedadSeleccionada, setPropiedadSeleccionada] = useState<Propiedad | null>(null);

  const propiedadesFiltradas = propiedades.filter((prop) => 
    prop.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
    prop.ubicacion.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* HEADER Y BUSCADOR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-white tracking-tight">Inventario</h1>
        
        {propiedades.length > 0 && (
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
            <Input type="text" placeholder="Buscar..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} className="pl-9 h-10 bg-black/20 text-white placeholder-white/30 rounded-xl border-white/10 focus-visible:ring-white/30" />
          </div>
        )}
      </div>

      {/* RENDERIZADO CONDICIONAL DE LA VISTA */}
      {propiedades.length === 0 ? (
        
        // VISTA 1: INVENTARIO VACÍO
        <div className="h-96 flex flex-col items-center justify-center bg-roma-leaf/30 rounded-[32px] border border-dashed border-white/20 shadow-sm animate-in zoom-in-95 duration-500 backdrop-blur-md">
          <div className="h-20 w-20 bg-white/10 rounded-full flex items-center justify-center mb-5">
            <Home className="h-10 w-10 text-white/80" />
          </div>
          <h3 className="font-bold text-white text-2xl mb-2 tracking-tight">Tu inventario está vacío</h3>
          <p className="text-white/60 mb-8 text-center max-w-sm leading-relaxed">
            Aún no tenés propiedades cargadas en el sistema. Empezá a armar tu catálogo ahora.
          </p>
          <button 
            onClick={onAgregarNuevo}
            className="flex items-center gap-2 bg-white hover:bg-white/90 text-roma-dark font-bold py-3.5 px-8 rounded-2xl shadow-lg transition-all hover:-translate-y-1"
          >
            <PlusCircle className="h-5 w-5" />
            Agregar mi primer propiedad
          </button>
        </div>

      ) : propiedadesFiltradas.length === 0 ? (
        
        // VISTA 2: SIN RESULTADOS DE BÚSQUEDA
        <div className="h-64 flex flex-col items-center justify-center bg-roma-leaf/30 rounded-[32px] border border-dashed border-white/20 shadow-sm animate-in fade-in duration-300 backdrop-blur-md">
          <div className="h-16 w-16 bg-white/10 rounded-full flex items-center justify-center mb-4">
            <Search className="h-8 w-8 text-white/50" />
          </div>
          <h3 className="font-bold text-white text-xl mb-1">Sin resultados</h3>
          <p className="text-white/60 text-sm">No encontramos propiedades con esa búsqueda.</p>
        </div>

      ) : (
        
        // VISTA 3: TABLA DE PROPIEDADES
        <div className="bg-roma-leaf/30 backdrop-blur-md border border-white/10 rounded-[28px] shadow-sm overflow-hidden animate-in fade-in duration-300">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-white/50 uppercase tracking-wider bg-black/20">
                <tr className="border-b border-white/10">
                  <th className="px-6 py-5 font-bold">Inmueble</th>
                  <th className="px-6 py-5 font-bold">Ubicación</th>
                  <th className="px-6 py-5 font-bold">Precio</th>
                  <th className="px-6 py-5 font-bold">Estado</th>
                  <th className="px-6 py-5 font-bold text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {propiedadesFiltradas.map(prop => (
                  <tr 
                    key={prop.id} 
                    onClick={() => setPropiedadSeleccionada(prop)}
                    className="hover:bg-white/5 transition-colors group cursor-pointer text-white"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="h-14 w-14 rounded-xl overflow-hidden bg-black/30 shrink-0 border border-white/10">
                          <img src={(prop.media_urls && prop.media_urls[0]) || prop.imagen_url} alt={prop.titulo} className="h-full w-full object-cover" />
                        </div>
                        <div>
                          <div className="font-bold text-white line-clamp-1 text-base">{prop.titulo}</div>
                          <div className="text-[11px] text-white/60 font-black uppercase tracking-widest mt-0.5">{prop.tipo_propiedad}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-white/70 font-medium">{prop.ubicacion}</td>
                    <td className="px-6 py-4 font-black text-white text-base">USD {prop.precio.toLocaleString("es-AR")}</td>
                    <td className="px-6 py-4">
                      <span className="bg-white/10 text-white py-1.5 px-3 rounded-lg text-[10px] font-black uppercase tracking-widest border border-white/20">
                        {prop.operacion}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button 
                          onClick={(e) => { e.stopPropagation(); onEditar(prop); }} 
                          className="p-2 text-white/30 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                        >
                          <Pencil size={18} />
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); setPropiedadABorrar(prop.id); }} 
                          className="p-2 text-white/30 hover:text-red-400 hover:bg-white/10 rounded-lg transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL: TARJETA DE PROPIEDAD EXPANDIDA (MÁS PEQUEÑA Y CENTRADA) */}
      {propiedadSeleccionada && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200" onClick={() => setPropiedadSeleccionada(null)}>
          
          <div 
            className="bg-roma-dark border border-white/10 rounded-[28px] overflow-hidden shadow-2xl w-full max-w-[380px] relative animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* BOTONES FLOTANTES SUPERIORES */}
            <button 
              onClick={() => setPropiedadSeleccionada(null)}
              className="absolute top-4 left-4 z-20 p-2 bg-black/50 backdrop-blur-md rounded-full shadow-lg text-white/70 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="absolute top-4 right-4 z-20 p-2 bg-black/50 backdrop-blur-md rounded-full shadow-lg text-white/30">
              <Star className={`h-5 w-5 ${propiedadSeleccionada.destacada ? 'fill-amber-400 text-amber-400' : ''}`} />
            </div>

            {/* IMAGEN DE ALTURA FIJA PARA NO ESTIRARSE */}
            <div className="relative h-56 w-full overflow-hidden shrink-0">
              <img src={(propiedadSeleccionada.media_urls && propiedadSeleccionada.media_urls[0]) || propiedadSeleccionada.imagen_url} alt={propiedadSeleccionada.titulo} className="w-full h-full object-cover" />
              <div className="absolute bottom-4 left-4">
                <Badge className="bg-white/20 backdrop-blur-md text-white font-black rounded-lg px-3 py-1 text-[10px] uppercase tracking-wider shadow-lg border border-white/10">
                  {propiedadSeleccionada.operacion}
                </Badge>
              </div>
            </div>

            {/* DETALLES DE LA TARJETA */}
            <div className="p-6 space-y-2 overflow-y-auto">
              <p className="text-white/60 text-[10px] font-black uppercase tracking-[0.2em]">
                {propiedadSeleccionada.tipo_propiedad}
              </p>
              <h3 className="text-white text-2xl font-black tracking-tight leading-tight line-clamp-2">
                {propiedadSeleccionada.titulo}
              </h3>
              
              <div className="flex items-center gap-5 text-white/50 text-xs font-bold uppercase pt-2">
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-white/40" /> {propiedadSeleccionada.ubicacion}
                </div>
                <div className="flex items-center gap-1.5">
                  <Ruler className="h-4 w-4 text-white/40" /> {propiedadSeleccionada.dimensiones}
                </div>
              </div>

              <div className="pt-5 border-t border-white/10 mt-5 flex items-center justify-between">
                <p className="text-white text-2xl font-black tracking-tight">
                  USD {propiedadSeleccionada.precio.toLocaleString("es-AR")}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ALERT DE CONFIRMACIÓN PARA BORRAR */}
      {propiedadABorrar !== null && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-roma-dark border border-white/10 rounded-[28px] p-8 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="h-14 w-14 bg-red-500/10 rounded-2xl flex items-center justify-center">
                <AlertCircle className="h-7 w-7 text-red-500" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">¿Eliminar propiedad?</h3>
                <p className="text-sm text-white/60 mt-2 leading-relaxed">
                  Esta acción no se puede deshacer. El inmueble desaparecerá permanentemente de tu inventario.
                </p>
              </div>
              <div className="flex gap-3 w-full mt-4">
                <button 
                  className="flex-1 rounded-xl h-12 border border-white/20 text-white font-bold hover:bg-white/10 transition-colors"
                  onClick={() => setPropiedadABorrar(null)}
                >
                  Cancelar
                </button>
                <button 
                  className="flex-1 rounded-xl h-12 bg-red-500 hover:bg-red-600 text-white font-bold shadow-lg shadow-red-500/20 transition-all"
                  onClick={() => {
                    onBorrar(propiedadABorrar);
                    setPropiedadABorrar(null);
                  }}
                >
                  Sí, eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}