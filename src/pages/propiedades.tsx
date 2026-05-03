import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { 
  MapPin, WhatsappLogo, HouseLine, Tag, MapTrifold, CaretLeft, 
  CaretDown, X, Ruler, CaretRight, Info, Medal 
} from "@phosphor-icons/react";
import { Link } from 'react-router-dom';

export default function Catalogo() {
  const [propiedades, setPropiedades] = useState<any[]>([]);
  
  // Filtros
  const [filtroTipo, setFiltroTipo] = useState('Todos');
  const [filtroUbicacion, setFiltroUbicacion] = useState('Todas');
  const [filtroOperacion, setFiltroOperacion] = useState('Todas');
  const [dropdownAbierto, setDropdownAbierto] = useState<string | null>(null);

  // Modal
  const [propiedadActiva, setPropiedadActiva] = useState<any | null>(null);
  const [imagenIndex, setImagenIndex] = useState(0);

  // ESTADO DEL CARRUSEL DESTACADAS
  const [destacadaIndex, setDestacadaIndex] = useState(0);

  useEffect(() => {
    const fetchPropiedades = async () => {
      let query = supabase.from('propiedades').select('*');
      if (filtroTipo !== 'Todos') query = query.eq('tipo_propiedad', filtroTipo);
      if (filtroUbicacion !== 'Todas') query = query.eq('ubicacion', filtroUbicacion);
      if (filtroOperacion !== 'Todas') query = query.eq('operacion', filtroOperacion);

      const { data } = await query;
      if (data) setPropiedades(data);
    };
    fetchPropiedades();
  }, [filtroTipo, filtroUbicacion, filtroOperacion]);

  useEffect(() => {
    document.body.style.overflow = propiedadActiva ? 'hidden' : 'auto';
    return () => { document.body.style.overflow = 'auto'; };
  }, [propiedadActiva]);

  const toggleDropdown = (menu: string) => {
    setDropdownAbierto(dropdownAbierto === menu ? null : menu);
  };

  const abrirModal = (propiedad: any) => { setPropiedadActiva(propiedad); setImagenIndex(0); };
  const cerrarModal = () => setPropiedadActiva(null);

  const imagenesCarrusel = propiedadActiva?.imagenes || [propiedadActiva?.imagen_url];
  const nextImagen = (e: React.MouseEvent) => { e.stopPropagation(); setImagenIndex(p => p === imagenesCarrusel.length - 1 ? 0 : p + 1); };
  const prevImagen = (e: React.MouseEvent) => { e.stopPropagation(); setImagenIndex(p => p === 0 ? imagenesCarrusel.length - 1 : p - 1); };

  // Destacadas para el carrusel
  const propiedadesDestacadas = propiedades.filter(p => p.destacada);

  // LOGICA SCROLL AUTOMATICO (Cambia cada 6 segundos)
  useEffect(() => {
    if (propiedadesDestacadas.length <= 1) return;
    const interval = setInterval(() => {
      setDestacadaIndex((prev) => (prev === propiedadesDestacadas.length - 1 ? 0 : prev + 1));
    }, 6000);
    return () => clearInterval(interval);
  }, [propiedadesDestacadas.length]);

  // Funciones manuales para las flechas del carrusel de destacadas
  const nextDestacada = (e?: React.MouseEvent) => {
    if(e) e.stopPropagation();
    setDestacadaIndex((prev) => (prev === propiedadesDestacadas.length - 1 ? 0 : prev + 1));
  };
  const prevDestacada = (e?: React.MouseEvent) => {
    if(e) e.stopPropagation();
    setDestacadaIndex((prev) => (prev === 0 ? propiedadesDestacadas.length - 1 : prev - 1));
  };

  const tipos = ["Casa", "Campo", "Lote", "Terreno"];
  const ubicaciones = ["Villalonga", "Pedro Luro", "Stroeder", "San Blas", "Carmen de Patagones"];
  const operaciones = ["Venta", "Alquiler"];

  return (
    <div className="min-h-screen font-sans relative pb-32">
      
      {/* FONDO BASE */}
      <div className="fixed inset-0 z-[-2] bg-cover bg-center bg-no-repeat bg-fixed" style={{ backgroundImage: "url('/fondoRoma.png')" }}></div>
      <div className="fixed inset-0 bg-black/50 z-[-1]"></div> 

      {/* HEADER */}
      <header className="fixed top-0 w-full z-50 bg-black/20 backdrop-blur-md border-b border-white/10 h-20 flex items-center px-6 shadow-sm">
        <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 text-gray-300 hover:text-white font-bold transition-colors">
            <CaretLeft size={20} /> Volver al inicio
          </Link>
          <img src="/logo-blanco.png" alt="Roma" className="h-10 w-auto opacity-90" />
        </div>
      </header>

      <div className="max-w-7xl mx-auto pt-32 px-6">
        
        <div className="text-center max-w-3xl mx-auto mb-16 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <h1 className="text-5xl md:text-6xl font-black text-white tracking-tight mb-6">
            Catálogo Exclusivo
          </h1>
          <p className="text-lg md:text-xl text-gray-200 font-medium leading-relaxed">
            Invertí en las mejores zonas de la región. Calidad, ubicación y rendimiento en un solo lugar.
          </p>
        </div>

        {/* =========================================================
            1. CARRUSEL AUTOMÁTICO: PROPIEDADES DESTACADAS (DISEÑO DIVIDIDO)
            ========================================================= */}
        {propiedadesDestacadas.length > 0 && (
          <div className="mb-32 animate-in fade-in duration-1000 delay-100 relative">
            
            {/* Título Superior */}
            <div className="flex items-center justify-center gap-3 mb-10">
              <Medal size={32} className="text-[#6A804D]" weight="regular" />
              <h2 className="text-2xl md:text-3xl font-light text-white uppercase tracking-[0.15em]">
                Propiedades Destacadas
              </h2>
            </div>

            {/* Contenedor Principal del Carrusel */}
            <div className="relative w-full max-w-6xl mx-auto h-[500px] md:h-[450px] flex items-center justify-center">
              
              {/* Flecha Izquierda */}
              {propiedadesDestacadas.length > 1 && (
                <button 
                  onClick={prevDestacada} 
                  className="absolute left-0 md:-left-6 z-20 w-12 h-12 flex items-center justify-center bg-[#1a1a1a] hover:bg-[#6A804D] text-white hover:text-black rounded-full border border-white/10 transition-all duration-300 shadow-xl"
                >
                  <CaretLeft size={24} weight="bold" />
                </button>
              )}

              {/* Área de Visualización Dividida */}
              <div className="relative w-full h-full md:w-[92%] rounded-[32px] overflow-hidden shadow-2xl bg-[#161616] border border-white/5">
                {propiedadesDestacadas.map((prop, index) => (
                  <div 
                    key={prop.id}
                    className={`absolute inset-0 flex flex-col md:flex-row transition-opacity duration-1000 ${index === destacadaIndex ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}
                  >
                    {/* LADO IZQUIERDO: IMAGEN */}
                    <div className="w-full md:w-1/2 h-[50%] md:h-full relative overflow-hidden">
                      <img 
                        src={prop.imagen_url} 
                        alt={prop.titulo} 
                        className="w-full h-full object-cover transition-transform duration-1000 hover:scale-105" 
                      />
                      <div className="absolute top-6 left-6">
                        <span className="bg-[#6A804D] text-black text-[10px] font-black uppercase px-3 py-1.5 rounded-lg tracking-widest shadow-md">
                          {prop.operacion}
                        </span>
                      </div>
                    </div>
                    
                    {/* LADO DERECHO: INFORMACIÓN */}
                    <div className="w-full md:w-1/2 h-[50%] md:h-full p-8 md:p-12 flex flex-col justify-center relative bg-[#161616]">
                      <span className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-3 block">
                        {prop.tipo_propiedad}
                      </span>
                      
                      <h3 className="text-3xl md:text-4xl font-black text-white mb-6 line-clamp-2 leading-tight">
                        {prop.titulo}
                      </h3>
                      
                      <div className="text-4xl font-light text-white mb-8 tracking-tight">
                        <span className="text-[#6A804D] font-bold text-2xl mr-2">USD</span> 
                        {prop.precio.toLocaleString("es-AR")}
                      </div>
                      
                      <div className="flex flex-col gap-4 text-sm text-gray-300 font-medium mb-10">
                        <div className="flex items-center gap-4">
                          <Ruler size={24} className="text-[#6A804D]" /> 
                          <span>Superficie: {prop.dimensiones || "A consultar"}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <MapPin size={24} className="text-[#6A804D]" /> 
                          <span>Ubicación: {prop.ubicacion}</span>
                        </div>
                      </div>
                      
                      <button 
                        onClick={(e) => { e.stopPropagation(); abrirModal(prop); }} 
                        className="mt-auto w-full md:w-fit px-10 py-4 bg-[#6A804D] hover:bg-[#14b854] text-black rounded-xl font-black uppercase tracking-[0.2em] text-xs transition-all hover:scale-[1.02] shadow-lg shadow-green-900/20"
                      >
                        Ver Detalles
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Flecha Derecha */}
              {propiedadesDestacadas.length > 1 && (
                <button 
                  onClick={nextDestacada} 
                  className="absolute right-0 md:-right-6 z-20 w-12 h-12 flex items-center justify-center bg-[#1a1a1a] hover:bg-[#6A804D] text-white hover:text-black rounded-full border border-white/10 transition-all duration-300 shadow-xl"
                >
                  <CaretRight size={24} weight="bold" />
                </button>
              )}
            </div>

            {/* Píldoras de Paginación */}
            {propiedadesDestacadas.length > 1 && (
              <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex gap-3">
                {propiedadesDestacadas.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={(e) => { e.stopPropagation(); setDestacadaIndex(idx); }}
                    className={`h-1.5 rounded-full transition-all duration-500 ${idx === destacadaIndex ? 'w-10 bg-[#6A804D]' : 'w-4 bg-gray-600 hover:bg-gray-400'}`}
                  />
                ))}s
              </div>
            )}

          </div>
        )}

        {/* =========================================================
            2. CÁPSULA FLOTANTE DE FILTROS
            ========================================================= */}
        <div className="sticky top-24 z-40 bg-[#121212]/85 backdrop-blur-2xl border border-white/10 rounded-[32px] p-4 md:px-8 mb-12 shadow-2xl flex flex-wrap lg:flex-nowrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-bold text-gray-300 hidden md:block text-sm uppercase tracking-widest">Filtrar:</span>
            
            <div className="relative">
              <button onClick={() => toggleDropdown('tipo')} className="flex items-center gap-2 bg-[#1f1f1f] hover:bg-[#2a2a2a] border border-white/5 text-white px-4 py-2.5 rounded-2xl font-bold transition-colors text-xs uppercase tracking-wider">
                <HouseLine size={16} className="text-[#6A804D]" /> Tipo <CaretDown size={14} />
              </button>
              {dropdownAbierto === 'tipo' && (
                <div className="absolute top-full left-0 mt-3 w-48 bg-[#1f1f1f] border border-white/10 shadow-2xl rounded-2xl p-2 flex flex-col gap-1 z-50">
                  {tipos.map(t => (
                    <button key={t} onClick={() => { setFiltroTipo(t); setDropdownAbierto(null); }} className="text-left px-4 py-2 rounded-xl hover:bg-[#6A804D] hover:text-black text-white font-bold text-xs transition-colors">{t}</button>
                  ))}
                </div>
              )}
            </div>

            <div className="relative">
              <button onClick={() => toggleDropdown('ubicacion')} className="flex items-center gap-2 bg-[#1f1f1f] hover:bg-[#2a2a2a] border border-white/5 text-white px-4 py-2.5 rounded-2xl font-bold transition-colors text-xs uppercase tracking-wider">
                <MapTrifold size={16} className="text-[#6A804D]" /> Zona <CaretDown size={14} />
              </button>
              {dropdownAbierto === 'ubicacion' && (
                <div className="absolute top-full left-0 mt-3 w-56 bg-[#1f1f1f] border border-white/10 shadow-2xl rounded-2xl p-2 flex flex-col gap-1 z-50">
                  {ubicaciones.map(u => (
                    <button key={u} onClick={() => { setFiltroUbicacion(u); setDropdownAbierto(null); }} className="text-left px-4 py-2 rounded-xl hover:bg-[#6A804D] hover:text-black text-white font-bold text-xs transition-colors">{u}</button>
                  ))}
                </div>
              )}
            </div>

            <div className="relative hidden sm:block">
              <button onClick={() => toggleDropdown('operacion')} className="flex items-center gap-2 bg-[#1f1f1f] hover:bg-[#2a2a2a] border border-white/5 text-white px-4 py-2.5 rounded-2xl font-bold transition-colors text-xs uppercase tracking-wider">
                <Tag size={16} className="text-[#6A804D]" /> Operación <CaretDown size={14} />
              </button>
              {dropdownAbierto === 'operacion' && (
                <div className="absolute top-full left-0 mt-3 w-48 bg-[#1f1f1f] border border-white/10 shadow-2xl rounded-2xl p-2 flex flex-col gap-1 z-50">
                  {operaciones.map(o => (
                    <button key={o} onClick={() => { setFiltroOperacion(o); setDropdownAbierto(null); }} className="text-left px-4 py-2 rounded-xl hover:bg-[#6A804D] hover:text-black text-white font-bold text-xs transition-colors">{o}</button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-white bg-white/5 px-4 py-2 rounded-xl border border-white/5 uppercase tracking-widest">
              {propiedades.length} <span className="text-gray-500">Unidades</span>
            </span>
          </div>
        </div>

        {/* ETIQUETAS ACTIVAS */}
        {(filtroTipo !== 'Todos' || filtroUbicacion !== 'Todas' || filtroOperacion !== 'Todas') && (
          <div className="flex flex-wrap items-center gap-3 mb-10 -mt-4 pl-4 animate-in fade-in slide-in-from-top-4">
            {filtroTipo !== 'Todos' && (
              <div className="flex items-center gap-2 bg-[#6A804D] text-black px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-md"><HouseLine size={12}/> {filtroTipo} <button onClick={() => setFiltroTipo('Todos')} className="hover:scale-125 transition-transform"><X size={12} weight="bold" /></button></div>
            )}
            {filtroUbicacion !== 'Todas' && (
              <div className="flex items-center gap-2 bg-[#6A804D] text-black px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-md"><MapTrifold size={12}/> {filtroUbicacion} <button onClick={() => setFiltroUbicacion('Todas')} className="hover:scale-125 transition-transform"><X size={12} weight="bold" /></button></div>
            )}
            {filtroOperacion !== 'Todas' && (
              <div className="flex items-center gap-2 bg-[#6A804D] text-black px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-md"><Tag size={12}/> {filtroOperacion} <button onClick={() => setFiltroOperacion('Todas')} className="hover:scale-125 transition-transform"><X size={12} weight="bold" /></button></div>
            )}
            <button onClick={() => {setFiltroTipo('Todos'); setFiltroUbicacion('Todas'); setFiltroOperacion('Todas');}} className="text-gray-500 hover:text-[#6A804D] text-[10px] font-bold uppercase tracking-widest ml-2 transition-colors underline underline-offset-4">Limpiar todo</button>
          </div>
        )}

        {/* =========================================================
            3. GRILLA DE RESULTADOS 
            ========================================================= */}
        <h2 className="text-2xl font-black text-white mb-8 border-l-4 border-[#6A804D] pl-4 uppercase tracking-widest">Catálogo Completo</h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
          {propiedades.length > 0 ? propiedades.map((item) => (
            
            <div 
              key={item.id} 
              onClick={() => abrirModal(item)}
              className="group bg-[#1a1a1a] rounded-[24px] overflow-hidden border border-[#2a2a2a] shadow-xl hover:-translate-y-1 hover:shadow-2xl hover:border-[#6A804D] transition-all duration-300 flex flex-col cursor-pointer"
            >
              <div className="relative h-56 w-full overflow-hidden bg-black">
                <img src={item.imagen_url} alt={item.titulo} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100" />
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="bg-[#6A804D] text-black text-[10px] font-black uppercase px-3 py-1 rounded-lg tracking-widest shadow-md">{item.operacion}</span>
                  {item.destacada && <span className="bg-amber-400 text-black text-[10px] font-black uppercase px-3 py-1 rounded-lg tracking-widest shadow-md">Destacada</span>}
                </div>
              </div>

              <div className="p-6 pt-4 flex-1 flex flex-col relative text-white">
                <a 
                  href={`https://wa.me/5492920123456?text=Hola Roma Inmobiliaria, quiero consultar por esta propiedad: ${item.titulo} (ID: ${item.id})`} 
                  target="_blank" rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()} 
                  className="absolute -top-8 right-6 h-14 w-14 bg-[#6A804D] hover:bg-white text-black rounded-full flex items-center justify-center shadow-[0_4px_14px_rgba(0,209,91,0.4)] transition-all hover:scale-110 z-10"
                >
                  <WhatsappLogo size={28} weight="fill" />
                </a>

                <div className="mb-3 pr-12">
                  <span className="text-[#6A804D] text-[10px] font-bold uppercase tracking-widest mb-1.5 block">{item.tipo_propiedad}</span>
                  <h3 className="text-xl font-bold text-white leading-tight line-clamp-2">{item.titulo}</h3>
                </div>

                <div className="flex items-center gap-1.5 text-gray-400 text-sm mt-auto mb-4">
                  <MapPin size={16} className="text-[#6A804D]" /> {item.ubicacion}
                </div>
                
                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <span className="text-xl font-black text-white tracking-tight">USD {item.precio.toLocaleString("es-AR")}</span>
                </div>
              </div>
            </div>

          )) : (
            <div className="col-span-full py-24 flex flex-col items-center justify-center bg-[#1a1a1a]/30 backdrop-blur-xl rounded-[40px] border border-white/5 border-dashed">
              <HouseLine size={48} className="text-gray-700 mb-6" />
              <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-widest">Sin coincidencias</h3>
              <p className="text-gray-500 text-center max-w-md font-medium">Probá ajustando los filtros para encontrar tu propiedad ideal.</p>
            </div>
          )}
        </div>
      </div>

      {/* =========================================================
          MODAL DE DETALLE
          ========================================================= */}
      {propiedadActiva && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-8 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={cerrarModal}></div>
          <div className="relative w-full max-w-5xl bg-[#161616] border border-white/10 rounded-[40px] overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh] animate-in zoom-in-95 duration-300">
            
            <button onClick={cerrarModal} className="absolute top-6 right-6 z-50 bg-white/5 hover:bg-white/10 text-white p-2.5 rounded-full transition-all">
              <X size={20} weight="bold" />
            </button>
            
            <div className="w-full md:w-1/2 relative bg-black p-8 flex flex-col min-h-[400px] md:min-h-full">
              
              <div className="mb-6 flex gap-2">
                <span className="bg-[#6A804D] text-black text-[10px] font-black uppercase px-3 py-1.5 rounded-lg tracking-widest shadow-md">
                  {propiedadActiva.operacion}
                </span>
              </div>
              
              <div className="flex-1 w-full relative rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.8)]">
                <img 
                  src={imagenesCarrusel[imagenIndex]} 
                  alt={propiedadActiva.titulo} 
                  className="absolute inset-0 w-full h-full object-cover" 
                />
                
                {imagenesCarrusel.length > 1 && (
                  <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-4 px-10">
                    <button onClick={prevImagen} className="bg-black/50 hover:bg-[#6A804D] text-white hover:text-black p-3 rounded-full backdrop-blur-md transition-all"><CaretLeft size={20} weight="bold" /></button>
                    <button onClick={nextImagen} className="bg-black/50 hover:bg-[#6A804D] text-white hover:text-black p-3 rounded-full backdrop-blur-md transition-all"><CaretRight size={20} weight="bold" /></button>
                  </div>
                )}
              </div>

            </div>

            <div className="w-full md:w-1/2 flex flex-col overflow-y-auto custom-scrollbar bg-[#161616] p-10 relative">
              <span className="text-[#6A804D] text-[10px] font-black uppercase tracking-[0.3em] mb-3 block">{propiedadActiva.tipo_propiedad}</span>
              <h2 className="text-3xl md:text-4xl font-black text-white leading-tight mb-4 pr-12">{propiedadActiva.titulo}</h2>
              <div className="flex items-center gap-2 text-gray-500 text-xs font-black uppercase tracking-widest mb-8"><MapPin size={18} className="text-[#6A804D]" /> {propiedadActiva.ubicacion}</div>
              <div className="text-4xl font-black text-white tracking-tighter mb-10">USD {propiedadActiva.precio.toLocaleString("es-AR")}</div>

              {propiedadActiva.dimensiones && (
                <div className="bg-[#222222] border border-white/5 px-5 py-3 rounded-2xl flex items-center gap-4 w-fit mb-8">
                  <div className="bg-[#6A804D]/15 p-3 rounded-xl text-[#6A804D]"><Ruler size={22} weight="bold" /></div>
                  <div>
                     <span className="block text-gray-500 text-[10px] uppercase font-black tracking-widest">Superficie</span>
                     <span className="text-white font-bold text-base">{propiedadActiva.dimensiones}</span>
                  </div>
                </div>
              )}

              <div className="mb-10 flex-1">
                <h3 className="text-white text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2 mb-6 border-b border-white/5 pb-4"><Info size={18} className="text-[#6A804D]" /> Descripción</h3>
                <p className="text-gray-400 leading-relaxed text-sm whitespace-pre-wrap font-medium">{propiedadActiva.descripcion || "Consulte para recibir la ficha técnica completa y detalles específicos de esta propiedad única."}</p>
              </div>

              <a 
                href={`https://wa.me/5492920123456?text=Me interesa esta propiedad: *${propiedadActiva.titulo}* (ID: ${propiedadActiva.id})`} 
                target="_blank" rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-3 bg-[#6A804D] hover:bg-[#14b854] text-black px-8 py-4 rounded-xl font-black transition-all hover:scale-[1.02] uppercase tracking-widest text-sm mt-auto"
              >
                <WhatsappLogo size={24} weight="fill" /> Contactar Asesor
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}