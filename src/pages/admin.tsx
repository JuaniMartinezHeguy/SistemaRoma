"use client";

import { useState, useEffect } from "react";
// IMPORTANTE: Agregamos useNavigate para poder redirigir al login
import { useNavigate } from "react-router-dom";
import { 
  LogOut, LayoutDashboard, Building2, PlusCircle, 
  CheckCircle, AlertCircle, Home, LayoutGrid, 
  Tractor, Map, Pencil, ArrowRight, SlidersHorizontal,
  Users
} from "lucide-react";

import Lista from "@/components/Lista";
// @ts-ignore
import FormularioPropiedad from "@/components/FormularioPropiedad";
import ConfigFiltros from "@/components/ConfigFiltros";
import ClientesAdmin from "@/components/ClientesAdmin";
import { supabase } from "@/lib/supabase"; 

export default function Admin() {
  // ─ Hooks ─ siempre primero ───────────────────────────────────────────
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [propiedadEditando, setPropiedadEditando] = useState<any>(null);
  const [propiedades, setPropiedades] = useState<any[]>([]);
  const [sidebarOpen] = useState(false);
  const [toast, setToast] = useState({ visible: false, texto: "", tipo: "success" });

  // ─ Efectos ──────────────────────────────────────────────────────
  useEffect(() => {
    const verificarSesion = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) navigate("/login");
    };
    verificarSesion();
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) navigate("/login");
    });
    return () => { authListener.subscription.unsubscribe(); };
  }, [navigate]);

  useEffect(() => { fetchPropiedades(); }, []);

  // ─ Funciones ─────────────────────────────────────────────────────
  const mostrarToast = (texto: string, tipo: "success" | "error" = "success") => {
    setToast({ visible: true, texto, tipo });
    setTimeout(() => setToast((prev) => ({ ...prev, visible: false })), 3000);
  };

  const fetchPropiedades = async () => {
    const { data, error } = await supabase.from("propiedades").select("*").order("id", { ascending: false });
    if (!error && data) setPropiedades(data);
  };

  const handleCerrarSesion = async () => await supabase.auth.signOut();

  const abrirFormularioNuevo = () => {
    setPropiedadEditando(null);
    setIsFormOpen(true);
  };

  const handleSubmit = async (payload: any, archivos: File[]) => {
    try {
      const mediaUrls: string[] = propiedadEditando?.media_urls ? [...propiedadEditando.media_urls] : [];
      for (const archivo of archivos) {
        const ext = archivo.name.split(".").pop();
        const nombre = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const { error: uploadError } = await supabase.storage.from("propiedades").upload(nombre, archivo);
        if (uploadError) throw uploadError;
        const { data: { publicUrl } } = supabase.storage.from("propiedades").getPublicUrl(nombre);
        mediaUrls.push(publicUrl);
      }
      const datosFinales = { ...payload, media_urls: mediaUrls };
      
      let error;
      if (propiedadEditando) {
        const { error: updateError } = await supabase.from("propiedades").update(datosFinales).eq('id', propiedadEditando.id);
        error = updateError;
      } else {
        const { error: insertError } = await supabase.from("propiedades").insert([datosFinales]);
        error = insertError;
      }

      if (error) throw error;
      mostrarToast(propiedadEditando ? "¡Propiedad actualizada!" : "¡Propiedad publicada!");
      fetchPropiedades();
      setIsFormOpen(false);
      setPropiedadEditando(null);
    } catch (error: any) {
      mostrarToast(error.message, "error");
    }
  };

  const handleEditar = (prop: any) => {
    setPropiedadEditando(prop);
    setIsFormOpen(true);
  };

  const handleBorrar = async (id: number) => {
    const { error } = await supabase.from("propiedades").delete().eq("id", id);
    if (!error) { fetchPropiedades(); mostrarToast("Eliminado"); }
  };

  // Datos para el dashboard
  const ultimasPropiedades = propiedades.slice(0, 4);
  const stats = {
    total: propiedades.length,
    casas: propiedades.filter(p => p.tipo_propiedad?.toLowerCase() === "casa").length,
    campos: propiedades.filter(p => p.tipo_propiedad?.toLowerCase() === "campo").length,
    lotes: propiedades.filter(p => ["terreno", "lote"].includes(p.tipo_propiedad?.toLowerCase())).length,
  };

  const renderDashboard = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl mx-auto">
      
      {/* HEADER CON BOTÓN DE ACCIÓN */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-roma-leaf/30 backdrop-blur-md p-6 rounded-[24px] border border-white/10 shadow-sm">
        <div>
          <h1 className="text-[28px] font-black text-white tracking-tight">Resumen General</h1>
          <p className="text-white/60 font-medium mt-1">Monitoreá la actividad de tu inventario.</p>
        </div>
        <button 
          onClick={abrirFormularioNuevo}
          className="flex items-center gap-2 bg-white hover:bg-white/90 text-roma-dark font-bold py-3.5 px-6 rounded-2xl shadow-lg transition-all hover:-translate-y-0.5 active:translate-y-0"
        >
          <PlusCircle className="h-5 w-5" />
          Nueva Propiedad
        </button>
      </div>

      {/* MÉTRICAS (Monocromáticas: Verde y Blanco) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Propiedades Totales", val: stats.total, ic: <LayoutGrid className="h-5 w-5" /> },
          { label: "Casas Disponibles", val: stats.casas, ic: <Home className="h-5 w-5" /> },
          { label: "Campos Activos", val: stats.campos, ic: <Tractor className="h-5 w-5" /> },
          { label: "Lotes / Terrenos", val: stats.lotes, ic: <Map className="h-5 w-5" /> }
        ].map((s, i) => (
          <div key={i} className="bg-roma-leaf/30 backdrop-blur-md border border-white/10 rounded-[24px] p-6 shadow-sm hover:border-white/30 transition-all flex flex-col justify-between group">
            <div className="flex justify-between items-start mb-4">
              <div className="h-10 w-10 bg-white/10 text-white rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                {s.ic}
              </div>
            </div>
            <div>
              <p className="text-3xl font-black text-white leading-none">{s.val}</p>
              <p className="text-sm font-semibold text-white/60 mt-2">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* SECCIÓN DE ÚLTIMA ACTIVIDAD */}
      <div className="bg-roma-leaf/30 backdrop-blur-md border border-white/10 rounded-[28px] shadow-sm overflow-hidden">
        <div className="p-6 border-b border-white/10 flex justify-between items-center">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Building2 className="h-5 w-5 text-white/80" />
            Últimos ingresos al sistema
          </h2>
          <button 
            onClick={() => setActiveTab("propiedades")} 
            className="flex items-center gap-1 text-sm font-bold text-white/80 hover:text-white transition-colors"
          >
            Ver catálogo completo <ArrowRight className="h-4 w-4" />
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-white/50 uppercase tracking-wider bg-black/20">
              <tr className="border-b border-white/10">
                <th className="px-6 py-4 font-bold">Inmueble</th>
                <th className="px-6 py-4 font-bold">Ubicación</th>
                <th className="px-6 py-4 font-bold">Precio</th>
                <th className="px-6 py-4 font-bold">Estado</th>
                <th className="px-6 py-4 font-bold text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {ultimasPropiedades.map(prop => (
                <tr key={prop.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-xl overflow-hidden bg-black/30 shrink-0 border border-white/10">
                        <img src={(prop.media_urls && prop.media_urls[0]) || prop.imagen_url} alt={prop.titulo} className="h-full w-full object-cover" />
                      </div>
                      <div>
                        <div className="font-bold text-white line-clamp-1">{prop.titulo}</div>
                        <div className="text-xs text-white/60 font-bold uppercase mt-0.5">{prop.tipo_propiedad}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-white/70 font-medium">{prop.ubicacion}</td>
                  <td className="px-6 py-4 font-black text-white">USD {prop.precio.toLocaleString("es-AR")}</td>
                  <td className="px-6 py-4">
                    <span className="bg-white/10 text-white py-1.5 px-3 rounded-lg text-[10px] font-black uppercase tracking-widest border border-white/20">
                      {prop.operacion}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => handleEditar(prop)} 
                      className="p-2 text-white/40 hover:text-white hover:bg-white/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Pencil size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {ultimasPropiedades.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-white/40 font-medium">
                    No hay propiedades cargadas todavía.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-roma-olive text-white overflow-hidden">
      
      {/* SIDEBAR */}
      <aside className={`fixed md:relative w-72 h-full bg-roma-olive flex flex-col z-40 transition-transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"} shadow-xl border-r border-white/10`}>
        
        {/* Contenedor del Logo */}
        <div className="py-2 border-b border-white/10 flex items-center justify-center overflow-hidden h-32">
          <img 
            src="/logo-blanco.png" 
            alt="Roma Servicios Inmobiliarios" 
            className="w-56 -my-12 drop-shadow-md hover:scale-105 transition-transform duration-500" 
          />
        </div>
        
        {/* Navegación */}
        <nav className="p-4 pt-4 space-y-2 flex-1">
          <button 
            onClick={() => setActiveTab("dashboard")} 
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all font-bold ${activeTab === "dashboard" ? "bg-white text-roma-olive shadow-lg" : "text-white/60 hover:bg-white/10 hover:text-white"}`}
          >
            <LayoutDashboard size={20} className={activeTab === "dashboard" ? "text-roma-olive" : "text-white/60"} /> 
            Dashboard
          </button>
          <button 
            onClick={() => setActiveTab("propiedades")} 
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all font-bold ${activeTab === "propiedades" ? "bg-white text-roma-olive shadow-lg" : "text-white/60 hover:bg-white/10 hover:text-white"}`}
          >
            <Building2 size={20} className={activeTab === "propiedades" ? "text-roma-olive" : "text-white/60"} /> 
            Propiedades
          </button>
          <button 
            onClick={() => setActiveTab("filtros")} 
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all font-bold ${activeTab === "filtros" ? "bg-white text-roma-olive shadow-lg" : "text-white/60 hover:bg-white/10 hover:text-white"}`}
          >
            <SlidersHorizontal size={20} className={activeTab === "filtros" ? "text-roma-olive" : "text-white/60"} /> 
            Filtros
          </button>
          <button 
            onClick={() => setActiveTab("clientes")} 
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all font-bold ${activeTab === "clientes" ? "bg-white text-roma-olive shadow-lg" : "text-white/60 hover:bg-white/10 hover:text-white"}`}
          >
            <Users size={20} className={activeTab === "clientes" ? "text-roma-olive" : "text-white/60"} /> 
            Clientes
          </button>
        </nav>

        {/* Botón Salir */}
        <div className="p-4 border-t border-white/10 mb-2">
          <button 
            onClick={handleCerrarSesion} 
            className="w-full flex items-center gap-3 px-4 py-3 text-white/60 hover:text-white hover:bg-white/10 rounded-xl transition-colors font-bold"
          >
            <LogOut size={20} /> 
            Salir del sistema
          </button>
        </div>
      </aside>

      {/* --- EL RESTO DEL CÓDIGO SIGUE IGUAL --- */}
      <main className="flex-1 overflow-y-auto p-6 md:p-8 relative z-10">
        {activeTab === "dashboard" && renderDashboard()}
        {activeTab === "propiedades" && (
          <Lista 
            propiedades={propiedades} 
            onEditar={handleEditar} 
            onBorrar={handleBorrar} 
            onAgregarNuevo={abrirFormularioNuevo} 
          />
        )}
        {activeTab === "filtros" && <ConfigFiltros mostrarToast={mostrarToast} />}
        {activeTab === "clientes" && <ClientesAdmin mostrarToast={mostrarToast} />}
      </main>

      {isFormOpen && (
        <FormularioPropiedad
          onSubmit={handleSubmit}
          onCancelar={() => { setIsFormOpen(false); setPropiedadEditando(null); }}
          propiedadInicial={propiedadEditando}
        />
      )}
      
      {toast.visible && (
        <div className={`fixed top-6 right-6 flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl z-[100] animate-in slide-in-from-right-8 fade-in duration-300 ${toast.tipo === "success" ? "bg-[#16a34a] text-white" : "bg-red-500 text-white"}`}>
          {toast.tipo === "success" ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
          <span className="font-bold">{toast.texto}</span>
        </div>
      )}
    </div>
  );  
}