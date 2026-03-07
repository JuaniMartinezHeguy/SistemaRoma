"use client";

import { useState, useEffect } from "react";
import {
  LogOut,
  Home,
  LayoutGrid,
  Plus,
  CheckCircle,
  AlertCircle,
  Menu,
  X,
} from "lucide-react";

// 1. CONEXIÓN REAL: Importamos tu instancia de Supabase
import { supabase } from "../lib/supabase"; 

// 2. RUTAS DE COMPONENTES: Ajustadas a tu estructura de carpetas
import Lista from "../components/Lista";
import Formulario from "../components/Formulario";

export default function Admin() {
  const [activeTab, setActiveTab] = useState("lista");
  const [propiedades, setPropiedades] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [toast, setToast] = useState({
    visible: false,
    texto: "",
    tipo: "success",
  });
  const [archivoImagen, setArchivoImagen] = useState<File | null>(null);

  const formInicial = {
    titulo: "",
    descripcion: "",
    precio: "",
    tipo_propiedad: "Casa",
    operacion: "Venta",
    ubicacion: "Villalonga",
    dimensiones: "",
    imagen_url: "",
    destacada: false,
  };
  const [formData, setFormData] = useState(formInicial);

  const mostrarToast = (texto: string, tipo: "success" | "error" = "success") => {
    setToast({ visible: true, texto, tipo });
    setTimeout(() => setToast((prev) => ({ ...prev, visible: false })), 3000);
  };

  // Traer datos reales de la base de datos
  const fetchPropiedades = async () => {
    const { data, error } = await supabase
      .from("propiedades")
      .select("*")
      .order("id", { ascending: false });
    if (!error && data) setPropiedades(data);
  };

  useEffect(() => {
    fetchPropiedades();
  }, []);

  const handleCerrarSesion = async () => await supabase.auth.signOut();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imagenFinalUrl = formData.imagen_url;

      if (archivoImagen) {
        mostrarToast("Procesando imagen...", "success");
        const fileExt = archivoImagen.name.split(".").pop();
        const fileName = `${Math.random()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("propiedades")
          .upload(fileName, archivoImagen);
        if (uploadError) throw uploadError;

        const {
          data: { publicUrl },
        } = supabase.storage.from("propiedades").getPublicUrl(fileName);
        imagenFinalUrl = publicUrl;
      }

      if (!imagenFinalUrl)
        throw new Error("Por favor, subí una imagen principal.");

      const datosAEnviar: any = {
        ...formData,
        precio: parseFloat(formData.precio.toString()),
        imagen_url: imagenFinalUrl,
      };
      
      // Limpieza de campos automáticos de Supabase para evitar errores
      delete datosAEnviar.id;
      delete datosAEnviar.created_at;

      if (editandoId) {
        const { error } = await supabase
          .from("propiedades")
          .update(datosAEnviar)
          .eq("id", editandoId);
        if (error) throw error;
        mostrarToast("¡Propiedad actualizada con éxito!", "success");
      } else {
        const { error } = await supabase
          .from("propiedades")
          .insert([datosAEnviar]);
        if (error) throw error;
        mostrarToast("¡Propiedad publicada con éxito!", "success");
      }

      fetchPropiedades();
      setFormData(formInicial);
      setArchivoImagen(null);
      setEditandoId(null);
      setTimeout(() => setActiveTab("lista"), 400);
    } catch (error: any) {
      mostrarToast(error.message || "Ocurrió un error inesperado.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleEditar = (prop: any) => {
    setFormData(prop);
    setArchivoImagen(null);
    setEditandoId(prop.id);
    setActiveTab("formulario");
    setSidebarOpen(false);
  };

  const handleBorrar = async (id: number) => {
    const { error } = await supabase.from("propiedades").delete().eq("id", id);
    if (!error) {
      fetchPropiedades();
      mostrarToast("Propiedad eliminada correctamente", "success");
    } else {
      mostrarToast("Error al borrar: " + error.message, "error");
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900 font-sans overflow-hidden">
      
      {/* TOAST FLOTANTE PERSONALIZADO (Sin librerías extra) */}
      <div
        className={`fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-5 py-4 rounded-xl shadow-lg transition-all duration-300 transform ${
          toast.visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0 pointer-events-none"
        } ${toast.tipo === "success" ? "bg-green-800 text-white" : "bg-red-600 text-white"}`}
      >
        {toast.tipo === "success" ? <CheckCircle className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
        <span className="font-medium">{toast.texto}</span>
      </div>

      {/* SIDEBAR */}
      <aside className={`fixed md:relative w-72 h-full bg-white border-r border-gray-200 flex flex-col justify-between z-40 transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>
        <div>
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-xl bg-green-700 flex items-center justify-center shadow-md">
                <Home className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-black text-gray-900 tracking-tight">ROMA</h1>
                <p className="text-[10px] text-green-600 font-bold tracking-widest uppercase">Management</p>
              </div>
            </div>
          </div>

          <nav className="p-4 space-y-2">
            <button onClick={() => { setActiveTab("lista"); setSidebarOpen(false); }} 
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium transition-all ${activeTab === "lista" ? "bg-green-50 text-green-700 shadow-sm" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"}`}>
              <LayoutGrid className="h-5 w-5" /> Inventario
            </button>
            <button onClick={() => { setFormData(formInicial); setArchivoImagen(null); setEditandoId(null); setActiveTab("formulario"); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium transition-all ${activeTab === "formulario" ? "bg-green-50 text-green-700 shadow-sm" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"}`}>
              <Plus className="h-5 w-5" /> Cargar Inmueble
            </button>
          </nav>
        </div>

        <div className="p-4 border-t border-gray-100">
          <button onClick={handleCerrarSesion} className="w-full flex items-center justify-start gap-3 text-gray-500 hover:text-red-600 hover:bg-red-50 px-4 py-3 rounded-xl transition font-medium">
            <LogOut className="h-5 w-5" /> Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* ÁREA DE CONTENIDO */}
      <main className="flex-1 overflow-y-auto">
        <div className="md:hidden bg-white border-b border-gray-200 p-4 sticky top-0 z-20 flex justify-between items-center">
          <button onClick={() => setSidebarOpen(true)} className="p-2"><Menu className="h-6 w-6" /></button>
          <span className="font-bold">ROMA</span>
          <div className="w-6"></div>
        </div>

        <div className="p-6 md:p-10 max-w-7xl mx-auto">
          {activeTab === "lista" && (
            <Lista propiedades={propiedades} onEditar={handleEditar} onBorrar={handleBorrar} />
          )}

          {activeTab === "formulario" && (
            <Formulario formData={formData} setFormData={setFormData} onSubmit={handleSubmit} loading={loading} editandoId={editandoId} archivoImagen={archivoImagen} setArchivoImagen={setArchivoImagen} onCancelar={() => setActiveTab("lista")} />
          )}
        </div>
      </main>
    </div>
  );
}