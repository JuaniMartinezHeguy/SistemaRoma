import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import { Instagram, User, ArrowUpRight } from 'lucide-react';
import PageLoader from './ui/PageLoader';
import HeroServicesMenu from './HeroServicesMenu';
import TasacionesSection from './TasacionesSection';
import SedesSection from './SedesSection';
import NuestrosCimientos from './NuestrosCimientos';

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
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>('inicio');
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);
  const [expandedMember, setExpandedMember] = useState<number | null>(null);
  const [playingIg, setPlayingIg] = useState(false);
  const [playingTk, setPlayingTk] = useState(false);
  const [mutedIgMobile, setMutedIgMobile] = useState(true);
  const [mutedTkMobile, setMutedTkMobile] = useState(true);

  // Referencias para animaciones y videos
  const { scrollY } = useScroll();
  const videoIgRef = useRef<HTMLVideoElement>(null);
  const videoTkRef = useRef<HTMLVideoElement>(null);
  const videoIgMobileRef = useRef<HTMLVideoElement>(null);
  const videoTkMobileRef = useRef<HTMLVideoElement>(null);

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

  // ScrollSpy preciso basado en la posición en pantalla (getBoundingClientRect)
  useEffect(() => {
    const handleScroll = () => {
      const sectionIds = ['inicio', 'servicios', 'tasaciones', 'ubicaciones', 'equipo'];
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;

      // Si el usuario está muy cerca del top de la página (Hero)
      if (scrollPosition < 200) {
        setActiveSection('inicio');
        return;
      }

      const viewportThreshold = windowHeight * 0.70;
      let currentSection: string | null = null;

      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          // La sección se activa si está dentro de la zona de lectura de la pantalla
          if (rect.top <= viewportThreshold && rect.bottom > 100) {
            currentSection = id;
          }
        }
      }

      setActiveSection(currentSection);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Hover play handlers para escritorio (computadora)
  const handleVideoHoverStart = (ref: React.RefObject<HTMLVideoElement | null>) => {
    const video = ref.current;
    if (!video) return;
    video.currentTime = 0;
    video.play().catch(() => {});
  };

  const handleVideoHoverEnd = (ref: React.RefObject<HTMLVideoElement | null>) => {
    const video = ref.current;
    if (!video) return;
    video.pause();
    video.currentTime = 0;
  };

  // Toggle de sonido global: para escritorio
  const toggleSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newSoundEnabled = !soundEnabled;
    setSoundEnabled(newSoundEnabled);
    [videoIgRef, videoTkRef].forEach(ref => {
      if (ref.current) ref.current.muted = !newSoundEnabled;
    });
  };

  // Toggle de sonido independiente para mobile (evita reproducir audio en simultáneo)
  const toggleSoundIgMobile = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newMuted = !mutedIgMobile;
    setMutedIgMobile(newMuted);
    if (videoIgMobileRef.current) {
      videoIgMobileRef.current.muted = newMuted;
    }
    if (!newMuted) {
      setMutedTkMobile(true);
      if (videoTkMobileRef.current) {
        videoTkMobileRef.current.muted = true;
      }
    }
  };

  const toggleSoundTkMobile = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newMuted = !mutedTkMobile;
    setMutedTkMobile(newMuted);
    if (videoTkMobileRef.current) {
      videoTkMobileRef.current.muted = newMuted;
    }
    if (!newMuted) {
      setMutedIgMobile(true);
      if (videoIgMobileRef.current) {
        videoIgMobileRef.current.muted = true;
      }
    }
  };

  const handleVideoClick = (ref: React.RefObject<HTMLVideoElement | null>, isPlaying: boolean, setPlaying: (v: boolean) => void) => {
    const video = ref.current;
    if (!video) return;
    if (isPlaying) {
      video.pause();
      setPlaying(false);
    } else {
      video.currentTime = 0;
      video.play().catch(() => {});
      setPlaying(true);
    }
  };

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
  });

  const heroImgY = useTransform(scrollY, [0, 800], [0, 200]);
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0.3]);
  const watermarkOpacity = useTransform(scrollY, [80, 350], [0, 0.12]);

  const navTransition = { duration: 0.6, ease: EASE };

  const NAV_ITEMS = [
    { id: 'inicio', href: '#inicio', label: 'Inicio' },
    { id: 'servicios', href: '#servicios', label: 'Servicios' },
    { id: 'tasaciones', href: '#tasaciones', label: 'Tasaciones' },
    { id: 'ubicaciones', href: '#ubicaciones', label: 'Sedes' },
    { id: 'equipo', href: '#equipo', label: 'Equipo' },
  ];

  return (
    <div className="bg-black text-white font-['Inter',system-ui,sans-serif] overflow-x-hidden">

      {/* ── LOADER DE PÁGINA ── */}
      {isPageLoading && <PageLoader />}

      {/* ── NAVBAR ESCRITORIO (PC) ── */}
      <motion.header
        className="hidden md:block fixed z-[100] left-0 right-0 mx-auto border"
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
          initial={{ paddingLeft: "1.25rem", paddingRight: "1.25rem", height: "4.5rem" }}
          animate={{ paddingLeft: isScrolled ? "1.25rem" : "1.5rem", paddingRight: isScrolled ? "1.25rem" : "1.5rem", height: isScrolled ? "3.5rem" : "4.5rem" }}
          transition={navTransition}
        >
          {/* LOGO (IZQUIERDA) */}
          <motion.a layout href="#inicio" className="flex-shrink-0">
            <motion.img
              src="/logo-blanco.png"
              alt="Roma"
              className="h-auto"
              initial={{ width: "5.5rem" }}
              animate={{ width: isScrolled ? "4.5rem" : "5.5rem" }}
              transition={navTransition}
            />
          </motion.a>

          {/* MENÚ VISTA ESCRITORIO (PC) */}
          <motion.nav
            layout
            className="flex items-center gap-2 relative"
            onMouseLeave={() => setHoveredSection(null)}
          >
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.id;
              const isHovered = hoveredSection === item.id;
              const showPill = isHovered || (isActive && !hoveredSection && (item.id !== 'inicio' || isScrolled));

              return (
                <a
                  key={item.id}
                  href={item.href}
                  onMouseEnter={() => setHoveredSection(item.id)}
                  className="relative px-5 py-2 text-[13px] font-semibold transition-colors duration-300 rounded-full select-none"
                >
                  <AnimatePresence>
                    {showPill && (
                      <motion.div
                        layoutId="activeNavPill"
                        className="absolute inset-0 bg-roma-olive rounded-full shadow-lg"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </AnimatePresence>
                  <span className={`relative z-10 transition-colors duration-300 ${showPill ? 'text-white drop-shadow-sm' : 'text-white/70 hover:text-white'}`}>
                    {item.label}
                  </span>
                </a>
              );
            })}
          </motion.nav>

          {/* BOTÓN VISTA ESCRITORIO (PC) */}
          <motion.div layout>
            <Link to="/propiedades" className="bg-roma-olive text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-roma-olive/90 shadow-lg transition-all duration-300 hover:scale-[1.03]">
              Ver Propiedades
            </Link>
          </motion.div>
        </motion.div>
      </motion.header>

      {/* ── NAVBAR MÓVIL: FILA SUPERIOR QUE SE QUEDA ARRIBA EN INICIO (ABSOLUTE) ── */}
      <div className="md:hidden absolute top-4 left-0 right-0 z-40 w-[92%] max-w-xl mx-auto flex items-center justify-between pointer-events-auto">
        <a href="#inicio" className="flex-shrink-0">
          <img src="/logo-blanco.png" alt="Roma" className="h-8 w-auto drop-shadow-md" />
        </a>
        <div className="flex items-center gap-1.5 sm:gap-2">
          <a
            href="#tasaciones"
            className="bg-roma-olive text-white px-2.5 sm:px-3 py-1.5 rounded-full text-[10px] sm:text-[11px] font-semibold shadow-md whitespace-nowrap border border-white/10"
          >
            Tasar propiedad
          </a>
          <Link
            to="/propiedades"
            className="bg-roma-olive text-white px-2.5 sm:px-3 py-1.5 rounded-full text-[10px] sm:text-[11px] font-semibold shadow-md whitespace-nowrap border border-white/10"
          >
            Ver Propiedades
          </Link>
        </div>
      </div>

      {/* ── NAVBAR MÓVIL: PÍLDORAS VERDES QUE APARECEN FLUIDAMENTE SOLO AL HACER SCROLL ── */}
      <AnimatePresence>
        {isScrolled && (
          <motion.div
            initial={{ opacity: 0, y: -25, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -25, scale: 0.95 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="md:hidden fixed top-4 left-1/2 -translate-x-1/2 z-[110] flex items-center justify-center gap-2 pointer-events-auto"
          >
            {[
              { id: 'servicios', href: '#servicios', label: 'Servicios' },
              { id: 'tasaciones', href: '#tasaciones', label: 'Tasaciones' },
              { id: 'ubicaciones', href: '#ubicaciones', label: 'Sucursales' },
            ].map((item) => {
              const isActive = activeSection === item.id;
              return (
                <a
                  key={item.id}
                  href={item.href}
                  className={`px-3.5 sm:px-4 py-1.5 rounded-full text-[11px] sm:text-xs font-semibold uppercase tracking-wider transition-all duration-300 backdrop-blur-xl shadow-xl flex items-center justify-center cursor-pointer border ${
                    isActive
                      ? 'bg-roma-leaf text-white border-white/60 shadow-roma-leaf/50 ring-2 ring-roma-leaf/40 scale-105 z-10'
                      : 'bg-roma-olive/95 hover:bg-roma-olive text-white/95 border-white/25 shadow-black/40'
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

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
      <section id="inicio" className="relative min-h-screen flex flex-col justify-center pb-20 sm:pb-32 pt-24 sm:pt-32 px-4 sm:px-8 md:px-16 overflow-hidden">
        <motion.div className="absolute inset-0 z-0 bg-roma-dark" style={{ y: heroImgY, opacity: heroOpacity }}>
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          >
            <source src="/video_final.webm" type="video/webm" />
          </video>
          <div className="absolute inset-0 bg-black/15 pointer-events-none" />
        </motion.div>

        <motion.div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[1] select-none" style={{ opacity: watermarkOpacity }}>
          <span className="text-[clamp(80px,18vw,240px)] font-bold uppercase leading-none tracking-tighter text-white/10 drop-shadow-xl">ROMA</span>
        </motion.div>

        <motion.div className="relative z-[2] max-w-7xl mx-auto w-full flex flex-col items-center text-center" variants={stagger} initial="hidden" animate="visible">
          <motion.h1 variants={fadeUp} className="w-full flex justify-center mb-8">
            <img src="/roma-logo.png" alt="Roma Inmobiliaria" className="w-full max-w-[280px] md:max-w-[500px] h-auto object-contain drop-shadow-[0_4px_15px_rgba(0,0,0,0.8)]" />
          </motion.h1>
        </motion.div>

        <motion.a href="#servicios" className="absolute bottom-10 left-1/2 -translate-x-1/2 z-[2] text-white/80 hover:text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] transition-colors duration-300" animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>
          <span className="material-icons text-[50px] sm:text-[60px] md:text-[80px] font-light">keyboard_arrow_down</span>
        </motion.a>
      </section>

      {/* ═══ CONTENEDOR GLOBAL DE FONDO CAMPO ═══ */}
      <div
        className="relative w-full overflow-hidden bg-roma-olive md:bg-transparent md:bg-[url('/fondo-campo.png')] md:bg-cover md:bg-center md:[background-attachment:fixed]"
      >

        {/* ═══ CARRUSEL DE MARCAS/DATOS ═══ */}
        <div className="relative z-10 w-full overflow-hidden py-5 bg-black/60 backdrop-blur-md border-y border-white/10">
          <motion.div
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
            className="flex items-center whitespace-nowrap"
          >
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex items-center">
                {['10+ Años de experiencia', '3 Sedes en la región', 'Propiedades', 'Campos', 'Lotes'].map((text, idx) => (
                  <div key={idx} className="flex items-center">
                    <span className="text-[11px] md:text-[12px] text-white/90 font-medium uppercase tracking-[0.2em] px-8 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">{text}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-roma-leaf/80 shadow-[0_0_5px_rgba(0,0,0,0.8)]" />
                  </div>
                ))}
              </div>
            ))}
          </motion.div>
        </div>

        {/* ═══ SERVICIOS (MENÚ HERO 4 PANELES 100VH) ═══ */}
        <HeroServicesMenu />

        {/* ═══ SECCIÓN DE TASACIONES ═══ */}
        <TasacionesSection />

        {/* ═══ SEDES Y COBERTURA TERRITORIAL ═══ */}
        <SedesSection />

        {/* ═══ NUESTRO EQUIPO ═══ */}
        <section id="equipo" className="relative z-10 pt-16 sm:pt-20 pb-16 sm:pb-20 px-4 sm:px-6">
          <motion.div className="max-w-7xl mx-auto" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>

            <motion.div variants={fadeUp} className="text-center mb-10 sm:mb-14">
              <p className="text-roma-leaf text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.25em] mb-3 sm:mb-4">Conocenos</p>
              <h2 className="font-['Cinzel',serif] text-3xl sm:text-4xl md:text-5xl font-semibold text-white tracking-tight">Nuestro equipo</h2>
            </motion.div>

            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 items-start">
              {EQUIPO.map((persona) => {
                const isExpanded = expandedMember === persona.id;
                return (
                  <motion.div
                    key={persona.id}
                    variants={fadeUp}
                    onClick={() => setExpandedMember(isExpanded ? null : persona.id)}
                    className="flex flex-col bg-[#1a2c1a]/95 backdrop-blur-md rounded-2xl sm:rounded-3xl overflow-hidden border border-white/10 shadow-2xl cursor-pointer hover:border-roma-leaf/40 transition-colors"
                  >
                    {/* Foto / Ícono superior */}
                    <div className="relative h-36 sm:h-64 w-full flex-shrink-0 bg-black/40 flex items-center justify-center border-b border-white/5">
                      <User size={48} strokeWidth={1} className="text-white/20 sm:hidden" />
                      <User size={80} strokeWidth={1} className="text-white/20 hidden sm:block" />
                    </div>

                    {/* Contenedor de Textos Inferior */}
                    <div className="p-3 sm:p-6 flex flex-col bg-roma-olive transition-all duration-500">
                      <h3 className="text-[14px] sm:text-[20px] font-semibold text-white tracking-tight leading-none mb-1 sm:mb-1.5">{persona.nombre}</h3>
                      <div className="flex items-center justify-between gap-1">
                        <p className="text-roma-leaf text-[8px] sm:text-[10px] font-medium uppercase tracking-widest">{persona.rol}</p>
                        <span className={`material-icons text-white/50 text-[14px] sm:text-[18px] transition-transform duration-300 ${isExpanded ? 'rotate-180 text-white' : ''}`}>
                          expand_more
                        </span>
                      </div>

                      {/* Acordeón que se abre al hacer click */}
                      <div
                        className="transition-[grid-template-rows] duration-500 ease-in-out grid"
                        style={{ gridTemplateRows: isExpanded ? '1fr' : '0fr' }}
                      >
                        <div className="overflow-hidden">
                          <p className="text-white/80 text-[11px] sm:text-[13px] leading-relaxed font-light mt-3 sm:mt-4 border-t border-white/10 pt-3 sm:pt-4">
                            {persona.desc}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </section>

        {/* ═══ NUESTRAS REDES (Videos Nativos) ═══ */}
        <section className="relative z-10 pt-16 sm:pt-20 pb-24 sm:pb-32 px-4 sm:px-6">
          <motion.div className="max-w-5xl mx-auto" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <motion.div variants={fadeUp} className="text-center mb-10 sm:mb-14">
              <p className="text-roma-leaf text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.25em] mb-3 sm:mb-4">Comunidad</p>
              <h2 className="font-['Cinzel',serif] text-3xl sm:text-4xl md:text-5xl font-semibold text-white tracking-tight">Nuestras Redes</h2>
            </motion.div>

            {/* ─── VISTA COMPUTADORA (Hover play interactivo y minimalista) ─── */}
            <div className="hidden md:grid md:grid-cols-2 gap-10 justify-items-center">
              {/* Instagram Desktop */}
              <motion.div variants={fadeLeft} className="flex flex-col items-center gap-4 w-full max-w-[320px]">
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
                    {/* Play hint icon */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-100 group-hover:opacity-0 transition-opacity duration-400 pointer-events-none">
                      <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center">
                        <i className="fas fa-play text-white text-lg ml-1" />
                      </div>
                    </div>
                    {/* Botón de sonido en hover */}
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

              {/* TikTok Desktop */}
              <motion.div variants={fadeRight} className="flex flex-col items-center gap-4 w-full max-w-[320px]">
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
                    {/* Play hint icon */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-100 group-hover:opacity-0 transition-opacity duration-400 pointer-events-none">
                      <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center">
                        <i className="fas fa-play text-white text-lg ml-1" />
                      </div>
                    </div>
                    {/* Botón de sonido en hover */}
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

            {/* ─── VISTA MOBILE (Touch interactivo con badges flotantes y click to play) ─── */}
            <div className="grid md:hidden grid-cols-1 gap-8 justify-items-center">
              {/* Instagram Mobile */}
              <motion.div variants={fadeLeft} className="flex flex-col items-center gap-3 w-full max-w-[280px]">
                <motion.a
                  href="https://instagram.com/romainmobiliaria"
                  target="_blank"
                  rel="noopener noreferrer"
                  animate={{ y: [-8, 8, -8] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="flex items-center gap-2.5 bg-black/50 hover:bg-roma-olive/90 text-white px-4 py-2 rounded-full border border-roma-leaf/40 hover:border-roma-leaf backdrop-blur-md shadow-lg transition-all duration-300 hover:scale-105 group/link cursor-pointer"
                >
                  <Instagram size={18} strokeWidth={1.75} className="text-pink-400 group-hover/link:text-white transition-colors duration-300" />
                  <span className="font-semibold tracking-widest text-[11px] uppercase drop-shadow-md">
                    @romainmobiliaria
                  </span>
                  <ArrowUpRight size={14} className="text-white/60 group-hover/link:text-white group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-all duration-300" />
                </motion.a>

                <div
                  className="relative bg-[#1a2c1a]/90 backdrop-blur-md border border-white/10 p-2.5 rounded-[2.5rem] shadow-2xl w-full aspect-[9/16] overflow-hidden cursor-pointer"
                  onClick={() => handleVideoClick(videoIgMobileRef, playingIg, setPlayingIg)}
                >
                  <div className="w-full h-full rounded-[2rem] overflow-hidden bg-black relative">
                    <video
                      ref={videoIgMobileRef}
                      className="w-full h-full object-cover"
                      muted
                      playsInline
                      preload="auto"
                      loop
                    >
                      <source src="/video-ig.mp4#t=0.001" type="video/mp4" />
                    </video>
                    {!playingIg && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30 pointer-events-none">
                        <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center">
                          <i className="fas fa-play text-white text-lg ml-1" />
                        </div>
                      </div>
                    )}
                    <button
                      onClick={toggleSoundIgMobile}
                      className="absolute bottom-4 right-4 z-30 w-10 h-10 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-black/80 transition-colors"
                      title={mutedIgMobile ? 'Activar sonido' : 'Silenciar'}
                    >
                      <i className={`fas ${!mutedIgMobile ? 'fa-volume-high text-roma-leaf' : 'fa-volume-xmark text-white/70'} text-sm`} />
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* TikTok Mobile */}
              <motion.div variants={fadeRight} className="flex flex-col items-center gap-3 w-full max-w-[280px]">
                <motion.a
                  href="https://tiktok.com/@romainmobiliaria"
                  target="_blank"
                  rel="noopener noreferrer"
                  animate={{ y: [8, -8, 8] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="flex items-center gap-2.5 bg-black/50 hover:bg-roma-olive/90 text-white px-4 py-2 rounded-full border border-roma-leaf/40 hover:border-roma-leaf backdrop-blur-md shadow-lg transition-all duration-300 hover:scale-105 group/link cursor-pointer"
                >
                  <i className="fab fa-tiktok text-cyan-400 group-hover/link:text-white text-[15px] transition-colors duration-300" />
                  <span className="font-semibold tracking-widest text-[11px] uppercase drop-shadow-md">
                    @romainmobiliaria
                  </span>
                  <ArrowUpRight size={14} className="text-white/60 group-hover/link:text-white group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-all duration-300" />
                </motion.a>

                <div
                  className="relative bg-[#1a2c1a]/90 backdrop-blur-md border border-white/10 p-2.5 rounded-[2.5rem] shadow-2xl w-full aspect-[9/16] overflow-hidden cursor-pointer"
                  onClick={() => handleVideoClick(videoTkMobileRef, playingTk, setPlayingTk)}
                >
                  <div className="w-full h-full rounded-[2rem] overflow-hidden bg-black relative">
                    <video
                      ref={videoTkMobileRef}
                      className="w-full h-full object-cover"
                      muted
                      playsInline
                      preload="auto"
                      loop
                    >
                      <source src="/video-tiktok.mp4#t=0.001" type="video/mp4" />
                    </video>
                    {!playingTk && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30 pointer-events-none">
                        <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center">
                          <i className="fas fa-play text-white text-lg ml-1" />
                        </div>
                      </div>
                    )}
                    <button
                      onClick={toggleSoundTkMobile}
                      className="absolute bottom-4 right-4 z-30 w-10 h-10 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-black/80 transition-colors"
                      title={mutedTkMobile ? 'Activar sonido' : 'Silenciar'}
                    >
                      <i className={`fas ${!mutedTkMobile ? 'fa-volume-high text-roma-leaf' : 'fa-volume-xmark text-white/70'} text-sm`} />
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* ═══ NUESTROS CIMIENTOS ═══ */}
        <NuestrosCimientos />

        {/* ═══ CTA SECCIÓN PRINCIPAL ═══ */}
        <section className="relative z-10 pt-8 sm:pt-10 pb-32 sm:pb-40 px-4 sm:px-6 flex flex-col justify-center">
          <motion.div
            className="max-w-4xl mx-auto w-full text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={stagger}
          >
            <motion.div variants={fadeUp}>
              <p className="text-roma-leaf text-[11px] sm:text-[12px] md:text-[13px] font-semibold uppercase tracking-[0.25em] mb-3 sm:mb-4">
                Inversión Patrimonial
              </p>
              <h2 className="font-['Cinzel',serif] text-3xl sm:text-4xl md:text-6xl font-semibold text-white tracking-tight drop-shadow-md mb-5 sm:mb-6 max-w-3xl mx-auto leading-tight">
                El momento de asegurar tu futuro es hoy
              </h2>
              <p className="text-white/80 text-sm sm:text-base md:text-lg font-light leading-relaxed max-w-2xl mx-auto mb-8 sm:mb-10">
                Descubrí propiedades exclusivas y oportunidades de inversión únicas en la Patagonia con nuestro acompañamiento estratégico.
              </p>
              <Link
                to="/propiedades"
                className="inline-flex items-center gap-2 sm:gap-3 bg-roma-olive hover:bg-roma-olive/90 text-white px-7 sm:px-9 py-3.5 sm:py-4 rounded-full font-semibold text-[10px] sm:text-xs uppercase tracking-widest shadow-2xl transition-all duration-300 hover:scale-105 border border-white/10"
              >
                <span>Elegí tu próxima inversión</span>
                <span className="material-icons text-sm">arrow_forward</span>
              </Link>
            </motion.div>
          </motion.div>
        </section>

      </div>

      {/* ═══ FOOTER ═══ */}
      <footer className="bg-roma-dark text-white py-14 sm:py-20 px-4 sm:px-6 border-t border-white/5 relative z-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12">
          <div className="col-span-1 sm:col-span-2">
            <img src="/logo-blanco.png" alt="Logo Roma" className="w-44 h-auto mb-6" />
            <p className="text-white/50 text-[13px] font-light max-w-md leading-relaxed">
              En Roma Inmobiliaria, nos especializamos en la venta, alquiler y gestión de propiedades urbanas y rurales en la Patagonia, ofreciendo un trato cercano y profesional.
            </p>
          </div>
          <div>
            <h5 className="font-semibold mb-4 text-roma-leaf text-[11px] uppercase tracking-wider">Contacto</h5>
            <ul className="space-y-3 text-white/50 text-[13px] font-light">
              <li className="flex items-start gap-2">
                <span className="material-icons text-[16px] shrink-0 mt-0.5">call</span>
                <div>
                  <div>+54 9 291 4136535 (Rodrigo)</div>
                  <div>+54 291 4714896 (Maira)</div>
                </div>
              </li>
              <li className="flex items-center gap-2">
                <span className="material-icons text-[16px] shrink-0">mail</span>
                <a href="mailto:romainmobiliaria.arg@gmail.com" className="hover:text-white transition">
                  romainmobiliaria.arg@gmail.com
                </a>
              </li>
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