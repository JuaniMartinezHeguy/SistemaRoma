import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import {
  MapPin, WhatsappLogo, HouseLine, Ruler,
  Bed, Buildings, Tree, Storefront, ArrowLeft, Bathtub,
  CaretLeft, CaretRight, X, ArrowSquareOut,
  CheckCircle, Tag, Info, ShareNetwork
} from '@phosphor-icons/react';
import { motion, AnimatePresence } from 'framer-motion';


interface Propiedad {
  id: number;
  titulo: string;
  tipo_propiedad: string;
  operacion: string;
  provincia?: string;
  ubicacion: string;
  coordenadas?: string;
  precio: number;
  habitaciones?: number;
  banos?: number;
  dimensiones?: string;
  superficie?: string | number;
  mts2?: string | number;
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

interface PropiedadDetalleProps {
  propId?: number;
  initialPropiedad?: Propiedad | null;
  onClose?: () => void;
}

export default function PropiedadDetalle({ propId, initialPropiedad, onClose }: PropiedadDetalleProps) {
  const { id: routeId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const effectiveId = propId || routeId;
  const [propiedad, setPropiedad] = useState<Propiedad | null>(initialPropiedad || null);
  const [loading, setLoading] = useState(!initialPropiedad && Boolean(effectiveId));
  const [imagenModalIndex, setImagenModalIndex] = useState<number | null>(null);
  const [imagenIndex, setImagenIndex] = useState(0);
  const [mostrarCompartir, setMostrarCompartir] = useState(false);
  const [copiado, setCopiado] = useState(false);
  const shareContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (shareContainerRef.current && !shareContainerRef.current.contains(event.target as Node)) {
        setMostrarCompartir(false);
      }
    };
    if (mostrarCompartir) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [mostrarCompartir]);

  const getShareUrl = () => {
    if (typeof window === 'undefined') return '';
    return `${window.location.origin}/propiedad/${propiedad?.id || ''}`;
  };

