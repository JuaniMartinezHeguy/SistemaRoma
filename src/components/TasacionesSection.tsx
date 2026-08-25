import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, CheckCircle2, ChevronRight } from 'lucide-react';

const EASE = [0.22, 1, 0.36, 1] as const;

export default function TasacionesSection() {
  const [activeFactor, setActiveFactor] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    ubicacion: '',
    detalles: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nombre || !formData.ubicacion) return;

    const textMessage = `Hola Roma Inmobiliaria, deseo solicitar la tasación de un campo.%0A%0A` +
      `*Nombre:* ${encodeURIComponent(formData.nombre)}%0A` +
      `*Teléfono:* ${encodeURIComponent(formData.telefono || 'No especificado')}%0A` +
      `*Ubicación:* ${encodeURIComponent(formData.ubicacion)}%0A` +
      `*Detalles:* ${encodeURIComponent(formData.detalles || 'Sin detalles adicionales')}`;

    const whatsappUrl = `https://wa.me/5492920123456?text=${textMessage}`;

    setSubmitted(true);
    window.open(whatsappUrl, '_blank');

    setTimeout(() => {
      setSubmitted(false);
    }, 5000);
  };

  const FACTORES = [
    {
      numero: '01',
      titulo: 'Aptitud y Calidad de Suelos',
      resumen: 'Análisis agronómico, profundidad arable e índice de productividad.',
      detalle: 'Evaluamos la textura del suelo, aptitud agrícola vs. ganadera, capacidad de retención de humedad, índice de productividad (IP) y rotación histórica de cultivos.',
    },
    {
      numero: '02',
      titulo: 'Ubicación y Logística',
      resumen: 'Accesibilidad a rutas, acopios y puertos agroexportadores.',
      detalle: 'Analizamos la distancia a centros urbanos, rutas asfaltadas, conectividad ferroviaria, terminales portuarias y la transitabilidad de los caminos rurales en cualquier época del año.',
    },
    {
      numero: '03',
      titulo: 'Infraestructura y Mejoras',
      resumen: 'Estado de conservación de molinos, alambres, mangas y galpones.',
      detalle: 'Auditamos en detalle el estado de los potreros, alambres perimetrales e internos, perforaciones de agua, tanques australianos, corrales, mangas y viviendas del establecimiento.',
    },
    {
      numero: '04',
      titulo: 'Régimen Hídrico y Receptividad',
      resumen: 'Calidad de agua subterránea, precipitaciones y carga animal.',
      detalle: 'Estudiamos el registro pluviométrico histórico, la salinidad y aptitud del agua para consumo animal/humano, receptividad de cabezas por hectárea y drenajes naturales.',
    },
  ];

  return (
    <section id="tasaciones" className="relative z-10 pt-28 pb-36 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto w-full">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* LADO IZQUIERDO: TÍTULO A LA IZQUIERDA Y LISTA EDITORIAL CON MOVIMIENTO */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: EASE }}
            className="lg:col-span-7 flex flex-col text-left"
          >
            {/* Subtítulo / Badge a la izquierda */}
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2 h-2 rounded-full bg-roma-leaf animate-pulse" />
              <span className="text-roma-leaf text-[11px] md:text-[12px] font-semibold uppercase tracking-[0.25em]">
                Servicio Inmobiliario Rural
              </span>
            </div>

            {/* Título alineado a la izquierda */}
            <h2 className="font-['Cinzel',serif] text-4xl md:text-5xl lg:text-6xl font-semibold text-white tracking-tight drop-shadow-md mb-6 leading-[1.1]">
              Tasación de Campos
            </h2>

            <p className="text-white/80 text-base md:text-lg font-light leading-relaxed mb-10 max-w-2xl">
              Determinamos el verdadero valor de mercado de tu tierra combinando precisión técnica agronómica, análisis comparativo de operaciones recientes y más de 10 años de trayectoria regional.
            </p>

            {/* Subtítulo explicativo */}
            <h3 className="font-['Cinzel',serif] text-lg md:text-xl font-medium text-white/90 mb-6 flex items-center gap-3">
              <span>Criterios clave en la valoración</span>
              <span className="h-[1px] flex-1 bg-white/15" />
            </h3>

            {/* LISTA EDITORIAL INTERACTIVA CON MOVIMIENTO */}
            <div className="flex flex-col gap-3">
              {FACTORES.map((item, idx) => {
                const isActive = activeFactor === idx;
                return (
                  <motion.div
                    key={item.numero}
                    onClick={() => setActiveFactor(activeFactor === idx ? null : idx)}
                    onMouseEnter={() => {
                      if (typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches) {
                        setActiveFactor(idx);
                      }
                    }}
                    onMouseLeave={() => {
                      if (typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches) {
                        setActiveFactor(null);
                      }
                    }}
                    className={`relative cursor-pointer rounded-2xl transition-all duration-500 overflow-hidden border ${
                      isActive
                        ? 'bg-white/[0.06] border-roma-leaf/50 shadow-lg shadow-black/40'
                        : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.04] hover:border-white/15'
                    }`}
                  >
                    {/* Indicador lateral animado */}
                    {isActive && (
                      <motion.div
                        layoutId="activeFactorBar"
                        className="absolute left-0 top-0 bottom-0 w-1.5 bg-roma-leaf"
                        transition={{ duration: 0.4, ease: EASE }}
                      />
                    )}

                    <div className="p-5 sm:p-6 flex flex-col justify-center">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <span className={`font-['Cinzel',serif] text-lg md:text-xl font-bold transition-colors duration-300 ${isActive ? 'text-roma-leaf' : 'text-white/40'}`}>
                            {item.numero}
                          </span>
                          <h4 className="text-white font-medium text-base md:text-lg tracking-wide">
                            {item.titulo}
                          </h4>
                        </div>
                        <ChevronRight
                          size={18}
                          className={`text-white/40 transition-transform duration-300 ${isActive ? 'rotate-90 text-roma-leaf' : ''}`}
                        />
                      </div>

                      {/* Acordeón fluido con AnimatePresence */}
                      <AnimatePresence initial={false}>
                        {isActive && (
                          <motion.div
                            initial={{ height: 0, opacity: 0, marginTop: 0 }}
                            animate={{ height: 'auto', opacity: 1, marginTop: 12 }}
                            exit={{ height: 0, opacity: 0, marginTop: 0 }}
                            transition={{ duration: 0.4, ease: EASE }}
                            className="overflow-hidden pl-9"
                          >
                            <p className="text-white/70 text-sm font-light leading-relaxed border-t border-white/10 pt-3">
                              {item.detalle}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* LADO DERECHO: FORMULARIO ELEGANTE */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.2 }}
            className="lg:col-span-5 w-full"
          >
            <div className="bg-[#1a2c1a]/95 backdrop-blur-xl border border-white/10 p-8 md:p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
              
              <div className="mb-8 text-left">
                <h3 className="font-['Cinzel',serif] text-2xl md:text-3xl font-semibold text-white mb-2 tracking-tight">
                  Solicitá tu Tasación
                </h3>
                <p className="text-white/70 text-sm font-light leading-relaxed">
                  Ingresá tus datos y la ubicación del establecimiento para coordinar una inspección técnica.
                </p>
              </div>

              {submitted && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 rounded-2xl bg-roma-leaf/20 border border-roma-leaf/40 text-white text-sm flex items-center gap-3"
                >
                  <CheckCircle2 size={20} className="text-roma-leaf flex-shrink-0" />
                  <span>¡Solicitud lista! Redirigiendo a WhatsApp...</span>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="flex flex-col gap-5 text-left">
                <div>
                  <label className="block text-white/90 text-xs font-semibold uppercase tracking-wider mb-2">
                    Nombre y Apellido *
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    placeholder="Ej. Rodrigo Martínez"
                    required
                    className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-3.5 text-white placeholder:text-white/40 text-sm focus:outline-none focus:border-roma-leaf focus:ring-1 focus:ring-roma-leaf transition-all duration-300"
                  />
                </div>

                <div>
                  <label className="block text-white/90 text-xs font-semibold uppercase tracking-wider mb-2">
                    Teléfono / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    placeholder="Ej. +54 9 2920 123456"
                    required
                    className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-3.5 text-white placeholder:text-white/40 text-sm focus:outline-none focus:border-roma-leaf focus:ring-1 focus:ring-roma-leaf transition-all duration-300"
                  />
                </div>

                <div>
                  <label className="block text-white/90 text-xs font-semibold uppercase tracking-wider mb-2">
                    Ubicación del Campo *
                  </label>
                  <input
                    type="text"
                    name="ubicacion"
                    value={formData.ubicacion}
                    onChange={handleChange}
                    placeholder="Ej. Villalonga, Pedro Luro, Partido de Patagones..."
                    required
                    className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-3.5 text-white placeholder:text-white/40 text-sm focus:outline-none focus:border-roma-leaf focus:ring-1 focus:ring-roma-leaf transition-all duration-300"
                  />
                </div>

                <div>
                  <label className="block text-white/90 text-xs font-semibold uppercase tracking-wider mb-2">
                    Detalles / Hectáreas (Opcional)
                  </label>
                  <textarea
                    name="detalles"
                    value={formData.detalles}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Ej. 500 ha agrícolas con molino y galpón..."
                    className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-3.5 text-white placeholder:text-white/40 text-sm focus:outline-none focus:border-roma-leaf focus:ring-1 focus:ring-roma-leaf transition-all duration-300 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-roma-olive hover:bg-roma-leaf text-white font-semibold py-4 px-8 rounded-full shadow-xl transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center gap-3 text-base mt-2 group cursor-pointer"
                >
                  <span>Tasar mi campo</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-300" />
                </button>
              </form>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
