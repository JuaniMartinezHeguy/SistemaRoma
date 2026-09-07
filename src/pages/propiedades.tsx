import { useState, useEffect, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import useOpcionesFiltros from '../hooks/useOpcionesFiltros';
import {
  MapPin, WhatsappLogo, HouseLine, Tag, MapTrifold, CaretLeft,
  X, Ruler, CaretRight, MagnifyingGlass, CaretDown, Check, CurrencyDollar,
  Bed, Star, Buildings, Tree, Storefront, ArrowLeft, SlidersHorizontal, Bathtub
} from '@phosphor-icons/react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import PageLoader from '../components/ui/PageLoader';
import PropiedadDetalle from './PropiedadDetalle';

// ─── Tipos ────────────────────────────────────────────────────────────────────
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
  superficie?: string | number;
  dimensiones?: string;
  mts2?: string | number;
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

  const [showScreenLoader, setShowScreenLoader] = useState(true);
  const [heroDismissed, setHeroDismissed] = useState(false); // ESTADO PARA EL SCROLL-JACK

  const [propiedades, setPropiedades] = useState<Propiedad[]>([]);
  const [loading, setLoading] = useState(true);

  // Opciones dinámicas de filtros (leídas de propiedades publicadas y configuración)
  const { 
    tipos: TIPOS, 
    ubicaciones: UBICACIONES, 
    ubicacionesBuenosAires: UBICACIONES_BSAS, 
    ubicacionesRioNegro: UBICACIONES_RN, 
    provincias: PROVINCIAS_BASE,
    operaciones: OPERACIONES, 
    habitaciones: HABITACIONES, 
    tiposCampo: TIPOS_CAMPO 
  } = useOpcionesFiltros();

  const PROVINCIAS = useMemo(() => ['Todas', ...(PROVINCIAS_BASE || ['Buenos Aires', 'Río Negro'])], [PROVINCIAS_BASE]);

  // Filtros
  const [filtroProvincia, setFiltroProvincia] = useState('Todas');
  const [filtroTipo, setFiltroTipo] = useState('Todos');
  const [filtroUbicacion, setFiltroUbicacion] = useState('Todas');
  const [filtroOperacion, setFiltroOperacion] = useState('Todas');
  const [filtroTipoCampo, setFiltroTipoCampo] = useState('Todos');
  const [filtroHabs, setFiltroHabs] = useState<number | null>(null);
  const [filtroPrecioMin, setFiltroPrecioMin] = useState('');
  const [filtroPrecioMax, setFiltroPrecioMax] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [ordenar, setOrdenar] = useState('recientes');

  // Ciudades a mostrar según la provincia seleccionada
  const ubicacionesFiltradasPorProvincia = useMemo(() => {
    if (filtroProvincia === 'Buenos Aires') {
      return UBICACIONES_BSAS.length > 0 ? UBICACIONES_BSAS : UBICACIONES;
    }
    if (filtroProvincia === 'Río Negro' || filtroProvincia === 'Rio Negro') {
      return UBICACIONES_RN.length > 0 ? UBICACIONES_RN : UBICACIONES;
    }
    return UBICACIONES;
  }, [filtroProvincia, UBICACIONES_BSAS, UBICACIONES_RN, UBICACIONES]);

  const cambiarProvincia = (prov: string) => {
    setFiltroProvincia(prov);
    setFiltroUbicacion('Todas');
  };

  // Estado para desplegables "efecto hamburguesa" en PC y Mobile
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [openMobileSections, setOpenMobileSections] = useState<Record<string, boolean>>({
    provincia: false,
    tipo: false,
    operacion: false,
    zona: false,
    habs: false,
    campo: false,
    precio: false,
  });

  const toggleMobileSection = (key: string) => {
    setOpenMobileSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // UI
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [destacadaIndex, setDestacadaIndex] = useState(0);
  const [modalPropiedadId, setModalPropiedadId] = useState<number | null>(null);
  const [selectedPropiedadObj, setSelectedPropiedadObj] = useState<Propiedad | null>(null);

  const cantidadFiltrosActivos = [
    filtroProvincia !== 'Todas',
    filtroTipo !== 'Todos',
    filtroUbicacion !== 'Todas',
    filtroOperacion !== 'Todas',
    filtroTipoCampo !== 'Todos',
    filtroHabs !== null,
    Boolean(filtroPrecioMin),
    Boolean(filtroPrecioMax),
    Boolean(busqueda),
  ].filter(Boolean).length;

  const [searchParams] = useSearchParams();

  // Sincronizar filtro desde parámetros de la URL (?tipo=Campo, ?tipo=Terreno, etc.)
  useEffect(() => {
    const tipoQuery = searchParams.get('tipo');
    if (tipoQuery) {
      setFiltroTipo(tipoQuery);
      setHeroDismissed(true);
    }
  }, [searchParams]);

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
    if (showScreenLoader || !heroDismissed || modalPropiedadId !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [showScreenLoader, heroDismissed, modalPropiedadId]);

  // ─── Fetch ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchPropiedades = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from('propiedades')
        .select('*');

      if (error) {
        console.error('Error fetching propiedades:', error);
        setLoading(false);
        return;
      }

      let result: Propiedad[] = (data ?? []).filter(p => !p.estado || p.estado === 'publicado');

      // 1. Filtro por Provincia
      if (filtroProvincia !== 'Todas') {
        const fProvLower = filtroProvincia.toLowerCase();
        result = result.filter(p => {
          if (p.provincia) {
            return p.provincia.toLowerCase() === fProvLower;
          }
          // Fallback por si la propiedad antigua no tiene provincia guardada todavía:
          if (fProvLower.includes('buenos')) {
            return UBICACIONES_BSAS.some(u => u.toLowerCase() === p.ubicacion?.toLowerCase());
          }
          if (fProvLower.includes('rio') || fProvLower.includes('río')) {
            return UBICACIONES_RN.some(u => u.toLowerCase() === p.ubicacion?.toLowerCase());
          }
          return true;
        });
      }

      // 2. Filtro por Tipo de Propiedad
      if (filtroTipo !== 'Todos') {
        const fLower = filtroTipo.toLowerCase();
        result = result.filter(p => {
          if (!p.tipo_propiedad) return false;
          const pType = p.tipo_propiedad.toLowerCase();
          if (fLower.includes('campo')) {
            return pType.includes('campo');
          }
          if (fLower.includes('terreno') || fLower.includes('lote')) {
            return pType.includes('terreno') || pType.includes('lote');
          }
          if (fLower.includes('propiedad') || fLower.includes('casa') || fLower.includes('depto') || fLower.includes('departamento')) {
            return pType.includes('casa') || pType.includes('depto') || pType.includes('departamento') || pType.includes('propiedad') || pType.includes('local');
          }
          return pType.includes(fLower);
        });
      }

      // 3. Filtro por Ubicación
      if (filtroUbicacion !== 'Todas') {
        result = result.filter(p => p.ubicacion?.toLowerCase() === filtroUbicacion.toLowerCase());
      }

      // 4. Filtro por Operación (Venta / Alquiler)
      if (filtroOperacion !== 'Todas') {
        result = result.filter(p => p.operacion?.toLowerCase() === filtroOperacion.toLowerCase());
      }

      // 5. Filtro por Tipo de Campo
      if (filtroTipoCampo !== 'Todos') {
        result = result.filter(p => 
          p.atributos_especificos && 
          p.atributos_especificos.tipo_campo?.toLowerCase() === filtroTipoCampo.toLowerCase()
        );
      }

      // 6. Filtro por Habitaciones
      if (filtroHabs !== null) {
        result = result.filter(p => {
          const habs = p.habitaciones ?? p.atributos_especificos?.habitaciones ?? 0;
          if (filtroHabs === 4) return habs >= 4;
          return habs === filtroHabs;
        });
      }

      // 7. Filtro por Rango de Precios
      if (filtroPrecioMin) {
        const min = parseFloat(filtroPrecioMin);
        if (!isNaN(min)) result = result.filter(p => (p.precio || 0) >= min);
      }
      if (filtroPrecioMax) {
        const max = parseFloat(filtroPrecioMax);
        if (!isNaN(max)) result = result.filter(p => (p.precio || 0) <= max);
      }

      // 8. Búsqueda libre
      if (busqueda.trim()) {
        const q = busqueda.toLowerCase();
        result = result.filter(
          p => p.titulo?.toLowerCase().includes(q) || p.ubicacion?.toLowerCase().includes(q) || p.descripcion?.toLowerCase().includes(q)
        );
      }

      // 9. Ordenamiento
      if (ordenar === 'asc') result.sort((a, b) => (a.precio || 0) - (b.precio || 0));
      else if (ordenar === 'desc') result.sort((a, b) => (b.precio || 0) - (a.precio || 0));
      else if (ordenar === 'destacadas') result.sort((a, b) => (b.destacada ? 1 : 0) - (a.destacada ? 1 : 0));

      setPropiedades(result);
      setLoading(false);
    };

    fetchPropiedades();
  }, [filtroProvincia, filtroTipo, filtroUbicacion, filtroOperacion, filtroTipoCampo, filtroHabs, filtroPrecioMin, filtroPrecioMax, busqueda, ordenar, UBICACIONES_BSAS, UBICACIONES_RN]);

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

  useEffect(() => {
    if (!modalPropiedadId) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setModalPropiedadId(null);
        setSelectedPropiedadObj(null);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [modalPropiedadId]);

  const abrirModal = (p: Propiedad) => {
    setSelectedPropiedadObj(p);
    setModalPropiedadId(p.id);
  };
  const activeDestacada = propiedadesDestacadas[destacadaIndex];

  const limpiarFiltros = () => {
    setFiltroProvincia('Todas');
    setFiltroTipo('Todos');
    setFiltroUbicacion('Todas');
    setFiltroOperacion('Todas');
    setFiltroTipoCampo('Todos');
    setFiltroHabs(null);
    setFiltroPrecioMin('');
    setFiltroPrecioMax('');
    setBusqueda('');
    setOpenDropdown(null);
  };

  const filtrosActivos = [
    filtroProvincia !== 'Todas' && { 
      label: `Provincia: ${filtroProvincia}`, 
      clear: () => { setFiltroProvincia('Todas'); setFiltroUbicacion('Todas'); } 
    },
    filtroTipo !== 'Todos' && { label: filtroTipo, clear: () => { setFiltroTipo('Todos'); setFiltroTipoCampo('Todos'); } },
    filtroUbicacion !== 'Todas' && { label: filtroUbicacion, clear: () => setFiltroUbicacion('Todas') },
    filtroOperacion !== 'Todas' && { label: filtroOperacion, clear: () => setFiltroOperacion('Todas') },
    filtroTipoCampo !== 'Todos' && { label: `Campo: ${filtroTipoCampo}`, clear: () => setFiltroTipoCampo('Todos') },
    filtroHabs !== null && { label: `${filtroHabs}${filtroHabs === 4 ? '+' : ''} hab.`, clear: () => setFiltroHabs(null) },
    busqueda.trim() !== '' && { label: `"${busqueda}"`, clear: () => setBusqueda('') },
    (filtroPrecioMin !== '' || filtroPrecioMax !== '') && {
      label: `USD ${filtroPrecioMin || '0'} - ${filtroPrecioMax || '∞'}`,
      clear: () => { setFiltroPrecioMin(''); setFiltroPrecioMax(''); }
    },
  ].filter(Boolean) as { label: string; clear: () => void }[];

  const hayFiltros = filtrosActivos.length > 0;

  // ─── Sidebar content ────────────────────────────────────────────────────────
  const SidebarContent = () => (
    <div className="flex flex-col gap-2 pb-4">
      {/* Buscador */}
      <div className="border-b border-white/10 py-4 px-1">
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

      {/* Acordeón: Tipo de propiedad */}
      <div className="border-b border-white/10 py-3 px-1">
        <button
          type="button"
          onClick={() => toggleMobileSection('tipo')}
          className="w-full flex items-center justify-between py-1 text-left cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <HouseLine size={16} className="text-roma-leaf" />
            <span className="text-xs font-semibold text-white uppercase tracking-wider">Tipo de propiedad</span>
          </div>
          <div className="flex items-center gap-2">
            {filtroTipo !== 'Todos' && (
              <span className="text-[10px] bg-white text-roma-olive font-bold px-2 py-0.5 rounded-full">
                {filtroTipo}
              </span>
            )}
            <CaretDown size={14} className={`text-white/70 transition-transform duration-200 ${openMobileSections['tipo'] ? 'rotate-180' : ''}`} />
          </div>
        </button>
        <AnimatePresence>
          {openMobileSections['tipo'] && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden pt-3 flex flex-wrap gap-2"
            >
              {['Todos', ...TIPOS].map(t => {
                const isSelected = filtroTipo === t;
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => { setFiltroTipo(t); if (!t.toLowerCase().includes('campo')) setFiltroTipoCampo('Todos'); }}
                    className={`px-3.5 py-1.5 rounded-full text-[12px] border transition-all cursor-pointer ${
                      isSelected ? 'bg-white border-white text-roma-olive font-semibold' : 'bg-transparent border-white/30 text-white/90'
                    }`}
                  >
                    {t}
                  </button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Acordeón: Tipo de Campo */}
      {filtroTipo.toLowerCase().includes('campo') && TIPOS_CAMPO.length > 0 && (
        <div className="border-b border-white/10 py-3 px-1">
          <button
            type="button"
            onClick={() => toggleMobileSection('campo')}
            className="w-full flex items-center justify-between py-1 text-left cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Tree size={16} className="text-roma-leaf" />
              <span className="text-xs font-semibold text-white uppercase tracking-wider">Tipo de Campo</span>
            </div>
            <div className="flex items-center gap-2">
              {filtroTipoCampo !== 'Todos' && (
                <span className="text-[10px] bg-white text-roma-olive font-bold px-2 py-0.5 rounded-full">
                  {filtroTipoCampo}
                </span>
              )}
              <CaretDown size={14} className={`text-white/70 transition-transform duration-200 ${openMobileSections['campo'] ? 'rotate-180' : ''}`} />
            </div>
          </button>
          <AnimatePresence>
            {openMobileSections['campo'] && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden pt-3 flex flex-wrap gap-2"
              >
                {['Todos', ...TIPOS_CAMPO].map(tc => (
                  <button
                    key={tc}
                    type="button"
                    onClick={() => setFiltroTipoCampo(tc)}
                    className={`px-3.5 py-1.5 rounded-full text-[12px] border transition-all cursor-pointer ${
                      filtroTipoCampo === tc ? 'bg-white border-white text-roma-olive font-semibold' : 'bg-transparent border-white/30 text-white/90'
                    }`}
                  >
                    {tc}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Acordeón: Operación */}
      <div className="border-b border-white/10 py-3 px-1">
        <button
          type="button"
          onClick={() => toggleMobileSection('operacion')}
          className="w-full flex items-center justify-between py-1 text-left cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Tag size={16} className="text-roma-leaf" />
            <span className="text-xs font-semibold text-white uppercase tracking-wider">Operación</span>
          </div>
          <div className="flex items-center gap-2">
            {filtroOperacion !== 'Todas' && (
              <span className="text-[10px] bg-white text-roma-olive font-bold px-2 py-0.5 rounded-full">
                {filtroOperacion}
              </span>
            )}
            <CaretDown size={14} className={`text-white/70 transition-transform duration-200 ${openMobileSections['operacion'] ? 'rotate-180' : ''}`} />
          </div>
        </button>
        <AnimatePresence>
          {openMobileSections['operacion'] && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden pt-3 flex gap-2"
            >
              {['Todas', ...OPERACIONES].map(o => (
                <button
                  key={o}
                  type="button"
                  onClick={() => setFiltroOperacion(o)}
                  className={`px-3.5 py-1.5 rounded-full text-[12px] border transition-all cursor-pointer ${
                    filtroOperacion === o ? 'bg-white border-white text-roma-olive font-semibold' : 'bg-transparent border-white/30 text-white/90'
                  }`}
                >
                  {o}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Acordeón: Provincia */}
      <div className="border-b border-white/10 py-3 px-1">
        <button
          type="button"
          onClick={() => toggleMobileSection('provincia')}
          className="w-full flex items-center justify-between py-1 text-left cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-roma-leaf" />
            <span className="text-xs font-semibold text-white uppercase tracking-wider">Provincia</span>
          </div>
          <div className="flex items-center gap-2">
            {filtroProvincia !== 'Todas' && (
              <span className="text-[10px] bg-white text-roma-olive font-bold px-2 py-0.5 rounded-full">
                {filtroProvincia}
              </span>
            )}
            <CaretDown size={14} className={`text-white/70 transition-transform duration-200 ${openMobileSections['provincia'] ? 'rotate-180' : ''}`} />
          </div>
        </button>
        <AnimatePresence>
          {openMobileSections['provincia'] && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden pt-3 flex flex-wrap gap-2"
            >
              {PROVINCIAS.map(p => {
                const isSelected = filtroProvincia === p;
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => cambiarProvincia(p)}
                    className={`px-3.5 py-1.5 rounded-full text-[12px] border transition-all cursor-pointer ${
                      isSelected ? 'bg-white border-white text-roma-olive font-semibold' : 'bg-transparent border-white/30 text-white/90'
                    }`}
                  >
                    {p}
                  </button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Acordeón: Ciudad / Zona */}
      <div className="border-b border-white/10 py-3 px-1">
        <button
          type="button"
          onClick={() => toggleMobileSection('zona')}
          className="w-full flex items-center justify-between py-1 text-left cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <MapTrifold size={16} className="text-roma-leaf" />
            <span className="text-xs font-semibold text-white uppercase tracking-wider">
              Ciudad / Zona {filtroProvincia !== 'Todas' ? `(${filtroProvincia === 'Buenos Aires' ? 'Bs.As' : 'Río Negro'})` : ''}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {filtroUbicacion !== 'Todas' && (
              <span className="text-[10px] bg-white text-roma-olive font-bold px-2 py-0.5 rounded-full">
                {filtroUbicacion}
              </span>
            )}
            <CaretDown size={14} className={`text-white/70 transition-transform duration-200 ${openMobileSections['zona'] ? 'rotate-180' : ''}`} />
          </div>
        </button>
        <AnimatePresence>
          {openMobileSections['zona'] && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden pt-3 flex flex-wrap gap-2 max-h-[220px] overflow-y-auto"
            >
              {['Todas', ...ubicacionesFiltradasPorProvincia].map(u => (
                <button
                  key={u}
                  type="button"
                  onClick={() => setFiltroUbicacion(u)}
                  className={`px-3.5 py-1.5 rounded-full text-[12px] border transition-all cursor-pointer ${
                    filtroUbicacion === u ? 'bg-white border-white text-roma-olive font-semibold' : 'bg-transparent border-white/30 text-white/90'
                  }`}
                >
                  {u}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Acordeón: Habitaciones */}
      <div className="border-b border-white/10 py-3 px-1">
        <button
          type="button"
          onClick={() => toggleMobileSection('habs')}
          className="w-full flex items-center justify-between py-1 text-left cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Bed size={16} className="text-roma-leaf" />
            <span className="text-xs font-semibold text-white uppercase tracking-wider">Habitaciones</span>
          </div>
          <div className="flex items-center gap-2">
            {filtroHabs !== null && (
              <span className="text-[10px] bg-white text-roma-olive font-bold px-2 py-0.5 rounded-full">
                {filtroHabs === 4 ? '4+' : filtroHabs} hab
              </span>
            )}
            <CaretDown size={14} className={`text-white/70 transition-transform duration-200 ${openMobileSections['habs'] ? 'rotate-180' : ''}`} />
          </div>
        </button>
        <AnimatePresence>
          {openMobileSections['habs'] && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden pt-3 flex gap-2"
            >
              <button
                type="button"
                onClick={() => setFiltroHabs(null)}
                className={`min-w-[44px] h-9 rounded-xl text-[12px] border transition-all px-3 cursor-pointer ${
                  filtroHabs === null ? 'bg-white border-white text-roma-olive font-semibold' : 'bg-transparent border-white/30 text-white/90'
                }`}
              >
                Todas
              </button>
              {HABITACIONES.map(n => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setFiltroHabs(n)}
                  className={`w-9 h-9 rounded-xl text-[12px] border transition-all flex items-center justify-center cursor-pointer ${
                    filtroHabs === n ? 'bg-white border-white text-roma-olive font-semibold' : 'bg-transparent border-white/30 text-white/90'
                  }`}
                >
                  {n === 4 ? '4+' : n}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    {/* Precio (USD) siempre visible */}
    <div className="border-b border-white/10 py-5 px-1">
      <p className="text-[10px] font-medium tracking-[0.2em] text-white uppercase mb-3 opacity-90 flex items-center gap-1.5">
        <CurrencyDollar size={14} weight="light" /> Precio (USD)
      </p>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-[10px] font-light text-white/70 block mb-1">Mínimo</label>
          <input
            type="text"
            inputMode="numeric"
            value={filtroPrecioMin}
            onChange={e => setFiltroPrecioMin(e.target.value.replace(/\D/g, ''))}
            placeholder="0"
            className="w-full bg-black/10 border border-white/10 rounded-xl px-3 py-2 text-[12px] text-white placeholder:text-white/40 outline-none focus:border-white/40 transition-colors"
          />
        </div>
        <div>
          <label className="text-[10px] font-light text-white/70 block mb-1">Máximo</label>
          <input
            type="text"
            inputMode="numeric"
            value={filtroPrecioMax}
            onChange={e => setFiltroPrecioMax(e.target.value.replace(/\D/g, ''))}
            placeholder="Sin límite"
            className="w-full bg-black/10 border border-white/10 rounded-xl px-3 py-2 text-[12px] text-white placeholder:text-white/40 outline-none focus:border-white/40 transition-colors"
          />
        </div>
      </div>
    </div>

      {hayFiltros && (
        <button
          type="button"
          onClick={limpiarFiltros}
          className="w-full py-3 rounded-xl border border-white/30 text-[10px] font-medium tracking-[0.15em] uppercase text-white hover:bg-white hover:text-roma-olive transition-all duration-300 mt-2 cursor-pointer"
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
        className="fixed inset-0 z-[-2] bg-roma-olive md:bg-[url('/fondo-campo.png')] md:bg-cover md:bg-center md:bg-no-repeat md:[background-attachment:fixed]"
      />

      {/* ── HEADER ABSOLUTE ── */}
      <header className={`absolute top-0 left-0 w-full z-50 h-20 sm:h-24 bg-transparent flex items-center px-4 sm:px-6 transition-opacity duration-200 ${sidebarOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <div className="max-w-screen-2xl mx-auto w-full flex items-center justify-between">

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              to="/"
              className="flex items-center gap-1.5 sm:gap-2 text-white bg-black/30 hover:bg-black/50 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full backdrop-blur-md border border-white/15 text-[11px] sm:text-[12px] font-light tracking-wide transition-colors"
            >
              <ArrowLeft size={14} weight="light" /> <span>Volver al inicio</span>
            </Link>
          </div>

          <img src="/logoblanco.png" alt="Roma Inmobiliaria" className="w-[6.5rem] sm:w-[8rem] h-auto object-contain opacity-95" />
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
                className="text-3xl sm:text-4xl md:text-6xl lg:text-[80px] font-light text-white tracking-[0.1em] sm:tracking-[0.15em] uppercase text-center drop-shadow-2xl"
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
        className="max-w-screen-2xl mx-auto pt-24 sm:pt-32 pb-8 px-3 sm:px-4 lg:px-6 flex flex-col relative z-40 bg-transparent min-h-screen"
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
                          href={`https://wa.me/5492914136535?text=Me interesa esta propiedad: *${activeDestacada.titulo}* (ID: ${activeDestacada.id})`}
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
        <div className="w-full mb-8 sm:mb-10 pb-5 sm:pb-6 border-b border-white/10 flex flex-col items-center justify-center gap-3 sm:gap-4">
          <HouseLine size={28} weight="light" className="text-white/80 sm:hidden" />
          <HouseLine size={32} weight="light" className="text-white/80 hidden sm:block" />
          <h2 className="text-xl sm:text-2xl md:text-4xl font-light text-white tracking-[0.1em] sm:tracking-[0.15em] uppercase text-center">
            Catálogo de Propiedades
          </h2>
        </div>

        {/* ── FILTRO HORIZONTAL VISTA PC (Desplegables efecto hamburguesa) ── */}
        <div className="hidden lg:block w-full bg-roma-olive/95 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl mb-8 text-left relative z-50">
          {/* Overlay transparente para cerrar el menú desplegable activo al hacer clic afuera */}
          {openDropdown !== null && (
            <div className="fixed inset-0 z-40" onClick={() => setOpenDropdown(null)} />
          )}

          <div className="flex items-center gap-3 flex-wrap relative z-50 justify-between">
            {/* 1. Buscador libre */}
            <div className="relative min-w-[200px] flex-1 max-w-xs">
              <MagnifyingGlass
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none"
              />
              <input
                type="text"
                value={busqueda}
                onChange={e => setBusqueda(e.target.value)}
                placeholder="Buscar por título, ubicación..."
                className="w-full bg-black/20 border border-white/15 rounded-xl pl-9 pr-3 py-2 text-[13px] text-white placeholder:text-white/40 outline-none focus:border-white/40 transition-colors"
              />
            </div>

            <div className="flex items-center gap-2.5 flex-wrap">
              {/* 2. DROPDOWN TIPO DE PROPIEDAD */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setOpenDropdown(openDropdown === 'tipo' ? null : 'tipo')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[12px] font-medium border transition-all duration-200 cursor-pointer ${
                    filtroTipo !== 'Todos'
                      ? 'bg-white border-white text-roma-olive shadow-sm font-semibold'
                      : 'bg-black/20 border-white/15 text-white/90 hover:border-white/40'
                  }`}
                >
                  <HouseLine size={15} />
                  <span>{filtroTipo === 'Todos' ? 'Tipo' : `Tipo: ${filtroTipo}`}</span>
                  <CaretDown size={12} className={`transition-transform duration-200 ${openDropdown === 'tipo' ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {openDropdown === 'tipo' && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-0 mt-2 z-50 min-w-[200px] max-h-[300px] overflow-y-auto bg-[#182a1a] border border-white/20 rounded-2xl p-2 shadow-2xl backdrop-blur-xl flex flex-col gap-1"
                    >
                      {['Todos', ...TIPOS].map(t => {
                        const isSelected = filtroTipo === t;
                        return (
                          <button
                            key={t}
                            type="button"
                            onClick={() => {
                              setFiltroTipo(t);
                              if (!t.toLowerCase().includes('campo')) setFiltroTipoCampo('Todos');
                              setOpenDropdown(null);
                            }}
                            className={`w-full text-left px-3.5 py-2 rounded-xl text-[12px] transition-colors flex items-center justify-between cursor-pointer ${
                              isSelected ? 'bg-white text-roma-olive font-semibold' : 'text-white/80 hover:bg-white/10 hover:text-white'
                            }`}
                          >
                            <span>{t}</span>
                            {isSelected && <Check size={14} weight="bold" />}
                          </button>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* 3. DROPDOWN OPERACIÓN */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setOpenDropdown(openDropdown === 'operacion' ? null : 'operacion')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[12px] font-medium border transition-all duration-200 cursor-pointer ${
                    filtroOperacion !== 'Todas'
                      ? 'bg-white border-white text-roma-olive shadow-sm font-semibold'
                      : 'bg-black/20 border-white/15 text-white/90 hover:border-white/40'
                  }`}
                >
                  <Tag size={15} />
                  <span>{filtroOperacion === 'Todas' ? 'Operación' : `Operación: ${filtroOperacion}`}</span>
                  <CaretDown size={12} className={`transition-transform duration-200 ${openDropdown === 'operacion' ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {openDropdown === 'operacion' && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-0 mt-2 z-50 min-w-[180px] bg-[#182a1a] border border-white/20 rounded-2xl p-2 shadow-2xl backdrop-blur-xl flex flex-col gap-1"
                    >
                      {['Todas', ...OPERACIONES].map(o => {
                        const isSelected = filtroOperacion === o;
                        return (
                          <button
                            key={o}
                            type="button"
                            onClick={() => {
                              setFiltroOperacion(o);
                              setOpenDropdown(null);
                            }}
                            className={`w-full text-left px-3.5 py-2 rounded-xl text-[12px] transition-colors flex items-center justify-between cursor-pointer ${
                              isSelected ? 'bg-white text-roma-olive font-semibold' : 'text-white/80 hover:bg-white/10 hover:text-white'
                            }`}
                          >
                            <span>{o}</span>
                            {isSelected && <Check size={14} weight="bold" />}
                          </button>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* 4. DROPDOWN PROVINCIA */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setOpenDropdown(openDropdown === 'provincia' ? null : 'provincia')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[12px] font-medium border transition-all duration-200 cursor-pointer ${
                    filtroProvincia !== 'Todas'
                      ? 'bg-white border-white text-roma-olive shadow-sm font-semibold'
                      : 'bg-black/20 border-white/15 text-white/90 hover:border-white/40'
                  }`}
                >
                  <MapPin size={15} />
                  <span>{filtroProvincia === 'Todas' ? 'Provincia' : filtroProvincia}</span>
                  <CaretDown size={12} className={`transition-transform duration-200 ${openDropdown === 'provincia' ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {openDropdown === 'provincia' && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-0 mt-2 z-50 min-w-[180px] bg-[#182a1a] border border-white/20 rounded-2xl p-2 shadow-2xl backdrop-blur-xl flex flex-col gap-1"
                    >
                      {PROVINCIAS.map(p => {
                        const isSelected = filtroProvincia === p;
                        return (
                          <button
                            key={p}
                            type="button"
                            onClick={() => {
                              cambiarProvincia(p);
                              setOpenDropdown(null);
                            }}
                            className={`w-full text-left px-3.5 py-2 rounded-xl text-[12px] transition-colors flex items-center justify-between cursor-pointer ${
                              isSelected ? 'bg-white text-roma-olive font-semibold' : 'text-white/80 hover:bg-white/10 hover:text-white'
                            }`}
                          >
                            <span>{p}</span>
                            {isSelected && <Check size={14} weight="bold" />}
                          </button>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* 5. DROPDOWN ZONA / CIUDAD */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setOpenDropdown(openDropdown === 'zona' ? null : 'zona')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[12px] font-medium border transition-all duration-200 cursor-pointer ${
                    filtroUbicacion !== 'Todas'
                      ? 'bg-white border-white text-roma-olive shadow-sm font-semibold'
                      : 'bg-black/20 border-white/15 text-white/90 hover:border-white/40'
                  }`}
                >
                  <MapTrifold size={15} />
                  <span>
                    {filtroUbicacion === 'Todas' 
                      ? (filtroProvincia === 'Todas' ? 'Zona / Ciudad' : `Ciudades (${filtroProvincia === 'Buenos Aires' ? 'Bs.As' : 'Río Negro'})`) 
                      : `Zona: ${filtroUbicacion}`}
                  </span>
                  <CaretDown size={12} className={`transition-transform duration-200 ${openDropdown === 'zona' ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {openDropdown === 'zona' && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-0 mt-2 z-50 min-w-[220px] max-h-[300px] overflow-y-auto bg-[#182a1a] border border-white/20 rounded-2xl p-2 shadow-2xl backdrop-blur-xl flex flex-col gap-1"
                    >
                      {['Todas', ...ubicacionesFiltradasPorProvincia].map(u => {
                        const isSelected = filtroUbicacion === u;
                        return (
                          <button
                            key={u}
                            type="button"
                            onClick={() => {
                              setFiltroUbicacion(u);
                              setOpenDropdown(null);
                            }}
                            className={`w-full text-left px-3.5 py-2 rounded-xl text-[12px] transition-colors flex items-center justify-between cursor-pointer ${
                              isSelected ? 'bg-white text-roma-olive font-semibold' : 'text-white/80 hover:bg-white/10 hover:text-white'
                            }`}
                          >
                            <span>{u}</span>
                            {isSelected && <Check size={14} weight="bold" />}
                          </button>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* 5. DROPDOWN HABITACIONES */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setOpenDropdown(openDropdown === 'habs' ? null : 'habs')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[12px] font-medium border transition-all duration-200 cursor-pointer ${
                    filtroHabs !== null
                      ? 'bg-white border-white text-roma-olive shadow-sm font-semibold'
                      : 'bg-black/20 border-white/15 text-white/90 hover:border-white/40'
                  }`}
                >
                  <Bed size={15} />
                  <span>{filtroHabs === null ? 'Habitaciones' : `Habs: ${filtroHabs}${filtroHabs === 4 ? '+' : ''}`}</span>
                  <CaretDown size={12} className={`transition-transform duration-200 ${openDropdown === 'habs' ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {openDropdown === 'habs' && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-0 mt-2 z-50 min-w-[180px] bg-[#182a1a] border border-white/20 rounded-2xl p-2 shadow-2xl backdrop-blur-xl flex flex-col gap-1"
                    >
                      <button
                        type="button"
                        onClick={() => {
                          setFiltroHabs(null);
                          setOpenDropdown(null);
                        }}
                        className={`w-full text-left px-3.5 py-2 rounded-xl text-[12px] transition-colors flex items-center justify-between cursor-pointer ${
                          filtroHabs === null ? 'bg-white text-roma-olive font-semibold' : 'text-white/80 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        <span>Todas</span>
                        {filtroHabs === null && <Check size={14} weight="bold" />}
                      </button>
                      {HABITACIONES.map(n => {
                        const isSelected = filtroHabs === n;
                        return (
                          <button
                            key={n}
                            type="button"
                            onClick={() => {
                              setFiltroHabs(n);
                              setOpenDropdown(null);
                            }}
                            className={`w-full text-left px-3.5 py-2 rounded-xl text-[12px] transition-colors flex items-center justify-between cursor-pointer ${
                              isSelected ? 'bg-white text-roma-olive font-semibold' : 'text-white/80 hover:bg-white/10 hover:text-white'
                            }`}
                          >
                            <span>{n === 4 ? '4+ habitaciones' : `${n} ${n === 1 ? 'habitación' : 'habitaciones'}`}</span>
                            {isSelected && <Check size={14} weight="bold" />}
                          </button>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* 6. DROPDOWN SUBTIPO DE CAMPO (SI APLICA) */}
              {filtroTipo.toLowerCase().includes('campo') && TIPOS_CAMPO.length > 0 && (
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setOpenDropdown(openDropdown === 'campo' ? null : 'campo')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[12px] font-medium border transition-all duration-200 cursor-pointer ${
                      filtroTipoCampo !== 'Todos'
                        ? 'bg-white border-white text-roma-olive shadow-sm font-semibold'
                        : 'bg-black/20 border-white/15 text-white/90 hover:border-white/40'
                    }`}
                  >
                    <Tree size={15} />
                    <span>{filtroTipoCampo === 'Todos' ? 'Tipo de Campo' : `Campo: ${filtroTipoCampo}`}</span>
                    <CaretDown size={12} className={`transition-transform duration-200 ${openDropdown === 'campo' ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {openDropdown === 'campo' && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full left-0 mt-2 z-50 min-w-[180px] bg-[#182a1a] border border-white/20 rounded-2xl p-2 shadow-2xl backdrop-blur-xl flex flex-col gap-1"
                      >
                        {['Todos', ...TIPOS_CAMPO].map(tc => {
                          const isSelected = filtroTipoCampo === tc;
                          return (
                            <button
                              key={tc}
                              type="button"
                              onClick={() => {
                                setFiltroTipoCampo(tc);
                                setOpenDropdown(null);
                              }}
                              className={`w-full text-left px-3.5 py-2 rounded-xl text-[12px] transition-colors flex items-center justify-between cursor-pointer ${
                                isSelected ? 'bg-white text-roma-olive font-semibold' : 'text-white/80 hover:bg-white/10 hover:text-white'
                              }`}
                            >
                              <span>{tc}</span>
                              {isSelected && <Check size={14} weight="bold" />}
                            </button>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* 7. PRECIO USD INLINE */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-semibold tracking-wider text-white/80 uppercase shrink-0">USD:</span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={filtroPrecioMin}
                  onChange={e => setFiltroPrecioMin(e.target.value.replace(/\D/g, ''))}
                  placeholder="Mín"
                  className="w-20 bg-black/20 border border-white/15 rounded-xl px-2.5 py-1.5 text-xs text-white placeholder:text-white/40 outline-none focus:border-white/40"
                />
                <span className="text-white/40 text-xs">-</span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={filtroPrecioMax}
                  onChange={e => setFiltroPrecioMax(e.target.value.replace(/\D/g, ''))}
                  placeholder="Máx"
                  className="w-20 bg-black/20 border border-white/15 rounded-xl px-2.5 py-1.5 text-xs text-white placeholder:text-white/40 outline-none focus:border-white/40"
                />
              </div>

              {/* 8. BOTÓN LIMPIAR TODO */}
              {hayFiltros && (
                <button
                  type="button"
                  onClick={limpiarFiltros}
                  className="text-white/70 hover:text-white text-xs font-medium tracking-wide underline underline-offset-4 transition-colors cursor-pointer ml-auto"
                >
                  Limpiar todo
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ── SECCIÓN INFERIOR: SIDEBAR MOBILE Y GRILLA 4 COLUMNAS EN PC ── */}
        <section className="flex gap-6 lg:gap-10 relative items-start">

          {/* SIDEBAR MOBILE */}
          <AnimatePresence>
            {sidebarOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setSidebarOpen(false)}
                  className="fixed inset-0 z-[80] lg:hidden"
                />
                <motion.aside
                  initial={{ x: '-100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '-100%' }}
                  transition={{ ease: EASE, duration: 0.35 }}
                  className="fixed top-0 left-0 bottom-0 w-[88%] max-w-[340px] bg-roma-olive border-r border-white/10 z-[90] overflow-y-auto px-5 sm:px-6 pt-6 pb-6 lg:hidden shadow-2xl rounded-r-3xl"
                >
                  <div className="flex items-center justify-between mb-5 sticky top-0 bg-roma-olive z-20 pb-3 border-b border-white/10">
                    <div className="flex items-center gap-2 text-white font-semibold text-sm uppercase tracking-wider">
                      <SlidersHorizontal size={18} weight="bold" className="text-roma-leaf" />
                      <span>Filtros</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSidebarOpen(false)}
                      className="px-3 py-1.5 rounded-full bg-black/30 hover:bg-black/40 flex items-center gap-1.5 text-white/90 hover:text-white transition-colors cursor-pointer border border-white/15 text-xs"
                      title="Cerrar"
                    >
                      <X size={14} weight="bold" />
                      <span>Cerrar</span>
                    </button>
                  </div>
                  {SidebarContent()}
                </motion.aside>
              </>
            )}
          </AnimatePresence>

          {/* GRILLA PRINCIPAL DE 4 COLUMNAS EN PC */}
          <main className="flex-1 min-w-0">
            {/* Controles */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div className="inline-flex items-center gap-1.5 text-white/80 text-[13px] font-light">
                <strong className="font-medium text-white">{propiedades.length}</strong> propiedades encontradas
              </div>

              <select
                value={ordenar}
                onChange={e => setOrdenar(e.target.value)}
                className="bg-black/30 backdrop-blur-md border border-white/10 text-white text-[12px] font-light rounded-xl px-4 py-2.5 outline-none cursor-pointer w-full sm:w-auto"
              >
                <option value="recientes">Más recientes</option>
                <option value="asc">Menor precio</option>
                <option value="desc">Mayor precio</option>
                <option value="destacadas">Destacadas primero</option>
              </select>
            </div>

            {/* Pills de filtros activos */}
            {filtrosActivos.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 mb-6">
                {filtrosActivos.map(({ label, clear }) => (
                  <button
                    key={label}
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      clear();
                    }}
                    className="group inline-flex items-center gap-2 bg-white text-roma-olive hover:bg-white/90 px-3.5 py-1.5 rounded-full text-[11px] font-medium tracking-wide shadow-md transition-all hover:scale-105 cursor-pointer"
                  >
                    <span>{label}</span>
                    <span className="w-4 h-4 rounded-full bg-roma-olive/15 group-hover:bg-roma-olive/30 flex items-center justify-center transition-colors">
                      <X size={10} weight="bold" className="text-roma-olive" />
                    </span>
                  </button>
                ))}
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    limpiarFiltros();
                  }}
                  className="text-white/70 hover:text-white text-[11px] font-medium tracking-wide underline underline-offset-4 transition-colors cursor-pointer ml-2"
                >
                  Limpiar todo
                </button>
              </div>
            )}

            {/* Grilla de 4 Tarjetas por fila en PC */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="bg-black/20 backdrop-blur-md rounded-[20px] sm:rounded-[24px] h-[400px] sm:h-[480px] animate-pulse border border-white/10" />
                ))}
              </div>
            ) : propiedades.length > 0 ? (
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6"
                variants={stagger}
                initial="hidden"
                animate="visible"
              >
                {propiedades.map(prop => (
                  <motion.div
                    key={prop.id}
                    variants={fadeUp}
                    onClick={() => abrirModal(prop)}
                    className="group bg-[#141d15] border border-white/10 hover:border-roma-leaf/40 rounded-[20px] sm:rounded-[24px] overflow-hidden cursor-pointer transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1 flex flex-col justify-between"
                  >
                    {/* Imagen */}
                    <div className="relative w-full h-[200px] sm:h-[250px] md:h-[260px] overflow-hidden bg-black/40 shrink-0">
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

                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/20 pointer-events-none" />

                      {/* Badges superiores izquierda */}
                      <div className="absolute top-3.5 left-3.5 flex items-center gap-2 z-10 flex-wrap max-w-[70%]">
                        <span className="bg-[#2a2a2a]/90 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-xl border border-white/10 shadow-sm">
                          {prop.operacion || 'COMPRAR'}
                        </span>
                        {prop.destacada && (
                          <span className="bg-roma-leaf/90 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-xl border border-roma-leaf/40 shadow-sm flex items-center gap-1">
                            <Star size={11} weight="fill" className="text-amber-300" /> DESTACADA
                          </span>
                        )}
                      </div>

                      {/* Badge tipo propiedad superior derecha */}
                      <div className="absolute top-3.5 right-3.5 z-10">
                        <span className="bg-white/90 backdrop-blur-md text-roma-dark text-[11px] font-semibold tracking-wide px-3.5 py-1.5 rounded-xl shadow-md capitalize">
                          {prop.tipo_propiedad}
                        </span>
                      </div>

                      {/* Badge contador de fotos inferior derecha */}
                      {((prop.media_urls && prop.media_urls.length > 0) || (prop.imagenes && prop.imagenes.length > 0)) && (
                        <div className="absolute bottom-3.5 right-3.5 z-10 bg-black/60 backdrop-blur-md text-white/90 text-[11px] font-medium px-2.5 py-1 rounded-xl flex items-center gap-1.5 border border-white/15 shadow-sm">
                          <svg className="w-3.5 h-3.5 text-white/80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="3" width="7" height="7" rx="1.5" />
                            <rect x="14" y="3" width="7" height="7" rx="1.5" />
                            <rect x="14" y="14" width="7" height="7" rx="1.5" />
                            <rect x="3" y="14" width="7" height="7" rx="1.5" />
                          </svg>
                          <span>{prop.media_urls?.length || prop.imagenes?.length || 1}</span>
                        </div>
                      )}
                    </div>

                    {/* Contenido del Card */}
                    <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between bg-[#141d15]">
                      <div>
                        {/* Fila con Precio a la izquierda y Título vistoso a la derecha */}
                        <div className="flex items-baseline justify-between gap-3 mb-2">
                          {/* Precio en la fuente principal limpia */}
                          <div className="text-xl md:text-2xl font-bold text-white tracking-tight shrink-0">
                            US$ {prop.precio ? prop.precio.toLocaleString('es-AR') : 'Consultar'}
                          </div>

                          {/* Título de la propiedad */}
                          <h3 className="text-lg md:text-xl font-bold text-white text-right leading-tight tracking-tight line-clamp-2">
                            {prop.titulo}
                          </h3>
                        </div>

                        {/* Ubicación con punto */}
                        {prop.ubicacion && (
                          <div className="text-xs text-white/50 font-light flex items-center gap-1.5">
                            <span className="text-[6px] text-white/40">⚪</span>
                            <span>{prop.ubicacion}{prop.provincia ? `, ${prop.provincia}` : ''}</span>
                          </div>
                        )}
                      </div>

                      {/* Línea de separación */}
                      <div className="my-4 border-t border-white/10" />

                      {/* Especificaciones en la parte inferior de la tarjeta con m² para Casas, Deptos, Terrenos y Campos */}
                      {(() => {
                        const tipoLower = (prop.tipo_propiedad || '').toLowerCase().trim();
                        const isCampo = tipoLower.includes('campo');
                        const isTerreno = tipoLower.includes('terreno') || tipoLower.includes('lote');
                        const isCasaODepto = ['casa', 'departamento', 'depto', 'duplex', 'ph'].some(t => tipoLower.includes(t));

                        const sup = prop.superficie || prop.dimensiones || prop.atributos_especificos?.dimensiones || prop.mts2;
                        const habs = prop.habitaciones || prop.atributos_especificos?.habitaciones;
                        const bns = prop.banos || prop.atributos_especificos?.banos;
                        const formatSup = sup
                          ? (String(sup).toLowerCase().includes('ha') || String(sup).toLowerCase().includes('m')
                              ? String(sup)
                              : `${sup} ${isCampo ? 'ha' : 'm²'}`)
                          : null;

                        if (isCampo) {
                          let attrs = prop.atributos_especificos;
                          if (typeof attrs === 'string') {
                            try { attrs = JSON.parse(attrs); } catch { attrs = {}; }
                          }
                          let actividad = attrs?.tipo_campo || attrs?.actividad || attrs?.aptitud || (prop as any).tipo_campo || (prop as any).actividad || (prop as any).aptitud;
                          if (!actividad || String(actividad).trim() === '' || String(actividad).toLowerCase() === 'campo') {
                            const text = `${prop.titulo || ''} ${prop.descripcion || ''}`.toLowerCase();
                            if (text.includes('ganader') || text.includes('vaca') || text.includes('hacienda')) actividad = 'Ganadero';
                            else if (text.includes('agricol') || text.includes('agrícol') || text.includes('siembra') || text.includes('cosecha')) actividad = 'Agrícola';
                            else if (text.includes('mixt')) actividad = 'Mixto';
                            else if (text.includes('forest')) actividad = 'Forestal';
                            else actividad = 'Agrícola';
                          }

                          return (
                            <div className="grid grid-cols-3 gap-2 text-left pt-0.5 items-center">
                              <div className="flex items-center gap-1 col-span-2">
                                <Ruler size={15} weight="light" className="text-roma-leaf shrink-0" />
                                <span className="text-xs font-medium text-white/90 truncate">
                                  {formatSup || '-'}
                                </span>
                              </div>
                              <div className="text-right">
                                <span className="text-xs font-medium text-white/60 capitalize truncate block" title={String(actividad)}>
                                  {actividad}
                                </span>
                              </div>
                            </div>
                          );
                        }

                        if (isTerreno) {
                          return (
                            <div className="grid grid-cols-3 gap-2 text-left pt-0.5 items-center">
                              <div className="flex items-center gap-1 col-span-2">
                                <Ruler size={15} weight="light" className="text-roma-leaf shrink-0" />
                                <span className="text-xs font-medium text-white/90 truncate">
                                  {formatSup || '-'}
                                </span>
                              </div>
                              <div className="text-right">
                                <span className="text-xs font-medium text-white/60 capitalize truncate block">
                                  {prop.tipo_propiedad || 'Terreno'}
                                </span>
                              </div>
                            </div>
                          );
                        }

                        if (isCasaODepto) {
                          return (
                            <div className="grid grid-cols-3 gap-1.5 text-left pt-0.5 items-center">
                              <div className="flex items-center gap-1">
                                <Bed size={15} weight="light" className="text-roma-leaf shrink-0" />
                                <span className="text-xs font-medium text-white/90">
                                  {habs ? String(habs) : '-'}
                                </span>
                              </div>

                              <div className="flex items-center gap-1">
                                <Bathtub size={15} weight="light" className="text-roma-leaf shrink-0" />
                                <span className="text-xs font-medium text-white/90">
                                  {bns ? String(bns) : '-'}
                                </span>
                              </div>

                              <div className="flex items-center gap-1 justify-end">
                                <Ruler size={15} weight="light" className="text-roma-leaf shrink-0" />
                                <span className="text-xs font-medium text-white/90 truncate">
                                  {formatSup || '-'}
                                </span>
                              </div>
                            </div>
                          );
                        }

                        return (
                          <div className="grid grid-cols-3 gap-2 text-left pt-0.5 items-center">
                            <div className="flex items-center gap-1 col-span-2">
                              <Ruler size={15} weight="light" className="text-roma-leaf shrink-0" />
                              <span className="text-xs font-medium text-white/90 truncate">
                                {formatSup || '-'}
                              </span>
                            </div>
                            <div className="text-right">
                              <span className="text-xs font-medium text-white/60 capitalize truncate block">
                                {prop.tipo_propiedad || '-'}
                              </span>
                            </div>
                          </div>
                        );
                      })()}
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

      {/* ── BOTÓN FLOTANTE DE FILTROS EN MOBILE (FAB FLOTANTE AL NAVEGAR) ── */}
      {heroDismissed && !showScreenLoader && !sidebarOpen && (
        <motion.button
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.35, ease: EASE }}
          onClick={() => setSidebarOpen(true)}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] lg:hidden flex items-center gap-2.5 bg-roma-olive/95 hover:bg-roma-olive text-white px-6 py-3 rounded-full border border-white/25 shadow-[0_10px_25px_rgba(0,0,0,0.5)] backdrop-blur-xl transition-all duration-300 active:scale-95 cursor-pointer"
        >
          <SlidersHorizontal size={18} weight="bold" className="text-roma-leaf" />
          <span className="font-semibold text-xs uppercase tracking-widest text-white">Filtros</span>
          {cantidadFiltrosActivos > 0 && (
            <span className="w-5 h-5 rounded-full bg-white text-roma-olive font-bold text-[10px] flex items-center justify-center shadow-xs">
              {cantidadFiltrosActivos}
            </span>
          )}
        </motion.button>
      )}

      {/* ── MODAL SOBRE EL CATÁLOGO ── */}
      <AnimatePresence>
        {modalPropiedadId !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[100] bg-[#182b19] sm:bg-black/70 backdrop-blur-md overflow-y-auto p-0 sm:p-4 md:p-6 flex justify-center items-start sm:items-center"
            onClick={() => {
              setModalPropiedadId(null);
              setSelectedPropiedadObj(null);
            }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-6xl relative min-h-full sm:min-h-0 sm:my-auto flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <PropiedadDetalle
                propId={modalPropiedadId}
                initialPropiedad={selectedPropiedadObj}
                onClose={() => {
                  setModalPropiedadId(null);
                  setSelectedPropiedadObj(null);
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}