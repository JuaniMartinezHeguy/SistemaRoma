import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Compass, Building2, TrendingUp } from 'lucide-react';

interface SedeFisica {
  id: string;
  nombre: string;
  partido: string;
  direccion: string;
  desde: string;
  descripcion: string;
  mapaUrl: string;
  coordSvg: { x: number; y: number };
  textOffset?: { dx: number; dy: number };
}

interface Localidad {
  nombre: string;
  provincia: 'BA' | 'RN';
  zona: string;
  desc: string;
  coordSvg: { x: number; y: number };
  textOffset?: { dx: number; dy: number };
}

const EASE = [0.22, 1, 0.36, 1] as const;
const fadeUp = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } } };
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.15 } } };

const SEDES: SedeFisica[] = [
  {
    id: 'luro',
    nombre: 'Pedro Luro',
    partido: 'Pdo. Villarino, BA',
    direccion: 'C. 5 N°1146',
    desde: '2022',
    descripcion: 'Centro operativo clave en el Valle Bonaerense del Río Colorado.',
    mapaUrl: 'https://maps.google.com/maps?q=-39.5033084,-62.6847163&t=k&z=18&ie=UTF8&iwloc=&output=embed',
    coordSvg: { x: 480, y: 270 },
    textOffset: { dx: 14, dy: 4 },
  },
  {
    id: 'villalonga',
    nombre: 'Villalonga',
    partido: 'Pdo. Patagones, BA',
    direccion: 'Los Pozos 31',
    desde: '2012',
    descripcion: 'Sede pionera y corazón del desarrollo agrícola de Patagones.',
    mapaUrl: 'https://maps.google.com/maps?q=-39.9161537,-62.6215767&t=k&z=18&ie=UTF8&iwloc=&output=embed',
    coordSvg: { x: 430, y: 410 },
    textOffset: { dx: 14, dy: 4 },
  },
  {
    id: 'sanblas',
    nombre: 'Bahía San Blas',
    partido: 'Pdo. Patagones, BA',
    direccion: 'Blvr. Wasserman 426',
    desde: '2024',
    descripcion: 'Atención especializada en la franja costera y emprendimientos insulares.',
    mapaUrl: 'https://maps.google.com/maps?q=-40.555102,-62.236987&t=k&z=18&ie=UTF8&iwloc=&output=embed',
    coordSvg: { x: 570, y: 510 },
    textOffset: { dx: 14, dy: 4 },
  },
];

const LOCALIDADES_BA: Localidad[] = [
  { nombre: 'Carmen de Patagones', provincia: 'BA', zona: 'Villarino y Patagones', desc: 'Cabecera histórica y centro administrativo del partido.', coordSvg: { x: 410, y: 575 }, textOffset: { dx: 12, dy: -8 } },
  { nombre: 'Stroeder', provincia: 'BA', zona: 'Villarino y Patagones', desc: 'Núcleo cerealero e industrial del sur bonaerense.', coordSvg: { x: 420, y: 480 }, textOffset: { dx: 12, dy: 4 } },
  { nombre: 'Hilario Ascasubi', provincia: 'BA', zona: 'Villarino y Patagones', desc: 'Zona de regadío y producción hortícola intensiva.', coordSvg: { x: 460, y: 200 }, textOffset: { dx: 12, dy: 4 } },
  { nombre: 'Mayor Buratovich', provincia: 'BA', zona: 'Villarino y Patagones', desc: 'Eje agropecuario de la cuenca baja del Colorado.', coordSvg: { x: 470, y: 140 }, textOffset: { dx: 12, dy: 4 } },
  { nombre: 'Juan A. Pradere', provincia: 'BA', zona: 'Villarino y Patagones', desc: 'Localidad productora de cebolla y cultivos bajo riego.', coordSvg: { x: 440, y: 340 }, textOffset: { dx: 12, dy: 4 } },
  { nombre: 'Médanos', provincia: 'BA', zona: 'Villarino y Patagones', desc: 'Cabecera del partido de Villarino y zona vitivinícola.', coordSvg: { x: 480, y: 70 }, textOffset: { dx: 12, dy: 4 } },
  { nombre: 'Cardenal Cagliero', provincia: 'BA', zona: 'Villarino y Patagones', desc: 'Área mixta de ganadería y secano.', coordSvg: { x: 470, y: 535 }, textOffset: { dx: 12, dy: 4 } },
];

