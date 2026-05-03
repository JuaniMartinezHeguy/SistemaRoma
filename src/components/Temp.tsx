import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import { Home, Tractor, Map, Plane, Truck, Globe } from 'lucide-react';

const SERVICIOS = [
  { icon: Home, title: 'Propiedades', desc: 'Venta y alquiler de casas y departamentos urbanos, con acompañamiento profesional en cada etapa.' },
  { icon: Tractor, title: 'Campos', desc: 'Comercialización de extensiones agrícolas y ganaderas de alto rendimiento productivo.' },
  { icon: Map, title: 'Terrenos', desc: 'Lotes estratégicos, listos para escriturar, invertir y construir tu futuro desde cero.' },
  { icon: Plane, title: 'Vista Aérea', desc: 'Relevamiento con drones para visualizar y evaluar campos o terrenos desde el aire.' },
  { icon: Truck, title: 'Visitas en Campo', desc: 'Te llevamos en nuestros vehículos a recorrer y conocer tu próxima propiedad en persona.' },
  { icon: Globe, title: 'Catálogo Digital', desc: 'Explorá nuestro catálogo completo de propiedades actualizado en tiempo real desde la web.' },
];

const SEDES = [
  { nombre: 'Villalonga', url: 'https://maps.google.com/maps?q=Villalonga,Buenos+Aires,Argentina&t=&z=14&ie=UTF8&iwloc=&output=embed' },
  { nombre: 'Pedro Luro', url: 'https://maps.google.com/maps?q=Pedro+Luro,Buenos+Aires,Argentina&t=&z=14&ie=UTF8&iwloc=&output=embed' },
  { nombre: 'San Blas', url: 'https://maps.google.com/maps?q=Bahia+San+Blas,Buenos+Aires,Argentina&t=&z=14&ie=UTF8&iwloc=&output=embed' },
];

const EQUIPO = [
  { name: 'Rodrigo', role: 'Fundador y Jefe' },
  { name: 'Marina', role: 'Secretaria' },
  { name: 'Elena', role: 'Marketing' },
  { name: 'Maira', role: 'Vendedora' },
];

const EASE = [0.22, 1, 0.36, 1] as const;
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.15 } } };
const fadeUp = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } } };
const fadeLeft = { hidden: { opacity: 0, x: -50 }, visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: EASE } } };
const fadeRight = { hidden: { opacity: 0, x: 50 }, visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: EASE } } };

