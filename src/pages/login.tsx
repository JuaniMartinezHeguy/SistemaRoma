import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase"; 
import { Lock, Mail, AlertCircle, ArrowRight } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.session) {
        // Si el login es exitoso, lo mandamos al panel
        navigate("/admin");
      }
    } catch (err: any) {
      setError("Correo o contraseña incorrectos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col justify-center items-center p-4">
      
      <div className="max-w-md w-full bg-white rounded-[32px] shadow-xl p-8 border border-slate-100 animate-in fade-in zoom-in-95 duration-500">
        
        {/* LOGO Y TÍTULO */}
        <div className="flex flex-col items-center mb-8">
          <div className="bg-[#16a34a] p-4 rounded-2xl mb-4 shadow-lg shadow-green-200">
            <Lock className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Acceso Restringido</h2>
          <p className="text-slate-500 text-sm mt-2 text-center">
            Ingresá tus credenciales para administrar el inventario de Roma Inmobiliaria.
          </p>
        </div>

        {/* MENSAJE DE ERROR */}
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-3 mb-6 text-sm font-bold border border-red-100">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {/* FORMULARIO */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Correo Electrónico</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-12 pr-4 h-14 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#16a34a] focus:border-transparent outline-none transition-all font-medium text-slate-900"
                placeholder="admin@romainmo.com.ar"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Contraseña</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-12 pr-4 h-14 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#16a34a] focus:border-transparent outline-none transition-all font-medium text-slate-900"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-14 bg-[#16a34a] hover:bg-[#148e40] text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-green-500/20 disabled:opacity-70 disabled:cursor-not-allowed mt-4"
          >
            {loading ? "Verificando..." : "Ingresar al Panel"}
            {!loading && <ArrowRight className="h-5 w-5" />}
          </button>
        </form>

      </div>
      
      {/* BOTÓN PARA VOLVER A LA WEB PÚBLICA */}
      <button 
        onClick={() => navigate("/")}
        className="mt-8 text-slate-500 font-medium hover:text-[#16a34a] transition-colors"
      >
        ← Volver al sitio web
      </button>

    </div>
  );
}