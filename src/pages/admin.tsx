"use client";

import { useState, useEffect } from "react";
// IMPORTANTE: Agregamos useNavigate para poder redirigir al login
import { useNavigate } from "react-router-dom";
import { 
  LogOut, LayoutDashboard, Building2, PlusCircle, 
  CheckCircle, AlertCircle, Home, LayoutGrid, 
  Tractor, Map, Pencil, ArrowRight
} from "lucide-react";

import Lista from "@/components/Lista";
import Formulario from "@/components/Formulario";
import { supabase } from "@/lib/supabase"; 

export default function Admin() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [propiedades, setPropiedades] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [sidebarOpen] = useState(false);
  const [toast, setToast] = useState({ visible: false, texto: "", tipo: "success" });
  const [archivoImagen, setArchivoImagen] = useState<File | null>(null);

  const formInicial = {
    titulo: "", descripcion: "", precio: "", tipo_propiedad: "Casa",
    operacion: "Venta", ubicacion: "", dimensiones: "",
    imagen_url: "", destacada: false,
  };
  const [formData, setFormData] = useState(formInicial);
  
  // Inicializamos el navegador de rutas
  const navigate = useNavigate();

  // --- EFECTO DE SEGURIDAD: EL CANDADO ---
  useEffect(() => {
    const verificarSesion = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        // Si no hay sesión, lo pateamos a la pantalla de login
        navigate("/login");
      }
    };
    
    verificarSesion();

    // Escuchar cambios (por si cierra sesión)
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate("/login");
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate]);
  // ----------------------------------------

  const mostrarToast = (texto: string, tipo: "success" | "error" = "success") => {
    setToast({ visible: true, texto, tipo });
    setTimeout(() => setToast((prev) => ({ ...prev, visible: false })), 3000);
  };

  const fetchPropiedades = async () => {
    const { data, error } = await supabase.from("propiedades").select("*").order("id", { ascending: false });
    if (!error && data) setPropiedades(data);
  };

  useEffect(() => { fetchPropiedades(); }, []);

  const handleCerrarSesion = async () => await supabase.auth.signOut();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let imagenFinalUrl = formData.imagen_url;
      if (archivoImagen) {
        mostrarToast("Subiendo imagen...", "success");
        const fileExt = archivoImagen.name.split(".").pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from("propiedades").upload(fileName, archivoImagen);
        if (uploadError) throw uploadError;
        const { data: { publicUrl } } = supabase.storage.from("propiedades").getPublicUrl(fileName);
        imagenFinalUrl = publicUrl;
      }
      if (!imagenFinalUrl) throw new Error("Falta la imagen principal.");
      const datosAEnviar: any = { 
        ...formData, 
        precio: parseFloat(formData.precio.toString()), 
        imagen_url: imagenFinalUrl 
      };
      delete datosAEnviar.id;
      delete datosAEnviar.created_at;

      if (editandoId) {
        const { error } = await supabase.from("propiedades").update(datosAEnviar).eq("id", editandoId);
        if (error) throw error;
        mostrarToast("¡Actualizado!");
      } else {
        const { error } = await supabase.from("propiedades").insert([datosAEnviar]);
        if (error) throw error;
        mostrarToast("¡Publicado!");
      }
      fetchPropiedades();
      setFormData(formInicial);
      setArchivoImagen(null);
      setEditandoId(null);
      setIsFormOpen(false);
    } catch (error: any) {
      mostrarToast(error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleEditar = (prop: any) => {
    setFormData(prop);
    setEditandoId(prop.id);
    setIsFormOpen(true); 
  };

  const handleBorrar = async (id: number) => {
    const { error } = await supabase.from("propiedades").delete().eq("id", id);
    if (!error) { fetchPropiedades(); mostrarToast("Eliminado"); }
  };

  const abrirFormularioNuevo = () => {
    setEditandoId(null); 
    setFormData(formInicial); 
    setIsFormOpen(true);
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm">
        <div>
          <h1 className="text-[28px] font-black text-slate-900 tracking-tight">Resumen General</h1>
          <p className="text-slate-500 font-medium mt-1">Monitoreá la actividad de tu inventario.</p>
        </div>
        <button 
          onClick={abrirFormularioNuevo}
          className="flex items-center gap-2 bg-[#16a34a] hover:bg-[#148e40] text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg shadow-green-500/20 transition-all hover:-translate-y-0.5 active:translate-y-0"
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
          <div key={i} className="bg-white border border-slate-100 rounded-[24px] p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
            <div className="flex justify-between items-start mb-4">
              <div className="h-10 w-10 bg-[#f0fdf4] text-[#16a34a] rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                {s.ic}
              </div>
            </div>
            <div>
              <p className="text-3xl font-black text-slate-900 leading-none">{s.val}</p>
              <p className="text-sm font-semibold text-slate-400 mt-2">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* SECCIÓN DE ÚLTIMA ACTIVIDAD */}
      <div className="bg-white border border-slate-100 rounded-[28px] shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-white">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Building2 className="h-5 w-5 text-[#16a34a]" />
            Últimos ingresos al sistema
          </h2>
          <button 
            onClick={() => setActiveTab("propiedades")} 
            className="flex items-center gap-1 text-sm font-bold text-[#16a34a] hover:text-[#148e40] transition-colors"
          >
            Ver catálogo completo <ArrowRight className="h-4 w-4" />
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-400 uppercase tracking-wider bg-slate-50/50">
              <tr className="border-b border-slate-100">
                <th className="px-6 py-4 font-bold">Inmueble</th>
                <th className="px-6 py-4 font-bold">Ubicación</th>
                <th className="px-6 py-4 font-bold">Precio</th>
                <th className="px-6 py-4 font-bold">Estado</th>
                <th className="px-6 py-4 font-bold text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {ultimasPropiedades.map(prop => (
                <tr key={prop.id} className="hover:bg-[#f0fdf4]/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                        <img src={prop.imagen_url} alt={prop.titulo} className="h-full w-full object-cover" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 line-clamp-1">{prop.titulo}</div>
                        <div className="text-xs text-[#16a34a] font-bold uppercase mt-0.5">{prop.tipo_propiedad}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600 font-medium">{prop.ubicacion}</td>
                  <td className="px-6 py-4 font-black text-slate-900">USD {prop.precio.toLocaleString("es-AR")}</td>
                  <td className="px-6 py-4">
                    <span className="bg-[#f0fdf4] text-[#16a34a] py-1.5 px-3 rounded-lg text-[10px] font-black uppercase tracking-widest border border-green-200/50">
                      {prop.operacion}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => handleEditar(prop)} 
                      className="p-2 text-slate-400 hover:text-[#16a34a] hover:bg-[#dcfce7] rounded-lg transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Pencil size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {ultimasPropiedades.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-slate-400 font-medium">
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
    <div className="flex h-screen bg-[#f8fafc] text-slate-900 overflow-hidden">
      
      {/* SIDEBAR VERDE CON LOGO BLANCO */}
      <aside className={`fixed md:relative w-72 h-full bg-[#16a34a] flex flex-col z-40 transition-transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"} shadow-xl`}>
        
        {/* Contenedor del Logo - Achicamos el padding y usamos overflow oculto por las dudas */}
        <div className="py-2 border-b border-white/10 flex items-center justify-center overflow-hidden h-32">
          <img 
            src="/logo-blanco.png" 
            alt="Roma Servicios Inmobiliarios" 
            /* El -my-12 "succiona" el espacio transparente que trae la imagen original */
            className="w-56 -my-12 drop-shadow-md hover:scale-105 transition-transform duration-500" 
          />
        </div>
        
        {/* Navegación - Le sacamos el mt-4 extra para que arranque pegadito arriba */}
        <nav className="p-4 pt-4 space-y-2 flex-1">
          <button 
            onClick={() => setActiveTab("dashboard")} 
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all font-bold ${activeTab === "dashboard" ? "bg-white text-[#16a34a] shadow-lg shadow-black/10" : "text-green-50 hover:bg-white/10 hover:text-white"}`}
          >
            <LayoutDashboard size={20} className={activeTab === "dashboard" ? "text-[#16a34a]" : "text-green-100"} /> 
            Dashboard
          </button>
          <button 
            onClick={() => setActiveTab("propiedades")} 
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all font-bold ${activeTab === "propiedades" ? "bg-white text-[#16a34a] shadow-lg shadow-black/10" : "text-green-50 hover:bg-white/10 hover:text-white"}`}
          >
            <Building2 size={20} className={activeTab === "propiedades" ? "text-[#16a34a]" : "text-green-100"} /> 
            Propiedades
          </button>
        </nav>

        {/* Botón Salir */}
        <div className="p-4 border-t border-white/10 mb-2">
          <button 
            onClick={handleCerrarSesion} 
            className="w-full flex items-center gap-3 px-4 py-3 text-green-100 hover:text-white hover:bg-white/10 rounded-xl transition-colors font-bold"
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
      </main>

      {isFormOpen && <Formulario formData={formData} setFormData={setFormData} onSubmit={handleSubmit} loading={loading} editandoId={editandoId} archivoImagen={archivoImagen} setArchivoImagen={setArchivoImagen} onCancelar={() => setIsFormOpen(false)} />}
      
      {toast.visible && (
        <div className={`fixed top-6 right-6 flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl z-[100] animate-in slide-in-from-right-8 fade-in duration-300 ${toast.tipo === "success" ? "bg-[#16a34a] text-white" : "bg-red-500 text-white"}`}>
          {toast.tipo === "success" ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
          <span className="font-bold">{toast.texto}</span>
        </div>
      )}
    </div>
  );  
}