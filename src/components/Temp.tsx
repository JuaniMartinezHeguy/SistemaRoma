import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import { Home, Tractor, Map, Camera, Globe, Instagram, User } from 'lucide-react';
import { JeepIcon } from '@phosphor-icons/react';
import PageLoader from './ui/PageLoader';

// ─── CONSTANTES DE DATOS ────────────────────────────────────────────────────────

const SERVICIOS = [
  { icon: Home, title: 'Propiedades', desc: 'Venta y alquiler de casas y departamentos urbanos, con acompañamiento profesional en cada etapa.' },
  { icon: Tractor, title: 'Campos', desc: 'Comercialización de extensiones agrícolas y ganaderas de alto rendimiento productivo.' },
  { icon: Map, title: 'Terrenos', desc: 'Lotes estratégicos, listos para escriturar, invertir y construir tu futuro desde cero.' },
  { icon: Camera, title: 'Vista Aérea', desc: 'Relevamiento con drones para visualizar y evaluar campos o terrenos desde el aire.' },
  { icon: JeepIcon, title: 'Visitas en Campo', desc: 'Te llevamos en nuestros vehículos a recorrer y conocer tu próxima propiedad en persona.' },
  { icon: Globe, title: 'Catálogo Digital', desc: 'Explorá nuestro catálogo completo de propiedades actualizado en tiempo real desde la web.' },
];

const SEDES = [
  { nombre: 'Villalonga', direccion: 'Los Pozos 31', url: 'https://maps.google.com/maps?q=-39.9161537,-62.6215767&t=k&z=18&ie=UTF8&iwloc=&output=embed' },
  { nombre: 'Pedro Luro', direccion: 'C. 5 N°1146', url: 'https://maps.google.com/maps?q=-39.5033084,-62.6847163&t=k&z=18&ie=UTF8&iwloc=&output=embed' },
  { nombre: 'San Blas', direccion: 'Blvr. Wasserman 426', url: 'https://maps.google.com/maps?q=-40.555102,-62.236987&t=k&z=18&ie=UTF8&iwloc=&output=embed' },
];

const EQUIPO = [
  {
    id: 1,
    nombre: 'Rodrigo Martinez',
    rol: 'Martillero Público y Corredor',
    desc: 'Especialista en la comercialización de establecimientos agropecuarios. Aporta su profundo conocimiento del campo patagónico para asegurar negocios de alto rendimiento.'
  },
  {
    id: 2,
    nombre: 'Maira Pugnaloni',
    rol: 'Martillera Pública y Corredora',
    desc: 'Experta en el mercado urbano. Dedicada a encontrar el hogar ideal o la inversión perfecta en la ciudad, brindando un acompañamiento cercano y transparente.'
  },
  {
    id: 3,
    nombre: 'Marina Sotelo',
    rol: 'Administración y Servicios',
    desc: 'Responsable de garantizar una gestión documental impecable y una atención al público de excelencia, agilizando cada trámite para tu total tranquilidad.'
  },
  {
    id: 4,
    nombre: 'Elena Furlong',
    rol: 'Marketing y Redes',
    desc: 'Encargada de potenciar nuestra identidad digital, creando estrategias innovadoras y conectando nuestras propiedades con la comunidad a través de las redes.'
  }
];

// ─── CONFIGURACIÓN DE ANIMACIONES ───────────────────────────────────────────────

const EASE = [0.22, 1, 0.36, 1] as const;
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.15 } } };
const fadeUp = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } } };
const fadeLeft = { hidden: { opacity: 0, x: -50 }, visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: EASE } } };
const fadeRight = { hidden: { opacity: 0, x: 50 }, visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: EASE } } };

// ─── COMPONENTE PRINCIPAL ───────────────────────────────────────────────────────

