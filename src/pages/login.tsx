import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { LockKey } from "@phosphor-icons/react";

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setCargando(true);
    setError('');

    // Intento de inicio de sesión con Supabase
    const { error } = await supabase.auth.signInWithPassword({ 
      email, 
      password 
    });
    
    if (error) {
      setError('Correo o contraseña incorrectos.');
      setCargando(false);
    } else {
      // Si todo sale bien, lo mandamos al panel
      navigate('/admin');
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6">
      <div className="glass-panel p-10 rounded-3xl w-full max-w-md border border-white/10 text-center shadow-2xl">
        <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6 text-primary border border-primary/30">
         <LockKey size={32} weight="fill" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Roma Inmobiliaria</h1>
        <p className="text-gray-400 mb-8 text-sm">Acceso exclusivo para administración</p>
        
        <form onSubmit={handleLogin} className="space-y-4 text-left">
          <input 
            type="email" 
            placeholder="Correo electrónico" 
            value={email} 
            onChange={e => setEmail(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-primary transition" 
            required
          />
          <input 
            type="password" 
            placeholder="Contraseña" 
            value={password} 
            onChange={e => setPassword(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-primary transition" 
            required
          />
          
          {error && <p className="text-red-400 text-sm bg-red-500/10 p-3 rounded-lg border border-red-500/20">{error}</p>}
          
          <button 
            type="submit" 
            disabled={cargando}
            className="w-full bg-primary text-black font-bold py-4 rounded-xl hover:scale-[1.02] transition shadow-[0_0_15px_rgba(0,209,91,0.2)] disabled:opacity-50 mt-4"
          >
            {cargando ? 'Verificando...' : 'Entrar al Panel'}
          </button>
        </form>
      </div>
    </div>
  );
}