  const handleShareWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!propiedad) return;
    const url = getShareUrl();
    // Abre directamente WhatsApp con solo el link de la propiedad
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(url)}`, '_blank');
    setMostrarCompartir(false);
  };

  const handleShareFacebook = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!propiedad) return;
    const url = getShareUrl();
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (isMobile) {
      // Abre directamente la app de Messenger con solo el link para seleccionar destinatarios
      window.location.href = `fb-messenger://share/?link=${encodeURIComponent(url)}`;
      setTimeout(() => {
        window.open(`https://www.facebook.com/dialog/send?link=${encodeURIComponent(url)}&app_id=2914944191910609&redirect_uri=${encodeURIComponent(url)}`, '_blank');
      }, 500);
    } else {
      // Diálogo oficial de envío de Messenger / Facebook con solo el link
      window.open(`https://www.facebook.com/dialog/send?link=${encodeURIComponent(url)}&app_id=2914944191910609&redirect_uri=${encodeURIComponent(url)}`, '_blank', 'width=650,height=600');
    }
    setMostrarCompartir(false);
  };

  const handleShareInstagram = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!propiedad) return;
    const url = getShareUrl();

    try {
      await navigator.clipboard.writeText(url);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 3000);
    } catch (_) {}

    // Abre directamente el modal de 'Nuevo mensaje' (seleccionar usuarios) de Instagram
    window.open('https://www.instagram.com/direct/new/', '_blank');
    setMostrarCompartir(false);
  };

  const handleCopyLink = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!propiedad) return;
    const url = getShareUrl();
    try {
      await navigator.clipboard.writeText(url);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 3000);
    } catch (err) {
      console.error('Error al copiar al portapapeles:', err);
    }
  };

  useEffect(() => {
    if (initialPropiedad) {
      setPropiedad(initialPropiedad);
      setLoading(false);
      return;
    }
    if (!propId) window.scrollTo(0, 0);
    const fetchPropiedad = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('propiedades')
        .select('*')
        .eq('id', effectiveId)
        .single();
      if (error) console.error('Error fetching property:', error);
      else setPropiedad(data);
      setLoading(false);
    };
    if (effectiveId) fetchPropiedad();
  }, [effectiveId, propId, initialPropiedad]);

  const handleVolver = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    if (onClose) {
      onClose();
    } else {
      navigate('/propiedades');
    }
  };

  if (loading) {
    return (
      <div className={onClose ? "bg-[#182b19] min-h-screen sm:min-h-0 p-6 sm:p-12 rounded-none sm:rounded-3xl border-0 sm:border border-white/15 text-center text-white flex items-center justify-center" : "min-h-screen bg-[#182b19] text-white flex flex-col items-center justify-center p-6"}>
        <div className="bg-roma-leaf/30 backdrop-blur-md p-8 sm:p-12 rounded-3xl border border-white/15 shadow-2xl text-center max-w-sm mx-auto flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          <p className="text-white/80 text-sm font-medium">Cargando propiedad...</p>
        </div>
      </div>
    );
  }

  if (!propiedad) {
    return (
      <div className={onClose ? "bg-[#182b19] min-h-screen sm:min-h-0 p-6 sm:p-12 rounded-none sm:rounded-3xl border-0 sm:border border-white/15 text-center text-white flex items-center justify-center" : "min-h-screen bg-[#182b19] text-white flex flex-col items-center justify-center p-6"}>
        <div className="bg-roma-leaf/30 backdrop-blur-md p-8 sm:p-12 rounded-3xl border border-white/15 shadow-2xl text-center max-w-md mx-auto">
          <h2 className="text-2xl font-bold mb-4">Propiedad no encontrada</h2>
          <p className="text-white/70 text-sm mb-6">El inmueble solicitado no existe o fue despublicado.</p>
          <button onClick={handleVolver} className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow-lg cursor-pointer">
            Volver al catálogo
          </button>
        </div>
      </div>
    );
  }

  const imagenesRaw: (string | undefined | null)[] = [
    ...(Array.isArray(propiedad.media_urls) ? propiedad.media_urls : []),
    ...(Array.isArray(propiedad.imagenes) ? propiedad.imagenes : []),
    propiedad.imagen_url,
  ];
  const imagenes: string[] = Array.from(new Set(imagenesRaw.filter((url): url is string => Boolean(url && typeof url === 'string' && url.trim() !== ''))));

  const esCampo = propiedad.tipo_propiedad?.toLowerCase() === 'campo';

  let attrs = propiedad.atributos_especificos;
  if (typeof attrs === 'string') {
    try { attrs = JSON.parse(attrs); } catch { attrs = {}; }
  }

  const dims = propiedad.dimensiones || attrs?.dimensiones || propiedad.superficie || propiedad.mts2;
  const habs = propiedad.habitaciones || attrs?.habitaciones;
  const bns  = propiedad.banos || attrs?.banos;
  const tipoCampo = attrs?.tipo_campo || attrs?.actividad || attrs?.aptitud || (propiedad as any).tipo_campo;

  const nextImagen = (e: React.MouseEvent) => { e.stopPropagation(); setImagenIndex((p) => (p + 1) % imagenes.length); };
  const prevImagen = (e: React.MouseEvent) => { e.stopPropagation(); setImagenIndex((p) => (p - 1 + imagenes.length) % imagenes.length); };
  const nextModal  = (e: React.MouseEvent) => { e.stopPropagation(); setImagenModalIndex((p) => (p! + 1) % imagenes.length); };
  const prevModal  = (e: React.MouseEvent) => { e.stopPropagation(); setImagenModalIndex((p) => (p! - 1 + imagenes.length) % imagenes.length); };

  const mapQuery = propiedad.coordenadas
    ? (propiedad.coordenadas.includes(',') || (propiedad.ubicacion && propiedad.coordenadas.toLowerCase().includes(propiedad.ubicacion.toLowerCase()))
        ? propiedad.coordenadas
        : `${propiedad.coordenadas}, ${propiedad.ubicacion}`)
    : propiedad.ubicacion;

  const tipo = propiedad.tipo_propiedad?.toLowerCase() || '';
  const esCampoType = tipo === 'campo';
  const esTerreno = tipo === 'terreno' || tipo === 'lote';
  const esComercial = tipo === 'local' || tipo === 'oficina' || tipo === 'galpon';

  const specsList: { label: string; value: string }[] = [
    {
      label: 'Precio',
      value: `$ ${propiedad.precio.toLocaleString('es-AR')}`
    }
  ];

  if (esCampoType) {
    const supFormatted = dims
      ? (String(dims).toLowerCase().includes('ha') ? String(dims) : `${dims} ha`)
      : '-';
    specsList.push({
      label: 'Superficie',
      value: supFormatted
    });
    if (tipoCampo) {
      specsList.push({
        label: 'Aptitud',
        value: String(tipoCampo)
      });
    }
    specsList.push({
      label: 'Operación',
      value: propiedad.operacion
    });
  } else if (esTerreno) {
    specsList.push({
      label: 'Superficie',
      value: dims ? `${dims} m²` : '-'
    });
    specsList.push({
      label: 'Inmueble',
      value: propiedad.tipo_propiedad
    });
    specsList.push({
      label: 'Operación',
      value: propiedad.operacion
    });
  } else if (esComercial) {
    specsList.push({
      label: 'Superficie',
      value: dims ? `${dims} m²` : '-'
    });
    if (bns) {
      specsList.push({
        label: 'Baños',
        value: String(bns)
      });
    }
    specsList.push({
      label: 'Operación',
      value: propiedad.operacion
    });
  } else {
    // Residencial (Casa, Depto, Dúplex, etc.)
    specsList.push({
      label: 'Dormitorios',
      value: habs ? String(habs) : '-'
    });
    specsList.push({
      label: 'Baños',
      value: bns ? String(bns) : '-'
    });
    const supFormatted = dims
      ? (String(dims).toLowerCase().includes('m') || String(dims).toLowerCase().includes('ha') ? String(dims) : `${dims} m²`)
      : '-';
    specsList.push({
      label: 'Superficie',
      value: supFormatted
    });
  }

  const cardElement = (
    <div className="w-full max-w-6xl mx-auto bg-[#182b19] rounded-none sm:rounded-[32px] md:rounded-[40px] border-0 sm:border border-white/15 shadow-none sm:shadow-[0_25px_70px_rgba(0,0,0,0.6)] overflow-hidden relative min-h-full sm:min-h-0 flex-1 flex flex-col">

      {/* ── 1. HERO CON IMAGEN NÍTIDA Y DEGRADÉ DESDE MÁS ABAJO ── */}
      <div className="relative z-30 min-h-[60vh] sm:min-h-[75vh] md:min-h-[82vh] flex flex-col justify-between p-4 sm:p-7 lg:p-10">

        {/* Imagen Principal Nítida de Fondo */}
        <div className="absolute inset-0 z-0 overflow-hidden rounded-none sm:rounded-t-[32px] md:rounded-t-[40px]">
          {imagenes.length > 0 ? (
            <img
              src={imagenes[0]}
              alt={propiedad.titulo}
              className="w-full h-full object-cover opacity-95 transition-transform duration-700 hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-[#182b19]" />
          )}
          {/* Sombra sutil arriba para legibilidad del header + Degradé verde abajo */}
          <div className="absolute top-0 inset-x-0 h-28 bg-gradient-to-b from-black/60 to-transparent" />
          <div className="absolute bottom-0 inset-x-0 h-56 sm:h-96 bg-gradient-to-t from-[#182b19] via-[#182b19]/90 to-transparent" />
        </div>

        {/* Header propio sobre la imagen */}
        <header className="relative z-10 flex items-center justify-between gap-4">
          <button
            onClick={handleVolver}
            className="flex items-center gap-2 text-white bg-black/30 hover:bg-black/50 px-4 py-2.5 rounded-full backdrop-blur-md border border-white/20 text-xs font-semibold tracking-wide transition-all shadow-lg active:scale-95 cursor-pointer"
          >
            <ArrowLeft size={16} weight="bold" />
            <span>Volver al catálogo</span>
          </button>

          <div className="flex items-center gap-3">
            <img src="/logoblanco.png" alt="Roma Servicios Inmobiliarios" className="h-10 sm:h-12 w-auto object-contain filter drop-shadow-lg" />
          </div>
        </header>

          {/* Título & Ubicación (Posicionado más arriba) */}
          <div className="relative z-10 pt-4 sm:pt-6 pb-2 my-2 sm:my-4 max-w-3xl">
            <div className="flex items-center gap-2 mb-2.5 flex-wrap">
              <span className="bg-black/35 backdrop-blur-md text-white px-3.5 py-1 rounded-full text-[10px] sm:text-[11px] font-bold tracking-[0.2em] uppercase border border-white/20 shadow-sm flex items-center gap-1.5">
                <Tag size={12} weight="fill" className="text-white/90" />
                {propiedad.operacion}
              </span>
              <span className="bg-roma-leaf/60 backdrop-blur-md text-white px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-bold tracking-[0.15em] uppercase border border-white/20 shadow-sm">
                {propiedad.tipo_propiedad}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight mb-2.5 drop-shadow-md">
              {propiedad.titulo}
            </h1>

            <div className="flex items-center gap-2 text-white/90 text-xs sm:text-sm font-medium drop-shadow">
              <MapPin size={16} weight="fill" className="text-white shrink-0" />
              <span>{propiedad.ubicacion}{propiedad.provincia ? `, ${propiedad.provincia}` : ''}</span>
            </div>
          </div>

          {/* ── AL PIE DEL HERO: DATOS 100% SOBRE EL FONDO VERDE ── */}
          <div className="relative z-10 w-full mt-auto pt-6 border-t border-white/15">
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 py-1">
              
              {/* Franja de Datos Numéricos Dinámicos sobre el Fondo Verde según el Tipo de Propiedad */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-5 flex-1">
                
                {specsList.map((item, idx) => (
                  <div
                    key={idx}
                    className={idx < specsList.length - 1 ? "border-r border-white/15 pr-2.5 sm:pr-3" : ""}
                  >
                    <div className="text-[10px] uppercase tracking-widest text-white/60 font-mono mb-0.5">
                      {item.label}
                    </div>
                    <div className="font-mono text-lg sm:text-xl md:text-2xl lg:text-3xl font-black text-white tracking-tight tabular-nums truncate">
                      {item.value}
                    </div>
                  </div>
                ))}

              </div>

              {/* Botones de Acción: Contactar Asesor + Compartir Propiedad */}
              <div className="flex flex-col gap-2 shrink-0 relative" ref={shareContainerRef}>
                {/* Botón de Acción Principal (Verde con letras blancas) */}
                <a
                  href={`https://wa.me/5492914136535?text=Hola, me interesa la propiedad: *${propiedad.titulo}* (ID: ${propiedad.id}). ¿Podrían darme más información?`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3.5 rounded-2xl font-bold uppercase tracking-wider text-xs sm:text-sm transition-all shadow-xl flex items-center justify-center gap-2.5 active:scale-95 cursor-pointer border border-emerald-400/30"
                >
                  <WhatsappLogo size={20} weight="fill" className="text-white" />
                  <span>Contactar Asesor</span>
                </a>

                {/* Botón Compartir Propiedad */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setMostrarCompartir(!mostrarCompartir)}
                    className="w-full bg-[#162a18]/90 hover:bg-[#1c351e] text-emerald-100 hover:text-white px-4 py-2.5 rounded-xl font-medium tracking-wide text-xs transition-all flex items-center justify-center gap-2 border border-roma-leaf/35 cursor-pointer active:scale-95 shadow-md"
                  >
                    <ShareNetwork size={16} weight="bold" className="text-emerald-300" />
                    <span>Compartir propiedad</span>
                  </button>

                  {/* Contenedor horizontal de iconos de compartir */}
                  <AnimatePresence>
                    {mostrarCompartir && (
                      <motion.div
                        initial={{ opacity: 0, y: -6, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -6, scale: 0.95 }}
                        transition={{ duration: 0.16 }}
                        className="absolute right-0 top-full mt-3 bg-[#112313] border border-roma-leaf/40 rounded-full px-3 py-2 shadow-[0_25px_60px_rgba(0,0,0,0.95)] z-[100] flex items-center justify-center gap-3"
                      >
                        {/* WhatsApp */}
                        <button
                          type="button"
                          onClick={handleShareWhatsApp}
                          title="Compartir por WhatsApp"
                          className="w-10 h-10 rounded-full bg-[#1c3620] hover:bg-roma-olive text-white flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 shadow-lg cursor-pointer shrink-0"
                        >
                          <i className="fab fa-whatsapp text-[18px]" />
                        </button>

                        {/* Instagram */}
                        <button
                          type="button"
                          onClick={handleShareInstagram}
                          title="Compartir por Instagram"
                          className="w-10 h-10 rounded-full bg-[#1c3620] hover:bg-roma-olive text-white flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 shadow-lg cursor-pointer shrink-0"
                        >
                          <i className="fab fa-instagram text-[18px]" />
                        </button>

                        {/* Facebook */}
                        <button
                          type="button"
                          onClick={handleShareFacebook}
                          title="Compartir por Messenger / Facebook"
                          className="w-10 h-10 rounded-full bg-[#1c3620] hover:bg-roma-olive text-white flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 shadow-lg cursor-pointer shrink-0"
                        >
                          <i className="fab fa-facebook-f text-[17px]" />
                        </button>

                        {/* Copiar Enlace Directo */}
                        <button
                          type="button"
                          onClick={handleCopyLink}
                          title={copiado ? '¡Enlace copiado!' : 'Copiar enlace'}
                          className={`w-10 h-10 rounded-full transition-all duration-300 shadow-lg cursor-pointer active:scale-95 shrink-0 flex items-center justify-center ${
                            copiado
                              ? 'bg-roma-olive text-white'
                              : 'bg-[#1c3620] hover:bg-roma-olive text-white hover:scale-110'
                          }`}
                        >
                          <i className={`fas ${copiado ? 'fa-check text-emerald-300' : 'fa-link'} text-[15px]`} />
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* ── 2. CONTINUACIÓN CON EL MISMO FONDO VERDE DENSE ── */}
        <div className="p-4 sm:p-7 lg:p-10 space-y-10 sm:space-y-14 relative z-10 border-t border-white/10">

          {/* ══ GALERÍA DE IMÁGENES ══ */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                Galería de Fotografías
              </h2>
              {imagenes.length > 0 && (
                <span className="text-xs font-mono text-white/70 bg-white/10 px-3 py-1 rounded-full border border-white/15">
                  {imagenes.length} fotos
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_80px] gap-3.5 items-start">
              
              {/* Imagen Principal Interactivas */}
              <div
                className="w-full h-[300px] sm:h-[400px] md:h-[460px] rounded-2xl sm:rounded-3xl overflow-hidden relative group cursor-pointer bg-[#122313] border border-white/15 shadow-xl shrink-0"
                onClick={() => setImagenModalIndex(imagenIndex)}
              >
                {imagenes.length === 0 ? (
                  <div className="w-full h-full flex flex-col items-center justify-center text-white/40 p-6 text-center">
                    <IconoTipo tipo={propiedad.tipo_propiedad} size={64} />
                    <p className="mt-4 uppercase tracking-[0.2em] text-xs font-medium">Fotografías en preparación</p>
                  </div>
                ) : (
                  <>
                    <AnimatePresence mode="wait">
                      <motion.img
                        key={imagenIndex}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeOut' }}
                        src={imagenes[imagenIndex]}
                        alt={propiedad.titulo}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    </AnimatePresence>

                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

                    {imagenes.length > 1 && (
                      <div className="absolute inset-y-0 w-full flex items-center justify-between px-3 sm:px-4 z-10 pointer-events-none">
                        <button
                          onClick={prevImagen}
                          className="pointer-events-auto bg-black/50 hover:bg-black/70 text-white p-2.5 sm:p-3 rounded-full backdrop-blur-md border border-white/20 transition-all shadow-lg active:scale-95 cursor-pointer"
                          aria-label="Anterior"
                        >
                          <CaretLeft size={18} weight="bold" />
                        </button>
                        <button
                          onClick={nextImagen}
                          className="pointer-events-auto bg-black/50 hover:bg-black/70 text-white p-2.5 sm:p-3 rounded-full backdrop-blur-md border border-white/20 transition-all shadow-lg active:scale-95 cursor-pointer"
                          aria-label="Siguiente"
                        >
                          <CaretRight size={18} weight="bold" />
                        </button>
                      </div>
                    )}

                    {imagenes.length > 1 && (
                      <div className="absolute bottom-4 right-4 z-20 bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20 text-white text-xs font-mono">
                        {imagenIndex + 1} / {imagenes.length}
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Tira de Miniaturas */}
              {imagenes.length > 1 && (
                <div className="w-full shrink-0">
                  <ThumbnailList
                    imagenes={imagenes}
                    imagenIndex={imagenIndex}
                    onSelect={setImagenIndex}
                    onOpenModal={setImagenModalIndex}
                  />
                </div>
              )}

            </div>
          </section>

          {/* ══ CARACTERÍSTICAS FICHAS ══ */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">

            {/* Fichas de Características */}
            <div className="lg:col-span-1 space-y-3.5">
              <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                <Info size={18} weight="light" className="text-white/80" />
                Especificaciones
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
                
                {/* Tipo Inmueble */}
                <div className="bg-white/10 border border-white/15 p-4 rounded-2xl backdrop-blur-md flex items-center gap-3.5 shadow-sm">
                  <div className="h-10 w-10 bg-white/10 rounded-xl flex items-center justify-center shrink-0 text-white">
                    <IconoTipo tipo={propiedad.tipo_propiedad} size={20} />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-white/50 font-mono">Inmueble</div>
                    <div className="text-sm font-bold text-white capitalize">{propiedad.tipo_propiedad}</div>
                  </div>
                </div>

                {/* Operación */}
                <div className="bg-white/10 border border-white/15 p-4 rounded-2xl backdrop-blur-md flex items-center gap-3.5 shadow-sm">
                  <div className="h-10 w-10 bg-white/10 rounded-xl flex items-center justify-center shrink-0 text-white">
                    <Tag size={20} weight="light" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-white/50 font-mono">Operación</div>
                    <div className="text-sm font-bold text-white capitalize">{propiedad.operacion}</div>
                  </div>
                </div>

                {/* Superficie / m² */}
                <div className="bg-white/10 border border-white/15 p-4 rounded-2xl backdrop-blur-md flex items-center gap-3.5 shadow-sm">
                  <div className="h-10 w-10 bg-white/10 rounded-xl flex items-center justify-center shrink-0 text-white">
                    <Ruler size={20} weight="light" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-white/50 font-mono">Superficie</div>
                    <div className="text-sm font-bold text-white font-mono">{dims ? `${dims}${esCampo ? ' Ha' : ' m²'}` : '- m²'}</div>
                  </div>
                </div>

                {/* Dormitorios / Ambientes */}
                {habs && (
                  <div className="bg-white/10 border border-white/15 p-4 rounded-2xl backdrop-blur-md flex items-center gap-3.5 shadow-sm">
                    <div className="h-10 w-10 bg-white/10 rounded-xl flex items-center justify-center shrink-0 text-white">
                      <Bed size={20} weight="light" />
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-white/50 font-mono">Dormitorios</div>
                      <div className="text-sm font-bold text-white font-mono">{habs} habitaciones</div>
                    </div>
                  </div>
                )}

                {/* Baños */}
                {bns && (
                  <div className="bg-white/10 border border-white/15 p-4 rounded-2xl backdrop-blur-md flex items-center gap-3.5 shadow-sm">
                    <div className="h-10 w-10 bg-white/10 rounded-xl flex items-center justify-center shrink-0 text-white">
                      <Bathtub size={20} weight="light" />
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-white/50 font-mono">Baños</div>
                      <div className="text-sm font-bold text-white font-mono">{bns} baños</div>
                    </div>
                  </div>
                )}

                {/* Aptitud de Campo */}
                {esCampo && tipoCampo && (
                  <div className="bg-white/10 border border-white/15 p-4 rounded-2xl backdrop-blur-md flex items-center gap-3.5 shadow-sm">
                    <div className="h-10 w-10 bg-white/10 rounded-xl flex items-center justify-center shrink-0 text-white">
                      <Tree size={20} weight="light" />
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-white/50 font-mono">Aptitud</div>
                      <div className="text-sm font-bold text-white capitalize">{tipoCampo}</div>
                    </div>
                  </div>
                )}

                {/* Estado */}
                <div className="bg-white/10 border border-white/15 p-4 rounded-2xl backdrop-blur-md flex items-center gap-3.5 shadow-sm">
                  <div className="h-10 w-10 bg-white/10 rounded-xl flex items-center justify-center shrink-0 text-white">
                    <CheckCircle size={20} weight="light" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-white/50 font-mono">Estado</div>
                    <div className="text-sm font-bold text-emerald-400">Disponible</div>
                  </div>
                </div>

              </div>
            </div>

            {/* Narrativa de Descripción */}
            <div className="lg:col-span-2 space-y-3.5">
              <h3 className="text-xl font-bold text-white mb-2">
                Descripción General
              </h3>
              
              <div className="bg-white/10 border border-white/15 rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-xl h-full flex flex-col justify-between">
                <p className="text-white/90 leading-relaxed text-base font-normal whitespace-pre-wrap">
                  {propiedad.descripcion || 'Consultanos para recibir la ficha técnica completa, plano comercial y detalles específicos de esta propiedad.'}
                </p>

                <div className="mt-8 pt-6 border-t border-white/15 flex items-center justify-between flex-wrap gap-4 text-xs text-white/60 font-mono">
                  <span>Código de Ref: #{propiedad.id}</span>
                  <span>Roma Servicios Inmobiliarios</span>
                </div>
              </div>
            </div>

          </section>

          {/* ══ UBICACIÓN / MAPA SATELITAL ══ */}
          {(propiedad.coordenadas || propiedad.ubicacion) && (
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <MapPin size={22} weight="fill" className="text-white/80" />
                  Ubicación & Entorno
                </h3>
              </div>

              <div className="relative rounded-3xl overflow-hidden border border-white/15 bg-black/30 shadow-xl h-[400px] sm:h-[480px]">
                {/* Contenedor recortado para eliminar la caja blanca superior de Google Maps */}
                <div className="absolute inset-0 overflow-hidden">
                  <iframe
                    title="Ubicación de la propiedad"
                    width="100%"
                    height="100%"
                    className="absolute -top-24 -left-8 w-[calc(100%+64px)] h-[calc(100%+140px)] border-0 transition-all duration-500"
                    loading="lazy"
                    allowFullScreen
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(mapQuery)}&t=k&z=16&ie=UTF8&iwloc=near&output=embed`}
                  />
                </div>

                {/* Tarjeta Flotante Minimalista */}
                <div className="absolute bottom-4 left-4 right-4 sm:right-auto max-w-sm sm:max-w-md bg-[#122313]/90 backdrop-blur-md border border-white/15 p-4 sm:p-5 rounded-2xl shadow-xl z-20 space-y-3.5">
                  <div className="space-y-1">
                    <div className="text-[11px] uppercase tracking-wider text-white/50 font-mono flex items-center gap-1.5">
                      <span>Dirección</span>
                      <MapPin size={14} weight="fill" className="text-white/70 shrink-0" />
                    </div>

                    <div className="text-sm sm:text-base font-bold text-white leading-snug break-words">
                      {propiedad.coordenadas || propiedad.ubicacion}
                    </div>
                  </div>

                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-white/10 hover:bg-white/20 text-white/90 hover:text-white py-2.5 px-4 rounded-xl text-xs font-medium flex items-center justify-center gap-2 transition-all border border-white/15 active:scale-95 cursor-pointer shadow-sm"
                  >
                    <span>Abrir en Google Maps</span>
                    <ArrowSquareOut size={15} weight="light" />
                  </a>
                </div>
              </div>
            </section>
          )}

          {/* ══ CIERRE FINAL CON CTA CENTRADO Y LOGO ══ */}
          <section className="text-center py-8 sm:py-12 border-t border-white/15 max-w-2xl mx-auto space-y-6">
            <img src="/logoblanco.png" alt="Roma Servicios Inmobiliarios" className="h-11 sm:h-13 w-auto mx-auto object-contain opacity-95" />
            
            <div className="space-y-2">
              <h3 className="text-2xl sm:text-3xl font-black text-white">
                ¿Te interesa esta propiedad?
              </h3>
              <p className="text-white/80 text-sm font-medium leading-relaxed max-w-md mx-auto">
                Ponete en contacto directo con nuestro equipo para agendar una visita presencial o solicitar la ficha técnica detallada.
              </p>
            </div>

            <div className="pt-2">
              <a
                href={`https://wa.me/5492914136535?text=Hola, me interesa la propiedad: *${propiedad.titulo}* (ID: ${propiedad.id}). ¿Podrían darme más información?`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-4 rounded-2xl font-bold uppercase tracking-wider text-xs sm:text-sm transition-all shadow-xl hover:scale-105 active:scale-95 cursor-pointer border border-emerald-400/30"
              >
                <WhatsappLogo size={22} weight="fill" className="text-white" />
                <span>Hablar con un asesor</span>
              </a>
            </div>
          </section>

        </div>

      </div>
    );

  // Bloquear totalmente el scroll del body, html y touch cuando la imagen está ampliada
  useEffect(() => {
    if (imagenModalIndex !== null) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      document.body.style.touchAction = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      document.body.style.touchAction = '';
    };
  }, [imagenModalIndex]);

  const fullContent = (
    <>
      {cardElement}

      {/* Lightbox Modal para Fotografías mediante Portal a document.body (Se abre directo en pantalla completa) */}
      {imagenModalIndex !== null && createPortal(
        <AnimatePresence mode="wait">
          <motion.div
            key="lightbox-portal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[9999999] bg-[#182b19] w-screen h-screen flex flex-col items-center justify-center p-3 sm:p-8 overflow-hidden touch-none select-none"
            onClick={() => setImagenModalIndex(null)}
            onTouchMove={(e) => e.preventDefault()}
            onWheel={(e) => e.preventDefault()}
          >
            {/* Cruz para salir y volver */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setImagenModalIndex(null);
              }}
              className="absolute top-5 right-5 text-white bg-black/60 hover:bg-black/90 p-3.5 sm:p-4 rounded-full border border-white/30 transition-all z-[100] cursor-pointer shadow-2xl active:scale-95 flex items-center justify-center"
              aria-label="Cerrar y volver a la propiedad"
              title="Cerrar galería"
            >
              <X size={26} weight="bold" />
            </button>

            {/* Contador de Fotos */}
            <div className="absolute top-5 left-5 bg-black/50 backdrop-blur-md text-white/90 text-xs font-mono px-4 py-2 rounded-full border border-white/20 z-[100] shadow-md">
              {imagenModalIndex + 1} / {imagenes.length}
            </div>

            {/* Flechas de Navegación */}
            {imagenes.length > 1 && (
              <div className="absolute inset-y-0 w-full flex items-center justify-between px-3 sm:px-8 z-[90] pointer-events-none">
                <button
                  onClick={prevModal}
                  className="pointer-events-auto bg-black/60 hover:bg-black/85 text-white p-3.5 sm:p-4 rounded-full backdrop-blur-md border border-white/25 transition-all active:scale-95 cursor-pointer shadow-2xl"
                  aria-label="Anterior"
                >
                  <CaretLeft size={26} weight="bold" />
                </button>
                <button
                  onClick={nextModal}
                  className="pointer-events-auto bg-black/60 hover:bg-black/85 text-white p-3.5 sm:p-4 rounded-full backdrop-blur-md border border-white/25 transition-all active:scale-95 cursor-pointer shadow-2xl"
                  aria-label="Siguiente"
                >
                  <CaretRight size={26} weight="bold" />
                </button>
              </div>
            )}

            {/* Imagen Centrada */}
            <motion.img
              key={imagenModalIndex}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              src={imagenes[imagenModalIndex]}
              alt={propiedad.titulo}
              className="max-w-[92vw] sm:max-w-[88vw] max-h-[82vh] object-contain z-[80] rounded-2xl sm:rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.9)] border border-white/20"
              onClick={(e) => e.stopPropagation()}
            />

            {/* Puntos Indicadores al Pie */}
            {imagenes.length > 1 && (
              <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 z-[90]">
                {imagenes.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={(e) => { e.stopPropagation(); setImagenModalIndex(idx); }}
                    className={`h-2 rounded-full transition-all cursor-pointer ${idx === imagenModalIndex ? 'w-6 bg-white' : 'w-2 bg-white/40 hover:bg-white/70'}`}
                    aria-label={`Foto ${idx + 1}`}
                  />
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>,
        document.body
      )}

      <KeyboardLightbox
        active={imagenModalIndex !== null}
        total={imagenes.length}
        onClose={() => setImagenModalIndex(null)}
        onNext={() => setImagenModalIndex((p) => p !== null ? (p + 1) % imagenes.length : 0)}
        onPrev={() => setImagenModalIndex((p) => p !== null ? (p - 1 + imagenes.length) % imagenes.length : 0)}
      />
    </>
  );

  if (onClose) {
    return fullContent;
  }

  return (
    <div className="min-h-screen bg-[#182b19] text-white font-sans py-0 sm:py-6 md:py-8 px-0 sm:px-4 lg:px-6 relative overflow-x-hidden selection:bg-roma-leaf selection:text-white">
      {fullContent}
    </div>
  );
}

/** Componente de lista de miniaturas vertical u horizontal */
function ThumbnailList({
  imagenes,
  imagenIndex,
  onSelect,
  onOpenModal,
}: {
  imagenes: string[];
  imagenIndex: number;
  onSelect: (idx: number) => void;
  onOpenModal: (idx: number) => void;
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

  return (
    <div
      ref={containerRef}
      className="w-full lg:w-[80px] h-auto lg:h-[460px] overflow-x-auto lg:overflow-y-auto py-1 lg:py-2 no-scrollbar overscroll-contain touch-pan-x lg:touch-pan-y"
    >
      <div className="flex flex-row lg:flex-col gap-2.5 pb-1">
        {imagenes.map((img, idx) => (
          <button
            key={idx}
            ref={(el) => { itemsRef.current[idx] = el; }}
            onClick={() => {
              onSelect(idx);
              onOpenModal(idx);
            }}
            className={`relative shrink-0 w-16 h-16 sm:w-20 sm:h-20 lg:w-[80px] lg:h-[80px] rounded-xl overflow-hidden border-2 transition-all duration-200 cursor-pointer ${
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
