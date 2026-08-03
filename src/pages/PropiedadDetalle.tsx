import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import {
  MapPin, WhatsappLogo, HouseLine, Ruler,
  Bed, Buildings, Tree, Storefront, ArrowLeft, Bathtub, Info,
  CaretLeft, CaretRight
} from '@phosphor-icons/react';
import { motion, AnimatePresence } from 'framer-motion';
import PageLoader from '../components/ui/PageLoader';

interface Propiedad {
  id: number;
  titulo: string;
  tipo_propiedad: string;
  operacion: string;
  ubicacion: string;
  precio: number;
  habitaciones?: number;
  banos?: number;
  dimensiones?: string;
  descripcion?: string;
  imagen_url?: string;
  imagenes?: string[];
  media_urls?: string[];
  atributos_especificos?: any;
  destacada?: boolean;
}

function IconoTipo({ tipo, size = 20 }: { tipo: string; size?: number }) {
  switch (tipo?.toLowerCase()) {
    case 'campo': return <Tree size={size} weight="light" />;
    case 'local': return <Storefront size={size} weight="light" />;
    case 'departamento': return <Buildings size={size} weight="light" />;
    default: return <HouseLine size={size} weight="light" />;
  }
}

export default function PropiedadDetalle() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [propiedad, setPropiedad] = useState<Propiedad | null>(null);
  const [loading, setLoading] = useState(true);
  const [imagenModalIndex, setImagenModalIndex] = useState<number | null>(null);
  const [showScreenLoader, setShowScreenLoader] = useState(true);
  const [imagenIndex, setImagenIndex] = useState(0);

  const nextImagen = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImagenIndex((prev) => (prev + 1) % imagenes.length);
  };

  const prevImagen = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImagenIndex((prev) => (prev - 1 + imagenes.length) % imagenes.length);
  };

  const nextImagenModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (imagenModalIndex !== null) {
      setImagenModalIndex((prev) => (prev! + 1) % imagenes.length);
    }
  };

  const prevImagenModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (imagenModalIndex !== null) {
      setImagenModalIndex((prev) => (prev! - 1 + imagenes.length) % imagenes.length);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowScreenLoader(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchPropiedad = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('propiedades')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) {
        console.error("Error fetching property:", error);
      } else {
        setPropiedad(data);
      }
      setLoading(false);
    };
    if (id) fetchPropiedad();
  }, [id]);

  if (loading || showScreenLoader) {
    return <PageLoader />;
  }

  if (!propiedad) {
    return (
      <div className="min-h-screen bg-roma-olive text-white flex flex-col items-center justify-center">
        <h2 className="text-2xl mb-4">Propiedad no encontrada</h2>
        <button onClick={() => navigate('/propiedades')} className="bg-white text-roma-olive px-6 py-2 rounded-full uppercase text-xs font-semibold">
          Volver
        </button>
      </div>
    );
  }

  const imagenes = propiedad.media_urls?.length 
    ? propiedad.media_urls 
    : propiedad.imagenes?.length 
      ? propiedad.imagenes 
      : [propiedad.imagen_url].filter(Boolean) as string[];

  return (
    <div className="min-h-screen font-['Inter',system-ui,sans-serif] text-white relative overflow-x-hidden">
      
      {/* Fondo Fijo */}
      <div
        className="fixed inset-0 z-[-2] bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/fondo-campo.png')", backgroundAttachment: 'fixed' }}
      />

      {/* HEADER */}
      <header className="absolute top-0 left-0 w-full z-50 h-24 bg-transparent flex items-center px-6">
        <div className="max-w-screen-2xl mx-auto w-full flex items-center justify-between">
          <Link
            to="/propiedades"
            className="flex items-center gap-2 text-white bg-black/20 hover:bg-black/40 px-5 py-2.5 rounded-full backdrop-blur-md border border-white/10 text-[12px] font-light tracking-wide transition-colors"
          >
            <ArrowLeft size={16} weight="light" /> <span>Volver al catálogo</span>
          </Link>
          <img src="/roma-logo.png" alt="Roma Inmobiliaria" className="w-[7rem] h-auto object-contain opacity-90" />
        </div>
      </header>

      <main className="pt-28 pb-20 px-4 lg:px-8 max-w-screen-2xl mx-auto flex flex-col gap-6 relative z-10">
        
        {/* TÍTULO PRINCIPAL Y UBICACIÓN */}
        <section className="w-full">
          <span className="bg-white/20 text-white px-4 py-1.5 rounded-full text-[10px] font-medium tracking-widest uppercase mb-4 inline-block">
            {propiedad.operacion}
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-white leading-tight tracking-tight mb-4 drop-shadow-md">
            {propiedad.titulo}
          </h1>
          <div className="flex items-center gap-2 text-white/70 text-[14px] md:text-[16px] font-light">
            <MapPin size={20} weight="light" className="text-white/60" />
            {propiedad.ubicacion}
          </div>
        </section>

        {/* SECCIÓN DE IMÁGENES (FULL WIDTH) */}
        <section className="w-full h-[45vh] lg:h-[70vh] rounded-[2rem] overflow-hidden flex gap-2 md:gap-3 shrink-0 shadow-2xl mb-4">
          {imagenes.length === 0 ? (
            <div className="w-full h-full bg-black/30 backdrop-blur-md flex flex-col items-center justify-center text-white/40">
               <IconoTipo tipo={propiedad.tipo_propiedad} size={100} />
               <p className="mt-4 uppercase tracking-[0.2em] text-xs">Sin imágenes</p>
            </div>
          ) : imagenes.length === 1 ? (
             <div 
               className="w-full h-full cursor-pointer relative group overflow-hidden bg-black/30"
               onClick={() => setImagenModalIndex(0)}
             >
               <img src={imagenes[0]} alt={propiedad.titulo} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
             </div>
          ) : (
            <>
              {/* Imagen principal */}
              <div 
                className="w-[70%] md:w-[75%] h-full cursor-pointer relative group overflow-hidden bg-black/30 flex items-center justify-center"
                onClick={() => setImagenModalIndex(imagenIndex)}
              >
                <AnimatePresence mode="wait">
                  <motion.img 
                    key={imagenIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    src={imagenes[imagenIndex]} 
                    alt={propiedad.titulo} 
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                  />
                </AnimatePresence>
                
                <div className="absolute inset-y-0 w-full flex items-center justify-between px-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button
                    onClick={prevImagen}
                    className="bg-black/40 hover:bg-black/60 text-white p-3 rounded-full backdrop-blur-md border border-white/20 transition-all"
                  >
                    <CaretLeft size={20} weight="light" />
                  </button>
                  <button
                    onClick={nextImagen}
                    className="bg-black/40 hover:bg-black/60 text-white p-3 rounded-full backdrop-blur-md border border-white/20 transition-all"
                  >
                    <CaretRight size={20} weight="light" />
                  </button>
                </div>
              </div>
              
              {/* Imágenes secundarias */}
              <div className="w-[30%] md:w-[25%] h-full flex flex-col gap-2 md:gap-3">
                {imagenes.slice(1, 3).map((img, idx) => (
                  <div 
                    key={idx} 
                    className="flex-1 cursor-pointer relative group overflow-hidden bg-black/30 rounded-lg md:rounded-xl"
                    onClick={() => setImagenModalIndex(idx + 1)}
                  >
                    <img src={img} alt={`${propiedad.titulo} ${idx + 2}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    {idx === 1 && imagenes.length > 3 && (
                      <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] flex items-center justify-center">
                        <span className="text-white text-lg md:text-2xl font-light tracking-widest uppercase">
                          +{imagenes.length - 3}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </section>

        {/* SECCIÓN INFERIOR: Descripción + Detalles y Precio */}
        <section className="flex flex-col lg:flex-row gap-8 lg:gap-10 w-full items-stretch">
          
          {/* Izquierda: Detalles */}
          <div className="lg:w-[65%] flex flex-col gap-8">
            <div className="flex flex-col bg-black/30 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-xl shadow-2xl h-full">
              <div className="border-b border-white/10 px-8 py-5">
                <h3 className="text-[13px] font-bold tracking-widest uppercase text-white">
                  Descripción
                </h3>
              </div>

              <div className="p-8">
                <p className="text-white leading-relaxed text-[15px] font-bold whitespace-pre-wrap mb-8">
                  {propiedad.descripcion || 'Consultanos para recibir la ficha técnica completa y detalles específicos de esta propiedad.'}
                </p>

                <div className="w-full h-[1px] bg-white/10 my-6" />

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 pt-2">
                  {['casa', 'departamento'].includes(propiedad.tipo_propiedad?.toLowerCase()) && (
                    <>
                      {(propiedad.habitaciones || propiedad.atributos_especificos?.habitaciones) && (
                        <div className="flex flex-col gap-1.5">
                          <span className="text-[10px] font-medium tracking-[0.2em] text-white/50 uppercase">Habitaciones</span>
                          <div className="flex items-center gap-2 text-white text-[15px] font-bold">
                            <Bed size={20} weight="light" className="text-white/70" />
                            <span>{propiedad.habitaciones || propiedad.atributos_especificos?.habitaciones} habitaciones</span>
                          </div>
                        </div>
                      )}
                      {(propiedad.banos || propiedad.atributos_especificos?.banos) && (
                        <div className="flex flex-col gap-1.5">
                          <span className="text-[10px] font-medium tracking-[0.2em] text-white/50 uppercase">Baños</span>
                          <div className="flex items-center gap-2 text-white text-[15px] font-bold">
                            <Bathtub size={20} weight="light" className="text-white/70" />
                            <span>{propiedad.banos || propiedad.atributos_especificos?.banos} baños</span>
                          </div>
                        </div>
                      )}
                      {(propiedad.dimensiones || propiedad.atributos_especificos?.dimensiones) && (
                        <div className="flex flex-col gap-1.5">
                          <span className="text-[10px] font-medium tracking-[0.2em] text-white/50 uppercase">Superficie</span>
                          <div className="flex items-center gap-2 text-white text-[15px] font-bold">
                            <Ruler size={20} weight="light" className="text-white/70" />
                            <span>{propiedad.dimensiones || propiedad.atributos_especificos?.dimensiones}</span>
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {propiedad.tipo_propiedad?.toLowerCase() === 'campo' && (
                    <>
                      {(propiedad.dimensiones || propiedad.atributos_especificos?.dimensiones) && (
                        <div className="flex flex-col gap-1.5">
                          <span className="text-[10px] font-medium tracking-[0.2em] text-white/50 uppercase">Hectáreas</span>
                          <div className="flex items-center gap-2 text-white text-[15px] font-bold">
                            <Ruler size={20} weight="light" className="text-white/70" />
                            <span>{propiedad.dimensiones || propiedad.atributos_especificos?.dimensiones} Ha</span>
                          </div>
                        </div>
                      )}
                      {propiedad.atributos_especificos?.tipo_campo && (
                        <div className="flex flex-col gap-1.5">
                          <span className="text-[10px] font-medium tracking-[0.2em] text-white/50 uppercase">Tipo de Campo</span>
                          <div className="flex items-center gap-2 text-white text-[15px] font-bold">
                            <Tree size={20} weight="light" className="text-white/70" />
                            <span className="capitalize">{propiedad.atributos_especificos.tipo_campo}</span>
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {['lote', 'terreno', 'local'].includes(propiedad.tipo_propiedad?.toLowerCase()) && (propiedad.dimensiones || propiedad.atributos_especificos?.dimensiones) && (
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[10px] font-medium tracking-[0.2em] text-white/50 uppercase">Superficie</span>
                      <div className="flex items-center gap-2 text-white text-[15px] font-bold">
                        <Ruler size={20} weight="light" className="text-white/70" />
                        <span>{propiedad.dimensiones || propiedad.atributos_especificos?.dimensiones}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Derecha: Precio y Contacto (Sticky Sidebar) */}
          <div className="lg:w-[35%] flex flex-col">
            <div className="bg-black/30 backdrop-blur-xl border border-white/10 p-8 rounded-3xl flex flex-col gap-8 shadow-2xl sticky top-28 h-full">
              <div>
                <span className="text-[10px] font-medium tracking-[0.3em] text-white/60 uppercase mb-3 block">
                  Valor
                </span>
                <div className="text-[38px] lg:text-[42px] font-light text-white tracking-tight leading-none mb-4">
                  USD {propiedad.precio.toLocaleString('es-AR')}
                </div>
                <div className="flex items-center gap-2 text-white/50 text-[12px] font-light">
                  <IconoTipo tipo={propiedad.tipo_propiedad} size={14} />
                  <span className="capitalize">{propiedad.tipo_propiedad}</span>
                </div>
              </div>

              <div className="w-full h-[1px] bg-white/10" />

              <a
                href={`https://wa.me/5492920123456?text=Hola, me interesa la propiedad: *${propiedad.titulo}* (ID: ${propiedad.id}). ¿Podrían darme más información?`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-3 bg-white hover:bg-white/90 text-roma-olive px-6 py-4 rounded-xl font-bold uppercase tracking-[0.1em] text-[13px] transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)]"
              >
                <WhatsappLogo size={22} weight="light" /> Contactar Asesor
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* LIGHTBOX DE IMÁGENES COMPLETO */}
      <AnimatePresence>
        {imagenModalIndex !== null && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center"
          >
            <button 
              onClick={() => setImagenModalIndex(null)}
              className="absolute top-6 right-6 text-white/70 hover:text-white p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-50"
            >
              <ArrowLeft size={24} weight="light" className="rotate-180" />
            </button>
            
            {imagenes.length > 1 && (
              <div className="absolute inset-y-0 w-full flex items-center justify-between px-6 z-10">
                <button
                  onClick={prevImagenModal}
                  className="bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-all"
                >
                  <CaretLeft size={24} weight="light" />
                </button>
                <button
                  onClick={nextImagenModal}
                  className="bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-all"
                >
                  <CaretRight size={24} weight="light" />
                </button>
              </div>
            )}
            
            <img 
              src={imagenes[imagenModalIndex]} 
              alt="Propiedad" 
              className="max-w-[85vw] max-h-[85vh] object-contain z-0"
            />
            
            {imagenes.length > 1 && (
              <div className="absolute bottom-10 left-0 right-0 flex justify-center gap-2 z-10">
                {imagenes.map((_, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setImagenModalIndex(idx)}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${idx === imagenModalIndex ? 'bg-white scale-125' : 'bg-white/30 hover:bg-white/50'}`}
                  />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