export default function Landing() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeService, setActiveService] = useState(0);
  const [sedeActiva, setSedeActiva] = useState(0);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);

  // Referencias para animaciones y videos
  const { scrollY } = useScroll();
  const videoIgRef = useRef<HTMLVideoElement>(null);
  const videoTkRef = useRef<HTMLVideoElement>(null);

  // Bloqueo de Scroll al cargar
  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.style.overflow = 'hidden';

    const timer = setTimeout(() => {
      setIsPageLoading(false);
      document.body.style.overflow = '';
    }, 2200);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = '';
    };
  }, []);

  // Hover play handlers - siempre reproduce (muted), el usuario activa sonido con un click
  const handleVideoHoverStart = (ref: React.RefObject<HTMLVideoElement | null>) => {
    const video = ref.current;
    if (!video) return;
    video.currentTime = 0;
    video.play().catch(() => { });
  };

  const handleVideoHoverEnd = (ref: React.RefObject<HTMLVideoElement | null>) => {
    const video = ref.current;
    if (!video) return;
    video.pause();
    video.currentTime = 0;
  };

  // Toggle de sonido global: un solo click activa/desactiva el audio en ambos videos
  const toggleSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newSoundEnabled = !soundEnabled;
    setSoundEnabled(newSoundEnabled);
    [videoIgRef, videoTkRef].forEach(ref => {
      if (ref.current) ref.current.muted = !newSoundEnabled;
    });
  };

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
  });

  const heroImgY = useTransform(scrollY, [0, 800], [0, 200]);
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0.3]);
  const watermarkOpacity = useTransform(scrollY, [80, 350], [0, 0.12]);

  const navTransition = { duration: 0.6, ease: EASE };

  return (
    <div className="bg-black text-white font-['Inter',system-ui,sans-serif] overflow-x-hidden">

      {/* ── LOADER DE PÁGINA ── */}
      {isPageLoading && <PageLoader />}

      {/* ── NAVBAR ── */}
      <motion.header
        className="fixed z-[100] left-0 right-0 mx-auto border"
        initial={{ y: -120, opacity: 0, top: 16, width: "90%", maxWidth: "1152px", borderRadius: "40px", backgroundColor: "rgba(0,0,0,0)", borderColor: "rgba(255,255,255,0)", backdropFilter: "blur(0px)" }}
        animate={{
          y: 0,
          opacity: 1,
          top: 16,
          width: "90%",
          maxWidth: "1152px",
          backgroundColor: isScrolled ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0)",
          borderColor: isScrolled ? "rgba(255, 255, 255, 0.2)" : "rgba(255, 255, 255, 0)",
          borderRadius: "40px",
          backdropFilter: isScrolled ? "blur(24px)" : "blur(0px)",
          boxShadow: isScrolled ? "0 25px 50px -12px rgba(0, 0, 0, 0.25)" : "none"
        }}
        transition={{ ...navTransition, delay: 0.1 }}
      >
        <motion.div
          layout
          className="flex items-center justify-between w-full"
          initial={{ paddingLeft: "3rem", paddingRight: "3rem", height: "5.5rem" }}
          animate={{ paddingLeft: isScrolled ? "2rem" : "3rem", paddingRight: isScrolled ? "2rem" : "3rem", height: isScrolled ? "4rem" : "5.5rem" }}
          transition={navTransition}
        >
          <motion.a layout href="#inicio" className="flex-shrink-0">
            <motion.img
              src="/logo-blanco.png"
              alt="Roma"
              className="h-auto"
              initial={{ width: "7rem" }}
              animate={{ width: isScrolled ? "6rem" : "7rem" }}
              transition={navTransition}
            />
          </motion.a>

          <motion.nav layout className="hidden md:flex items-center gap-8">
            {[['#inicio', 'Inicio'], ['#servicios', 'Servicios'], ['#ubicaciones', 'Sedes'], ['#equipo', 'Equipo']].map(([href, label]) => (
              <a key={href} href={href} className="text-[13px] font-medium text-white/80 hover:text-white transition-colors relative after:absolute after:left-0 after:-bottom-1 after:h-px after:w-0 after:bg-white after:transition-all hover:after:w-full">
                {label}
              </a>
            ))}
          </motion.nav>

          <motion.div layout className="hidden md:block">
            <Link to="/propiedades" className="bg-roma-olive text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-roma-olive/90 shadow-lg transition-all duration-300 hover:scale-[1.03]">
              Ver Propiedades
            </Link>
          </motion.div>

          <motion.button layout onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-white p-2">
            <i className={mobileOpen ? "ph ph-x text-2xl" : "ph ph-list text-2xl"} />
          </motion.button>
        </motion.div>

        {/* Desplegable Móvil */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="md:hidden bg-black/80 backdrop-blur-xl border-t border-white/10 p-6 flex flex-col items-center gap-5 rounded-b-3xl shadow-2xl absolute left-0 right-0 top-full mt-2 w-[90%] mx-auto">
              {[['#inicio', 'Inicio'], ['#servicios', 'Servicios'], ['#ubicaciones', 'Sedes'], ['#equipo', 'Equipo']].map(([href, label]) => (
                <a key={href} href={href} onClick={() => setMobileOpen(false)} className="text-white/90 hover:text-white font-medium text-[15px]">{label}</a>
              ))}
              <Link to="/propiedades" className="bg-roma-olive text-white px-8 py-3 rounded-full font-semibold mt-2 text-[14px]" onClick={() => setMobileOpen(false)}>Ver Propiedades</Link>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* ── SOCIAL FLOTANTE ── */}
      <div className="hidden md:flex fixed right-5 top-1/2 -translate-y-1/2 z-40 flex-col gap-3">
        {[
          { href: 'https://www.facebook.com/romainmobiliaria.arg/?locale=es_LA', icon: 'fa-facebook-f' },
          { href: 'https://www.tiktok.com/@romainmobiliaria', icon: 'fa-tiktok' },
          { href: 'https://wa.me/5492920123456', icon: 'fa-whatsapp' },
          { href: 'https://www.instagram.com/romainmobiliaria', icon: 'fa-instagram' },
        ].map(({ href, icon }) => (
          <a key={icon} href={href} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-[#1a2c1a]/90 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-roma-olive hover:scale-110 transition-all duration-300 shadow-xl">
            <i className={`fab ${icon} text-[15px]`} />
          </a>
        ))}
      </div>
      <div className="md:hidden fixed bottom-6 right-6 z-50">
        <a href="https://wa.me/5492920123456" target="_blank" rel="noopener noreferrer" className="w-14 h-14 bg-[#1a2c1a]/95 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center text-white shadow-2xl hover:bg-roma-olive transition-colors duration-300">
          <i className="fab fa-whatsapp text-2xl" />
        </a>
      </div>

      {/* ═══ HERO ═══ */}
      <section id="inicio" className="relative min-h-screen flex flex-col justify-center pb-32 pt-32 px-8 md:px-16 overflow-hidden">
        <motion.div className="absolute inset-0 z-0 bg-roma-dark" style={{ y: heroImgY, opacity: heroOpacity }}>
          <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/fondoRoma.png')" }} />
        </motion.div>
        <div className="absolute inset-0 bg-black/40 z-[1]" />

        <motion.div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[1] select-none" style={{ opacity: watermarkOpacity }}>
          <span className="text-[clamp(80px,18vw,240px)] font-bold uppercase leading-none tracking-tighter text-white/10">ROMA</span>
        </motion.div>

        <motion.div className="relative z-[2] max-w-7xl mx-auto w-full flex flex-col items-center text-center" variants={stagger} initial="hidden" animate="visible">
          <motion.h1 variants={fadeUp} className="w-full flex justify-center mb-8">
            <img src="/roma-logo.png" alt="Roma Inmobiliaria" className="w-full max-w-[280px] md:max-w-[500px] h-auto object-contain" />
          </motion.h1>

          <motion.div variants={fadeUp} className="w-full max-w-3xl overflow-hidden mt-4 pt-6 border-t border-white/10 relative flex">
            <motion.div animate={{ x: ["0%", "-50%"] }} transition={{ duration: 50, repeat: Infinity, ease: "linear" }} className="flex items-center whitespace-nowrap">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="flex items-center">
                  {['10+ Años de experiencia', '3 Sedes en la región', '500+ Propiedades', 'Propiedades', 'Campos', 'Lotes'].map((text, idx) => (
                    <div key={idx} className="flex items-center">
                      <span className="text-[11px] md:text-[12px] text-white/80 font-medium uppercase tracking-[0.2em] px-8">{text}</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-roma-leaf/50" />
                    </div>
                  ))}
                </div>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.a href="#servicios" className="absolute bottom-10 left-1/2 -translate-x-1/2 z-[2] text-white/60 hover:text-white transition-colors duration-300" animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>
          <span className="material-icons text-[60px] md:text-[80px] font-light">keyboard_arrow_down</span>
        </motion.a>
      </section>

      {/* ═══ CONTENEDOR GLOBAL DE FONDO CAMPO ═══ */}
      <div
        className="relative w-full overflow-hidden bg-transparent"
        style={{
          backgroundImage: "url('/fondo-campo.png')",
          backgroundSize: "cover",
          backgroundPosition: "center center",
          backgroundAttachment: "fixed"
        }}
      >

        {/* ═══ SERVICIOS ═══ */}
        <section id="servicios" className="relative z-10 min-h-screen pt-40 pb-40 px-6 flex flex-col justify-center">
          <motion.div className="relative z-10 max-w-7xl mx-auto w-full" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={stagger}>

            <div className="text-center mb-16">
              <p className="text-roma-leaf text-[11px] font-medium uppercase tracking-[0.25em] mb-4">Lo que hacemos</p>
              <h2 className="text-4xl md:text-5xl font-semibold text-white tracking-tight">Nuestros Servicios</h2>
            </div>

            <div className="flex flex-col lg:flex-row gap-12 items-center">

              {/* Panel Izquierdo: Tarjeta verde oscura */}
              <div className="w-full lg:w-[60%] lg:pr-16 relative h-[600px] flex flex-col justify-center">
                {SERVICIOS.map((srv, idx) => (
                  <div key={idx} className={`absolute inset-0 lg:right-16 flex flex-col justify-center transition-all duration-700 ${idx === activeService ? 'opacity-100 translate-y-0 z-10' : 'opacity-0 translate-y-8 pointer-events-none z-0'}`}>
                    <div className="bg-[#2a3c2a] rounded-[2rem] p-8 md:p-12 shadow-2xl border border-white/10 w-full h-full max-h-[550px] flex flex-col text-center items-center">
                      <div className="w-full flex-1 bg-black/20 flex items-center justify-center rounded-[1.5rem] mb-8 min-h-[180px] border border-white/5">
                        {/* Se renderiza el ícono dinámicamente. JeepIcon de Phosphor o los de Lucide */}
                        <srv.icon size={80} strokeWidth={1} className="text-white/20" />
                      </div>
                      <h2 className="text-3xl md:text-5xl font-semibold text-white leading-tight mb-4 tracking-tight">{srv.title}</h2>
                      <p className="text-white/70 text-[15px] leading-relaxed font-light">{srv.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Panel Derecho: Timeline estático controlado por Hover */}
              <motion.div variants={fadeRight} className="w-full lg:w-[40%] relative py-8 pl-14">
                <div className="absolute left-4 top-[40px] bottom-[40px] w-[2px] bg-white/10 hidden lg:block rounded-full" />
                <div
                  className="absolute left-4 top-[40px] w-[2px] bg-roma-leaf hidden lg:block rounded-full transition-all duration-500"
                  style={{ height: `calc(${(activeService / (SERVICIOS.length - 1)) * 100}%)` }}
                />

                <div className="flex flex-col relative z-10">
                  {SERVICIOS.map((srv, idx) => {
                    const isActive = idx === activeService;
                    return (
                      <div key={idx} onMouseEnter={() => setActiveService(idx)} onClick={() => setActiveService(idx)} className="group flex items-center gap-5 cursor-pointer py-5 relative">
                        <div className="absolute left-[-26px] hidden lg:flex w-4 h-4 rounded-full items-center justify-center -translate-x-1/2">
                          <div className={`rounded-full transition-all duration-300 ${isActive ? 'w-4 h-4 bg-roma-leaf shadow-[0_0_14px_rgba(91,138,97,0.9)]' : 'w-2.5 h-2.5 bg-white/20 border border-white/20'}`} />
                        </div>
                        <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
                          <srv.icon size={20} strokeWidth={isActive ? 2 : 1.5} className={`transition-colors duration-300 ${isActive ? 'text-roma-leaf' : 'text-white/30 group-hover:text-white/60'}`} />
                        </div>
                        <div className={`flex-1 border-b pb-5 text-[22px] md:text-[26px] font-light tracking-tight transition-all duration-300 ${isActive ? 'text-white border-roma-leaf/30' : 'text-white/50 border-white/5 group-hover:text-white/80'}`}>
                          {srv.title}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* ═══ SEDES ═══ */}
        <section id="ubicaciones" className="relative z-10 pt-32 pb-40 px-6">
          <motion.div className="relative z-10 max-w-7xl mx-auto" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={stagger}>

            <div className="text-center mb-16">
              <p className="text-roma-leaf text-[11px] font-medium uppercase tracking-[0.25em] mb-4">Ubicaciones</p>
              <h2 className="text-4xl md:text-5xl font-semibold text-white mb-6 leading-tight tracking-tight">Nuestras Sedes</h2>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 min-h-[500px] items-center lg:items-stretch">

              <motion.div variants={fadeLeft} className="w-full lg:w-[35%] flex flex-col justify-center gap-3">
                {SEDES.map((sede, index) => {
                  const isActive = sedeActiva === index;
                  return (
                    <div
                      key={index}
                      onMouseEnter={() => setSedeActiva(index)}
                      onClick={() => setSedeActiva(index)}
                      className={`group p-5 rounded-[2rem] cursor-pointer transition-all duration-500 border ${isActive ? 'bg-roma-olive border-white/20 shadow-xl shadow-black/30' : 'bg-roma-olive/30 border-transparent hover:bg-roma-olive/50'}`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`mt-0.5 flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-500 ${isActive ? 'bg-white text-roma-olive shadow-lg' : 'bg-white/20 text-white/80 group-hover:bg-white/30 group-hover:text-white'}`}>
                          <span className="material-icons text-[20px]">location_on</span>
                        </div>
                        <div>
                          <h3 className={`text-[20px] font-medium tracking-tight mb-1 transition-colors duration-500 ${isActive ? 'text-white' : 'text-white/90 group-hover:text-white'}`}>
                            {sede.nombre}
                          </h3>
                          <p className={`text-[13px] font-light leading-relaxed transition-colors duration-500 ${isActive ? 'text-white/90' : 'text-white/70 group-hover:text-white/90'}`}>
                            {sede.direccion}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </motion.div>

              <motion.div variants={fadeRight} className="w-full lg:w-[65%]">
                <div className="h-full min-h-[400px] rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl relative bg-black/20 p-2 group">
                  {SEDES.map((sede, index) => {
                    const isActive = sedeActiva === index;
                    return (
                      <motion.div
                        key={index}
                        initial={false}
                        animate={{
                          opacity: isActive ? 1 : 0,
                          scale: isActive ? 1 : 1.05,
                          zIndex: isActive ? 10 : 0,
                          pointerEvents: isActive ? "auto" : "none"
                        }}
                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        className="absolute inset-2"
                      >
                        <iframe
                          src={sede.url}
                          className="w-full h-full rounded-[1.5rem] border-0 opacity-80 mix-blend-luminosity group-hover:mix-blend-normal group-hover:opacity-100 transition-all duration-700"
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                          title={`Mapa de ${sede.nombre}`}
                        />
                      </motion.div>
                    );
                  })}

                  {/* Etiqueta flotante del mapa animada */}
                  <div className="absolute top-6 left-6 z-20 pointer-events-none group-hover:opacity-0 transition-opacity duration-500">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={sedeActiva}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        transition={{ duration: 0.3 }}
                        className="bg-black/60 backdrop-blur-md border border-white/10 px-5 py-2.5 rounded-full text-white text-sm font-medium flex items-center gap-2 shadow-xl"
                      >
                        <span className="w-2 h-2 rounded-full bg-roma-leaf animate-pulse"></span>
                        Sede {SEDES[sedeActiva].nombre}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>

            </div>
          </motion.div>
        </section>

        {/* ═══ NUESTRO EQUIPO ═══ */}
        <section id="equipo" className="relative z-10 pt-20 pb-20 px-6">
          <motion.div className="max-w-7xl mx-auto" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>

            <div className="text-center mb-14">
              <p className="text-roma-leaf text-[11px] font-medium uppercase tracking-[0.25em] mb-4">Conocenos</p>
              <h2 className="text-4xl md:text-5xl font-semibold text-white tracking-tight">Nuestro equipo</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
              {EQUIPO.map((persona) => (
                <motion.div
                  key={persona.id}
                  variants={fadeUp}
                  className="group flex flex-col bg-[#1a2c1a]/95 backdrop-blur-md rounded-3xl overflow-hidden border border-white/10 shadow-2xl cursor-pointer"
                >
                  {/* Foto / Ícono superior */}
                  <div className="relative h-64 w-full flex-shrink-0 bg-black/40 flex items-center justify-center border-b border-white/5">
                    <User size={80} strokeWidth={1} className="text-white/20 group-hover:text-white/30 transition-colors duration-500" />
                    {/* Cuando tengas las fotos: <img src={persona.img} className="absolute inset-0 w-full h-full object-cover" /> */}
                  </div>

                  {/* Contenedor de Textos Inferior */}
                  <div className="p-6 flex flex-col bg-roma-olive transition-all duration-500">
                    <h3 className="text-[20px] font-semibold text-white tracking-tight leading-none mb-1.5">{persona.nombre}</h3>
                    <p className="text-roma-leaf text-[10px] font-medium uppercase tracking-widest">{persona.rol}</p>

                    {/* Acordeón que empuja la tarjeta hacia abajo */}
                    <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-[grid-template-rows] duration-500 ease-in-out">
                      <div className="overflow-hidden">
                        <p className="text-white/80 text-[13px] leading-relaxed font-light mt-4 border-t border-white/10 pt-4">
                          {persona.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* ═══ NUESTRAS REDES (Videos Nativos Secuenciales) ═══ */}
        <section className="relative z-10 pt-20 pb-32 px-6">
          <motion.div className="max-w-5xl mx-auto" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <div className="text-center mb-14">
              <p className="text-roma-leaf text-[11px] font-medium uppercase tracking-[0.25em] mb-4">Comunidad</p>
              <h2 className="text-4xl md:text-5xl font-semibold text-white tracking-tight">Nuestras Redes</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-10 justify-items-center">

              {/* Contenedor Instagram */}
              <motion.div variants={fadeLeft} className="flex flex-col items-center gap-4 w-full max-w-[320px]">
                {/* Label arriba del card */}
                <a
                  href="https://instagram.com/romainmobiliaria"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 group/link cursor-pointer hover:-translate-y-0.5 transition-transform duration-300"
                >
                  <Instagram size={20} strokeWidth={1.5} className="text-white group-hover/link:text-roma-leaf transition-colors duration-300" />
                  <span className="text-white group-hover/link:text-roma-leaf font-medium tracking-widest text-[11px] uppercase drop-shadow-md transition-colors duration-300">
                    @romainmobiliaria
                  </span>
                </a>

                {/* Card del video */}
                <div
                  className="relative bg-[#1a2c1a]/90 backdrop-blur-md border border-white/10 p-2.5 rounded-[2.5rem] shadow-2xl w-full aspect-[9/16] overflow-hidden group cursor-pointer"
                  onMouseEnter={() => handleVideoHoverStart(videoIgRef)}
                  onMouseLeave={() => handleVideoHoverEnd(videoIgRef)}
                >
                  <div className="w-full h-full rounded-[2rem] overflow-hidden bg-black relative">
                    <video
                      ref={videoIgRef}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                      muted
                      playsInline
                      loop
                    >
                      <source src="/video-ig.mp4" type="video/mp4" />
                    </video>
                    {/* Overlay play hint cuando está pausado */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-100 group-hover:opacity-0 transition-opacity duration-400 pointer-events-none">
                      <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center">
                        <i className="fas fa-play text-white text-lg ml-1" />
                      </div>
                    </div>
                    {/* Botón de sonido - bottom right */}
                    <button
                      onClick={toggleSound}
                      className="absolute bottom-4 right-4 z-30 w-10 h-10 rounded-full bg-black/50 backdrop-blur-md border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-black/70"
                      title={soundEnabled ? 'Silenciar' : 'Activar sonido'}
                    >
                      <i className={`fas ${soundEnabled ? 'fa-volume-high' : 'fa-volume-xmark'} text-white text-sm`} />
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* Contenedor TikTok */}
              <motion.div variants={fadeRight} className="flex flex-col items-center gap-4 w-full max-w-[320px]">
                {/* Label arriba del card */}
                <a
                  href="https://tiktok.com/@romainmobiliaria"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 group/link cursor-pointer hover:-translate-y-0.5 transition-transform duration-300"
                >
                  <i className="fab fa-tiktok text-white group-hover/link:text-roma-leaf text-[18px] transition-colors duration-300" />
                  <span className="text-white group-hover/link:text-roma-leaf font-medium tracking-widest text-[11px] uppercase drop-shadow-md transition-colors duration-300">
                    @romainmobiliaria
                  </span>
                </a>

                {/* Card del video */}
                <div
                  className="relative bg-[#1a2c1a]/90 backdrop-blur-md border border-white/10 p-2.5 rounded-[2.5rem] shadow-2xl w-full aspect-[9/16] overflow-hidden group cursor-pointer"
                  onMouseEnter={() => handleVideoHoverStart(videoTkRef)}
                  onMouseLeave={() => handleVideoHoverEnd(videoTkRef)}
                >
                  <div className="w-full h-full rounded-[2rem] overflow-hidden bg-black relative">
                    <video
                      ref={videoTkRef}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                      muted
                      playsInline
                      loop
                    >
                      <source src="/video-tiktok.mp4" type="video/mp4" />
                    </video>
                    {/* Overlay play hint cuando está pausado */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-100 group-hover:opacity-0 transition-opacity duration-400 pointer-events-none">
                      <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center">
                        <i className="fas fa-play text-white text-lg ml-1" />
                      </div>
                    </div>
                    {/* Botón de sonido - bottom right */}
                    <button
                      onClick={toggleSound}
                      className="absolute bottom-4 right-4 z-30 w-10 h-10 rounded-full bg-black/50 backdrop-blur-md border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-black/70"
                      title={soundEnabled ? 'Silenciar' : 'Activar sonido'}
                    >
                      <i className={`fas ${soundEnabled ? 'fa-volume-high' : 'fa-volume-xmark'} text-white text-sm`} />
                    </button>
                  </div>
                </div>
              </motion.div>

            </div>
          </motion.div>
        </section>

        {/* ═══ NUESTRAS RAÍCES ═══ */}
        <section className="relative z-10 pt-16 pb-32 px-6 min-h-screen flex flex-col justify-center">
          <motion.div className="relative z-10 max-w-7xl mx-auto w-full" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={stagger}>

            <div className="text-center mb-16">
              <p className="text-roma-leaf text-[11px] font-medium uppercase tracking-[0.25em] mb-4">Nuestros cimientos</p>
              <h2 className="text-4xl md:text-5xl font-semibold text-white tracking-tight">Raíces que <span className="text-roma-leaf">trascienden</span></h2>
            </div>

            <div className="flex flex-col lg:flex-row gap-16 items-center">

              <motion.div variants={fadeLeft} className="w-full lg:w-[50%] grid grid-cols-2 grid-rows-2 gap-4 h-[500px]">
                <div className="col-span-2 row-span-1 md:col-span-1 md:row-span-2 rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl relative">
                  <img src="/fondoRoma.png" alt="Roma Campo Principal" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/10" />
                </div>
                <div className="rounded-[2rem] overflow-hidden border border-white/10 shadow-xl relative">
                  <img src="/fondoRoma.png" alt="Roma Propiedades" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/10" />
                </div>
                <div className="rounded-[2rem] overflow-hidden border border-white/10 shadow-xl relative">
                  <img src="/fondoRoma.png" alt="Roma Equipo" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/10" />
                </div>
              </motion.div>

              <motion.div variants={fadeRight} className="w-full lg:w-[50%] lg:pl-10 text-left">
                <p className="text-white/80 text-[16px] md:text-[18px] mb-6 font-light leading-relaxed">
                  Roma surge de la necesidad de devolver la confianza al mercado inmobiliario. Nacimos en la Patagonia con una visión clara: transformar cada operación en una relación a largo plazo.
                </p>
                <p className="text-white/60 text-[14px] md:text-[16px] mb-10 font-light leading-relaxed">
                  Para nosotros, un campo o una propiedad no es solo un terreno; es el escenario donde construirás tu futuro. Por eso, acompañamos a cada cliente con la honestidad y el arraigo que solo nuestra tierra puede inspirar.
                </p>

                <div className="flex flex-col sm:flex-row gap-8 pt-4">
                  <div className="flex-1">
                    <h3 className="text-roma-leaf text-[11px] uppercase font-semibold tracking-widest mb-2">Presencia Regional</h3>
                    <p className="text-white/70 text-[13px] font-light leading-relaxed">Conocimiento profundo del territorio y las necesidades de nuestra gente.</p>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-roma-leaf text-[11px] uppercase font-semibold tracking-widest mb-2">Compromiso Real</h3>
                    <p className="text-white/70 text-[13px] font-light leading-relaxed">Relaciones basadas en la confianza y la transparencia absoluta.</p>
                  </div>
                </div>
              </motion.div>

            </div>
          </motion.div>
        </section>

        {/* ═══ CTA OVALADO MARKETINERO ═══ */}
        <section className="relative z-10 pb-40 px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: EASE }}
            className="max-w-3xl mx-auto bg-gradient-to-br from-roma-olive to-[#1a2c1a] border border-white/20 rounded-[2rem] sm:rounded-[3rem] p-8 md:p-12 text-center shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-white/5 blur-3xl rounded-full pointer-events-none" />

            <h2 className="text-2xl md:text-3xl font-semibold text-white mb-3 tracking-tight relative z-10">
              El momento de asegurar tu futuro es hoy.
            </h2>
            <p className="text-white/80 text-[14px] md:text-[15px] mb-8 max-w-lg mx-auto font-light relative z-10">
              Descubrí propiedades exclusivas y oportunidades de inversión únicas en la Patagonia.
            </p>
            <Link
              to="/propiedades"
              className="relative z-10 inline-block bg-white text-roma-olive px-8 py-3.5 rounded-full font-semibold text-[12px] uppercase tracking-widest shadow-lg hover:scale-105 transition-transform duration-300"
            >
              Elegí tu próxima inversión
            </Link>
          </motion.div>
        </section>

      </div>

      {/* ═══ FOOTER ═══ */}
      <footer className="bg-roma-dark text-white py-20 px-6 border-t border-white/5 relative z-20">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <img src="/logo-blanco.png" alt="Logo Roma" className="w-44 h-auto mb-6" />
            <p className="text-white/50 text-[13px] font-light max-w-md leading-relaxed">
              En Roma Inmobiliaria, nos especializamos en la venta, alquiler y gestión de propiedades urbanas y rurales en la Patagonia, ofreciendo un trato cercano y profesional.
            </p>
          </div>
          <div>
            <h5 className="font-semibold mb-4 text-roma-leaf text-[11px] uppercase tracking-wider">Contacto</h5>
            <ul className="space-y-3 text-white/50 text-[13px] font-light">
              <li className="flex items-center gap-2"><span className="material-icons text-[16px]">call</span> +54 9 2920 123456</li>
              <li className="flex items-center gap-2"><span className="material-icons text-[16px]">mail</span> info@romainmo.com.ar</li>
              <li className="flex items-center gap-2"><span className="material-icons text-[16px]">location_on</span> Villalonga, Buenos Aires</li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold mb-4 text-roma-leaf text-[11px] uppercase tracking-wider">Navegación</h5>
            <ul className="space-y-3 text-white/50 text-[13px] font-light">
              <li><a href="#inicio" className="hover:text-white transition">Inicio</a></li>
              <li><a href="#servicios" className="hover:text-white transition">Servicios</a></li>
              <li><Link to="/propiedades" className="hover:text-white transition">Propiedades</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-white/5 text-center text-white/30 text-[11px] font-light">
          © {new Date().getFullYear()} Roma Inmobiliaria. Todos los derechos reservados.
        </div>
      </footer>
    </div>
  );
}