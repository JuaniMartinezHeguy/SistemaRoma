import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { PlusCircle, Pencil, Trash2, Users, Phone, MapPin, AlignLeft, Search, Building, Tag, FilterX, ArrowUpDown, LayoutGrid, Table } from 'lucide-react';
import FormularioClienteModal from '@/components/FormularioClienteModal';

export default function ClientesAdmin({ mostrarToast, autoOpenForm }: { mostrarToast: (texto: string, tipo?: 'success' | 'error') => void; autoOpenForm?: boolean }) {
  const [clientes, setClientes] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [clienteEditando, setClienteEditando] = useState<any>(null);

  // Filter & Sort states
  const [busqueda, setBusqueda] = useState('');
  const [filtroUbicacion, setFiltroUbicacion] = useState('Todas');
  const [filtroTipoPropiedad, setFiltroTipoPropiedad] = useState('Todos');
  const [filtroOperacion, setFiltroOperacion] = useState('Todas');
  const [ordenar, setOrdenar] = useState<'recientes' | 'antiguos'>('recientes');
  const [vistaMode, setVistaMode] = useState<'cards' | 'tabla'>('cards');

  useEffect(() => {
    fetchClientes();
    if (autoOpenForm) {
      abrirFormulario();
    }
  }, [autoOpenForm]);

  const fetchClientes = async () => {
    setCargando(true);
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching clientes:', error);
      mostrarToast('Error al cargar clientes', 'error');
    } else {
      setClientes(data || []);
    }
    setCargando(false);
  };

  const abrirFormulario = (cliente?: any) => {
    setClienteEditando(cliente || null);
    setIsFormOpen(true);
  };

  const cerrarFormulario = () => {
    setIsFormOpen(false);
    setClienteEditando(null);
  };

  const handleBorrar = async (id: number) => {
    if (window.confirm('¿Estás seguro de eliminar este cliente?')) {
      const { error } = await supabase
        .from('clientes')
        .delete()
        .eq('id', id);

      if (error) {
        mostrarToast('Error al eliminar cliente', 'error');
      } else {
        mostrarToast('Cliente eliminado');
        fetchClientes();
      }
    }
  };

  const limpiarFiltros = () => {
    setBusqueda('');
    setFiltroUbicacion('Todas');
    setFiltroTipoPropiedad('Todos');
    setFiltroOperacion('Todas');
    setOrdenar('recientes');
  };

  const hayFiltros = busqueda.trim() !== '' || filtroUbicacion !== 'Todas' || filtroTipoPropiedad !== 'Todos' || filtroOperacion !== 'Todas' || ordenar !== 'recientes';

  // Extraer orígenes / ubicaciones únicas de los clientes
  const ubicacionesUnicas = Array.from(new Set(clientes.map(c => c.origen?.trim()).filter(Boolean)));

  // Filtrado inteligente
  const clientesFiltrados = clientes.filter(cliente => {
    const rawDesc = (cliente.descripcion || '').toLowerCase();
    const rawNombre = (cliente.nombre || '').toLowerCase();
    const rawApellido = (cliente.apellido || '').toLowerCase();
    const rawTelefono = (cliente.telefono || '').toLowerCase();
    const rawOrigen = (cliente.origen || '').toLowerCase();

    // 1. Buscador libre por texto
    if (busqueda.trim()) {
      const q = busqueda.toLowerCase().trim();
      const matchNombre = rawNombre.includes(q);
      const matchApellido = rawApellido.includes(q);
      const matchTelefono = rawTelefono.includes(q);
      const matchOrigen = rawOrigen.includes(q);
      const matchDesc = rawDesc.includes(q);

      if (!matchNombre && !matchApellido && !matchTelefono && !matchOrigen && !matchDesc) {
        return false;
      }
    }

    // 2. Filtro por Ubicación / Origen
    if (filtroUbicacion !== 'Todas') {
      const uLower = filtroUbicacion.toLowerCase();
      const matchOrigen = rawOrigen.includes(uLower);
      const matchDesc = rawDesc.includes(uLower);
      if (!matchOrigen && !matchDesc) return false;
    }

    // 3. Filtro por Tipo de Propiedad
    if (filtroTipoPropiedad !== 'Todos') {
      const tLower = filtroTipoPropiedad.toLowerCase();
      const matchTipo = (cliente.tipo_propiedad || '').toLowerCase().includes(tLower);
      let matchInDesc = false;
      if (tLower.includes('campo')) matchInDesc = rawDesc.includes('campo');
      else if (tLower.includes('terreno') || tLower.includes('lote')) matchInDesc = rawDesc.includes('terreno') || rawDesc.includes('lote');
      else if (tLower.includes('casa')) matchInDesc = rawDesc.includes('casa');
      else if (tLower.includes('depto') || tLower.includes('departamento')) matchInDesc = rawDesc.includes('depto') || rawDesc.includes('departamento');
      else if (tLower.includes('local')) matchInDesc = rawDesc.includes('local');
      else matchInDesc = rawDesc.includes(tLower);

      if (!matchTipo && !matchInDesc) return false;
    }

    // 4. Filtro por Operación
    if (filtroOperacion !== 'Todas') {
      const oLower = filtroOperacion.toLowerCase();
      const matchOp = (cliente.operacion || '').toLowerCase().includes(oLower);
      let matchInDesc = false;

      if (oLower === 'compra') {
        matchInDesc = rawDesc.includes('compra') || rawDesc.includes('comprar') || rawDesc.includes('busco comprar');
      } else if (oLower === 'venta') {
        matchInDesc = rawDesc.includes('venta') || rawDesc.includes('vender') || rawDesc.includes('quiere vender');
      } else if (oLower === 'alquiler') {
        matchInDesc = rawDesc.includes('alquiler') || rawDesc.includes('alquila') || rawDesc.includes('alquilar');
      } else if (oLower.includes('tasacion') || oLower.includes('tasación')) {
        matchInDesc = rawDesc.includes('tasacion') || rawDesc.includes('tasación') || rawDesc.includes('tasar');
      } else {
        matchInDesc = rawDesc.includes(oLower);
      }

      if (!matchOp && !matchInDesc) return false;
    }

    return true;
  });

  // Ordenamiento por más recientes o más antiguos
  clientesFiltrados.sort((a, b) => {
    const timeA = a.created_at ? new Date(a.created_at).getTime() : (a.id || 0);
    const timeB = b.created_at ? new Date(b.created_at).getTime() : (b.id || 0);
    return ordenar === 'recientes' ? timeB - timeA : timeA - timeB;
  });

  return (
    <div className="space-y-4 sm:space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl mx-auto">
      
      {/* ── ENCABEZADO DE GESTIÓN ── */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 bg-roma-leaf/30 backdrop-blur-md p-4 sm:p-6 rounded-[20px] sm:rounded-[24px] border border-white/10 shadow-sm">
        <div>
          <h1 className="text-xl sm:text-[28px] font-black text-white tracking-tight flex items-center gap-2.5">
            <Users className="text-white/80 shrink-0 h-6 w-6 sm:h-8 sm:w-8" />
            Gestión de Clientes
          </h1>
          <p className="text-xs sm:text-sm text-white/60 font-medium mt-1">
            Agenda de contactos, filtros por propiedad/operación y notas de repesca.
          </p>
        </div>
        
        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end">
          {/* CONMUTADOR DE VISTA (CARDS / EXCEL TABLA) */}
          <div className="flex items-center bg-black/40 p-1 rounded-2xl border border-white/15">
            <button
              onClick={() => setVistaMode('cards')}
              className={`flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                vistaMode === 'cards'
                  ? 'bg-white text-roma-dark shadow-md'
                  : 'text-white/60 hover:text-white'
              }`}
              title="Vista de Tarjetas"
            >
              <LayoutGrid size={15} />
              <span className="inline sm:inline">Tarjetas</span>
            </button>
            <button
              onClick={() => setVistaMode('tabla')}
              className={`flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                vistaMode === 'tabla'
                  ? 'bg-white text-roma-dark shadow-md'
                  : 'text-white/60 hover:text-white'
              }`}
              title="Vista de Tabla Excel"
            >
              <Table size={15} />
              <span className="inline sm:inline">Tabla</span>
            </button>
          </div>

          <button 
            onClick={() => abrirFormulario()}
            className="flex items-center justify-center gap-1.5 bg-white hover:bg-white/90 text-roma-dark font-bold py-2.5 sm:py-3.5 px-4 sm:px-6 rounded-2xl shadow-lg transition-all active:scale-95 cursor-pointer text-xs sm:text-sm whitespace-nowrap"
          >
            <PlusCircle className="h-4 w-4 sm:h-5 sm:w-5" />
            <span>Nuevo</span>
          </button>
        </div>
      </div>

      {/* ── BARRA DE FILTROS, ORDENAMIENTO Y BÚSQUEDA EN DESCRIPCIÓN ── */}
      <div className="bg-roma-leaf/25 backdrop-blur-md p-4 sm:p-6 rounded-[20px] sm:rounded-[24px] border border-white/10 shadow-sm space-y-3.5 sm:space-y-4">
        
        {/* BUSCADOR LIBRE POR PALABRAS EN DESCRIPCIÓN Y DATOS */}
        <div className="relative">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none" />
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar palabras en descripción, nombre, teléfono..."
            className="w-full bg-black/25 border border-white/15 rounded-xl sm:rounded-2xl pl-10 pr-9 py-2.5 sm:py-3 text-base sm:text-sm text-white placeholder:text-white/40 outline-none focus:border-white/40 transition-colors"
          />
          {busqueda && (
            <button
              onClick={() => setBusqueda('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white p-1 cursor-pointer"
            >
              <FilterX size={16} />
            </button>
          )}
        </div>

        {/* DROPDOWNS DE FILTROS Y ORDENAMIENTO (2 por fila en mobile) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
          
          {/* Ubicación / Origen */}
          <div>
            <label className="text-[10px] font-bold text-white/60 uppercase tracking-wider block mb-1 flex items-center gap-1">
              <MapPin size={11} /> Ubicación
            </label>
            <select
              value={filtroUbicacion}
              onChange={(e) => setFiltroUbicacion(e.target.value)}
              className="w-full bg-black/30 border border-white/15 text-white text-base sm:text-xs font-medium rounded-xl px-2.5 py-2.5 outline-none cursor-pointer focus:border-white/40 truncate"
            >
              <option value="Todas" className="bg-roma-dark text-white">Todas</option>
              {ubicacionesUnicas.map(u => (
                <option key={u} value={u} className="bg-roma-dark text-white">{u}</option>
              ))}
            </select>
          </div>

          {/* Tipo de Propiedad */}
          <div>
            <label className="text-[10px] font-bold text-white/60 uppercase tracking-wider block mb-1 flex items-center gap-1">
              <Building size={11} /> Propiedad
            </label>
            <select
              value={filtroTipoPropiedad}
              onChange={(e) => setFiltroTipoPropiedad(e.target.value)}
              className="w-full bg-black/30 border border-white/15 text-white text-base sm:text-xs font-medium rounded-xl px-2.5 py-2.5 outline-none cursor-pointer focus:border-white/40 truncate"
            >
              <option value="Todos" className="bg-roma-dark text-white">Todos</option>
              <option value="Casa" className="bg-roma-dark text-white">Casa</option>
              <option value="Departamento" className="bg-roma-dark text-white">Departamento</option>
              <option value="Campo" className="bg-roma-dark text-white">Campo</option>
              <option value="Terreno" className="bg-roma-dark text-white">Terreno / Lote</option>
              <option value="Local" className="bg-roma-dark text-white">Local</option>
            </select>
          </div>

          {/* Operación */}
          <div>
            <label className="text-[10px] font-bold text-white/60 uppercase tracking-wider block mb-1 flex items-center gap-1">
              <Tag size={11} /> Operación
            </label>
            <select
              value={filtroOperacion}
              onChange={(e) => setFiltroOperacion(e.target.value)}
              className="w-full bg-black/30 border border-white/15 text-white text-base sm:text-xs font-medium rounded-xl px-2.5 py-2.5 outline-none cursor-pointer focus:border-white/40 truncate"
            >
              <option value="Todas" className="bg-roma-dark text-white">Todas</option>
              <option value="Compra" className="bg-roma-dark text-white">Compra</option>
              <option value="Venta" className="bg-roma-dark text-white">Venta</option>
              <option value="Alquiler" className="bg-roma-dark text-white">Alquiler</option>
              <option value="Tasación" className="bg-roma-dark text-white">Tasación</option>
            </select>
          </div>

          {/* Ordenamiento */}
          <div>
            <label className="text-[10px] font-bold text-white/60 uppercase tracking-wider block mb-1 flex items-center gap-1">
              <ArrowUpDown size={11} /> Ordenar
            </label>
            <select
              value={ordenar}
              onChange={(e) => setOrdenar(e.target.value as 'recientes' | 'antiguos')}
              className="w-full bg-black/30 border border-white/15 text-white text-base sm:text-xs font-medium rounded-xl px-2.5 py-2.5 outline-none cursor-pointer focus:border-white/40 truncate"
            >
              <option value="recientes" className="bg-roma-dark text-white">Más recientes</option>
              <option value="antiguos" className="bg-roma-dark text-white">Más antiguos</option>
            </select>
          </div>
        </div>

        {/* CONTADOR Y LIMPIAR FILTROS */}
        <div className="flex items-center justify-between pt-1 border-t border-white/10 text-xs text-white/70">
          <span>
            Mostrando <strong className="text-white">{clientesFiltrados.length}</strong> de {clientes.length} clientes
          </span>

          {hayFiltros && (
            <button
              onClick={limpiarFiltros}
              className="text-white hover:underline text-xs font-medium flex items-center gap-1 cursor-pointer"
            >
              <FilterX size={14} /> Limpiar
            </button>
          )}
        </div>
      </div>

      {/* ── VISTA DE DATOS: CARDS O TABLA TIPO EXCEL ── */}
      <div className="bg-roma-leaf/30 backdrop-blur-md border border-white/10 rounded-[20px] sm:rounded-[28px] shadow-sm overflow-hidden p-4 sm:p-6">
        {cargando ? (
          <div className="text-center py-12 text-white/40 font-medium">Cargando clientes...</div>
        ) : clientesFiltrados.length === 0 ? (
          <div className="text-center py-12 text-white/40 font-medium flex flex-col items-center gap-3">
            <Users size={40} className="text-white/20" />
            <p className="text-sm">{hayFiltros ? 'No se encontraron clientes con los filtros aplicados.' : 'No hay clientes registrados.'}</p>
          </div>
        ) : vistaMode === 'tabla' ? (
          /* ── VISTA TABLA TIPO EXCEL (Scrollable en mobile) ── */
          <div className="overflow-x-auto rounded-xl sm:rounded-2xl border border-white/10 shadow-inner">
            <table className="w-full text-xs text-left border-collapse bg-black/25">
              <thead className="bg-black/50 text-white/70 uppercase tracking-wider text-[10px] sm:text-[11px] font-bold border-b border-white/15 select-none">
                <tr>
                  <th className="py-3 px-3.5 font-bold border-r border-white/10 whitespace-nowrap">Cliente</th>
                  <th className="py-3 px-3.5 font-bold border-r border-white/10 whitespace-nowrap">Teléfono</th>
                  <th className="py-3 px-3.5 font-bold border-r border-white/10 whitespace-nowrap">Origen / Zona</th>
                  <th className="py-3 px-3.5 font-bold border-r border-white/10 whitespace-nowrap">Tipo Propiedad</th>
                  <th className="py-3 px-3.5 font-bold border-r border-white/10 whitespace-nowrap">Operación</th>
                  <th className="py-3 px-3.5 font-bold border-r border-white/10 whitespace-nowrap">Notas / Descripción</th>
                  <th className="py-3 px-3.5 font-bold text-right whitespace-nowrap">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 text-white/90">
                {clientesFiltrados.map((cliente, idx) => (
                  <tr 
                    key={cliente.id} 
                    className={`hover:bg-white/10 transition-colors ${idx % 2 === 0 ? 'bg-white/[0.02]' : 'bg-transparent'}`}
                  >
                    <td className="py-3 px-3.5 font-bold text-white whitespace-nowrap border-r border-white/5">
                      {cliente.nombre} {cliente.apellido}
                    </td>
                    <td className="py-3 px-3.5 font-medium text-white/80 whitespace-nowrap border-r border-white/5">
                      {cliente.telefono || <span className="text-white/30">-</span>}
                    </td>
                    <td className="py-3 px-3.5 font-medium text-white/80 whitespace-nowrap border-r border-white/5">
                      {cliente.origen || <span className="text-white/30">-</span>}
                    </td>
                    <td className="py-3 px-3.5 font-medium whitespace-nowrap border-r border-white/5">
                      {cliente.tipo_propiedad ? (
                        <span className="bg-roma-leaf/40 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border border-roma-leaf/40">
                          {cliente.tipo_propiedad}
                        </span>
                      ) : (
                        <span className="text-white/30">-</span>
                      )}
                    </td>
                    <td className="py-3 px-3.5 font-medium whitespace-nowrap border-r border-white/5">
                      {cliente.operacion ? (
                        <span className="bg-white/10 text-white/90 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border border-white/15">
                          {cliente.operacion}
                        </span>
                      ) : (
                        <span className="text-white/30">-</span>
                      )}
                    </td>
                    <td className="py-3 px-3.5 font-normal text-white/70 min-w-[200px] max-w-xs border-r border-white/5" title={cliente.descripcion}>
                      <span className="line-clamp-2">{cliente.descripcion || '-'}</span>
                    </td>
                    <td className="py-3 px-3.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => abrirFormulario(cliente)}
                          className="p-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all cursor-pointer"
                          title="Editar"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => handleBorrar(cliente.id)}
                          className="p-1.5 bg-red-500/20 hover:bg-red-500/40 text-red-300 rounded-lg transition-all cursor-pointer"
                          title="Eliminar"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          /* ── VISTA DE TARJETAS (Ajustada para Mobile) ── */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {clientesFiltrados.map(cliente => (
              <div key={cliente.id} className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5 hover:border-white/30 hover:bg-white/10 transition-all group relative flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2.5">
                    <div>
                      <h3 className="font-bold text-white text-base sm:text-lg">{cliente.nombre} {cliente.apellido}</h3>
                      
                      {/* Badges de Operación y Tipo de Propiedad */}
                      <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                        {cliente.operacion && (
                          <span className="bg-white/10 text-white/90 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border border-white/10">
                            {cliente.operacion}
                          </span>
                        )}
                        {cliente.tipo_propiedad && (
                          <span className="bg-roma-leaf/40 text-white text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border border-roma-leaf/40">
                            {cliente.tipo_propiedad}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-1.5 shrink-0">
                      <button onClick={() => abrirFormulario(cliente)} className="text-white/60 hover:text-white p-1.5 bg-white/5 hover:bg-white/15 rounded-lg transition-colors cursor-pointer"><Pencil size={16} /></button>
                      <button onClick={() => handleBorrar(cliente.id)} className="text-white/60 hover:text-red-400 p-1.5 bg-white/5 hover:bg-red-500/20 rounded-lg transition-colors cursor-pointer"><Trash2 size={16} /></button>
                    </div>
                  </div>
                  
                  <div className="space-y-1.5 mt-2.5">
                    {cliente.telefono && (
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-white/70 font-medium">
                        <Phone size={14} className="text-white/40 shrink-0" /> {cliente.telefono}
                      </div>
                    )}
                    {cliente.origen && (
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-white/70 font-medium">
                        <MapPin size={14} className="text-white/40 shrink-0" /> {cliente.origen}
                      </div>
                    )}
                    {cliente.descripcion && (
                      <div className="flex items-start gap-2 text-xs sm:text-sm text-white/70 bg-black/20 p-2.5 sm:p-3 rounded-xl border border-white/5 mt-2">
                        <AlignLeft size={14} className="text-white/40 shrink-0 mt-0.5" />
                        <span className="line-clamp-4 leading-relaxed">{cliente.descripcion}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── MODAL FORMULARIO CLIENTE ── */}
      <FormularioClienteModal
        isOpen={isFormOpen}
        clienteEditando={clienteEditando}
        onClose={cerrarFormulario}
        onGuardadoExitoso={() => {
          cerrarFormulario();
          fetchClientes();
        }}
        mostrarToast={mostrarToast}
      />
    </div>
  );
}
