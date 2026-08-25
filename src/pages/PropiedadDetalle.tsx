import { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import {
  MapPin, WhatsappLogo, HouseLine, Ruler,
  Bed, Buildings, Tree, Storefront, ArrowLeft, Bathtub,
  CaretLeft, CaretRight, X,
} from '@phosphor-icons/react';
import { motion, AnimatePresence } from 'framer-motion';
import PageLoader from '../components/ui/PageLoader';

interface Propiedad {
  id: number;
  titulo: string;
  tipo_propiedad: string;
  operacion: string;
  ubicacion: string;
  coordenadas?: string;
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

function KeyboardLightbox({ active, total, onClose, onNext, onPrev }: {
  active: boolean; total: number;
  onClose: () => void; onNext: () => void; onPrev: () => void;
}) {
  useEffect(() => {
    if (!active || total === 0) return;
    const handle = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'ArrowLeft') onPrev();
    };
    window.addEventListener('keydown', handle);
    return () => window.removeEventListener('keydown', handle);
  }, [active, total, onClose, onNext, onPrev]);
  return null;
}

export default function PropiedadDetalle() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [propiedad, setPropiedad] = useState<Propiedad | null>(null);
  const [loading, setLoading] = useState(true);
  const [imagenModalIndex, setImagenModalIndex] = useState<number | null>(null);
  const [showScreenLoader, setShowScreenLoader] = useState(true);
  const [imagenIndex, setImagenIndex] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setShowScreenLoader(false), 2000);
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
      if (error) console.error('Error fetching property:', error);
      else setPropiedad(data);
      setLoading(false);
    };
    if (id) fetchPropiedad();
  }, [id]);

  if (loading || showScreenLoader) return <PageLoader />;

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

  const imagenesRaw: (string | undefined | null)[] = [
    ...(Array.isArray(propiedad.media_urls) ? propiedad.media_urls : []),
    ...(Array.isArray(propiedad.imagenes) ? propiedad.imagenes : []),
    propiedad.imagen_url,
  ];
  const imagenes: string[] = Array.from(new Set(imagenesRaw.filter((url): url is string => Boolean(url && typeof url === 'string' && url.trim() !== ''))));

  const esCasaDepto = ['casa', 'departamento'].includes(propiedad.tipo_propiedad?.toLowerCase());
  const esCampo = propiedad.tipo_propiedad?.toLowerCase() === 'campo';
  const esLote = ['lote', 'terreno', 'local'].includes(propiedad.tipo_propiedad?.toLowerCase());

  const dims = propiedad.dimensiones || propiedad.atributos_especificos?.dimensiones;
  const habs = propiedad.habitaciones || propiedad.atributos_especificos?.habitaciones;
  const bns  = propiedad.banos || propiedad.atributos_especificos?.banos;
  const tipoCampo = propiedad.atributos_especificos?.tipo_campo;

  const nextImagen = (e: React.MouseEvent) => { e.stopPropagation(); setImagenIndex((p) => (p + 1) % imagenes.length); };
  const prevImagen = (e: React.MouseEvent) => { e.stopPropagation(); setImagenIndex((p) => (p - 1 + imagenes.length) % imagenes.length); };
  const nextModal  = (e: React.MouseEvent) => { e.stopPropagation(); setImagenModalIndex((p) => (p! + 1) % imagenes.length); };
  const prevModal  = (e: React.MouseEvent) => { e.stopPropagation(); setImagenModalIndex((p) => (p! - 1 + imagenes.length) % imagenes.length); };

  return (
    <div className="min-h-screen font-['Inter',system-ui,sans-serif] text-white relative overflow-x-hidden">

      {/* Fondo fijo */}
      <div className="fixed inset-0 z-[-2] bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/fondo-campo.png')", backgroundAttachment: 'fixed' }} />
      <div className="fixed inset-0 z-[-1] bg-black/30" />

      {/* Header */}
      <header className="absolute top-0 left-0 w-full z-50 h-20 sm:h-24 bg-transparent flex items-center px-4 sm:px-6">
        <div className="max-w-screen-xl mx-auto w-full flex items-center justify-between">
          <Link to="/propiedades" className="flex items-center gap-1.5 sm:gap-2 text-white bg-black/20 hover:bg-black/40 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full backdrop-blur-md border border-white/10 text-[11px] sm:text-[12px] font-light tracking-wide transition-colors">
            <ArrowLeft size={14} weight="light" /><span>Volver</span>
          </Link>
          <img src="/roma-logo.png" alt="Roma Inmobiliaria" className="w-[5.5rem] sm:w-[7rem] h-auto object-contain opacity-90" />
        </div>
      </header>

      <main className="pt-24 sm:pt-28 pb-24 px-4 sm:px-6 lg:px-8 max-w-screen-xl mx-auto flex flex-col gap-6 sm:gap-8 relative z-10">

        {/* ══ BLOQUE 1: Título + Ubicación ══ */}
        <section>
          <span className="bg-white/15 backdrop-blur-sm text-white/90 px-3.5 sm:px-4 py-1 sm:py-1.5 rounded-full text-[9px] sm:text-[10px] font-semibold tracking-widest uppercase mb-3 sm:mb-4 inline-block border border-white/10">
            {propiedad.operacion}
          </span>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light text-white leading-tight tracking-tight mb-2 sm:mb-3 drop-shadow-md">
            {propiedad.titulo}
          </h1>
          <div className="flex items-center gap-2 text-white/60 text-[13px] sm:text-[14px] font-light">
            <MapPin size={16} weight="light" />{propiedad.ubicacion}
          </div>
        </section>

        {/* ══ BLOQUE 2: Galería + Precio ══ */}
        <section className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-5 sm:gap-6 lg:gap-8 items-start">

          {/* Galería: miniaturas + imagen principal */}
          <div className="w-full flex flex-col lg:flex-row gap-3 items-stretch lg:items-start">

            {/* Imagen principal (En mobile arriba: order-1, en desktop derecha: lg:order-2) */}
            <div
              className="order-1 lg:order-2 w-full lg:flex-1 h-[260px] sm:h-[340px] md:h-[400px] lg:h-[440px] rounded-2xl overflow-hidden relative group cursor-pointer bg-black/30 border border-white/10 backdrop-blur-xl shadow-2xl shrink-0"
              onClick={() => setImagenModalIndex(imagenIndex)}
            >
              {imagenes.length === 0 ? (
                <div className="w-full h-full flex flex-col items-center justify-center text-white/40">
                  <IconoTipo tipo={propiedad.tipo_propiedad} size={72} />
                  <p className="mt-4 uppercase tracking-[0.2em] text-xs font-medium">Sin imágenes</p>
                </div>
              ) : (
                <>
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={imagenIndex}
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeOut' }}
                      src={imagenes[imagenIndex]}
                      alt={propiedad.titulo}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </AnimatePresence>

                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent pointer-events-none" />

                  {imagenes.length > 1 && (
                    <div className="absolute inset-y-0 w-full flex items-center justify-between px-2.5 sm:px-3 z-10 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                      <button onClick={prevImagen} className="pointer-events-auto bg-black/50 sm:bg-black/40 hover:bg-black/70 text-white p-2 sm:p-2.5 rounded-full backdrop-blur-md border border-white/20 transition-all" aria-label="Anterior">
                        <CaretLeft size={16} weight="light" />
                      </button>
                      <button onClick={nextImagen} className="pointer-events-auto bg-black/50 sm:bg-black/40 hover:bg-black/70 text-white p-2 sm:p-2.5 rounded-full backdrop-blur-md border border-white/20 transition-all" aria-label="Siguiente">
                        <CaretRight size={16} weight="light" />
                      </button>
                    </div>
                  )}

                  {imagenes.length > 1 && (
                    <div className="absolute bottom-3 right-3 z-20 bg-black/55 backdrop-blur-md px-3 py-1 rounded-full border border-white/15 text-white/75 text-[11px] font-mono pointer-events-none">
                      {imagenIndex + 1}/{imagenes.length}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Miniaturas (En mobile abajo: order-2, en desktop izquierda: lg:order-1) */}
            {imagenes.length > 1 && (
              <div className="order-2 lg:order-1 w-full lg:w-[76px] shrink-0">
                <ThumbnailList
                  imagenes={imagenes}
                  imagenIndex={imagenIndex}
                  onSelect={setImagenIndex}
                />
              </div>
            )}
          </div>

          {/* Precio y datos */}
          <div className="w-full h-auto lg:h-[440px] flex flex-col">
            <div className="bg-black/35 backdrop-blur-xl border border-white/10 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col h-full justify-between">

              <div className="p-5 sm:p-7 pb-4 sm:pb-5">
                <div className="flex items-center gap-2 text-white/45 text-[10px] sm:text-[11px] font-light mb-2 sm:mb-3 uppercase tracking-wider">
                  <IconoTipo tipo={propiedad.tipo_propiedad} size={13} />
                  <span className="capitalize">{propiedad.tipo_propiedad}</span>
                  <span className="text-white/20">·</span>
                  <span className="capitalize">{propiedad.operacion}</span>
                </div>
                <div className="text-[26px] sm:text-[32px] lg:text-[36px] font-light text-white tracking-tight leading-none">
                  USD {propiedad.precio.toLocaleString('es-AR')}
                </div>
              </div>

              {(esCasaDepto || esCampo || esLote) && (habs || bns || dims || tipoCampo) && (
                <>
                  <div className="h-[1px] bg-white/10 mx-5 sm:mx-7" />
                  <div className="px-5 sm:px-7 py-4 sm:py-5 flex flex-col gap-3">
                    {esCasaDepto && habs && (
                      <div className="flex items-center gap-3 text-white/80 text-[13px] sm:text-[14px]">
                        <Bed size={18} weight="light" className="text-white/40 shrink-0" />
                        <span>{habs} habitaciones</span>
                      </div>
                    )}
                    {esCasaDepto && bns && (
                      <div className="flex items-center gap-3 text-white/80 text-[13px] sm:text-[14px]">
                        <Bathtub size={18} weight="light" className="text-white/40 shrink-0" />
                        <span>{bns} baños</span>
                      </div>
                    )}
                    {dims && (
                      <div className="flex items-center gap-3 text-white/80 text-[13px] sm:text-[14px]">
                        <Ruler size={18} weight="light" className="text-white/40 shrink-0" />
                        <span>{dims}{esCampo ? ' Ha' : ''}</span>
                      </div>
                    )}
                    {esCampo && tipoCampo && (
                      <div className="flex items-center gap-3 text-white/80 text-[13px] sm:text-[14px]">
                        <Tree size={18} weight="light" className="text-white/40 shrink-0" />
                        <span className="capitalize">{tipoCampo}</span>
                      </div>
                    )}
                  </div>
                </>
              )}

              <div className="px-5 sm:px-7 pb-5 sm:pb-7 mt-auto flex flex-col gap-3">
                <div className="h-[1px] bg-white/10 mb-2" />
                <a
                  href={`https://wa.me/5492920123456?text=Hola, me interesa la propiedad: *${propiedad.titulo}* (ID: ${propiedad.id}). ¿Podrían darme más información?`}
                  target="_blank" rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2.5 bg-white hover:bg-white/90 text-roma-olive px-5 py-3.5 sm:py-4 rounded-xl font-bold uppercase tracking-[0.1em] text-[12px] sm:text-[13px] transition-all shadow-[0_0_20px_rgba(255,255,255,0.15)]"
                >
                  <WhatsappLogo size={20} weight="light" />Contactar Asesor
                </a>
                {(propiedad.coordenadas || propiedad.ubicacion) && (
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      propiedad.coordenadas
                        ? (propiedad.coordenadas.includes(',') || (propiedad.ubicacion && propiedad.coordenadas.toLowerCase().includes(propiedad.ubicacion.toLowerCase()))
                            ? propiedad.coordenadas
                            : `${propiedad.coordenadas}, ${propiedad.ubicacion}`)
                        : propiedad.ubicacion
                    )}`}
                    target="_blank" rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2.5 bg-white/10 hover:bg-white/20 border border-white/15 text-white px-5 py-3.5 sm:py-4 rounded-xl font-bold uppercase tracking-[0.1em] text-[12px] sm:text-[13px] transition-all backdrop-blur-md"
                  >
                    <MapPin size={18} weight="light" />Ver propiedad en Maps
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ══ BLOQUE 3: Descripción ══ */}
        <section className="w-full">
          <div className="bg-black/30 border border-white/10 rounded-2xl sm:rounded-3xl overflow-hidden backdrop-blur-xl shadow-2xl">
            <div className="border-b border-white/10 px-5 sm:px-8 py-4 sm:py-5">
              <h2 className="text-[11px] sm:text-[12px] font-semibold tracking-widest uppercase text-white/55">Descripción</h2>
            </div>
            <div className="p-5 sm:p-8 lg:p-10">
              <p className="text-white/85 leading-[1.8] sm:leading-[1.9] text-[14px] sm:text-[15px] lg:text-[16px] font-normal whitespace-pre-wrap max-w-4xl">
                {propiedad.descripcion || 'Consultanos para recibir la ficha técnica completa y detalles específicos de esta propiedad.'}
              </p>
            </div>
          </div>
        </section>

        {/* Fin Bloque Descripción */}

      </main>

      {/* Lightbox */}
      <AnimatePresence>
        {imagenModalIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center"
            onClick={() => setImagenModalIndex(null)}
          >
            <button onClick={() => setImagenModalIndex(null)} className="absolute top-5 right-5 text-white/70 hover:text-white p-2.5 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-50" aria-label="Cerrar">
              <X size={22} weight="light" />
            </button>

            <div className="absolute top-5 left-5 bg-black/40 backdrop-blur-md text-white/55 text-[12px] font-mono px-3 py-1.5 rounded-full border border-white/10 z-50">
              {imagenModalIndex + 1} / {imagenes.length}
            </div>

            {imagenes.length > 1 && (
              <div className="absolute inset-y-0 w-full flex items-center justify-between px-5 z-10 pointer-events-none">
                <button onClick={prevModal} className="pointer-events-auto bg-white/10 hover:bg-white/25 text-white p-3 rounded-full transition-all" aria-label="Anterior">
                  <CaretLeft size={24} weight="light" />
                </button>
                <button onClick={nextModal} className="pointer-events-auto bg-white/10 hover:bg-white/25 text-white p-3 rounded-full transition-all" aria-label="Siguiente">
                  <CaretRight size={24} weight="light" />
                </button>
              </div>
            )}

            <img
              src={imagenes[imagenModalIndex]}
              alt={propiedad.titulo}
              className="max-w-[88vw] max-h-[88vh] object-contain z-0 rounded-xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />

            {imagenes.length > 1 && (
              <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2 z-10">
                {imagenes.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={(e) => { e.stopPropagation(); setImagenModalIndex(idx); }}
                    className={`w-2 h-2 rounded-full transition-all ${idx === imagenModalIndex ? 'bg-white scale-125' : 'bg-white/30 hover:bg-white/60'}`}
                    aria-label={`Foto ${idx + 1}`}
                  />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <KeyboardLightbox
        active={imagenModalIndex !== null}
        total={imagenes.length}
        onClose={() => setImagenModalIndex(null)}
        onNext={() => setImagenModalIndex((p) => p !== null ? (p + 1) % imagenes.length : 0)}
        onPrev={() => setImagenModalIndex((p) => p !== null ? (p - 1 + imagenes.length) % imagenes.length : 0)}
      />
    </div>
  );
}

/** Componente de lista de miniaturas con scroll automático, scrollbar oculto y soporte responsive */
function ThumbnailList({
  imagenes,
  imagenIndex,
  onSelect,
}: {
  imagenes: string[];
  imagenIndex: number;
  onSelect: (idx: number) => void;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const itemsRef = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const el = itemsRef.current[imagenIndex];
    if (el) {
      el.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'nearest',
      });
    }
  }, [imagenIndex]);

  // En desktop, aislar el scroll de la rueda del mouse para el contenedor vertical
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      if (window.innerWidth >= 1024) {
        e.preventDefault();
        e.stopPropagation();
        container.scrollTop += e.deltaY;
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full lg:w-[76px] h-auto lg:h-[440px] overflow-x-auto lg:overflow-y-auto py-1 lg:py-2 no-scrollbar overscroll-contain touch-pan-x lg:touch-pan-y"
    >
      <div className="flex flex-row lg:flex-col gap-2 pb-1">
        {imagenes.map((img, idx) => (
          <button
            key={idx}
            ref={(el) => { itemsRef.current[idx] = el; }}
            onClick={() => onSelect(idx)}
            className={`relative shrink-0 w-16 h-16 sm:w-20 sm:h-20 lg:w-[76px] lg:h-[76px] rounded-xl overflow-hidden border-2 transition-all duration-200 cursor-pointer ${
              idx === imagenIndex
                ? 'border-white shadow-lg opacity-100 scale-[1.02]'
                : 'border-white/15 opacity-60 hover:opacity-90 hover:border-white/40'
            }`}
            aria-label={`Foto ${idx + 1}`}
          >
            <img src={img} alt={`Miniatura ${idx + 1}`} className="w-full h-full object-cover pointer-events-none" />
          </button>
        ))}
      </div>
    </div>
  );
}

