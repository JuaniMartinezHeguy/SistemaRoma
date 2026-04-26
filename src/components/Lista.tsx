"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Pencil, Trash2, Star, MapPin, Ruler, Search, AlertCircle, PlusCircle, Home, X } from "lucide-react";

interface Propiedad {
  id: number; titulo: string; descripcion: string; precio: number;
  tipo_propiedad: string; operacion: string; ubicacion: string;
  dimensiones: string; imagen_url: string; destacada: boolean;
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
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Inventario</h1>
        
        {propiedades.length > 0 && (
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input type="text" placeholder="Buscar..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} className="pl-9 h-10 bg-white rounded-xl border-slate-200 focus-visible:ring-[#16a34a]" />
          </div>
        )}
      </div>

      {/* RENDERIZADO CONDICIONAL DE LA VISTA */}
      {propiedades.length === 0 ? (
        
        // VISTA 1: INVENTARIO VACÍO
        <div className="h-96 flex flex-col items-center justify-center bg-white rounded-[32px] border border-dashed border-slate-200 shadow-sm animate-in zoom-in-95 duration-500">
          <div className="h-20 w-20 bg-[#f0fdf4] rounded-full flex items-center justify-center mb-5">
            <Home className="h-10 w-10 text-[#16a34a]" />
          </div>
          <h3 className="font-bold text-slate-900 text-2xl mb-2 tracking-tight">Tu inventario está vacío</h3>
          <p className="text-slate-500 mb-8 text-center max-w-sm leading-relaxed">
            Aún no tenés propiedades cargadas en el sistema. Empezá a armar tu catálogo ahora.
          </p>
          <button 
            onClick={onAgregarNuevo}
            className="flex items-center gap-2 bg-[#16a34a] hover:bg-[#148e40] text-white font-bold py-3.5 px-8 rounded-2xl shadow-lg shadow-green-200 transition-all hover:-translate-y-1"
          >
            <PlusCircle className="h-5 w-5" />
            Agregar mi primer propiedad
          </button>
        </div>

      ) : propiedadesFiltradas.length === 0 ? (
        
        // VISTA 2: SIN RESULTADOS DE BÚSQUEDA
        <div className="h-64 flex flex-col items-center justify-center bg-white rounded-[32px] border border-dashed border-slate-200 shadow-sm animate-in fade-in duration-300">
          <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
            <Search className="h-8 w-8 text-slate-400" />
          </div>
          <h3 className="font-bold text-slate-900 text-xl mb-1">Sin resultados</h3>
          <p className="text-slate-500 text-sm">No encontramos propiedades con esa búsqueda.</p>
        </div>

      ) : (
        
        // VISTA 3: TABLA DE PROPIEDADES
        <div className="bg-white border border-slate-100 rounded-[28px] shadow-sm overflow-hidden animate-in fade-in duration-300">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-400 uppercase tracking-wider bg-white">
                <tr className="border-b border-slate-100">
                  <th className="px-6 py-5 font-bold">Inmueble</th>
                  <th className="px-6 py-5 font-bold">Ubicación</th>
                  <th className="px-6 py-5 font-bold">Precio</th>
                  <th className="px-6 py-5 font-bold">Estado</th>
                  <th className="px-6 py-5 font-bold text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {propiedadesFiltradas.map(prop => (
                  <tr 
                    key={prop.id} 
                    onClick={() => setPropiedadSeleccionada(prop)}
                    className="hover:bg-slate-50/50 transition-colors group cursor-pointer"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="h-14 w-14 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                          <img src={prop.imagen_url} alt={prop.titulo} className="h-full w-full object-cover" />
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 line-clamp-1 text-base">{prop.titulo}</div>
                          <div className="text-[11px] text-[#16a34a] font-black uppercase tracking-widest mt-0.5">{prop.tipo_propiedad}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-500 font-medium">{prop.ubicacion}</td>
                    <td className="px-6 py-4 font-black text-slate-900 text-base">USD {prop.precio.toLocaleString("es-AR")}</td>
                    <td className="px-6 py-4">
                      <span className="bg-[#f0fdf4] text-[#16a34a] py-1.5 px-3 rounded-lg text-[10px] font-black uppercase tracking-widest border border-green-200/50">
                        {prop.operacion}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button 
                          onClick={(e) => { e.stopPropagation(); onEditar(prop); }} 
                          className="p-2 text-slate-300 hover:text-[#16a34a] hover:bg-[#dcfce7] rounded-lg transition-all"
                        >
                          <Pencil size={18} />
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); setPropiedadABorrar(prop.id); }} 
                          className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200" onClick={() => setPropiedadSeleccionada(null)}>
          
          <div 
            className="bg-white rounded-[28px] overflow-hidden shadow-2xl w-full max-w-[380px] relative animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* BOTONES FLOTANTES SUPERIORES */}
            <button 
              onClick={() => setPropiedadSeleccionada(null)}
              className="absolute top-4 left-4 z-20 p-2 bg-white/90 backdrop-blur-md rounded-full shadow-lg text-slate-500 hover:text-slate-900 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="absolute top-4 right-4 z-20 p-2 bg-white/90 backdrop-blur-md rounded-full shadow-lg text-slate-300">
              <Star className={`h-5 w-5 ${propiedadSeleccionada.destacada ? 'fill-amber-400 text-amber-400' : ''}`} />
            </div>

            {/* IMAGEN DE ALTURA FIJA PARA NO ESTIRARSE */}
            <div className="relative h-56 w-full overflow-hidden shrink-0">
              <img src={propiedadSeleccionada.imagen_url} alt={propiedadSeleccionada.titulo} className="w-full h-full object-cover" />
              <div className="absolute bottom-4 left-4">
                <Badge className="bg-[#16a34a] text-white font-black rounded-lg px-3 py-1 text-[10px] uppercase tracking-wider shadow-lg">
                  {propiedadSeleccionada.operacion}
                </Badge>
              </div>
            </div>

            {/* DETALLES DE LA TARJETA */}
            <div className="p-6 space-y-2 overflow-y-auto">
              <p className="text-[#16a34a] text-[10px] font-black uppercase tracking-[0.2em]">
                {propiedadSeleccionada.tipo_propiedad}
              </p>
              <h3 className="text-slate-900 text-2xl font-black tracking-tight leading-tight line-clamp-2">
                {propiedadSeleccionada.titulo}
              </h3>
              
              <div className="flex items-center gap-5 text-slate-500 text-xs font-bold uppercase pt-2">
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-slate-300" /> {propiedadSeleccionada.ubicacion}
                </div>
                <div className="flex items-center gap-1.5">
                  <Ruler className="h-4 w-4 text-slate-300" /> {propiedadSeleccionada.dimensiones}
                </div>
              </div>

              <div className="pt-5 border-t border-slate-100 mt-5 flex items-center justify-between">
                <p className="text-slate-900 text-2xl font-black tracking-tight">
                  USD {propiedadSeleccionada.precio.toLocaleString("es-AR")}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ALERT DE CONFIRMACIÓN PARA BORRAR */}
      {propiedadABorrar !== null && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-[28px] p-8 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="h-14 w-14 bg-red-50 rounded-2xl flex items-center justify-center">
                <AlertCircle className="h-7 w-7 text-red-500" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">¿Eliminar propiedad?</h3>
                <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                  Esta acción no se puede deshacer. El inmueble desaparecerá permanentemente de tu inventario.
                </p>
              </div>
              <div className="flex gap-3 w-full mt-4">
                <button 
                  className="flex-1 rounded-xl h-12 border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors"
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