const LOCALIDADES_RN: Localidad[] = [
  { nombre: 'Viedma', provincia: 'RN', zona: 'Valle Inferior y Costa', desc: 'Capital provincial y portal de la Patagonia argentina.', coordSvg: { x: 370, y: 640 }, textOffset: { dx: 12, dy: 16 } },
  { nombre: 'Guardia Mitre', provincia: 'RN', zona: 'Valle Inferior y Costa', desc: 'Tradición ganadera sobre la margen norte del Río Negro.', coordSvg: { x: 250, y: 470 }, textOffset: { dx: 12, dy: -8 } },
  { nombre: 'San Javier', provincia: 'RN', zona: 'Valle Inferior y Costa', desc: 'Valle de regadío, producción de frutos e intensivos.', coordSvg: { x: 290, y: 615 }, textOffset: { dx: 12, dy: 14 } },
  { nombre: 'Cubanea', provincia: 'RN', zona: 'Valle Inferior y Costa', desc: 'Zona ganadera e irrigada del curso medio del río.', coordSvg: { x: 230, y: 560 }, textOffset: { dx: 12, dy: 14 } },
  { nombre: 'General Conesa', provincia: 'RN', zona: 'Valle Inferior y Costa', desc: 'Encrucijada logística y valle frutícola-ganadero.', coordSvg: { x: 110, y: 440 }, textOffset: { dx: 12, dy: -6 } },
  { nombre: 'San Antonio Oeste', provincia: 'RN', zona: 'Valle Inferior y Costa', desc: 'Puerto pesquero e industrial de la bahía.', coordSvg: { x: 100, y: 670 }, textOffset: { dx: 12, dy: 4 } },
  { nombre: 'Las Grutas', provincia: 'RN', zona: 'Valle Inferior y Costa', desc: 'Desarrollo turístico y bienes raíces de costa.', coordSvg: { x: 110, y: 730 }, textOffset: { dx: 12, dy: 4 } },
];

const HITO_TRAYECTORIA = [
  {
    id: 0,
    year: '2012',
    titulo: 'Origen en Villalonga',
    sub: 'Partido de Patagones',
    desc: 'Fundación de Roma Inmobiliaria y primera sede física en el corazón del sur bonaerense.',
  },
  {
    id: 1,
    year: '2022',
    titulo: 'Sede Pedro Luro',
    sub: 'Partido de Villarino',
    desc: 'Apertura de la segunda sede para liderar la comercialización en el Valle Bonaerense del Río Colorado.',
  },
  {
    id: 2,
    year: '2024',
    titulo: 'Sede San Blas',
    sub: 'Franja Costera',
    desc: 'Expansión marítima e insular especializándonos en oportunidades turísticas y costeras.',
  },
  {
    id: 3,
    year: 'Presente',
    titulo: '17 Localidades Cubiertas',
    sub: 'Buenos Aires & Río Negro',
    desc: 'Consolidación de una red de presencia continua en valles productivos y centros urbanos de la región.',
  },
];

const allItems = [
  ...SEDES.map((s) => ({ id: s.id, nombre: s.nombre, tipo: 'sede' as const, info: s.descripcion, coord: s.coordSvg, textOffset: s.textOffset, partido: s.partido })),
  ...LOCALIDADES_BA.map((l) => ({ id: l.nombre.toLowerCase().replace(/\s+/g, ''), nombre: l.nombre, tipo: 'ba' as const, info: l.desc, coord: l.coordSvg, textOffset: l.textOffset, partido: 'Buenos Aires' })),
  ...LOCALIDADES_RN.map((l) => ({ id: l.nombre.toLowerCase().replace(/\s+/g, ''), nombre: l.nombre, tipo: 'rn' as const, info: l.desc, coord: l.coordSvg, textOffset: l.textOffset, partido: 'Río Negro' })),
];

