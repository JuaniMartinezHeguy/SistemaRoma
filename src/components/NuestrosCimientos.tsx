import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const EASE = [0.22, 1, 0.36, 1] as const;

// ─── COMPONENTE COUNT-UP ANIMADO ────────────────────────────────────────────────
function CountUpNumber({ end, prefix = '', suffix = '', duration = 2 }: { end: number; prefix?: string; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.05 });

  useEffect(() => {
    if (isInView) {
      setStarted(true);
    }
  }, [isInView]);

  // Fallback directo para mobile por si IntersectionObserver o scroll margin fallan en pantallas chicas
  useEffect(() => {
    if (started) return;

    const checkVisibility = () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          setStarted(true);
        }
      }
    };

    checkVisibility();
    window.addEventListener('scroll', checkVisibility, { passive: true });
    return () => window.removeEventListener('scroll', checkVisibility);
  }, [started]);

  useEffect(() => {
    if (!started) return;

    let startTime: number | null = null;
    let animationFrameId: number;

    const updateCount = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      
      // Easing outExpo
      const easeOutProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.floor(easeOutProgress * end));

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(updateCount);
      }
    };

    animationFrameId = requestAnimationFrame(updateCount);
    return () => cancelAnimationFrame(animationFrameId);
  }, [started, end, duration]);

  return (
    <span ref={ref} className="font-['Cinzel',serif] tracking-tight">
      {prefix}{count.toLocaleString('es-AR')}{suffix}
    </span>
  );
}

