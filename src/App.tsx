import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';

// Importamos las páginas
import Login from './pages/login';
import Admin from './pages/admin';

export default function App() {
  const [session, setSession] = useState<any>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    // 1. Preguntamos si hay alguien logueado al abrir la página
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setCargando(false);
    });

    // 2. Nos quedamos escuchando por si el usuario inicia o cierra sesión
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Pantalla negra de carga mientras Supabase responde
  if (cargando) return <div className="bg-black min-h-screen"></div>;

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* RUTA PROTEGIDA: Si hay sesión, muestra el Admin. Si no, manda al Login */}
        <Route 
          path="/admin" 
          element={session ? <Admin /> : <Navigate to="/login" />} 
        />

        {/* Temporal: Redirigir la raíz al login para probar más rápido */}
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}