import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import useOpcionesFiltros from '../hooks/useOpcionesFiltros';
import {
  MapPin, WhatsappLogo, HouseLine, Tag, MapTrifold, CaretLeft,
  X, Ruler, CaretRight, MagnifyingGlass,
  Bed, Star, Buildings, Tree, Storefront, ArrowLeft, SlidersHorizontal, Bathtub
} from '@phosphor-icons/react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import PageLoader from '../components/ui/PageLoader';

// ─── Tipos ────────────────────────────────────────────────────────────────────
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


const EASE = [0.22, 1, 0.36, 1] as const;
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

function IconoTipo({ tipo, size = 20 }: { tipo: string; size?: number }) {
  switch (tipo?.toLowerCase()) {
    case 'campo': return <Tree size={size} weight="light" />;
    case 'local': return <Storefront size={size} weight="light" />;
    case 'departamento': return <Buildings size={size} weight="light" />;
    default: return <HouseLine size={size} weight="light" />;
  }
}

// ─── Componente principal ─────────────────────────────────────────────────────
export default function Catalogo() {
  // 1. ESTO OBLIGA AL NAVEGADOR A IR AL TOPE DE LA PÁGINA AL ENTRAR
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant'
    });
  }, []);

  const navigate = useNavigate();

  const [showScreenLoader, setShowScreenLoader] = useState(true);
  const [heroDismissed, setHeroDismissed] = useState(false); // ESTADO PARA EL SCROLL-JACK

  const [propiedades, setPropiedades] = useState<Propiedad[]>([]);
  const [loading, setLoading] = useState(true);

  // Opciones dinámicas de filtros (leídas de propiedades publicadas)
  const { tipos: TIPOS, ubicaciones: UBICACIONES, operaciones: OPERACIONES, habitaciones: HABITACIONES, tiposCampo: TIPOS_CAMPO } = useOpcionesFiltros();

  // Filtros
  const [filtroTipo, setFiltroTipo] = useState('Todos');
  const [filtroUbicacion, setFiltroUbicacion] = useState('Todas');
  const [filtroOperacion, setFiltroOperacion] = useState('Todas');
  const [filtroTipoCampo, setFiltroTipoCampo] = useState('Todos');
  const [filtroHabs, setFiltroHabs] = useState<number | null>(null);
  const [filtroPrecioMin, setFiltroPrecioMin] = useState('');
  const [filtroPrecioMax, setFiltroPrecioMax] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [ordenar, setOrdenar] = useState('recientes');

  // UI
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [destacadaIndex, setDestacadaIndex] = useState(0);

  // ─── 1. EFECTO: Screen Loader Inicial ───
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowScreenLoader(false);
    }, 2200);
    return () => clearTimeout(timer);
  }, []);

  // ─── 2. EFECTO: Scroll-Jack (Desaparece hero en el primer scroll) ───
  useEffect(() => {
    if (showScreenLoader || heroDismissed) return;

    const handleUserScroll = (e: WheelEvent | TouchEvent | KeyboardEvent) => {
      if (e.type === 'keydown') {
        const key = (e as KeyboardEvent).key;
        if (['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', ' '].includes(key)) {
          setHeroDismissed(true);
        }
      } else {
        setHeroDismissed(true);
      }
    };

    window.addEventListener('wheel', handleUserScroll, { passive: false });
    window.addEventListener('touchmove', handleUserScroll, { passive: false });
    window.addEventListener('keydown', handleUserScroll);

    return () => {
      window.removeEventListener('wheel', handleUserScroll);
      window.removeEventListener('touchmove', handleUserScroll);
      window.removeEventListener('keydown', handleUserScroll);
    };
  }, [showScreenLoader, heroDismissed]);

  // ─── 3. EFECTO: Bloqueo Maestro de Scroll ───
  useEffect(() => {
    if (showScreenLoader || !heroDismissed) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [showScreenLoader, heroDismissed]);

  // ─── Fetch ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchPropiedades = async () => {
      setLoading(true);
      let query = supabase.from('propiedades').select('*').eq('estado', 'publicado');
      if (filtroTipo !== 'Todos') query = query.eq('tipo_propiedad', filtroTipo);
      if (filtroUbicacion !== 'Todas') query = query.eq('ubicacion', filtroUbicacion);
      if (filtroOperacion !== 'Todas') query = query.eq('operacion', filtroOperacion);
      if (filtroTipoCampo !== 'Todos') query = query.contains('atributos_especificos', { tipo_campo: filtroTipoCampo });
      if (filtroHabs !== null) {
        if (filtroHabs === 4) query = query.gte('habitaciones', 4);
        else query = query.eq('habitaciones', filtroHabs);
      }
      if (filtroPrecioMin) query = query.gte('precio', parseFloat(filtroPrecioMin));
      if (filtroPrecioMax) query = query.lte('precio', parseFloat(filtroPrecioMax));

      const { data } = await query;
      let result: Propiedad[] = data ?? [];

      if (busqueda.trim()) {
        const q = busqueda.toLowerCase();
        result = result.filter(
          p => p.titulo?.toLowerCase().includes(q) || p.ubicacion?.toLowerCase().includes(q)
        );
      }

      if (ordenar === 'asc') result.sort((a, b) => a.precio - b.precio);
      else if (ordenar === 'desc') result.sort((a, b) => b.precio - a.precio);
      else if (ordenar === 'destacadas') result.sort((a, b) => (b.destacada ? 1 : 0) - (a.destacada ? 1 : 0));

      setPropiedades(result);
      setLoading(false);
    };
    fetchPropiedades();
  }, [filtroTipo, filtroUbicacion, filtroOperacion, filtroTipoCampo, filtroHabs, filtroPrecioMin, filtroPrecioMax, busqueda, ordenar]);

  const propiedadesDestacadas = propiedades.filter(p => p.destacada);

  useEffect(() => {
    if (propiedadesDestacadas.length <= 1) return;
    const interval = setInterval(() => {
      if (heroDismissed) {
        setDestacadaIndex(prev => (prev + 1) % propiedadesDestacadas.length);
      }
    }, 6000);
    return () => clearInterval(interval);
  }, [propiedadesDestacadas.length, heroDismissed]);

  const abrirModal = (p: Propiedad) => { navigate(`/propiedad/${p.id}`); };
  const activeDestacada = propiedadesDestacadas[destacadaIndex];

  const limpiarFiltros = () => {
    setFiltroTipo('Todos');
    setFiltroUbicacion('Todas');
    setFiltroOperacion('Todas');
    setFiltroTipoCampo('Todos');
    setFiltroHabs(null);
    setFiltroPrecioMin('');
    setFiltroPrecioMax('');
    setBusqueda('');
  };

  const filtrosActivos = [
    filtroTipo !== 'Todos' && { label: filtroTipo, clear: () => setFiltroTipo('Todos') },
    filtroUbicacion !== 'Todas' && { label: filtroUbicacion, clear: () => setFiltroUbicacion('Todas') },
    filtroOperacion !== 'Todas' && { label: filtroOperacion, clear: () => setFiltroOperacion('Todas') },
    filtroTipoCampo !== 'Todos' && { label: filtroTipoCampo, clear: () => setFiltroTipoCampo('Todos') },
    filtroHabs !== null && { label: `${filtroHabs}${filtroHabs === 4 ? '+' : ''} hab.`, clear: () => setFiltroHabs(null) },
  ].filter(Boolean) as { label: string; clear: () => void }[];

  const hayFiltros = filtrosActivos.length > 0 || busqueda.trim() !== '';

  const precioMinimoCargado = propiedades.length > 0 ? Math.min(...propiedades.map(p => p.precio || 0)) : 0;

  // ─── Sidebar content ────────────────────────────────────────────────────────
  const SidebarContent = () => (
    <div className="flex flex-col gap-0 pb-4">
      <div className="border-b border-white/10 py-5 px-1">
        <p className="text-[10px] font-medium tracking-[0.2em] text-white uppercase mb-3 flex items-center gap-1.5 opacity-90">
          <MagnifyingGlass size={14} weight="light" /> Búsqueda rápida
        </p>
        <div className="relative">
          <MagnifyingGlass
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none"
          />
          <input
            type="text"
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            placeholder="Nombre, ciudad..."
            className="w-full bg-black/10 border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-[13px] text-white placeholder:text-white/40 outline-none focus:border-white/40 transition-colors"
          />
        </div>
      </div>

      <div className="border-b border-white/10 py-5 px-1">
        <p className="text-[10px] font-medium tracking-[0.2em] text-white uppercase mb-3 flex items-center gap-1.5 opacity-90">
          <HouseLine size={14} weight="light" /> Tipo de propiedad
        </p>
        <div className="flex flex-wrap gap-2">
          {['Todos', ...TIPOS].map(t => (
            <button
              key={t}
              onClick={() => { setFiltroTipo(t); if (t !== 'Campo') setFiltroTipoCampo('Todos'); }}
              className={`px-4 py-1.5 rounded-full text-[12px] font-normal tracking-wide border transition-all duration-300 ${filtroTipo === t
                ? 'bg-white border-white text-roma-olive shadow-sm'
                : 'bg-transparent border-white/30 text-white/90 hover:border-white/60'
                }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {filtroTipo === 'Campo' && TIPOS_CAMPO.length > 0 && (
        <div className="border-b border-white/10 py-5 px-1">
          <p className="text-[10px] font-medium tracking-[0.2em] text-white uppercase mb-3 flex items-center gap-1.5 opacity-90">
            <Tree size={14} weight="light" /> Tipo de Campo
          </p>
          <div className="flex flex-wrap gap-2">
            {['Todos', ...TIPOS_CAMPO].map(tc => (
              <button
                key={tc}
                onClick={() => setFiltroTipoCampo(tc)}
                className={`px-4 py-1.5 rounded-full text-[12px] font-normal tracking-wide border transition-all duration-300 ${filtroTipoCampo === tc
                  ? 'bg-white border-white text-roma-olive shadow-sm'
                  : 'bg-transparent border-white/30 text-white/90 hover:border-white/60'
                  }`}
              >
                {tc}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="border-b border-white/10 py-5 px-1">
        <p className="text-[10px] font-medium tracking-[0.2em] text-white uppercase mb-3 flex items-center gap-1.5 opacity-90">
          <Tag size={14} weight="light" /> Operación
        </p>
        <div className="flex gap-2">
          {['Todas', ...OPERACIONES].map(o => (
            <button
              key={o}
              onClick={() => setFiltroOperacion(o)}
              className={`px-4 py-1.5 rounded-full text-[12px] font-normal tracking-wide border transition-all duration-300 ${filtroOperacion === o
                ? 'bg-white border-white text-roma-olive shadow-sm'
                : 'bg-transparent border-white/30 text-white/90 hover:border-white/60'
                }`}
            >
              {o}
            </button>
          ))}
        </div>
      </div>

      <div className="border-b border-white/10 py-5 px-1">
        <p className="text-[10px] font-medium tracking-[0.2em] text-white uppercase mb-3 flex items-center gap-1.5 opacity-90">
          <MapTrifold size={14} weight="light" /> Ciudad / Zona
        </p>
        <div className="flex flex-wrap gap-2">
          {['Todas', ...UBICACIONES].map(u => (
            <button
              key={u}
              onClick={() => setFiltroUbicacion(u)}
              className={`px-4 py-1.5 rounded-full text-[12px] font-normal tracking-wide border transition-all duration-300 ${filtroUbicacion === u
                ? 'bg-white border-white text-roma-olive shadow-sm'
                : 'bg-transparent border-white/30 text-white/90 hover:border-white/60'
                }`}
            >
              {u}
            </button>
          ))}
        </div>
      </div>

      <div className="border-b border-white/10 py-5 px-1">
        <p className="text-[10px] font-medium tracking-[0.2em] text-white uppercase mb-3 flex items-center gap-1.5 opacity-90">
          <Bed size={14} weight="light" /> Habitaciones
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => setFiltroHabs(null)}
            className={`min-w-[44px] h-9 rounded-xl text-[12px] font-normal border transition-all duration-300 px-3 ${filtroHabs === null
              ? 'bg-white border-white text-roma-olive shadow-sm'
              : 'bg-transparent border-white/30 text-white/90 hover:border-white/60'
              }`}
          >
            Todas
          </button>
          {HABITACIONES.map(n => (
            <button
              key={n}
              onClick={() => setFiltroHabs(n)}
              className={`w-9 h-9 rounded-xl text-[12px] font-normal border transition-all duration-300 flex items-center justify-center ${filtroHabs === n
                ? 'bg-white border-white text-roma-olive shadow-sm'
                : 'bg-transparent border-white/30 text-white/90 hover:border-white/60'
                }`}
            >
              {n === 4 ? '4+' : n}
            </button>
          ))}
        </div>
      </div>

      <div className="border-b border-white/10 py-5 px-1">
        <p className="text-[10px] font-medium tracking-[0.2em] text-white uppercase mb-3 opacity-90">
          Precio (USD)
        </p>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[10px] font-light text-white/70 block mb-1">Mínimo</label>
            <input
              type="text"
              inputMode="numeric"
              value={filtroPrecioMin}
              onChange={e => {
                const val = e.target.value;
                if (val === '') {
                  setFiltroPrecioMin('');
                  return;
                }
                if (/^\d+$/.test(val)) setFiltroPrecioMin(val);
              }}
              placeholder={precioMinimoCargado > 0 ? precioMinimoCargado.toString() : "0"}
              className="w-full bg-black/10 border border-white/10 rounded-xl px-3 py-2 text-[12px] text-white placeholder:text-white/40 outline-none focus:border-white/40 transition-colors"
            />
          </div>
          <div>
            <label className="text-[10px] font-light text-white/70 block mb-1">Máximo</label>
            <input
              type="text"
              inputMode="numeric"
              value={filtroPrecioMax}
              onChange={e => {
                const val = e.target.value;
                if (val === '') {
                  setFiltroPrecioMax('');
                  return;
                }
                if (/^\d+$/.test(val)) setFiltroPrecioMax(val);
              }}
              placeholder="Sin límite"
              className="w-full bg-black/10 border border-white/10 rounded-xl px-3 py-2 text-[12px] text-white placeholder:text-white/40 outline-none focus:border-white/40 transition-colors"
            />
          </div>
        </div>
      </div>

      {hayFiltros && (
        <button
          onClick={limpiarFiltros}
          className="w-full py-3 rounded-xl border border-white/30 text-[10px] font-medium tracking-[0.15em] uppercase text-white hover:bg-white hover:text-roma-olive transition-all duration-300 mt-2"
        >
          Limpiar todos los filtros
        </button>
      )}
    </div>
  );

  // ─── RENDER ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen font-['Inter',system-ui,sans-serif] text-white overflow-x-hidden relative">

      {/* ══ OVERLAY DE CARGA ══ */}
      {showScreenLoader && <PageLoader />}

      {/* Fondo Fijo */}
      <div
        className="fixed inset-0 z-[-2] bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/fondo-campo.png')", backgroundAttachment: 'fixed' }}
      />

      {/* ── HEADER ABSOLUTE ── */}
      <header className="absolute top-0 left-0 w-full z-50 h-24 bg-transparent flex items-center px-6">
        <div className="max-w-screen-2xl mx-auto w-full flex items-center justify-between">

          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="flex items-center gap-2 text-white bg-black/20 hover:bg-black/40 px-5 py-2.5 rounded-full backdrop-blur-md border border-white/10 text-[12px] font-light tracking-wide transition-colors"
            >
              <ArrowLeft size={16} weight="light" /> <span className="hidden sm:inline">Volver al inicio</span>
            </Link>

            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden flex items-center gap-2 text-white bg-roma-olive hover:bg-roma-olive/90 text-[12px] font-light tracking-wide border border-white/20 px-5 py-2.5 rounded-full shadow-lg transition-all"
            >
              <SlidersHorizontal size={15} weight="light" /> Filtros
            </button>
          </div>

          <img src="/roma-logo.png" alt="Roma Inmobiliaria" className="w-[7rem] h-auto object-contain opacity-90" />
        </div>
      </header>

      {/* ── SECCIÓN HERO (ANIMADA: Entra de izq a der y desaparece con Scroll-Jack) ── */}
      <AnimatePresence>
        {!heroDismissed && !showScreenLoader && (
          <motion.div
            key="hero-intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ y: "-50vh", opacity: 0 }}
            transition={{ duration: 0.8, ease: EASE }}
            className="fixed inset-0 z-30 flex flex-col items-center justify-center pointer-events-none"
          >
            {/* Animación de Revelado de Izquierda a Derecha para el Título */}
            <motion.div
              initial={{ clipPath: 'inset(0% 100% 0% 0%)' }}
              animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
              transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
              className="p-8" // <-- Este es el margen de seguridad que evita que se corte
            >
              <motion.h1
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="text-4xl md:text-6xl lg:text-[80px] font-light text-white tracking-[0.15em] uppercase text-center drop-shadow-2xl"
              >
                Nuestras <br className="md:hidden" /> Propiedades
              </motion.h1>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              transition={{ delay: 1.5, duration: 1 }}
              className="absolute bottom-10 flex flex-col items-center animate-bounce"
            >
              <span className="text-[10px] tracking-widest uppercase mb-2 font-light">Deslizar</span>
              <span className="material-icons">keyboard_arrow_down</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── LAYOUT PRINCIPAL (Sube desde abajo en el primer scroll) ── */}
      <motion.div
        initial={{ y: "100vh", opacity: 0 }}
        animate={heroDismissed ? { y: 0, opacity: 1 } : { y: "100vh", opacity: 0 }}
        transition={{ duration: 0.8, ease: EASE }}
        className="max-w-screen-2xl mx-auto pt-32 pb-8 px-4 lg:px-6 flex flex-col relative z-40 bg-transparent min-h-screen"
      >

        {propiedadesDestacadas.length > 0 && activeDestacada && (
          <section className="w-full mb-16">

            {/* Título Propiedades Destacadas FUERA */}
            <div className="flex items-center justify-center gap-2 mb-8 px-2">
              <Star size={22} weight="regular" className="text-white drop-shadow-md" />
              <span className="text-[12px] md:text-[14px] font-medium tracking-[0.3em] text-white uppercase drop-shadow-sm">
                Propiedades Destacadas
              </span>
            </div>

            {/* ── CONTENEDOR 70/30 (Sin bordes curvos, fondo transparente) ── */}
            <div className="relative w-full overflow-hidden mb-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeDestacada.id}
                  className="flex flex-col lg:flex-row gap-6 lg:gap-8 w-full"
                >
                  {/* Mitad Izquierda: IMAGEN (70%) */}
                  <motion.div
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -50, opacity: 0 }}
                    transition={{ duration: 0.6, ease: EASE }}
                    className="w-full lg:w-[70%] relative overflow-hidden bg-black/20 min-h-[300px] lg:min-h-[500px] rounded-none shadow-xl border border-white/10"
                  >
                    {activeDestacada.imagen_url || (activeDestacada.media_urls && activeDestacada.media_urls.length > 0) ? (
                      <img
                        src={(activeDestacada.media_urls && activeDestacada.media_urls[0]) || activeDestacada.imagen_url}
                        alt={activeDestacada.titulo}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center opacity-30 text-white absolute inset-0">
                        <IconoTipo tipo={activeDestacada.tipo_propiedad} size={80} />
                      </div>
                    )}

                    <span className="absolute top-6 left-6 z-10 bg-white/95 text-roma-olive text-[10px] font-semibold uppercase tracking-[0.2em] px-4 py-2 rounded-none shadow-md">
                      {activeDestacada.operacion}
                    </span>
                    <div className="absolute top-6 right-6 z-10 bg-amber-400 text-white w-9 h-9 flex items-center justify-center rounded-full shadow-lg">
                      <Star size={16} weight="regular" />
                    </div>

                    {/* Flechas de Navegación del Carrusel en la Imagen */}
                    {propiedadesDestacadas.length > 1 && (
                      <div className="absolute inset-y-0 w-full flex items-center justify-between px-4 z-20">
                        <button
                          onClick={() => setDestacadaIndex(p => (p - 1 + propiedadesDestacadas.length) % propiedadesDestacadas.length)}
                          className="bg-black/40 hover:bg-black/70 text-white p-3 rounded-none backdrop-blur-md border border-white/10 transition-all"
                        >
                          <CaretLeft size={20} weight="light" />
                        </button>
                        <button
                          onClick={() => setDestacadaIndex(p => (p + 1) % propiedadesDestacadas.length)}
                          className="bg-black/40 hover:bg-black/70 text-white p-3 rounded-none backdrop-blur-md border border-white/10 transition-all"
                        >
                          <CaretRight size={20} weight="light" />
                        </button>
                      </div>
                    )}
                  </motion.div>

                  {/* Mitad Derecha: INFO (30%) */}
                  <motion.div
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 50, opacity: 0 }}
                    transition={{ duration: 0.6, ease: EASE }}
                    className="w-full lg:w-[30%] flex flex-col justify-center p-8 lg:p-10 bg-roma-olive border border-white/10 rounded-none shadow-xl"
                  >
                    <div>
                      <span className="text-[10px] font-medium tracking-[0.3em] text-white/60 uppercase mb-3 block">
                        {activeDestacada.tipo_propiedad}
                      </span>
                      <h3 className="text-3xl lg:text-4xl font-light text-white leading-tight tracking-tight mb-4">
                        {activeDestacada.titulo}
                      </h3>
                      <div className="flex items-center gap-2 text-white/70 text-[13px] mb-8 font-light">
                        <MapPin size={16} weight="light" className="text-white/60" />
                        {activeDestacada.ubicacion}
                      </div>

                      {/* --- Lógica Dinámica de Datos --- */}
                      <div className="flex flex-col gap-3 mb-8">
                        {['casa', 'departamento'].includes(activeDestacada.tipo_propiedad?.toLowerCase()) && (
                          <>
                            {activeDestacada.habitaciones && (
                              <div className="flex items-center gap-3 bg-black/10 border border-white/10 px-5 py-3.5 rounded-none">
                                <Bed size={20} weight="light" className="text-white/70" />
                                <div>
                                  <span className="block text-white/50 text-[9px] uppercase font-medium tracking-[0.15em]">Habitaciones</span>
                                  <span className="text-white/90 font-medium text-[14px]">{activeDestacada.habitaciones}</span>
                                </div>
                              </div>
                            )}
                            {activeDestacada.banos && (
                              <div className="flex items-center gap-3 bg-black/10 border border-white/10 px-5 py-3.5 rounded-none">
                                <Bathtub size={20} weight="light" className="text-white/70" />
                                <div>
                                  <span className="block text-white/50 text-[9px] uppercase font-medium tracking-[0.15em]">Baños</span>
                                  <span className="text-white/90 font-medium text-[14px]">{activeDestacada.banos}</span>
                                </div>
                              </div>
                            )}
                            {activeDestacada.dimensiones && (
                              <div className="flex items-center gap-3 bg-black/10 border border-white/10 px-5 py-3.5 rounded-none">
                                <Ruler size={20} weight="light" className="text-white/70" />
                                <div>
                                  <span className="block text-white/50 text-[9px] uppercase font-medium tracking-[0.15em]">Superficie</span>
                                  <span className="text-white/90 font-medium text-[14px]">{activeDestacada.dimensiones}</span>
                                </div>
                              </div>
                            )}
                          </>
                        )}

                        {activeDestacada.tipo_propiedad?.toLowerCase() === 'campo' && activeDestacada.dimensiones && (
                          <div className="flex items-center gap-3 bg-black/10 border border-white/10 px-5 py-3.5 rounded-none">
                            <Tree size={20} weight="light" className="text-white/70" />
                            <div>
                              <span className="block text-white/50 text-[9px] uppercase font-medium tracking-[0.15em]">Hectáreas</span>
                              <span className="text-white/90 font-medium text-[14px]">{activeDestacada.dimensiones}</span>
                            </div>
                          </div>
                        )}

                        {['lote', 'terreno', 'local'].includes(activeDestacada.tipo_propiedad?.toLowerCase()) && activeDestacada.dimensiones && (
                          <div className="flex items-center gap-3 bg-black/10 border border-white/10 px-5 py-3.5 rounded-none">
                            <Ruler size={20} weight="light" className="text-white/70" />
                            <div>
                              <span className="block text-white/50 text-[9px] uppercase font-medium tracking-[0.15em]">Superficie</span>
                              <span className="text-white/90 font-medium text-[14px]">{activeDestacada.dimensiones}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-auto pt-4">
                      <span className="text-[10px] font-medium text-white/50 tracking-[0.2em] uppercase block mb-1">
                        Precio
                      </span>
                      <div className="text-[36px] font-light text-white tracking-tight leading-none mb-8">
                        USD {activeDestacada.precio.toLocaleString('es-AR')}
                      </div>
                      <div className="flex gap-3 w-full">
                        <button
                          onClick={() => abrirModal(activeDestacada)}
                          className="flex-1 py-3.5 bg-white text-roma-olive rounded-none text-[12px] font-semibold uppercase tracking-[0.15em] transition-all hover:bg-white/90 shadow-md text-center"
                        >
                          Ver detalles
                        </button>
                        <a
                          href={`https://wa.me/5492920123456?text=Me interesa esta propiedad: *${activeDestacada.titulo}* (ID: ${activeDestacada.id})`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-12 h-12 flex items-center justify-center rounded-none bg-white/10 hover:bg-white/20 text-white transition-all shadow-md shrink-0 border border-white/20"
                        >
                          <WhatsappLogo size={22} weight="light" />
                        </a>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Dots del Carrusel Centrados Debajo de todo */}
            {propiedadesDestacadas.length > 1 && (
              <div className="flex gap-3 justify-center items-center mt-6 w-full">
                {propiedadesDestacadas.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setDestacadaIndex(idx)}
                    className={`rounded-full transition-all duration-300 shadow-sm ${idx === destacadaIndex
                      ? 'w-2.5 h-2.5 bg-white scale-125'
                      : 'w-2 h-2 bg-white/40 hover:bg-white/80'
                      }`}
                  />
                ))}
              </div>
            )}
          </section>
        )}

        {/* ── TÍTULO CATÁLOGO Y DIVISOR (Centrados y finos) ── */}
        <div className="w-full mb-10 pb-6 border-b border-white/10 flex flex-col items-center justify-center gap-4">
          <HouseLine size={32} weight="light" className="text-white/80" />
          <h2 className="text-2xl md:text-4xl font-light text-white tracking-[0.15em] uppercase text-center">
            Catálogo de Propiedades
          </h2>
        </div>

        {/* ── SECCIÓN INFERIOR: SIDEBAR Y GRILLA ── */}
        <section className="flex gap-6 lg:gap-10 relative items-start">

          {/* SIDEBAR DESKTOP */}
          <aside className="hidden lg:block w-[280px] shrink-0 sticky top-10 h-fit bg-roma-olive/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl px-6 py-7">
            {SidebarContent()}
          </aside>

          {/* SIDEBAR MOBILE */}
          <AnimatePresence>
            {sidebarOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setSidebarOpen(false)}
                  className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60] lg:hidden"
                />
                <motion.aside
                  initial={{ x: '-100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '-100%' }}
                  transition={{ ease: EASE, duration: 0.4 }}
                  className="fixed top-0 left-0 bottom-0 w-[85%] max-w-sm bg-roma-olive border-r border-white/10 z-[70] overflow-y-auto px-6 pt-7 pb-4 lg:hidden shadow-2xl rounded-r-2xl"
                >
                  <div className="flex items-center justify-between mb-6 sticky top-0 bg-roma-olive z-10 pb-2">
                    <span className="text-[11px] font-medium tracking-[0.2em] uppercase text-white/90">Filtros</span>
                    <button onClick={() => setSidebarOpen(false)} className="text-white hover:bg-white/10 p-2 rounded-full transition-colors">
                      <X size={20} weight="light" />
                    </button>
                  </div>
                  {SidebarContent()}
                </motion.aside>
              </>
            )}
          </AnimatePresence>

          {/* GRILLA PRINCIPAL */}
          <main className="flex-1 min-w-0">
            {/* Controles */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div className="inline-flex items-center gap-1.5 text-white/80 text-[13px] font-light">
                <strong className="font-medium text-white">{propiedades.length}</strong> propiedades encontradas
              </div>

              <select
                value={ordenar}
                onChange={e => setOrdenar(e.target.value)}
                className="bg-black/30 backdrop-blur-md border border-white/10 text-white text-[12px] font-light rounded-xl px-4 py-2.5 outline-none cursor-pointer"
              >
                <option value="recientes">Más recientes</option>
                <option value="asc">Menor precio</option>
                <option value="desc">Mayor precio</option>
                <option value="destacadas">Destacadas primero</option>
              </select>
            </div>

            {/* Pills de filtros activos */}
            {filtrosActivos.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {filtrosActivos.map(({ label, clear }) => (
                  <div
                    key={label}
                    className="flex items-center gap-1.5 bg-white/90 text-roma-olive px-3.5 py-1.5 rounded-full text-[10px] font-medium uppercase tracking-[0.1em]"
                  >
                    {label}
                    <button onClick={clear} className="opacity-70 hover:opacity-100 transition-opacity">
                      <X size={12} weight="bold" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={limpiarFiltros}
                  className="text-white/70 hover:text-white text-[10px] font-medium uppercase tracking-[0.1em] underline underline-offset-4 transition-colors"
                >
                  Limpiar todo
                </button>
              </div>
            )}

            {/* Grilla */}
            {loading ? (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-black/20 backdrop-blur-md rounded-2xl h-[220px] animate-pulse border border-white/10" />
                ))}
              </div>
            ) : propiedades.length > 0 ? (
              <motion.div
                className="grid grid-cols-1 xl:grid-cols-2 gap-6"
                variants={stagger}
                initial="hidden"
                animate="visible"
              >
                {propiedades.map(prop => (
                  <motion.div
                    key={prop.id}
                    variants={fadeUp}
                    onClick={() => abrirModal(prop)}
                    className="group bg-roma-olive border border-white/10 rounded-2xl overflow-hidden cursor-pointer hover:border-white/30 hover:-translate-y-1 transition-all duration-300 flex flex-col sm:flex-row shadow-lg hover:shadow-2xl h-auto sm:h-[220px]"
                  >
                    {/* Imagen */}
                    <div className="relative w-full sm:w-[40%] h-[200px] sm:h-full overflow-hidden bg-black/20 shrink-0">
                      {prop.imagen_url || (prop.media_urls && prop.media_urls.length > 0) ? (
                        <img
                          src={(prop.media_urls && prop.media_urls[0]) || prop.imagen_url}
                          alt={prop.titulo}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center opacity-30 text-white">
                          <IconoTipo tipo={prop.tipo_propiedad} size={48} />
                        </div>
                      )}

                      {/* Badge Venta/Alquiler */}
                      <div className="absolute top-4 left-4 flex gap-1.5">
                        <span className="bg-white/95 text-roma-olive text-[9px] font-semibold uppercase tracking-[0.2em] px-3.5 py-1.5 rounded-full shadow-sm backdrop-blur-md">
                          {prop.operacion}
                        </span>
                      </div>

                      {/* Badge Estrella Circular */}
                      {prop.destacada && (
                        <div className="absolute top-4 right-4 z-10 bg-amber-400 text-white w-7 h-7 flex items-center justify-center rounded-full shadow-md">
                          <Star size={14} weight="regular" />
                        </div>
                      )}
                    </div>

                    {/* Contenido Minimalista */}
                    <div className="p-6 flex-1 flex flex-col bg-black/10 justify-center">

                      <span className="text-[9px] font-bold uppercase tracking-widest text-white/50 mb-1">
                        {prop.tipo_propiedad}
                      </span>

                      <div className="flex justify-between items-start gap-4 mb-1">
                        <h3 className="text-[17px] font-medium text-white/95 leading-snug tracking-tight">
                          {prop.titulo}
                        </h3>
                        <span className="text-[17px] font-light text-white whitespace-nowrap">
                          ${prop.precio.toLocaleString('es-AR')}
                        </span>
                      </div>

                      <div className="text-[12px] text-white/60 font-light mb-3 flex items-center gap-1">
                        <MapPin size={13} weight="light" />
                        {prop.ubicacion}
                      </div>

                      <p className="text-[11px] text-white/50 line-clamp-2 mb-4 leading-relaxed">
                        {prop.descripcion}
                      </p>

                      {/* Características en línea sutil */}
                      <div className="flex items-center gap-4 text-white/70 text-[11px] font-light border-t border-white/10 pt-4 mt-auto">
                        {(prop.dimensiones || prop.atributos_especificos?.dimensiones) && (
                          <span className="flex items-center gap-1.5">
                            <Ruler size={13} weight="light" /> {prop.dimensiones || prop.atributos_especificos?.dimensiones}
                          </span>
                        )}
                        {(prop.habitaciones || prop.atributos_especificos?.habitaciones) && (
                          <span className="flex items-center gap-1.5">
                            <Bed size={13} weight="light" /> {prop.habitaciones || prop.atributos_especificos?.habitaciones}
                          </span>
                        )}
                        {(prop.banos || prop.atributos_especificos?.banos) && (
                          <span className="flex items-center gap-1.5">
                            <Bathtub size={13} weight="light" /> {prop.banos || prop.atributos_especificos?.banos}
                          </span>
                        )}
                        {prop.atributos_especificos?.tipo_campo && (
                          <span className="flex items-center gap-1.5">
                            <Tree size={13} weight="light" /> {prop.atributos_especificos.tipo_campo}
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 border border-dashed border-white/10 rounded-2xl bg-black/20 backdrop-blur-md text-center gap-4">
                <HouseLine size={48} weight="light" className="text-white/30" />
                <h3 className="text-[18px] font-light text-white/80 tracking-wide">Sin coincidencias</h3>
                <p className="text-white/50 text-[13px] font-light max-w-[280px] leading-relaxed">
                  Probá ajustando los filtros para encontrar tu propiedad ideal.
                </p>
                <button
                  onClick={limpiarFiltros}
                  className="mt-3 bg-white/10 border border-white/20 text-white px-6 py-2.5 rounded-full text-[11px] font-medium uppercase tracking-[0.1em] hover:bg-white hover:text-roma-olive transition-colors"
                >
                  Limpiar filtros
                </button>
              </div>
            )}
          </main>
        </section>
      </motion.div>
    </div>
  );
}