export default function SedesSection() {
  const [selectedId, setSelectedId] = useState<string>('luro');
  const [activeStep, setActiveStep] = useState<number>(3);

  const currentSelection = allItems.find((item) => item.id === selectedId) || allItems[0];
  const activeHito = HITO_TRAYECTORIA[activeStep];

  return (
    <section id="ubicaciones" className="relative z-10 pt-20 sm:pt-28 pb-20 sm:pb-36 px-4 sm:px-6 overflow-hidden">
      
      {/* ══════════════════════════════════════════════════════════════
          VISTA ESCRITORIO (COMPUTADORA) - Diseño interactivo original
          ══════════════════════════════════════════════════════════════ */}
      <div className="hidden lg:block max-w-7xl mx-auto w-full">
        {/* 1. ENCABEZADO */}
        <div className="text-center mb-12">
          <p className="text-roma-leaf text-[11px] md:text-[12px] font-semibold uppercase tracking-[0.3em] mb-3">
            Ubicaciones
          </p>
          <h2 className="font-['Cinzel',serif] text-4xl md:text-5xl lg:text-6xl font-semibold text-white tracking-tight drop-shadow-md mb-6">
            Nuestras Sedes
          </h2>
          <p className="text-white/80 text-base md:text-lg font-light max-w-3xl mx-auto leading-relaxed">
            Más de <span className="text-roma-leaf font-semibold">14 años</span> de trayectoria y <span className="text-white font-semibold">+200 propiedades</span> gestionadas avalan nuestra experiencia. Con 3 sedes físicas y cobertura activa en <span className="text-roma-leaf font-semibold">17 localidades</span>, impulsamos el desarrollo inmobiliario y agrícola en los valles productivos del sur bonaerense y la Patagonia.
          </p>
        </div>

        {/* 2. BARRA DINÁMICA DE TRAYECTORIA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: EASE }}
          className="mb-16 rounded-[2.5rem] bg-[#162719]/90 border border-white/12 backdrop-blur-xl shadow-2xl p-6 sm:p-8 relative overflow-hidden"
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-5 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-roma-olive/40 border border-roma-leaf/40 flex items-center justify-center text-roma-leaf">
                <TrendingUp size={16} />
              </div>
              <h3 className="font-['Cinzel',serif] text-xl md:text-2xl font-semibold text-white tracking-tight">
                Trayectoria & Expansión Regional
              </h3>
            </div>
            <span className="text-[11px] font-semibold uppercase tracking-widest text-roma-leaf bg-black/40 px-3.5 py-1.5 rounded-full border border-roma-leaf/30 inline-block">
              Liderazgo Inmobiliario Rural
            </span>
          </div>

          {/* Línea interactiva */}
          <div className="relative pt-4 pb-2">
            <div className="absolute top-[30px] left-[12.5%] right-[12.5%] h-[3px] bg-white/10 rounded-full pointer-events-none" />
            <motion.div
              className="absolute top-[30px] left-[12.5%] h-[3px] bg-gradient-to-r from-roma-leaf via-[#c9a56a] to-roma-leaf rounded-full shadow-md pointer-events-none"
              animate={{ width: `${(activeStep / (HITO_TRAYECTORIA.length - 1)) * 75}%` }}
              transition={{ duration: 0.45, ease: EASE }}
            />

            <div className="grid grid-cols-4 gap-2 relative z-10">
              {HITO_TRAYECTORIA.map((hito, idx) => {
                const isActive = activeStep === idx;
                return (
                  <div
                    key={hito.id}
                    onClick={() => setActiveStep(idx)}
                    onMouseEnter={() => setActiveStep(idx)}
                    className="flex flex-col items-center text-center cursor-pointer group"
                  >
                    <div className="relative mb-3 flex items-center justify-center">
                      {isActive && (
                        <motion.div
                          layoutId="nodePulseDesktop"
                          className="absolute w-10 h-10 rounded-full bg-roma-leaf/30 border border-roma-leaf/60"
                          transition={{ duration: 0.3 }}
                        />
                      )}
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 border ${isActive
                        ? 'bg-white border-roma-leaf text-roma-dark shadow-lg scale-110'
                        : 'bg-[#1a2c1a] border-white/30 text-white/70 group-hover:border-white/60'
                        }`}>
                        <span className="w-2.5 h-2.5 rounded-full bg-current" />
                      </div>
                    </div>

                    <span className={`font-['Cinzel',serif] text-sm sm:text-base font-bold transition-colors duration-300 ${isActive ? 'text-roma-leaf' : 'text-white/60 group-hover:text-white'
                      }`}>
                      {hito.year}
                    </span>

                    <span className="text-white font-medium text-xs sm:text-sm mt-0.5 tracking-wide line-clamp-1">
                      {hito.titulo}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Detalle Dinámico */}
            <div className="mt-8 pt-5 border-t border-white/10 text-center min-h-[50px] flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStep}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3, ease: EASE }}
                  className="max-w-2xl mx-auto"
                >
                  <p className="text-white/90 text-sm font-light leading-relaxed">
                    <span className="font-semibold text-roma-leaf">{activeHito.titulo} ({activeHito.sub}): </span>
                    {activeHito.desc}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* 3. DOS COLUMNAS: TARJETAS Y MAPA SVG CARTOGRÁFICO */}
        <div className="grid grid-cols-12 gap-12 items-start">
          {/* Columna Izquierda */}
          <div className="col-span-6 flex flex-col gap-8 text-left">
            <div>
              <h3 className="font-['Cinzel',serif] text-lg font-medium text-white/90 mb-4 flex items-center gap-2">
                <Building2 size={18} className="text-roma-leaf" />
                <span>Sedes Físicas Principales</span>
              </h3>

              <div className="flex flex-col gap-3">
                {SEDES.map((sede) => {
                  const isActive = selectedId === sede.id;
                  return (
                    <motion.div
                      key={sede.id}
                      onClick={() => setSelectedId(sede.id)}
                      onMouseEnter={() => setSelectedId(sede.id)}
                      className={`p-5 rounded-2xl cursor-pointer transition-all duration-300 border relative overflow-hidden ${isActive
                        ? 'bg-roma-olive/90 border-white/30 shadow-xl shadow-black/40 scale-[1.01]'
                        : 'bg-[#1a2c1a]/40 border-white/10 hover:bg-[#1a2c1a]/80 hover:border-white/20'
                        }`}
                    >
                      {isActive && (
                        <span className="absolute top-4 right-4 text-[10px] font-semibold uppercase tracking-widest text-roma-leaf bg-black/40 px-3 py-1 rounded-full border border-roma-leaf/30">
                          Sede Activa • Desde {sede.desde}
                        </span>
                      )}

                      <div className="flex items-start gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors duration-300 ${isActive ? 'bg-white text-roma-olive shadow-md' : 'bg-white/10 text-white/70'
                          }`}>
                          <MapPin size={20} />
                        </div>
                        <div>
                          <h4 className="text-white font-semibold text-lg tracking-wide flex items-center gap-2">
                            {sede.nombre}
                            <span className="text-xs font-normal text-white/60">({sede.partido})</span>
                          </h4>
                          <p className="text-white/80 text-sm font-light mt-0.5">
                            {sede.direccion}
                          </p>
                          <p className="text-white/60 text-xs font-light mt-1 italic">
                            {sede.descripcion}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Chips de localidades */}
            <div className="p-6 rounded-3xl bg-[#1a2c1a]/60 border border-white/10 backdrop-blur-md flex flex-col gap-5">
              <h3 className="font-['Cinzel',serif] text-base font-medium text-white/90 flex items-center gap-2">
                <Compass size={18} className="text-roma-leaf" />
                <span>Red de Cobertura en 17 Localidades</span>
              </h3>

              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-roma-leaf block mb-2.5">
                  Buenos Aires (Partidos de Villarino y Patagones):
                </span>
                <div className="flex flex-wrap gap-2">
                  {LOCALIDADES_BA.map((loc) => {
                    const itemKey = loc.nombre.toLowerCase().replace(/\s+/g, '');
                    const isSelected = selectedId === itemKey;
                    return (
                      <button
                        key={loc.nombre}
                        onClick={() => setSelectedId(itemKey)}
                        onMouseEnter={() => setSelectedId(itemKey)}
                        className={`text-xs px-3.5 py-1.5 rounded-full border transition-all duration-300 cursor-pointer ${isSelected
                          ? 'bg-roma-olive text-white border-white/40 shadow-md font-semibold'
                          : 'bg-white/5 text-white/80 border-white/10 hover:bg-white/15 hover:text-white'
                          }`}
                      >
                        {loc.nombre}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#8fc0b6] block mb-2.5">
                  Río Negro (Valle Inferior y Costa Atlántica):
                </span>
                <div className="flex flex-wrap gap-2">
                  {LOCALIDADES_RN.map((loc) => {
                    const itemKey = loc.nombre.toLowerCase().replace(/\s+/g, '');
                    const isSelected = selectedId === itemKey;
                    return (
                      <button
                        key={loc.nombre}
                        onClick={() => setSelectedId(itemKey)}
                        onMouseEnter={() => setSelectedId(itemKey)}
                        className={`text-xs px-3.5 py-1.5 rounded-full border transition-all duration-300 cursor-pointer ${isSelected
                          ? 'bg-[#2a4d46] text-white border-[#8fc0b6]/50 shadow-md font-semibold'
                          : 'bg-white/5 text-white/80 border-white/10 hover:bg-white/15 hover:text-white'
                          }`}
                      >
                        {loc.nombre}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Columna Derecha: Mapa SVG */}
          <div className="col-span-6 w-full">
            <div className="bg-[#1a2c1a]/95 backdrop-blur-xl border border-white/10 p-6 md:p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden flex flex-col gap-6">
              <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-roma-leaf animate-pulse" />
                  <span className="text-xs font-semibold uppercase tracking-widest text-white">
                    Mapa Cartográfico de Cobertura
                  </span>
                </div>
              </div>

              <div className="relative w-full h-[650px] bg-[#f4efe0] rounded-3xl overflow-hidden border border-white/20 p-2 shadow-2xl group">
                <div className="absolute top-4 left-4 z-20 bg-white/90 backdrop-blur-md border border-slate-300 p-3 rounded-2xl text-[10px] text-slate-800 flex flex-col gap-1.5 shadow-lg select-none">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-slate-800 shadow-xs" />
                    <span className="font-bold text-slate-900">Sede Oficial</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-600" />
                    <span className="font-medium">◎ Cobertura Territorial</span>
                  </div>
                  <div className="flex items-center gap-2 border-t border-slate-200 pt-1 mt-0.5">
                    <span className="w-3 h-1 bg-blue-600 rounded-full" />
                    <span className="text-blue-700 font-semibold">~ Curso Real del Río Negro</span>
                  </div>
                </div>

                <svg
                  viewBox="0 0 680 780"
                  className="w-full h-full object-contain filter drop-shadow-md select-none"
                >
                  <defs>
                    <linearGradient id="gradOcean" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#d0e5f5" />
                      <stop offset="100%" stopColor="#b4d7f0" />
                    </linearGradient>

                    <linearGradient id="gradLandBA" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#e8e2cf" />
                      <stop offset="100%" stopColor="#dcd4bd" />
                    </linearGradient>

                    <linearGradient id="gradLandRN" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#dfd7c2" />
                      <stop offset="100%" stopColor="#d2c8af" />
                    </linearGradient>

                    <filter id="mapShadow" x="-20%" y="-20%" width="140%" height="140%">
                      <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000000" floodOpacity="0.3" />
                    </filter>
                  </defs>

                  {/* Mar Argentino */}
                  <path
                    d="M 500,20 C 530,220 480,420 520,560 C 550,640 450,780 680,780 L 680,20 Z"
                    fill="url(#gradOcean)"
                    stroke="#86b7e3"
                    strokeWidth="1.5"
                  />
                  <text x="540" y="700" fill="#2b6cb0" fontSize="13" fontStyle="italic" fontWeight="600" opacity="0.8" letterSpacing="1">
                    Mar Argentino
                  </text>

                  {/* Buenos Aires */}
                  <path
                    d="M 300,20 L 580,20 C 550,220 510,400 540,560 L 370,600 Z"
                    fill="url(#gradLandBA)"
                    stroke="#a3967d"
                    strokeWidth="1.5"
                  />
                  <text x="400" y="45" fill="#355E3B" fontSize="12" fontWeight="bold" letterSpacing="2">
                    PROVINCIA DE BUENOS AIRES
                  </text>
                  <text x="400" y="62" fill="#64748b" fontSize="9" fontWeight="500">
                    (Partidos de Villarino y Patagones)
                  </text>

                  {/* Río Negro */}
                  <path
                    d="M 20,420 L 370,600 L 540,560 C 500,640 450,780 20,780 Z"
                    fill="url(#gradLandRN)"
                    stroke="#8c7e65"
                    strokeWidth="1.5"
                  />
                  <text x="30" y="430" fill="#1b4d3e" fontSize="12" fontWeight="bold" letterSpacing="2">
                    PROVINCIA DE RÍO NEGRO
                  </text>

                  {/* Boca Río Negro */}
                  <path
                    d="M 430,645 Q 470,660 510,670 L 530,680 L 490,695 C 450,680 410,665 370,645 Z"
                    fill="#b4d7f0"
                    opacity="0.85"
                  />

                  {/* Río Negro */}
                  <path
                    d="M 60,400 C 100,420 140,440 180,455 C 210,465 230,480 250,475 C 270,470 280,510 230,560 C 220,580 260,600 290,615 C 320,630 350,625 370,640 C 410,645 460,660 510,670"
                    fill="none"
                    stroke="#2563eb"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <text x="130" y="445" fill="#1d4ed8" fontSize="10" fontWeight="bold" fontStyle="italic">
                    ← RÍO NEGRO (Cauce Hídrico Real)
                  </text>
                  <text x="430" y="685" fill="#1d4ed8" fontSize="9" fontWeight="bold" fontStyle="italic">
                    Desembocadura →
                  </text>

                  {/* Ruta 3 */}
                  <path
                    d="M 480,70 L 470,140 L 460,200 L 480,270 L 440,340 L 430,410 L 420,480 L 470,535 L 410,575 L 370,640 L 110,440 L 100,670 L 110,730"
                    fill="none"
                    stroke="#dc2626"
                    strokeWidth="2"
                    strokeDasharray="6 4"
                    opacity="0.85"
                  />
                  <text x="500" y="105" fill="#b91c1c" fontSize="9" fontWeight="bold">Ruta Nac. 3</text>

                  {/* Localidades y Sedes */}
                  {allItems.map((item) => {
                    const isSelected = selectedId === item.id;
                    const isSede = item.tipo === 'sede';
                    const dx = item.textOffset?.dx ?? (isSede ? 12 : 9);
                    const dy = item.textOffset?.dy ?? 4;

                    return (
                      <g
                        key={item.id}
                        onClick={() => setSelectedId(item.id)}
                        className="cursor-pointer transition-transform duration-300"
                        transform={`translate(${item.coord.x}, ${item.coord.y})`}
                        filter="url(#mapShadow)"
                      >
                        {isSelected && (
                          <circle
                            r={isSede ? 14 : 11}
                            fill="none"
                            stroke="#1d4ed8"
                            strokeWidth="2"
                            className="animate-ping opacity-80"
                          />
                        )}

                        <circle
                          r={isSede ? (isSelected ? 7 : 6) : (isSelected ? 5.5 : 4.5)}
                          fill={isSede ? '#0f172a' : '#334155'}
                          stroke="#ffffff"
                          strokeWidth="1.5"
                        />

                        <text
                          x={dx}
                          y={dy}
                          fill="#0f172a"
                          stroke="#f4efe0"
                          strokeWidth="4"
                          strokeLinejoin="round"
                          paintOrder="stroke fill"
                          fontSize={isSede ? '14' : '10.5'}
                          fontWeight={isSede ? '800' : '600'}
                          className="pointer-events-none select-none"
                        >
                          {item.nombre}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>

              {/* Pie dinámico */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-left">
                <p className="text-xs text-white/90 italic font-light flex items-center justify-between">
                  <span>
                    <strong className="text-white not-italic font-semibold">{currentSelection.nombre}</strong>
                    {currentSelection.partido ? ` (${currentSelection.partido})` : ''} — {currentSelection.info}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          VISTA MOBILE - Diseño adaptado, limpio y sin scroll horizontal
          ══════════════════════════════════════════════════════════════ */}
      <motion.div
        className="block lg:hidden max-w-5xl mx-auto w-full"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={stagger}
      >
        {/* ENCABEZADO MOBILE */}
        <motion.div variants={fadeUp} className="text-center mb-10">
          <p className="text-roma-leaf text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.3em] mb-3">
            Ubicaciones
          </p>
          <h2 className="font-['Cinzel',serif] text-3xl sm:text-4xl font-semibold text-white tracking-tight drop-shadow-md mb-5">
            Nuestras Sedes
          </h2>
          <p className="text-white/80 text-sm sm:text-base font-light max-w-3xl mx-auto leading-relaxed">
            Más de <span className="text-roma-leaf font-semibold">14 años</span> de trayectoria y <span className="text-white font-semibold">+200 propiedades</span> gestionadas avalan nuestra experiencia. Con 3 sedes físicas y cobertura activa en <span className="text-roma-leaf font-semibold">17 localidades</span>, impulsamos el desarrollo inmobiliario y agrícola en los valles productivos del sur bonaerense y la Patagonia.
          </p>
        </motion.div>

        {/* 3 SEDES FÍSICAS MOBILE */}
        <motion.div variants={fadeUp} className="mb-10">
          <h3 className="font-['Cinzel',serif] text-base sm:text-lg font-medium text-white/90 mb-4 flex items-center gap-2">
            <Building2 size={18} className="text-roma-leaf" />
            <span>Sedes Físicas Principales</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            {SEDES.map((sede) => (
              <div
                key={sede.id}
                className="p-4 sm:p-5 rounded-2xl bg-[#1a2c1a]/70 border border-white/10 backdrop-blur-md"
              >
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-roma-olive/50 text-roma-leaf border border-roma-leaf/30">
                    <MapPin size={18} />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-white font-semibold text-base sm:text-lg tracking-wide leading-tight">
                      {sede.nombre}
                    </h4>
                    <p className="text-white/50 text-[10px] sm:text-xs font-light mt-0.5">
                      {sede.partido}
                    </p>
                    <p className="text-white/80 text-xs sm:text-sm font-light mt-1">
                      {sede.direccion}
                    </p>
                    <p className="text-white/50 text-[10px] sm:text-xs font-light mt-1.5 italic">
                      {sede.descripcion}
                    </p>
                    <span className="inline-block mt-2 text-[9px] sm:text-[10px] font-semibold uppercase tracking-widest text-roma-leaf bg-black/30 px-2.5 py-1 rounded-full border border-roma-leaf/20">
                      Desde {sede.desde}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* LOCALIDADES DONDE TRABAJAMOS MOBILE */}
        <motion.div
          variants={fadeUp}
          className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-[#1a2c1a]/60 border border-white/10 backdrop-blur-md flex flex-col gap-5"
        >
          <h3 className="font-['Cinzel',serif] text-base font-medium text-white/90 flex items-center gap-2">
            <Compass size={18} className="text-roma-leaf" />
            <span>Red de Cobertura en 17 Localidades</span>
          </h3>

          {/* Buenos Aires */}
          <div>
            <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-roma-leaf block mb-2.5">
              Buenos Aires (Partidos de Villarino y Patagones):
            </span>
            <div className="flex flex-wrap gap-2">
              {LOCALIDADES_BA.map((loc) => (
                <span
                  key={loc.nombre}
                  className="text-[11px] sm:text-xs px-3 sm:px-3.5 py-1.5 rounded-full border bg-white/5 text-white/80 border-white/10"
                >
                  {loc.nombre}
                </span>
              ))}
            </div>
          </div>

          {/* Río Negro */}
          <div>
            <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-[#8fc0b6] block mb-2.5">
              Río Negro (Valle Inferior y Costa Atlántica):
            </span>
            <div className="flex flex-wrap gap-2">
              {LOCALIDADES_RN.map((loc) => (
                <span
                  key={loc.nombre}
                  className="text-[11px] sm:text-xs px-3 sm:px-3.5 py-1.5 rounded-full border bg-white/5 text-white/80 border-white/10"
                >
                  {loc.nombre}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>

    </section>
  );
}
