import { motion } from 'framer-motion';
import { MapPin, Compass, Building2 } from 'lucide-react';

const EASE = [0.22, 1, 0.36, 1] as const;
const fadeUp = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } } };
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.15 } } };

const SEDES = [
  {
    id: 'villalonga',
    nombre: 'Villalonga',
    partido: 'Pdo. Patagones, BA',
    direccion: 'Los Pozos 31',
    desde: '2014',
    descripcion: 'Sede pionera y corazón del desarrollo agrícola de Patagones.',
  },
  {
    id: 'luro',
    nombre: 'Pedro Luro',
    partido: 'Pdo. Villarino, BA',
    direccion: 'C. 5 N°1146',
    desde: '2022',
    descripcion: 'Centro operativo clave en el Valle Bonaerense del Río Colorado.',
  },
  {
    id: 'sanblas',
    nombre: 'Bahía San Blas',
    partido: 'Pdo. Patagones, BA',
    direccion: 'Blvr. Wasserman 426',
    desde: '2024',
    descripcion: 'Atención especializada en la franja costera y emprendimientos insulares.',
  },
];

const LOCALIDADES_BA = [
  'Carmen de Patagones', 'Stroeder', 'Hilario Ascasubi', 'Mayor Buratovich',
  'Juan A. Pradere', 'Médanos', 'Cardenal Cagliero',
];

const LOCALIDADES_RN = [
  'Viedma', 'Guardia Mitre', 'San Javier', 'Cubanea',
  'General Conesa', 'San Antonio Oeste', 'Las Grutas',
];

export default function SedesSection() {
  return (
    <section id="ubicaciones" className="relative z-10 pt-20 sm:pt-28 pb-20 sm:pb-28 px-4 sm:px-6 overflow-hidden">
      <motion.div
        className="max-w-5xl mx-auto w-full"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={stagger}
      >

        {/* ENCABEZADO */}
        <motion.div variants={fadeUp} className="text-center mb-10 sm:mb-14">
          <p className="text-roma-leaf text-[10px] sm:text-[11px] md:text-[12px] font-semibold uppercase tracking-[0.3em] mb-3">
            Ubicaciones
          </p>
          <h2 className="font-['Cinzel',serif] text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold text-white tracking-tight drop-shadow-md mb-5 sm:mb-6">
            Nuestras Sedes
          </h2>
          <p className="text-white/80 text-sm sm:text-base md:text-lg font-light max-w-3xl mx-auto leading-relaxed">
            Más de <span className="text-roma-leaf font-semibold">12 años</span> de trayectoria y <span className="text-white font-semibold">+200 propiedades</span> gestionadas avalan nuestra experiencia. Con 3 sedes físicas y cobertura activa en <span className="text-roma-leaf font-semibold">17 localidades</span>, impulsamos el desarrollo inmobiliario y agrícola en los valles productivos del sur bonaerense y la Patagonia.
          </p>
        </motion.div>

        {/* 3 SEDES — Sin hover, estáticas y limpias */}
        <motion.div variants={fadeUp} className="mb-10 sm:mb-14">
          <h3 className="font-['Cinzel',serif] text-base sm:text-lg font-medium text-white/90 mb-4 sm:mb-5 flex items-center gap-2">
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

        {/* LOCALIDADES DONDE TRABAJAMOS */}
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
                  key={loc}
                  className="text-[11px] sm:text-xs px-3 sm:px-3.5 py-1.5 rounded-full border bg-white/5 text-white/80 border-white/10"
                >
                  {loc}
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
                  key={loc}
                  className="text-[11px] sm:text-xs px-3 sm:px-3.5 py-1.5 rounded-full border bg-white/5 text-white/80 border-white/10"
                >
                  {loc}
                </span>
              ))}
            </div>
          </div>
        </motion.div>

      </motion.div>
    </section>
  );
}