export default function Landing() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeService, setActiveService] = useState(0);
  const [sedeActiva, setSedeActiva] = useState(0);

  const [isScrolled, setIsScrolled] = useState(false);

  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
  });

  const heroImgY = useTransform(scrollY, [0, 800], [0, 200]);
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0.3]);
  const watermarkOpacity = useTransform(scrollY, [80, 350], [0, 0.12]);

  return (
    <div className="bg-roma-olive text-white font-['Inter',system-ui,sans-serif] overflow-x-hidden">

      {/* ── NAVBAR ── */}
      <motion.header
        className={`fixed z-50 transition-all duration-500 ${isScrolled
            ? 'top-4 left-4 right-4 bg-black/20 backdrop-blur-md rounded-2xl shadow-glass'
            : 'top-0 left-0 right-0 bg-transparent rounded-none'
          }`}
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className={`mx-auto flex items-center justify-between transition-all duration-500 ${isScrolled ? 'max-w-7xl px-6 h-16' : 'w-full px-8 h-20'}`}>
          <a href="#inicio" className="flex-shrink-0">
            <img src="/logo-blanco.png" alt="Roma" className="w-28 h-auto brightness-0 invert" />
          </a>
          <nav className="hidden md:flex items-center gap-8">
            {[['#inicio', 'Inicio'], ['#servicios', 'Servicios'], ['#ubicaciones', 'Sedes'], ['#equipo', 'Equipo']].map(([href, label]) => (
              <a key={href} href={href} className="text-sm font-medium text-white/80 hover:text-white transition-colors relative after:absolute after:left-0 after:-bottom-1 after:h-px after:w-0 after:bg-white after:transition-all hover:after:w-full">{label}</a>
            ))}
          </nav>
          <div className="hidden md:block">
            <Link to="/propiedades" className="bg-roma-olive text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-roma-olive/90 hover:shadow-float transition-all duration-300 hover:scale-[1.03]">
              Ver Propiedades
            </Link>
          </div>
          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-white p-2">
            <i className={mobileOpen ? "ph ph-x text-2xl" : "ph ph-list text-2xl"} />
          </button>
        </div>
        {mobileOpen && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="md:hidden mt-2 bg-black/40 backdrop-blur-xl border-t border-white/10 p-6 flex flex-col items-center gap-4 rounded-b-2xl shadow-glass-lg">
            {[['#inicio', 'Inicio'], ['#servicios', 'Servicios'], ['#ubicaciones', 'Sedes'], ['#equipo', 'Equipo']].map(([href, label]) => (
              <a key={href} href={href} onClick={() => setMobileOpen(false)} className="text-white/80 hover:text-white font-medium text-base">{label}</a>
            ))}
            <Link to="/propiedades" className="bg-roma-olive text-white px-8 py-3 rounded-full font-bold mt-2" onClick={() => setMobileOpen(false)}>Ver Propiedades</Link>
          </motion.div>
        )}
      </motion.header>

      {/* ── SOCIAL FLOTANTE ── */}
      <div className="hidden md:flex fixed right-5 top-1/2 -translate-y-1/2 z-40 flex-col gap-3">
        {[
          { href: 'https://www.facebook.com/romainmobiliaria.arg/?locale=es_LA', icon: 'fa-facebook-f' },
          { href: 'https://www.tiktok.com/@romainmobiliaria', icon: 'fa-tiktok' },
          { href: 'https://wa.me/5492920123456', icon: 'fa-whatsapp' },
          { href: 'https://www.instagram.com/romainmobiliaria', icon: 'fa-instagram' },
        ].map(({ href, icon }) => (
          <a key={icon} href={href} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-[#111111] backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-black hover:scale-110 transition-all duration-300 shadow-float">
            <i className={`fab ${icon} text-lg`} />
          </a>
        ))}
      </div>
      <div className="md:hidden fixed bottom-6 right-6 z-50">
        <a href="https://wa.me/5492920123456" target="_blank" rel="noopener noreferrer" className="w-14 h-14 bg-[#111111] border border-white/10 rounded-full flex items-center justify-center text-white shadow-float">
          <i className="fab fa-whatsapp text-3xl" />
        </a>
      </div>

      {/* ═══ HERO ═══ */}
      <section id="inicio" className="relative min-h-screen flex flex-col justify-end pb-20 pt-32 px-8 md:px-16 overflow-hidden">
        {/* Background image with parallax */}
        <motion.div className="absolute inset-0 z-0 bg-roma-dark" style={{ y: heroImgY, opacity: heroOpacity }}>
          <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/fondoRoma.png')" }} />
        </motion.div>
        <div className="absolute inset-0 bg-black/40 z-[1]" />

        {/* Watermark */}
        <motion.div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[1] select-none" style={{ opacity: watermarkOpacity }}>
          <span className="text-[clamp(80px,18vw,240px)] font-black uppercase leading-none tracking-tighter text-white/10">ROMA</span>
        </motion.div>

        {/* Content */}
        <motion.div className="relative z-[2] max-w-7xl mx-auto w-full" variants={stagger} initial="hidden" animate="visible">
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 border border-white/20 text-white text-xs font-semibold uppercase tracking-[0.2em] px-4 py-2 rounded-full mb-8 bg-black/20 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-roma-leaf animate-pulse" />
            Inmobiliaria · Región Patagónica
          </motion.div>
          <motion.h1 variants={fadeLeft} className="text-[clamp(42px,7vw,100px)] font-black leading-[0.92] tracking-tight text-white mb-8 max-w-5xl text-balance">
            Tu próxima<br />
            <span className="text-roma-leaf">inversión</span><br />
            empieza aquí.
          </motion.h1>
          <motion.p variants={fadeUp} className="text-white/80 text-base md:text-lg font-light max-w-lg mb-12 leading-relaxed">
            Especialistas en la venta, alquiler y gestión de propiedades urbanas y rurales. Más de una década de experiencia en la región.
          </motion.p>
          <motion.div variants={fadeUp} className="flex flex-wrap gap-4">
            <Link to="/propiedades" className="inline-flex items-center gap-3 bg-white text-roma-dark px-8 py-4 rounded-full font-semibold text-sm hover:scale-[1.03] hover:shadow-xl transition-all duration-300">
              Explorar Catálogo <i className="ph ph-arrow-right text-lg" />
            </Link>
            <a href="#servicios" className="inline-flex items-center gap-2 border border-white/30 text-white px-8 py-4 rounded-full font-medium text-sm hover:bg-white/10 hover:border-white transition-all duration-300 bg-black/20 backdrop-blur-sm">
              Conocer más
            </a>
          </motion.div>
          <motion.div variants={fadeUp} className="flex flex-wrap gap-10 mt-16 pt-10 border-t border-white/20">
            {[['10+', 'Años de experiencia'], ['3', 'Sedes en la región'], ['500+', 'Propiedades gestionadas']].map(([num, label]) => (
              <div key={label}>
                <div className="text-3xl font-black text-white tracking-tight">{num}</div>
                <div className="text-[11px] text-white/70 font-medium mt-1 uppercase tracking-wider">{label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ═══ SERVICIOS ═══ */}
      <section id="servicios" className="relative pt-64 pb-64 px-6 bg-roma-olive overflow-hidden">
        <motion.div className="relative z-10 max-w-7xl mx-auto" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={stagger}>
          <div className="flex flex-col lg:flex-row gap-12 min-h-[85vh]">

            {/* Left panel: active service detail */}
            <div className="lg:w-1/2 flex flex-col justify-center pr-0 lg:pr-16 border-b lg:border-b-0 lg:border-r border-white/10 pb-16 lg:pb-0 relative min-h-[500px]">
              {SERVICIOS.map((srv, idx) => {
                return (
                  <div key={idx} className={`absolute inset-0 lg:right-16 flex flex-col justify-center transition-all duration-500 ${idx === activeService ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
                    <p className="text-roma-leaf text-xs font-semibold uppercase tracking-[0.25em] mb-6">Nuestro Servicio</p>
                    <img src="/fondoRoma.png" className="w-full h-64 object-cover rounded-md mb-8 opacity-90 shadow-glass border border-white/10" alt="Servicio" />
                    <h2 className="text-5xl md:text-6xl font-black text-white leading-tight mb-6 tracking-tight">{srv.title}</h2>
                    <p className="text-white/80 text-base leading-relaxed max-w-sm border-l-2 border-roma-leaf/50 pl-5">{srv.desc}</p>
                  </div>
                );
              })}
            </div>

            {/* Right panel: hover list */}
            <motion.div variants={fadeRight} className="lg:w-1/2 flex flex-col justify-center pl-0 lg:pl-16 gap-3 pt-16 lg:pt-0">
              {SERVICIOS.map((srv, idx) => {
                const Icon = srv.icon;
                return (
                  <motion.div
                    key={idx}
                    onMouseEnter={() => setActiveService(idx)}
                    className="group flex items-center gap-4 py-5 border-b border-white/10 cursor-default"
                    whileHover={{ x: 8 }}
                    transition={{ duration: 0.25 }}
                  >
                    <div className={`w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center transition-all duration-300 ${idx === activeService ? 'bg-white text-roma-olive shadow-float scale-110' : 'bg-black/10 text-white/50 group-hover:bg-black/20 group-hover:text-white'}`}>
                      <Icon size={16} />
                    </div>
                    <span className={`text-2xl md:text-3xl font-light tracking-tight transition-all duration-300 ${idx === activeService ? 'text-white' : 'text-white/50 group-hover:text-white/80'}`}>
                      {srv.title}
                    </span>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </motion.div>

        {/* Cultivo Detail */}
        <div
          className="absolute bottom-0 left-0 w-full h-24 md:h-40 mix-blend-multiply opacity-50 pointer-events-none z-[1]"
          style={{
            backgroundImage: "url('/cultivo.png')",
            backgroundPosition: "bottom left",
            backgroundSize: "auto 100%",
            backgroundRepeat: "repeat-x"
          }}
        />
      </section>

      {/* ═══ SEDES ═══ */}
      <section id="ubicaciones" className="relative pt-64 pb-64 px-6 bg-roma-olive overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-56 bg-gradient-to-b from-[#2a4a2e] to-transparent pointer-events-none z-[0]" />
        <motion.div className="relative z-10 max-w-7xl mx-auto" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={stagger}>
          <div className="grid lg:grid-cols-2 gap-24 items-center min-h-[70vh]">
            <motion.div variants={fadeLeft}>
              <p className="text-roma-leaf text-sm font-semibold uppercase tracking-[0.25em] mb-6">Ubicaciones</p>
              <h2 className="text-5xl md:text-6xl font-black text-white mb-8 leading-tight">Nuestras Sedes</h2>
              <p className="text-white/80 text-lg md:text-xl mb-14 leading-relaxed max-w-lg">Cubrimos las zonas más importantes de la región, brindando un servicio local, cercano y altamente personalizado a tus necesidades.</p>
              <div className="flex flex-wrap gap-3">
                {SEDES.map((sede, index) => (
                  <button
                    key={index}
                    onMouseEnter={() => setSedeActiva(index)}
                    onClick={() => setSedeActiva(index)}
                    className={`px-5 py-2.5 rounded-full flex items-center gap-2 text-sm font-semibold transition-all duration-300 border ${sedeActiva === index
                        ? 'bg-white border-white text-roma-olive shadow-float'
                        : 'bg-black/20 border-white/20 text-white/70 hover:border-white hover:text-white'
                      }`}
                  >
                    <span className="material-icons text-inherit text-sm">location_on</span>
                    {sede.nombre}
                  </button>
                ))}
              </div>
            </motion.div>
            <motion.div variants={fadeRight}>
              <div className="h-[380px] rounded-2xl overflow-hidden border border-white/20 bg-black/10 shadow-glass-lg relative">
                <iframe
                  src={SEDES[sedeActiva].url}
                  className="w-full h-full border-0 opacity-90 mix-blend-luminosity hover:mix-blend-normal transition-all duration-500"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`Mapa de ${SEDES[sedeActiva].nombre}`}
                />
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Cultivo Detail */}
        <div
          className="absolute bottom-0 left-0 w-full h-24 md:h-40 mix-blend-multiply opacity-50 pointer-events-none z-[1]"
          style={{
            backgroundImage: "url('/cultivo.png')",
            backgroundPosition: "bottom left",
            backgroundSize: "auto 100%",
            backgroundRepeat: "repeat-x"
          }}
        />
      </section>

      {/* ═══ EQUIPO ═══ */}
      <section id="equipo" className="relative pt-64 pb-64 px-6 bg-roma-olive overflow-hidden min-h-[80vh] flex flex-col justify-center">
        <div className="absolute top-0 left-0 right-0 h-56 bg-gradient-to-b from-[#2a4a2e] to-transparent pointer-events-none z-[0]" />
        <motion.div className="relative z-10 max-w-7xl mx-auto w-full" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={stagger}>
          <motion.div variants={fadeUp} className="text-center mb-24">
            <p className="text-roma-leaf text-sm font-semibold uppercase tracking-[0.25em] mb-6">El equipo</p>
            <h2 className="text-5xl md:text-6xl font-black text-white mb-6">Nuestro Equipo</h2>
            <p className="text-white/80 text-lg max-w-lg mx-auto">Siempre disponibles para brindarte la mejor experiencia inmobiliaria y asesorarte en cada decisión.</p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-16">
            {EQUIPO.map((m, idx) => (
              <motion.div key={idx} variants={fadeUp} className="text-center group">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="w-32 h-32 md:w-40 md:h-40 rounded-full mx-auto mb-5 flex items-center justify-center border border-white/20 bg-black/10 shadow-card group-hover:shadow-float group-hover:border-white/50 transition-all duration-500"
                >
                  <span className="text-5xl text-white/50 group-hover:text-white transition-colors duration-300 select-none font-black">{m.name[0]}</span>
                </motion.div>
                <h4 className="text-lg font-bold text-white">{m.name}</h4>
                <p className="text-roma-leaf text-[10px] font-semibold uppercase mt-1 tracking-wider">{m.role}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Cultivo Detail */}
        <div
          className="absolute bottom-0 left-0 w-full h-24 md:h-40 mix-blend-multiply opacity-50 pointer-events-none z-[1]"
          style={{
            backgroundImage: "url('/cultivo.png')",
            backgroundPosition: "bottom left",
            backgroundSize: "auto 100%",
            backgroundRepeat: "repeat-x"
          }}
        />
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="bg-roma-dark text-white py-20 px-6 border-t border-roma-stone/20">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <img src="/logo-blanco.png" alt="Logo Roma" className="w-44 h-auto mb-6" />
            <p className="text-white/50 text-sm max-w-md leading-relaxed">
              En Roma Inmobiliaria, nos especializamos en la venta, alquiler y gestión de propiedades urbanas y rurales en la Patagonia.
            </p>
          </div>
          <div>
            <h5 className="font-semibold mb-4 text-roma-leaf text-xs uppercase tracking-wider">Contacto</h5>
            <ul className="space-y-3 text-white/50 text-sm">
              <li className="flex items-center gap-2"><span className="material-icons text-base">call</span> +54 9 2920 123456</li>
              <li className="flex items-center gap-2"><span className="material-icons text-base">mail</span> info@romainmo.com.ar</li>
              <li className="flex items-center gap-2"><span className="material-icons text-base">location_on</span> Villalonga, Buenos Aires</li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold mb-4 text-roma-leaf text-xs uppercase tracking-wider">Navegación</h5>
            <ul className="space-y-3 text-white/50 text-sm">
              <li><a href="#inicio" className="hover:text-white transition">Inicio</a></li>
              <li><a href="#servicios" className="hover:text-white transition">Servicios</a></li>
              <li><Link to="/propiedades" className="hover:text-white transition">Propiedades</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-white/10 text-center text-white/30 text-xs">
          © {new Date().getFullYear()} Roma Inmobiliaria. Todos los derechos reservados.
        </div>
      </footer>
    </div>
  );
}