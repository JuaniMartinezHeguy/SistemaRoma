import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { X, ExternalLink } from 'lucide-react';
import PageLoader from '@/components/ui/PageLoader';

interface Plantilla {
  id: number;
  slug: string;
  imagen_url: string;
  created_at: string;
}

export default function PlantillaView() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [plantilla, setPlantilla] = useState<Plantilla | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const fetchPlantilla = async () => {
      if (!slug) {
        navigate('/', { replace: true });
        return;
      }

      console.log('[PlantillaView] Buscando slug:', slug);

      const { data, error } = await supabase
        .from('plantillas')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();

      console.log('[PlantillaView] Resultado:', { data, error });

      if (error) {
        console.error('[PlantillaView] Error en query:', error);
        navigate('/', { replace: true });
        return;
      }

      if (!data) {
        console.log('[PlantillaView] Slug no encontrado, redirigiendo al landing');
        navigate('/', { replace: true });
        return;
      }

      setPlantilla(data);
      setLoading(false);
    };

    fetchPlantilla();
  }, [slug, navigate]);

  const handleClose = () => {
    navigate('/#inicio', { replace: true });
    // Forzar scroll al hero después de navegar
    setTimeout(() => {
      const heroSection = document.getElementById('inicio');
      if (heroSection) {
        heroSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  if (loading) {
    return <PageLoader />;
  }

  if (!plantilla) return null;

  return (
    <div className="min-h-screen bg-roma-olive flex flex-col">
      {/* Header minimalista */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-4 sm:px-6 py-3 bg-roma-olive backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center gap-3">
          <img 
            src="/logoblanco.png" 
            alt="Roma Servicios Inmobiliarios" 
            className="h-8 sm:h-9 object-contain cursor-pointer hover:opacity-80 transition-opacity" 
            onClick={handleClose}
          />
        </div>
        <button
          onClick={handleClose}
          className="flex items-center gap-2 px-3 py-2 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-all cursor-pointer text-sm font-bold"
          aria-label="Cerrar plantilla"
        >
          <span className="hidden sm:inline">Cerrar</span>
          <X size={20} />
        </button>
      </header>

      {/* Contenido principal — Imagen centrada */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="relative w-full max-w-3xl mx-auto">
          {/* Skeleton de carga de imagen */}
          {!imageLoaded && (
            <div className="w-full aspect-[4/5] bg-roma-leaf/20 rounded-2xl sm:rounded-3xl animate-pulse" />
          )}

          <img
            src={plantilla.imagen_url}
            alt={`Plantilla ${plantilla.slug}`}
            className={`w-full h-auto rounded-2xl sm:rounded-3xl shadow-2xl transition-opacity duration-500 ${
              imageLoaded ? 'opacity-100' : 'opacity-0 absolute inset-0'
            }`}
            loading="eager"
            decoding="async"
            onLoad={() => setImageLoaded(true)}
          />
        </div>
      </main>

      {/* Footer con link a la página principal */}
      <footer className="flex items-center justify-center px-4 py-4 border-t border-white/10 bg-roma-olive">
        <button
          onClick={handleClose}
          className="flex items-center gap-2 text-white/60 hover:text-white text-xs sm:text-sm font-medium transition-colors cursor-pointer"
        >
          <ExternalLink size={14} />
          Visitar romartinez.com.ar
        </button>
      </footer>
    </div>
  );
}
