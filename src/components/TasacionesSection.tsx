import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, CheckCircle2, ChevronRight, Home, TreePine, MapPin } from 'lucide-react';

const EASE = [0.22, 1, 0.36, 1] as const;

type TipoTasacion = 'Propiedad' | 'Campo' | 'Terreno';

export default function TasacionesSection() {
  const [tipoTasacion, setTipoTasacion] = useState<TipoTasacion>('Campo');
  const [activeFactor, setActiveFactor] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    ubicacion: '',
    tipoInmueble: 'Casa',
    ambientes: '',
    superficie: '',
    detalles: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nombre || !formData.ubicacion) return;

    const tipo = tipoTasacion === 'Propiedad' && formData.tipoInmueble
      ? formData.tipoInmueble
      : tipoTasacion;

    let detallesExtra = formData.detalles ? formData.detalles.trim() : '';
    if (tipoTasacion === 'Propiedad' && formData.ambientes) {
      detallesExtra = detallesExtra ? `${formData.ambientes} ambientes. ${detallesExtra}` : `${formData.ambientes} ambientes`;
    } else if (tipoTasacion === 'Terreno' && formData.superficie) {
      detallesExtra = detallesExtra ? `${formData.superficie}. ${detallesExtra}` : formData.superficie;
    }

    const mensaje = 
      `Nombre y apellido: ${formData.nombre.trim()}\n` +
      `Teléfono: ${formData.telefono ? formData.telefono.trim() : 'No especificado'}\n` +
      `Ubicación (${tipo}): ${formData.ubicacion.trim()}\n` +
      `Detalles: ${detallesExtra || 'Sin detalles adicionales'}`;

    const whatsappUrl = `https://api.whatsapp.com/send?phone=5492914136535&text=${encodeURIComponent(mensaje)}`;

    setSubmitted(true);
    window.location.href = whatsappUrl;

    setTimeout(() => {
      setSubmitted(false);
    }, 5000);
  };

  const FACTORES = [
    {
      numero: '01',
      titulo: 'Aptitud y Calidad de Suelos / Inmuebles',
      resumen: 'Análisis técnico, estado estructural y capacidad de desarrollo.',
      detalle: 'Evaluamos la calidad constructiva, conservación y superficie útil en propiedades urbanas, o la textura del suelo, profundidad arable e índice de productividad (IP) en campos y loteos.',
    },
    {
      numero: '02',
      titulo: 'Ubicación y Entorno Logístico',
      resumen: 'Accesibilidad a servicios, rutas, comercios y centros urbanos.',
      detalle: 'Analizamos el valor estratégico del sector, acceso a vías asfaltadas, conectividad urbana, cercanía a zonas de alta demanda o puertos agroexportadores.',
    },
    {
      numero: '03',
      titulo: 'Infraestructura y Mejoras Existentes',
      resumen: 'Estado de instalaciones, servicios públicos y edificaciones.',
      detalle: 'Auditamos en detalle el estado de conservación de viviendas, locales, corrales, perforaciones de agua, cerramientos perimetrales y redes de servicios.',
    },
    {
      numero: '04',
      titulo: 'Proyección de Mercado y Rentabilidad',
      resumen: 'Comparativo de valores reales de cierre y potencial patrimonial.',
      detalle: 'Estudiamos el comportamiento reciente de valores en la zona, potencial de subdivisión o valorización para garantizar una tasación certera y competitiva.',
    },
  ];

  return (
    <section id="tasaciones" className="relative z-10 pt-28 pb-36 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto w-full">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* LADO IZQUIERDO: TÍTULO Y CRITERIOS */}
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
                Servicio Inmobiliario Profesional
              </span>
            </div>

            {/* Título principal H1/H2 actualizado */}
            <h2 className="font-['Cinzel',serif] text-4xl md:text-5xl lg:text-6xl font-semibold text-white tracking-tight drop-shadow-md mb-6 leading-[1.1]">
              Tasación de Propiedades
            </h2>

            <p className="text-white/80 text-base md:text-lg font-light leading-relaxed mb-10 max-w-2xl">
              Determinamos el verdadero valor de mercado de tu casa, terreno o establecimiento rural combinando rigor técnico, análisis comparativo de operaciones reales y más de 10 años de trayectoria regional.
            </p>

            {/* Subtítulo explicativo */}
            <h3 className="font-['Cinzel',serif] text-lg md:text-xl font-medium text-white/90 mb-6 flex items-center gap-3">
              <span>Criterios clave en la valoración</span>
              <span className="h-[1px] flex-1 bg-white/15" />
            </h3>

            {/* LISTA EDITORIAL INTERACTIVA */}
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

                      {/* Acordeón fluido */}
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

          {/* LADO DERECHO: FORMULARIO DINÁMICO - CARD ENTERA ANIMADA */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.2 }}
            className="lg:col-span-5 w-full flex flex-col"
          >
            {/* SELECTOR DE TIPO (CHOICE TABS SUPERIOR) */}
            <div className="mb-4 p-1.5 bg-[#162719]/90 backdrop-blur-md border border-white/15 rounded-2xl flex items-center gap-1 shadow-lg relative z-20">
              {(['Propiedad', 'Campo', 'Terreno'] as TipoTasacion[]).map((tipo) => {
                const isSelected = tipoTasacion === tipo;
                return (
                  <button
                    key={tipo}
                    type="button"
                    onClick={() => setTipoTasacion(tipo)}
                    className={`flex-1 relative z-10 py-2.5 px-2 rounded-xl text-[11px] sm:text-xs font-semibold uppercase tracking-wider transition-colors duration-300 flex items-center justify-center gap-1.5 cursor-pointer ${
                      isSelected ? 'text-white' : 'text-white/60 hover:text-white/90'
                    }`}
                  >
                    {isSelected && (
                      <motion.div
                        layoutId="activeTasacionTab"
                        className="absolute inset-0 bg-roma-olive rounded-xl shadow-md z-[-1] border border-white/20"
                        transition={{ duration: 0.3, ease: EASE }}
                      />
                    )}
                    {tipo === 'Propiedad' && <Home size={14} className={isSelected ? 'text-roma-leaf' : 'text-white/50'} />}
                    {tipo === 'Campo' && <TreePine size={14} className={isSelected ? 'text-roma-leaf' : 'text-white/50'} />}
                    {tipo === 'Terreno' && <MapPin size={14} className={isSelected ? 'text-roma-leaf' : 'text-white/50'} />}
                    <span>{tipo}</span>
                  </button>
                );
              })}
            </div>

            {/* CARD COMPLETA ANIMADA QUE SALE HACIA LA IZQ Y ENTRA DESDE LA DERECHA */}
            <AnimatePresence mode="wait">
              <motion.div
                key={tipoTasacion}
                initial={{ opacity: 0, x: 60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -60 }}
                transition={{ duration: 0.35, ease: EASE }}
                className="bg-[#1a2c1a]/95 backdrop-blur-xl border border-white/10 p-7 md:p-9 rounded-[2.5rem] shadow-2xl relative overflow-hidden text-left"
              >
                <div className="mb-5 text-left">
                  <h3 className="font-['Cinzel',serif] text-2xl md:text-3xl font-semibold text-white mb-1.5 tracking-tight">
                    {tipoTasacion === 'Propiedad' && 'Tasá tu Propiedad'}
                    {tipoTasacion === 'Campo' && 'Tasá tu Campo'}
                    {tipoTasacion === 'Terreno' && 'Tasá tu Terreno'}
                  </h3>
                  <p className="text-white/70 text-xs sm:text-sm font-light leading-relaxed">
                    {tipoTasacion === 'Propiedad' && 'Ingresá los datos de tu casa, departamento o local para coordinar una inspección.'}
                    {tipoTasacion === 'Campo' && 'Ingresá la ubicación y características de tu establecimiento rural.'}
                    {tipoTasacion === 'Terreno' && 'Ingresá la ubicación y dimensiones de tu lote o terreno.'}
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

                <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left">
                  {/* CAMPOS COMUNES (Nombre y Teléfono) */}
                  <div>
                    <label className="block text-white/90 text-xs font-semibold uppercase tracking-wider mb-1.5">
                      Nombre y Apellido *
                    </label>
                    <input
                      type="text"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      required
                      className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-3 text-white placeholder:text-white/40 text-sm focus:outline-none focus:border-roma-leaf focus:ring-1 focus:ring-roma-leaf transition-all duration-300"
                    />
                  </div>

                  <div>
                    <label className="block text-white/90 text-xs font-semibold uppercase tracking-wider mb-1.5">
                      Teléfono / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleChange}
                      required
                      className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-3 text-white placeholder:text-white/40 text-sm focus:outline-none focus:border-roma-leaf focus:ring-1 focus:ring-roma-leaf transition-all duration-300"
                    />
                  </div>

                  {/* 1. FORMULARIO PROPIEDAD */}
                  {tipoTasacion === 'Propiedad' && (
                    <>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-white/90 text-xs font-semibold uppercase tracking-wider mb-1.5">
                            Tipo de Inmueble *
                          </label>
                          <select
                            name="tipoInmueble"
                            value={formData.tipoInmueble}
                            onChange={handleChange}
                            className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-roma-leaf focus:ring-1 focus:ring-roma-leaf transition-all duration-300 cursor-pointer"
                          >
                            <option value="Casa" className="bg-[#162719]">Casa</option>
                            <option value="Departamento" className="bg-[#162719]">Departamento</option>
                            <option value="Local Comercial" className="bg-[#162719]">Local Comercial</option>
                            <option value="PH" className="bg-[#162719]">PH</option>
                            <option value="Oficina / Galpón" className="bg-[#162719]">Oficina / Galpón</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-white/90 text-xs font-semibold uppercase tracking-wider mb-1.5">
                            Ambientes (Opcional)
                          </label>
                          <input
                            type="text"
                            name="ambientes"
                            value={formData.ambientes}
                            onChange={handleChange}
                            className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-3 text-white placeholder:text-white/40 text-sm focus:outline-none focus:border-roma-leaf focus:ring-1 focus:ring-roma-leaf transition-all duration-300"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-white/90 text-xs font-semibold uppercase tracking-wider mb-1.5">
                          Ubicación / Dirección *
                        </label>
                        <input
                          type="text"
                          name="ubicacion"
                          value={formData.ubicacion}
                          onChange={handleChange}
                          required
                          className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-3 text-white placeholder:text-white/40 text-sm focus:outline-none focus:border-roma-leaf focus:ring-1 focus:ring-roma-leaf transition-all duration-300"
                        />
                      </div>

                      <div>
                        <label className="block text-white/90 text-xs font-semibold uppercase tracking-wider mb-1.5">
                          Detalles Adicionales (Opcional)
                        </label>
                        <textarea
                          name="detalles"
                          value={formData.detalles}
                          onChange={handleChange}
                          rows={2}
                          className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-3 text-white placeholder:text-white/40 text-sm focus:outline-none focus:border-roma-leaf focus:ring-1 focus:ring-roma-leaf transition-all duration-300 resize-none"
                        />
                      </div>
                    </>
                  )}

                  {/* 2. FORMULARIO CAMPO */}
                  {tipoTasacion === 'Campo' && (
                    <>
                      <div>
                        <label className="block text-white/90 text-xs font-semibold uppercase tracking-wider mb-1.5">
                          Ubicación del Campo *
                        </label>
                        <input
                          type="text"
                          name="ubicacion"
                          value={formData.ubicacion}
                          onChange={handleChange}
                          required
                          className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-3 text-white placeholder:text-white/40 text-sm focus:outline-none focus:border-roma-leaf focus:ring-1 focus:ring-roma-leaf transition-all duration-300"
                        />
                      </div>

                      <div>
                        <label className="block text-white/90 text-xs font-semibold uppercase tracking-wider mb-1.5">
                          Detalles / Hectáreas (Opcional)
                        </label>
                        <textarea
                          name="detalles"
                          value={formData.detalles}
                          onChange={handleChange}
                          rows={3}
                          className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-3 text-white placeholder:text-white/40 text-sm focus:outline-none focus:border-roma-leaf focus:ring-1 focus:ring-roma-leaf transition-all duration-300 resize-none"
                        />
                      </div>
                    </>
                  )}

                  {/* 3. FORMULARIO TERRENO */}
                  {tipoTasacion === 'Terreno' && (
                    <>
                      <div>
                        <label className="block text-white/90 text-xs font-semibold uppercase tracking-wider mb-1.5">
                          Ubicación / Barrio *
                        </label>
                        <input
                          type="text"
                          name="ubicacion"
                          value={formData.ubicacion}
                          onChange={handleChange}
                          required
                          className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-3 text-white placeholder:text-white/40 text-sm focus:outline-none focus:border-roma-leaf focus:ring-1 focus:ring-roma-leaf transition-all duration-300"
                        />
                      </div>

                      <div>
                        <label className="block text-white/90 text-xs font-semibold uppercase tracking-wider mb-1.5">
                          Superficie / Medidas (Opcional)
                        </label>
                        <input
                          type="text"
                          name="superficie"
                          value={formData.superficie}
                          onChange={handleChange}
                          className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-3 text-white placeholder:text-white/40 text-sm focus:outline-none focus:border-roma-leaf focus:ring-1 focus:ring-roma-leaf transition-all duration-300"
                        />
                      </div>

                      <div>
                        <label className="block text-white/90 text-xs font-semibold uppercase tracking-wider mb-1.5">
                          Servicios / Detalles (Opcional)
                        </label>
                        <textarea
                          name="detalles"
                          value={formData.detalles}
                          onChange={handleChange}
                          rows={2}
                          className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-3 text-white placeholder:text-white/40 text-sm focus:outline-none focus:border-roma-leaf focus:ring-1 focus:ring-roma-leaf transition-all duration-300 resize-none"
                        />
                      </div>
                    </>
                  )}

                  <button
                    type="submit"
                    className="w-full bg-roma-olive hover:bg-roma-leaf text-white font-semibold py-3.5 px-8 rounded-full shadow-xl transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center gap-3 text-base mt-2 group cursor-pointer"
                  >
                    <span>
                      {tipoTasacion === 'Propiedad' && 'Tasar mi propiedad'}
                      {tipoTasacion === 'Campo' && 'Tasar mi campo'}
                      {tipoTasacion === 'Terreno' && 'Tasar mi terreno'}
                    </span>
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-300" />
                  </button>
                </form>
              </motion.div>
            </AnimatePresence>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

