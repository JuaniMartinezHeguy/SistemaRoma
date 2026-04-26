import { useState } from 'react';
import { Link } from 'react-router-dom';
import { List, X } from "@phosphor-icons/react";

export default function Landing() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // ESTADO PARA CONTROLAR EL MAPA
  const [sedeActiva, setSedeActiva] = useState(0);

  // DATOS DE LAS SEDES Y SUS MAPAS
  const sedes = [
    { 
      nombre: "Villalonga", 
      url: "https://maps.google.com/maps?q=Villalonga,Buenos+Aires,Argentina&t=&z=14&ie=UTF8&iwloc=&output=embed" 
    },
    { 
      nombre: "Pedro Luro", 
      url: "https://maps.google.com/maps?q=Pedro+Luro,Buenos+Aires,Argentina&t=&z=14&ie=UTF8&iwloc=&output=embed" 
    },
    { 
      nombre: "San Blas", 
      url: "https://maps.google.com/maps?q=Bahia+San+Blas,Buenos+Aires,Argentina&t=&z=14&ie=UTF8&iwloc=&output=embed" 
    }
  ];

  return (
    <div className="text-gray-200 font-sans overflow-x-hidden relative">
      {/* FONDO GLOBAL */}
      <div className="fixed inset-0 bg-black/50 z-[-1]"></div>
      
      {/* ESTE DIV SIMULA EL BODY BACKGROUND */}
      <div 
        className="fixed inset-0 z-[-2] bg-black bg-cover bg-center bg-no-repeat bg-fixed" 
        style={{ backgroundImage: "url('/fondoRoma.png')" }}
      ></div>

      {/* HEADER / NAVBAR */}
      <header className="fixed top-0 w-full z-50 bg-black/20 backdrop-blur-md border-b border-white/10 transition-all">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex-1 flex justify-start h-full items-center overflow-hidden">
            <a href="#inicio" className="flex items-center group">
              <img 
                src="/logo-blanco.png" 
                alt="Roma Inmobiliaria" 
                className="w-28 md:w-36 h-auto scale-110 origin-left object-contain group-hover:opacity-80 transition-opacity" 
              />
            </a>
          </div>

          <nav className="hidden md:flex flex-1 justify-center items-center gap-8">
            <a href="#servicios" className="text-sm font-medium text-gray-300 hover:text-white transition">Info</a>
            <a href="#ubicaciones" className="text-sm font-medium text-gray-300 hover:text-white transition">Sedes</a>
            <a href="#equipo" className="text-sm font-medium text-gray-300 hover:text-white transition">Equipo</a>
          </nav>

          <div className="hidden md:flex flex-1 justify-end">
            <Link to="/propiedades" className="bg-[#00d15b] text-black px-6 py-2.5 rounded-full text-sm font-bold hover:scale-105 transition-transform shadow-[0_0_15px_rgba(0,209,91,0.3)]">
              Ver Propiedades
            </Link>
          </div>

          <div className="md:hidden flex flex-1 justify-end">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-white focus:outline-none p-2">
              {mobileMenuOpen ? <X size={32} /> : <List size={32} />}
            </button>
          </div>
        </div>

        {/* MENU MOVIL */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-20 left-0 w-full bg-black/95 backdrop-blur-xl border-b border-white/10 flex flex-col items-center py-8 gap-6 shadow-2xl">
            <a href="#servicios" onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium text-gray-300 hover:text-white">Info</a>
            <a href="#ubicaciones" onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium text-gray-300 hover:text-white">Sedes</a>
            <a href="#equipo" onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium text-gray-300 hover:text-white">Equipo</a>
            <Link to="/propiedades" className="bg-[#00d15b] text-black px-8 py-3 rounded-full text-base font-bold mt-4 shadow-[0_0_15px_rgba(0,209,91,0.3)]">
              Ver Propiedades
            </Link>
          </div>
        )}
      </header>

      {/* REDES SOCIALES FLOTANTES (PC) */}
      <div className="hidden md:flex fixed right-4 top-1/2 -translate-y-1/2 z-50 flex-col gap-3">
        <a href="https://www.facebook.com/romainmobiliaria.arg/?locale=es_LA" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-[#00d15b] transition-all shadow-lg">
          <i className="fab fa-facebook-f text-sm"></i>
        </a>
        <a href="https://www.tiktok.com/@romainmobiliaria" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-[#00d15b] transition-all shadow-lg">
          <i className="fab fa-tiktok text-sm"></i>
        </a>
        <a href="https://wa.me/5492920123456" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-[#00d15b] transition-all shadow-lg">
          <i className="fab fa-whatsapp text-sm"></i>
        </a>
        <a href="https://www.instagram.com/romainmobiliaria" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-[#00d15b] transition-all shadow-lg">
          <i className="fab fa-instagram text-sm"></i>
        </a>
      </div>

      {/* WHATSAPP FLOTANTE (MÓVIL) */}
      <div className="md:hidden fixed bottom-6 right-6 z-50">
        <a href="https://wa.me/5492920123456" target="_blank" rel="noopener noreferrer" className="w-14 h-14 bg-[#00d15b] rounded-full flex items-center justify-center text-black shadow-[0_0_15px_rgba(0,209,91,0.4)] animate-bounce">
          <i className="fab fa-whatsapp text-3xl"></i>
        </a>
      </div>

  {/* SECCIÓN INICIO */}
      <section id="inicio" className="min-h-screen flex flex-col items-center justify-center pt-16 px-6">
        <div className="text-center max-w-4xl mx-auto flex flex-col items-center">
          
          {/* Contenedor del Logo */}
          <div className="w-full flex justify-center">
            {/* Agregamos translate-x-3 y md:translate-x-5 para empujarlo a la derecha y centrarlo ópticamente */}
            <img 
              src="/logo-blanco.png" 
              alt="Logo Roma Inmobiliaria" 
              className="w-80 md:w-[480px] lg:w-[520px] translate-x-3 md:translate-x-5 drop-shadow-2xl hover:scale-105 transition-transform duration-500" 
            />
          </div>

          <div className="max-w-2xl -mt-4 md:-mt-8 lg:-mt-12 relative z-10">
            <p className="text-lg md:text-xl text-gray-200 font-light leading-relaxed drop-shadow-md px-4">
              Especialistas en la venta, alquiler y gestión de propiedades urbanas y rurales.
              Con más de una década de experiencia, brindamos soluciones de alta calidad.
            </p>
          </div>
          <div className="mt-10">
            <Link to="/propiedades" className="inline-block bg-white text-black px-10 py-3.5 rounded-full font-bold text-lg hover:bg-gray-200 transition-all shadow-[0_0_25px_rgba(255,255,255,0.2)] active:scale-95">
              Explorar Inversiones
            </Link>
          </div>
        </div>
      </section>

      {/* SECCIÓN SERVICIOS */}
      <section id="servicios" className="py-24 px-6 border-t border-white/10 bg-black/40 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Nuestro Servicio</h2>
            <p className="text-gray-400 text-sm">Ofrecemos soluciones integrales para cada necesidad habitacional y de inversión.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: "ph-house", title: "Propiedades", desc: "Venta y alquiler de casas y departamentos urbanos." },
              { icon: "ph-tractor", title: "Campos", desc: "Extensiones agrícolas y ganaderas de alto rendimiento." },
              { icon: "ph-map-trifold", title: "Terrenos", desc: "Lotes listos para escriturar y construir." },
              { icon: "ph-drone", title: "Todo desde arriba", desc: "Visualizá tu próximo campo o terreno desde los cielos." },
              { icon: "ph-jeep", title: "Recorré con nosotros", desc: "Agendá una cita y vení a conocer tu próximo lote." },
              { icon: "ph-globe-hemisphere-west", title: "Nuestra Web", desc: "Conocé nuestro catálogo de propiedades online." }
            ].map((srv, idx) => (
              <div key={idx} className="bg-black/60 backdrop-blur-md border border-white/10 p-8 rounded-2xl hover:-translate-y-2 transition-transform duration-300">
                <div className="mb-6 text-[#00d15b] flex items-center">
                  <i className={`ph-fill ${srv.icon} text-[42px]`}></i>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{srv.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{srv.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECCIÓN NUESTRAS SEDES (MODIFICADA) */}
      {/* SECCIÓN NUESTRAS SEDES */}
      <section id="ubicaciones" className="py-24 px-6 border-t border-white/10 bg-black/40 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">Nuestras Sedes</h2>
              <p className="text-gray-400 text-sm mb-10 leading-relaxed">
                Cubrimos las zonas más importantes de la región, brindando un servicio local y cercano.
              </p>
              
              <div className="flex flex-wrap gap-3">
                {sedes.map((sede, index) => (
                  <button 
                    key={index}
                    onClick={() => setSedeActiva(index)}
                    className={`px-5 py-2.5 rounded-full flex items-center gap-2 text-sm font-bold transition-all duration-300 border ${
                      sedeActiva === index 
                        ? "bg-[#00d15b] border-[#00d15b] text-black shadow-[0_0_15px_rgba(0,209,91,0.4)]" 
                        : "bg-black/60 border-white/10 text-gray-300 hover:border-[#00d15b] hover:text-white"
                    }`}
                  >
                    <span className="material-icons text-inherit text-sm">location_on</span> 
                    {sede.nombre}
                  </button>
                ))}
              </div>
            </div>

            {/* CONTENEDOR DEL MAPA DINÁMICO (AHORA EN DARK MODE) */}
            <div className="h-[350px] rounded-2xl overflow-hidden border border-white/10 bg-black/90 shadow-2xl relative">
              {/* Icono de carga sutil por detrás del iframe */}
              <div className="absolute inset-0 flex items-center justify-center -z-10">
                 <span className="material-icons text-5xl text-[#00d15b]/30 animate-pulse">public</span>
              </div>
              
              <iframe 
                src={sedes[sedeActiva].url}
                /* ACÁ ESTÁ LA MAGIA: El filter invert(90%) hue-rotate(180deg) hace el modo oscuro perfecto */
                style={{ filter: "invert(90%) hue-rotate(180deg) brightness(95%) contrast(110%)" }}
                className="w-full h-full border-0 opacity-90 hover:opacity-100 transition-opacity duration-500"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={`Mapa de ${sedes[sedeActiva].nombre}`}
              ></iframe>
            </div>

          </div>
        </div>
      </section>

      {/* SECCIÓN EQUIPO */}
      <section id="equipo" className="py-24 px-6 border-t border-white/10 bg-black/40 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-2">Nuestro Equipo</h2>
            <p className="text-gray-400 text-sm">Siempre disponibles para brindarte la mejor experiencia.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: "person", name: "Rodrigo", role: "Fundador y Jefe" },
              { icon: "person", name: "Marina", role: "Secretaria" },
              { icon: "support_agent", name: "Elena", role: "Marketing" },
              { icon: "handshake", name: "Maira", role: "Vendedora" }
            ].map((member, idx) => (
              <div key={idx} className="text-center">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full mx-auto mb-5 flex items-center justify-center border border-white/10 bg-black/60 backdrop-blur-md">
                  <span className="material-icons text-[60px] text-gray-500 opacity-40">{member.icon}</span>
                </div>
                <h4 className="text-lg font-bold text-white">{member.name}</h4>
                <p className="text-[#00d15b] text-[10px] font-bold uppercase mt-1">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-black/80 backdrop-blur-xl border-t border-white/10 text-white py-16 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-2 -ml-2 overflow-visible h-16">
              <img src="/logo-blanco.png" alt="Logo Roma" className="w-44 md:w-52 h-auto scale-125 origin-left object-contain" />
            </div>
            <p className="text-gray-400 text-sm max-w-md mb-8 leading-relaxed">
              En Roma Inmobiliaria, nos especializamos en la venta, alquiler y gestión de propiedades urbanas y rurales.
            </p>
          </div>
          <div>
            <h5 className="font-bold mb-4 text-[#00d15b] text-xs uppercase tracking-wider">Contacto</h5>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li className="flex items-center gap-2"><span className="material-icons text-base">call</span> +54 9 2920 123456</li>
              <li className="flex items-center gap-2"><span className="material-icons text-base">mail</span> info@romainmo.com.ar</li>
              <li className="flex items-center gap-2"><span className="material-icons text-base">location_on</span> Villalonga, Buenos Aires</li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold mb-4 text-[#00d15b] text-xs uppercase tracking-wider">Navegación</h5>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li><a href="#inicio" className="hover:text-white transition">Info</a></li>
              <li><a href="#servicios" className="hover:text-white transition">Servicios</a></li>
              <li><Link to="/propiedades" className="hover:text-white transition">Propiedades</Link></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}