export default function NuestrosCimientos() {
  return (
    <section id="nosotros" className="relative z-10 pt-28 pb-36 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto w-full">

        {/* 1. ENCABEZADO DE LA SECCIÓN */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: EASE }}
          className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-8 mb-16 gap-6"
        >
          <div className="flex flex-col text-left">
            {/* Eyebrow con ícono de espiga de trigo */}
            <div className="flex items-center gap-2 mb-3">
              <svg className="w-4 h-4 text-roma-leaf" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 2v20M12 4c-2 2-3 4-3 6s1 4 3 4M12 4c2 2 3 4 3 6s-1 4-3 4M12 10c-2 2-3 4-3 6s1 4 3 4M12 10c2 2 3 4 3 6s-1 4-3 4" />
              </svg>
              <span className="text-roma-leaf text-[11px] md:text-[12px] font-semibold uppercase tracking-[0.3em]">
                NUESTROS CIMIENTOS
              </span>
            </div>

            {/* Título Principal en Cinzel */}
            <h2 className="font-['Cinzel',serif] text-4xl md:text-5xl lg:text-6xl font-semibold text-white tracking-tight leading-[1.1]">
              Raíces que <span className="text-roma-leaf font-normal italic">trascienden</span>
            </h2>
          </div>

          {/* Bloque Desde 2012 a la derecha */}
          <div className="flex flex-col md:items-end text-left md:text-right border-l-2 md:border-l-0 md:border-r-2 border-roma-leaf/40 pl-4 md:pl-0 md:pr-4">
            <span className="font-['Cinzel',serif] text-roma-leaf text-lg font-bold tracking-widest uppercase">
              DESDE 2012
            </span>
            <span className="text-white/60 text-xs font-light tracking-wide mt-0.5">
              Villalonga · Sur Bonaerense y Patagonia
            </span>
          </div>
        </motion.div>

        {/* 2. GRID DE 2 COLUMNAS (55/45) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center mb-24">

          {/* COLUMNA IZQUIERDA (55%): COMPOSICIÓN ARQUITECTÓNICA EJECUTIVA DE 2 CUADROS CON MONOGRAMA */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: EASE }}
            className="lg:col-span-7 relative h-[500px] sm:h-[540px] w-full select-none"
          >
            {/* Esquina decorativa dorada superior izquierda */}
            <div className="absolute -top-3 -left-3 w-16 h-16 border-t-2 border-l-2 border-roma-leaf/60 rounded-tl-xl z-20 pointer-events-none" />

            {/* Esquina decorativa dorada inferior derecha */}
            <div className="absolute -bottom-3 -right-3 w-16 h-16 border-b-2 border-r-2 border-roma-leaf/60 rounded-br-xl z-20 pointer-events-none" />

            {/* Monograma de Vidrio Flotante Superior */}
            <div className="absolute top-8 left-8 z-30 bg-[#162719]/90 backdrop-blur-xl border border-roma-leaf/40 px-4 py-2 rounded-full shadow-2xl flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-roma-leaf animate-pulse" />
              <span className="font-['Cinzel',serif] text-xs font-bold uppercase tracking-widest text-roma-leaf">
                FUNDADO EN VILLALONGA • 2012
              </span>
            </div>

            {/* Cuadro Principal Dominante (Izquierda-Arriba) */}
            <div className="absolute top-0 left-0 w-[74%] h-[82%] rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/15 bg-black/40">
              <img
                src="/fondoRoma.jpg"
                alt="Establecimiento fundacional"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-6 left-6 text-left">
                <span className="font-['Cinzel',serif] text-xs font-semibold uppercase tracking-widest text-roma-leaf block mb-1">
                  PATRIMONIO RURAL
                </span>
                <span className="text-white text-base font-medium drop-shadow-md">
                  Establecimiento Fundacional
                </span>
              </div>
            </div>

            {/* Cuadro Secundario Interconectado (Derecha-Abajo) */}
            <div className="absolute bottom-0 right-0 w-[54%] h-[54%] rounded-[2.2rem] overflow-hidden shadow-2xl border-4 border-[#121f14] bg-black/40 z-20">
              <img
                src="/hero_nosotros_real.png"
                alt="Equipo en campo"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 text-left">
                <span className="font-['Cinzel',serif] text-[10px] font-semibold uppercase tracking-widest text-white/70 block mb-0.5">
                  RECORRIDO EN CAMPO
                </span>
                <span className="text-white text-xs sm:text-sm font-medium">
                  Supervisión Directa
                </span>
              </div>
            </div>


          </motion.div>

          {/* COLUMNA DERECHA (45%): TEXTO INSTITUCIONAL, PULL-QUOTE EXACTO Y PILARES */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.2 }}
            className="lg:col-span-5 flex flex-col text-left justify-center"
          >
            {/* Copy Institucional */}
            <p className="text-white/90 text-base md:text-lg font-light leading-relaxed mb-6">
              En Roma combinamos una visión inmobiliaria moderna con un entendimiento integral de la actividad agropecuaria. Nuestra propuesta nace de la fusión entre el conocimiento técnico del mercado y el análisis preciso de la capacidad productiva de cada establecimiento.
            </p>

            <p className="text-white/70 text-sm md:text-base font-light leading-relaxed mb-8">
              Evaluamos la dinámica de los suelos, los ciclos de producción y la estructura de costos de la región. Esto nos permite asesorar a cada cliente no solo por el valor de mercado, sino por su verdadero potencial de rentabilidad y trascendencia patrimonial.
            </p>

            {/* Cita Destacada Solicitada (Frase Exacta) */}
            <div className="border-l-2 border-roma-leaf pl-5 py-2 mb-0 bg-white/[0.02] rounded-r-2xl">
              <p className="font-['Cinzel',serif] italic text-lg md:text-xl text-white/95 leading-snug">
                &ldquo;Conocemos la tierra porque la trabajamos día a día. Saber lo que rinde cada hectárea desde adentro es nuestra mayor garantía.&rdquo;
              </p>
            </div>
          </motion.div>

        </div>

        {/* 3. FRANJA DE ESTADÍSTICAS TRANSECT CARTOGRÁFICA (MOCKUP EXACTO SOLICITADO) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: EASE }}
          className="relative pt-12 mt-12"
        >
          {/* Contornos cartográficos sutiles de fondo */}
          <div className="absolute inset-0 opacity-10 pointer-events-none -top-12">
            <svg viewBox="0 0 1400 300" preserveAspectRatio="none" className="w-full h-full">
              <path d="M-50 80 C 300 20, 600 140, 950 60 S 1500 90 1550 40" stroke="#f3efe2" strokeWidth="1" fill="none" />
              <path d="M-50 180 C 320 120, 640 240, 980 160 S 1500 190 1550 140" stroke="#f3efe2" strokeWidth="1" fill="none" />
              <path d="M-50 300 C 340 240, 660 360, 1000 280 S 1500 310 1550 260" stroke="#f3efe2" strokeWidth="1" fill="none" />
            </svg>
          </div>

          {/* Kicker / Eyebrow del Relevamiento */}
          <div className="flex items-center gap-3 mb-8">
            <span className="text-[12px] uppercase tracking-[0.2em] font-medium text-roma-leaf">
              Relevamiento Roma
            </span>
            <div className="flex-1 h-[1px] bg-white/15" />
          </div>

          {/* Línea Transect (Dashed Survey Line) */}
          <div className="relative h-[2px] mb-8">
            <div className="absolute inset-0 border-b border-dashed border-roma-leaf/40" />
          </div>

          {/* Grid de 4 Estadísticas con ícono, número animado y marca vertical */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 relative z-10 text-left">
            
            {/* Stat 1: Hectáreas Tasadas */}
            <div className="relative pt-6 pr-4 border-t border-roma-leaf/50">
              <div className="absolute -top-3 left-0 w-[2px] h-4 bg-roma-leaf" />
              <svg className="w-6 h-6 text-roma-leaf mb-5 opacity-90" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
                <rect x="3" y="3" width="18" height="18" />
                <path d="M3 12h18M12 3v18" />
              </svg>
              <div className="font-['Cinzel',serif] font-semibold text-4xl lg:text-5xl text-white tracking-tight leading-none mb-3">
                <span className="text-roma-leaf font-medium mr-1">+</span>
                <CountUpNumber end={20000} duration={2.5} />
              </div>
              <div className="text-xs uppercase tracking-wider text-roma-leaf/80 pt-3 border-t border-white/15 font-medium">
                Hectáreas tasadas
              </div>
            </div>

            {/* Stat 2: Trayectoria Regional */}
            <div className="relative pt-6 pr-4 border-t border-roma-leaf/50">
              <div className="absolute -top-3 left-0 w-[2px] h-4 bg-roma-leaf" />
              <svg className="w-6 h-6 text-roma-leaf mb-5 opacity-90" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
                <circle cx="12" cy="12" r="9" />
                <circle cx="12" cy="12" r="5.2" />
                <circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none" />
              </svg>
              <div className="font-['Cinzel',serif] font-semibold text-4xl lg:text-5xl text-white tracking-tight leading-none mb-3">
                <CountUpNumber end={14} duration={2} /> <span className="text-2xl font-light text-white/80">años</span>
              </div>
              <div className="text-xs uppercase tracking-wider text-roma-leaf/80 pt-3 border-t border-white/15 font-medium">
                Trayectoria regional
              </div>
            </div>

            {/* Stat 3: Operaciones Cerradas */}
            <div className="relative pt-6 pr-4 border-t border-roma-leaf/50">
              <div className="absolute -top-3 left-0 w-[2px] h-4 bg-roma-leaf" />
              <svg className="w-6 h-6 text-roma-leaf mb-5 opacity-90" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
                <path d="M4 12.5l5 5L20 6.5" />
              </svg>
              <div className="font-['Cinzel',serif] font-semibold text-4xl lg:text-5xl text-white tracking-tight leading-none mb-3">
                <span className="text-roma-leaf font-medium mr-1">+</span>
                <CountUpNumber end={300} duration={2.2} />
              </div>
              <div className="text-xs uppercase tracking-wider text-roma-leaf/80 pt-3 border-t border-white/15 font-medium">
                Operaciones cerradas
              </div>
            </div>

            {/* Stat 4: Localidades Cubiertas */}
            <div className="relative pt-6 border-t border-roma-leaf/50">
              <div className="absolute -top-3 left-0 w-[2px] h-4 bg-roma-leaf" />
              <svg className="w-6 h-6 text-roma-leaf mb-5 opacity-90" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
                <path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z" />
                <circle cx="12" cy="9.5" r="2.1" />
              </svg>
              <div className="font-['Cinzel',serif] font-semibold text-4xl lg:text-5xl text-white tracking-tight leading-none mb-3">
                <CountUpNumber end={17} duration={2} />
              </div>
              <div className="text-xs uppercase tracking-wider text-roma-leaf/80 pt-3 border-t border-white/15 font-medium">
                Localidades cubiertas
              </div>
            </div>

          </div>
        </motion.div>

      </div>
    </section>
  );
}
