import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Plus, X, Save, SlidersHorizontal, Loader2, MapPin } from "lucide-react";
import { separarUbicacionesPorProvincia } from "@/lib/filtrosHelper";

export default function ConfigFiltros({ mostrarToast }: { mostrarToast: (msg: string, tipo?: "success" | "error") => void }) {
  const [config, setConfig] = useState({
    tipos: [] as string[],
    ubicacionesBuenosAires: [] as string[],
    ubicacionesRioNegro: [] as string[],
    operaciones: [] as string[],
    habitaciones: [] as number[],
    tiposCampo: [] as string[],
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [nuevosValores, setNuevosValores] = useState({
    tipos: "",
    ubicacionesBuenosAires: "",
    ubicacionesRioNegro: "",
    operaciones: "",
    habitaciones: "",
    tiposCampo: "",
  });

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("configuracion_filtros").select("opciones").eq("id", 1).single();
    if (!error && data) {
      const raw = data.opciones || {};
      const separated = separarUbicacionesPorProvincia(
        raw.ubicaciones || [],
        raw.ubicacionesBuenosAires || raw.ubicaciones_buenos_aires || [],
        raw.ubicacionesRioNegro || raw.ubicaciones_rio_negro || []
      );

      setConfig({
        tipos: raw.tipos || [],
        ubicacionesBuenosAires: separated.buenosAires,
        ubicacionesRioNegro: separated.rioNegro,
        operaciones: raw.operaciones || [],
        habitaciones: raw.habitaciones || [],
        tiposCampo: raw.tiposCampo || [],
      });
    } else {
      console.error("Error fetching config:", error);
    }
    setLoading(false);
  };

  const guardarConfiguracion = async () => {
    setSaving(true);
    const payload = {
      ...config,
      // Guardar también la lista combinada para máxima compatibilidad
      ubicaciones: Array.from(new Set([...config.ubicacionesBuenosAires, ...config.ubicacionesRioNegro])),
    };

    const { error } = await supabase.from("configuracion_filtros").update({ opciones: payload }).eq("id", 1);
    setSaving(false);
    if (error) {
      mostrarToast("Error al guardar: " + error.message, "error");
    } else {
      mostrarToast("Filtros actualizados correctamente");
    }
  };

  const handleAdd = (key: keyof typeof config) => {
    const val = nuevosValores[key].trim();
    if (!val) return;

    let newValue: any = val;
    if (key === "habitaciones") {
      newValue = parseInt(val, 10);
      if (isNaN(newValue)) return;
    }

    if (!config[key].includes(newValue as never)) {
      setConfig(prev => ({
        ...prev,
        [key]: [...prev[key], newValue],
      }));
    }
    setNuevosValores(prev => ({ ...prev, [key]: "" }));
  };

  const handleRemove = (key: keyof typeof config, index: number) => {
    setConfig(prev => ({
      ...prev,
      [key]: prev[key].filter((_, i) => i !== index),
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-[#16a34a] w-8 h-8" />
      </div>
    );
  }

  const renderPanel = (
    title: string, 
    key: keyof typeof config, 
    placeholder: string, 
    type = "text",
    badgeLabel?: string,
    icon?: React.ReactNode
  ) => (
    <div className="bg-white/5 border border-white/10 p-6 rounded-[24px] shadow-sm backdrop-blur-md hover:border-white/20 transition-all flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            {icon}
            <h3 className="font-bold text-white text-base">{title}</h3>
          </div>
          {badgeLabel && (
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-white/10 text-white/80 border border-white/15">
              {badgeLabel}
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mb-4 min-h-[42px]">
          {config[key].map((item, idx) => (
            <div key={idx} className="flex items-center gap-2 bg-white/10 text-white px-3 py-1.5 rounded-lg border border-white/20 text-sm font-semibold">
              <span>{item}</span>
              <button 
                type="button"
                onClick={() => handleRemove(key, idx)} 
                className="text-white/40 hover:text-red-400 transition-colors cursor-pointer"
                title="Eliminar"
              >
                <X size={14} />
              </button>
            </div>
          ))}
          {config[key].length === 0 && (
            <span className="text-white/40 text-sm italic flex items-center">No hay opciones cargadas</span>
          )}
        </div>
      </div>

      <div className="flex gap-2 pt-2">
        <input 
          type={type} 
          placeholder={placeholder}
          value={nuevosValores[key]}
          onChange={(e) => setNuevosValores(prev => ({ ...prev, [key]: e.target.value }))}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd(key)}
          className="flex-1 bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-white/30 text-sm focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/30"
        />
        <button 
          type="button"
          onClick={() => handleAdd(key)}
          className="bg-white/10 hover:bg-white/20 border border-white/10 text-white px-4 py-2.5 rounded-xl transition-colors font-semibold flex items-center cursor-pointer"
          title="Agregar"
        >
          <Plus size={18} />
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl mx-auto pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-roma-leaf/30 backdrop-blur-md p-6 rounded-[24px] border border-white/10 shadow-sm">
        <div>
          <h1 className="text-[28px] font-black text-white tracking-tight flex items-center gap-3">
            <SlidersHorizontal className="text-white/80 w-8 h-8" />
            Configurar Filtros
          </h1>
          <p className="text-white/60 font-medium mt-1">Administrá las opciones de búsqueda y las ciudades divididas por provincia.</p>
        </div>
        <button 
          onClick={guardarConfiguracion}
          disabled={saving}
          className="flex items-center gap-2 bg-white hover:bg-white/90 text-roma-dark font-bold py-3.5 px-8 rounded-2xl shadow-lg transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:transform-none cursor-pointer"
        >
          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          Guardar Cambios
        </button>
      </div>

      {/* SECCIÓN DESTACADA: PROVINCIAS Y CIUDADES */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <MapPin className="text-roma-leaf w-5 h-5" />
          <h2 className="text-lg font-bold text-white">Ciudades y Zonas por Provincia</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {renderPanel(
            "Buenos Aires (Ciudades / Zonas)", 
            "ubicacionesBuenosAires", 
            "Ej: Villalonga, Pedro Luro, Patagones...",
            "text",
            "Bs.As",
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
          )}
          {renderPanel(
            "Río Negro (Ciudades / Zonas)", 
            "ubicacionesRioNegro", 
            "Ej: Viedma, Las Grutas, San Antonio Oeste...",
            "text",
            "Río Negro",
            <span className="w-2.5 h-2.5 rounded-full bg-sky-400 inline-block" />
          )}
        </div>
      </div>

      {/* RESTO DE OPCIONES */}
      <div className="space-y-4 pt-2">
        <h2 className="text-lg font-bold text-white">Otras Opciones de Filtrado</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {renderPanel("Tipos de Propiedad", "tipos", "Ej: Casa, Departamento, Campo...")}
          {renderPanel("Operaciones", "operaciones", "Ej: Venta, Alquiler...")}
          {renderPanel("Tipos de Campo", "tiposCampo", "Ej: Agrícola, Ganadero, Mixto...")}
          {renderPanel("Opciones de Habitaciones", "habitaciones", "Ej: 1, 2, 3...", "number")}
        </div>
      </div>

      {/* BOTÓN INFERIOR PARA GUARDAR CAMBIOS */}
      <div className="flex justify-end pt-4">
        <button 
          onClick={guardarConfiguracion}
          disabled={saving}
          className="flex items-center gap-2 bg-white hover:bg-white/90 text-roma-dark font-bold py-3.5 px-8 rounded-2xl shadow-lg transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:transform-none cursor-pointer text-sm"
        >
          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          Guardar Todos los Cambios
        </button>
      </div>
    </div>
  );
}
