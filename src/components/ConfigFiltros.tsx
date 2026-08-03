import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Plus, X, Save, SlidersHorizontal, Loader2 } from "lucide-react";

export default function ConfigFiltros({ mostrarToast }: { mostrarToast: (msg: string, tipo?: "success" | "error") => void }) {
  const [config, setConfig] = useState({
    tipos: [] as string[],
    ubicaciones: [] as string[],
    operaciones: [] as string[],
    habitaciones: [] as number[],
    tiposCampo: [] as string[],
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [nuevosValores, setNuevosValores] = useState({
    tipos: "",
    ubicaciones: "",
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
      setConfig(data.opciones);
    } else {
      console.error("Error fetching config:", error);
    }
    setLoading(false);
  };

  const guardarConfiguracion = async () => {
    setSaving(true);
    const { error } = await supabase.from("configuracion_filtros").update({ opciones: config }).eq("id", 1);
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

  const renderPanel = (title: string, key: keyof typeof config, placeholder: string, type = "text") => (
    <div className="bg-white/5 border border-white/10 p-6 rounded-[24px] shadow-sm backdrop-blur-md hover:border-white/20 transition-all">
      <h3 className="font-bold text-white mb-4">{title}</h3>
      <div className="flex flex-wrap gap-2 mb-4">
        {config[key].map((item, idx) => (
          <div key={idx} className="flex items-center gap-2 bg-white/10 text-white px-3 py-1.5 rounded-lg border border-white/20 text-sm font-semibold">
            {item}
            <button onClick={() => handleRemove(key, idx)} className="text-white/40 hover:text-red-400 transition-colors">
              <X size={14} />
            </button>
          </div>
        ))}
        {config[key].length === 0 && <span className="text-white/40 text-sm">No hay opciones cargadas</span>}
      </div>
      <div className="flex gap-2">
        <input 
          type={type} 
          placeholder={placeholder}
          value={nuevosValores[key]}
          onChange={(e) => setNuevosValores(prev => ({ ...prev, [key]: e.target.value }))}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd(key)}
          className="flex-1 bg-black/20 border border-white/10 rounded-xl px-4 py-2 text-white placeholder-white/30 text-sm focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/30"
        />
        <button 
          onClick={() => handleAdd(key)}
          className="bg-white/10 hover:bg-white/20 border border-white/10 text-white px-4 py-2 rounded-xl transition-colors font-semibold flex items-center"
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
          <p className="text-white/60 font-medium mt-1">Administrá las opciones que aparecen en el buscador del catálogo.</p>
        </div>
        <button 
          onClick={guardarConfiguracion}
          disabled={saving}
          className="flex items-center gap-2 bg-white hover:bg-white/90 text-roma-dark font-bold py-3.5 px-8 rounded-2xl shadow-lg transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:transform-none"
        >
          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          Guardar Cambios
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {renderPanel("Tipos de Propiedad", "tipos", "Ej: Casa, Departamento")}
        {renderPanel("Ubicaciones", "ubicaciones", "Ej: Villalonga, Pedro Luro")}
        {renderPanel("Operaciones", "operaciones", "Ej: Venta, Alquiler")}
        {renderPanel("Tipos de Campo", "tiposCampo", "Ej: Agrícola, Ganadero")}
        {renderPanel("Opciones de Habitaciones", "habitaciones", "Ej: 1, 2, 3", "number")}
      </div>
    </div>
  );
}
