import { useState, useRef } from 'react';
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
  const scrollRef = useRef<HTMLDivElement>(null);
  const serviciosRef = useRef<HTMLElement>(null);

  const { scrollY } = useScroll({ container: scrollRef });
  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
  });

  const { scrollYProgress: srvProgress } = useScroll({
    container: scrollRef,
    target: serviciosRef,
    offset: ["start center", "end center"]
  });

  useMotionValueEvent(srvProgress, "change", (latest) => {
    const index = Math.min(Math.floor(latest * SERVICIOS.length), SERVICIOS.length - 1);
    if (index >= 0 && index !== activeService) {
      setActiveService(index);
    }
  });

  const heroImgY = useTransform(scrollY, [0, 800], [0, 200]);
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0.3]);
  const watermarkOpacity = useTransform(scrollY, [80, 350], [0, 0.12]);

  return (
    <div ref={scrollRef} className="bg-black text-white font-['Inter',system-ui,sans-serif] overflow-x-hidden">

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
      <section id="inicio" className="relative min-h-screen flex flex-col justify-center pb-32 pt-32 px-8 md:px-16 overflow-hidden">
        <motion.div className="absolute inset-0 z-0 bg-roma-dark" style={{ y: heroImgY, opacity: heroOpacity }}>
          <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/fondoRoma.png')" }} />
        </motion.div>
        <div className="absolute inset-0 bg-black/40 z-[1]" />
        <motion.div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[1] select-none" style={{ opacity: watermarkOpacity }}>
          <span className="text-[clamp(80px,18vw,240px)] font-black uppercase leading-none tracking-tighter text-white/10">ROMA</span>
        </motion.div>

        <motion.div className="relative z-[2] max-w-7xl mx-auto w-full flex flex-col items-center text-center" variants={stagger} initial="hidden" animate="visible">
          <motion.h1 variants={fadeUp} className="w-full flex justify-center mb-8">
            <img src="/roma-logo.png" alt="Roma Inmobiliaria" className="w-full max-w-[320px] md:max-w-[600px] h-auto object-contain" />
          </motion.h1>

          <motion.div variants={fadeUp} className="w-full max-w-4xl overflow-hidden mt-4 pt-6 border-t border-white/10 relative flex">
            <motion.div animate={{ x: ["0%", "-50%"] }} transition={{ duration: 50, repeat: Infinity, ease: "linear" }} className="flex items-center whitespace-nowrap">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="flex items-center">
                  {['10+ Años de experiencia', '3 Sedes en la región', '500+ Propiedades', 'Propiedades', 'Campos', 'Lotes'].map((text, idx) => (
                    <div key={idx} className="flex items-center">
                      <span className="text-[10px] md:text-xs text-white/80 font-bold uppercase tracking-[0.2em] px-8">{text}</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-roma-leaf/50" />
                    </div>
                  ))}
                </div>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.a href="#servicios" className="absolute bottom-10 left-1/2 -translate-x-1/2 z-[2] text-white/60 hover:text-white transition-colors duration-300" animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>
          <span className="material-icons text-[80px]">keyboard_arrow_down</span>
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
            <div className="flex flex-col lg:flex-row gap-12 items-center">

              {/* Panel Izquierdo: Tarjeta verde oscura (60%) */}
              <div className="w-full lg:w-[60%] lg:pr-16 relative h-[600px] flex flex-col justify-center">
                {SERVICIOS.map((srv, idx) => (
                  <div key={idx} className={`absolute inset-0 lg:right-16 flex flex-col justify-center transition-all duration-700 ${idx === activeService ? 'opacity-100 translate-y-0 z-10' : 'opacity-0 translate-y-8 pointer-events-none z-0'}`}>
                    <div className="bg-[#2a3c2a] rounded-[2rem] p-8 md:p-10 shadow-2xl border border-white/10 w-full h-full max-h-[550px] flex flex-col">
                      <p className="text-roma-leaf text-[10px] font-bold uppercase tracking-[0.25em] mb-4">Nuestro Servicio</p>
                      <img src="/fondoRoma.png" className="w-full flex-1 object-cover rounded-xl mb-6 min-h-[180px] border border-white/5" alt="Servicio" />
                      <h2 className="text-4xl md:text-5xl font-black text-white leading-tight mb-3 tracking-tight">{srv.title}</h2>
                      <p className="text-white/70 text-base leading-relaxed">{srv.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Panel Derecho: Timeline estático (40%) */}
              <motion.div variants={fadeRight} className="w-full lg:w-[40%] relative py-8 pl-14">
                {/* Track base */}
                <div className="absolute left-4 top-[40px] bottom-[40px] w-[2px] bg-white/10 hidden lg:block rounded-full" />
                {/* Línea progreso atada al índice activo */}
                <div
                  className="absolute left-4 top-[40px] w-[2px] bg-roma-leaf hidden lg:block rounded-full transition-all duration-500"
                  style={{ height: `calc(${(activeService / (SERVICIOS.length - 1)) * 100}%)` }}
                />

                <div className="flex flex-col relative z-10">
                  {SERVICIOS.map((srv, idx) => {
                    const isActive = idx === activeService;
                    return (
                      <div key={idx} onMouseEnter={() => setActiveService(idx)} onClick={() => setActiveService(idx)} className="group flex items-center gap-5 cursor-pointer py-5 relative">
                        {/* Punto en la línea */}
                        <div className="absolute left-[-26px] hidden lg:flex w-4 h-4 rounded-full items-center justify-center -translate-x-1/2">
                          <div className={`rounded-full transition-all duration-300 ${isActive ? 'w-4 h-4 bg-roma-leaf shadow-[0_0_14px_rgba(91,138,97,0.9)]' : 'w-2.5 h-2.5 bg-white/20 border border-white/20'}`} />
                        </div>
                        {/* Icono */}
                        <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
                          <srv.icon size={18} className={`transition-colors duration-300 ${isActive ? 'text-roma-leaf' : 'text-white/30 group-hover:text-white/60'}`} />
                        </div>
                        {/* Label */}
                        <div className={`flex-1 border-b pb-5 text-2xl md:text-3xl font-light tracking-tight transition-all duration-300 ${isActive ? 'text-white border-roma-leaf/30' : 'text-white/50 border-white/5 group-hover:text-white/80'}`}>
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
        <section id="ubicaciones" className="relative z-10 pt-40 pb-40 px-6">
          <motion.div className="relative z-10 max-w-7xl mx-auto" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={stagger}>
            <div className="flex flex-col lg:flex-row gap-12 min-h-[70vh] items-center">
              <motion.div variants={fadeLeft} className="w-full lg:w-[60%] lg:pr-16 text-left">
                <p className="text-roma-leaf text-sm font-semibold uppercase tracking-[0.25em] mb-6">Ubicaciones</p>
                <h2 className="text-5xl md:text-6xl font-black text-white mb-8 leading-tight">Nuestras Sedes</h2>
                <p className="text-white/80 text-lg md:text-xl mb-14 leading-relaxed max-w-lg">Cubrimos las zonas más importantes de la región, brindando un servicio local, cercano y altamente personalizado a tus necesidades.</p>
                <div className="flex flex-wrap gap-3">
                  {SEDES.map((sede, index) => (
                    <button key={index} onMouseEnter={() => setSedeActiva(index)} onClick={() => setSedeActiva(index)} className={`px-6 py-3 rounded-full flex items-center gap-2 text-sm font-semibold transition-all duration-300 border ${sedeActiva === index ? 'bg-roma-leaf border-roma-leaf text-white shadow-[0_0_15px_rgba(91,138,97,0.4)]' : 'bg-black/20 border-white/10 text-white/70 hover:border-white/30 hover:text-white'}`}>
                      <span className="material-icons text-inherit text-sm">location_on</span>
                      {sede.nombre}
                    </button>
                  ))}
                </div>
              </motion.div>

              <motion.div variants={fadeRight} className="w-full lg:w-[40%]">
                <div className="h-[450px] rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl relative bg-black/20 p-2">
                  <iframe src={SEDES[sedeActiva].url} className="w-full h-full rounded-2xl border-0 opacity-80 mix-blend-luminosity hover:mix-blend-normal hover:opacity-100 transition-all duration-500" loading="lazy" referrerPolicy="no-referrer-when-downgrade" title={`Mapa de ${SEDES[sedeActiva].nombre}`} />
                </div>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* ═══ NUESTRAS RAÍCES ═══ */}
        <section id="equipo" className="relative z-10 pt-40 pb-40 px-6 min-h-screen flex flex-col justify-center">
          <motion.div className="relative z-10 max-w-7xl mx-auto w-full" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={stagger}>
            <div className="flex flex-col lg:flex-row gap-16 items-center">

              {/* Izquierdo: Collage de fotos */}
              <motion.div variants={fadeLeft} className="w-full lg:w-[50%] grid grid-cols-2 grid-rows-2 gap-4 h-[500px]">
                <div className="col-span-2 row-span-1 md:col-span-1 md:row-span-2 rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl relative">
                  <img src="/fondoRoma.png" alt="Roma Campo Principal" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/10" />
                </div>
                <div className="rounded-[1.5rem] overflow-hidden border border-white/10 shadow-xl relative">
                  <img src="/fondoRoma.png" alt="Roma Propiedades" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/10" />
                </div>
                <div className="rounded-[1.5rem] overflow-hidden border border-white/10 shadow-xl relative">
                  <img src="/fondoRoma.png" alt="Roma Equipo" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/10" />
                </div>
              </motion.div>

              {/* Derecho: Texto Marketing */}
              <motion.div variants={fadeRight} className="w-full lg:w-[50%] lg:pl-10 text-left">
                <p className="text-roma-leaf text-sm font-semibold uppercase tracking-[0.25em] mb-4">Nuestros cimientos</p>
                <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">Raíces que <span className="text-roma-leaf">trascienden.</span></h2>
                <p className="text-white/80 text-lg md:text-xl mb-6 leading-relaxed">
                  Roma surge de la necesidad de devolver la confianza al mercado inmobiliario. Nacimos en la Patagonia con una visión clara: transformar cada operación en una relación a largo plazo.
                </p>
                <p className="text-white/60 text-base md:text-lg mb-10 leading-relaxed">
                  Para nosotros, un campo o una propiedad no es solo un terreno; es el escenario donde construirás tu futuro. Por eso, acompañamos a cada cliente con la honestidad y el arraigo que solo nuestra tierra puede inspirar.
                </p>

                <div className="flex gap-10">
                  <div>
                    <h3 className="text-4xl font-black text-white">10+</h3>
                    <p className="text-roma-leaf text-xs uppercase font-bold tracking-widest mt-1">Años en la región</p>
                  </div>
                  <div>
                    <h3 className="text-4xl font-black text-white">500+</h3>
                    <p className="text-roma-leaf text-xs uppercase font-bold tracking-widest mt-1">Operaciones de éxito</p>
                  </div>
                </div>
              </motion.div>

            </div>
          </motion.div>
        </section>
      </div>

      {/* ═══ FOOTER ═══ */}
      <footer className="bg-roma-dark text-white py-20 px-6 border-t border-white/5 relative z-20">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <img src="/logo-blanco.png" alt="Logo Roma" className="w-44 h-auto mb-6" />
            <p className="text-white/50 text-sm max-w-md leading-relaxed">
              En Roma Inmobiliaria, nos especializamos en la venta, alquiler y gestión de propiedades urbanas y rurales en la Patagonia, ofreciendo un trato cercano y profesional.
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
        <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-white/5 text-center text-white/30 text-xs">
          © {new Date().getFullYear()} Roma Inmobiliaria. Todos los derechos reservados.
        </div>
      </footer>
    </div>
  );
}