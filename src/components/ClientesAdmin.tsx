import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { PlusCircle, Pencil, Trash2, X, Users, Phone, MapPin, AlignLeft } from 'lucide-react';

export default function ClientesAdmin({ mostrarToast }: { mostrarToast: (texto: string, tipo?: 'success' | 'error') => void }) {
  const [clientes, setClientes] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [clienteEditando, setClienteEditando] = useState<any>(null);

  // Form states
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [telefono, setTelefono] = useState('');
  const [origen, setOrigen] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    fetchClientes();
  }, []);

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
    if (cliente) {
      setClienteEditando(cliente);
      setNombre(cliente.nombre || '');
      setApellido(cliente.apellido || '');
      setTelefono(cliente.telefono || '');
      setOrigen(cliente.origen || '');
      setDescripcion(cliente.descripcion || '');
    } else {
      setClienteEditando(null);
      setNombre('');
      setApellido('');
      setTelefono('');
      setOrigen('');
      setDescripcion('');
    }
    setIsFormOpen(true);
  };

  const cerrarFormulario = () => {
    setIsFormOpen(false);
    setClienteEditando(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim() || !apellido.trim()) {
      mostrarToast('Nombre y apellido son obligatorios', 'error');
      return;
    }

    setGuardando(true);
    const payload = {
      nombre,
      apellido,
      telefono,
      origen,
      descripcion
    };

    let error;
    if (clienteEditando) {
      const { error: updateError } = await supabase
        .from('clientes')
        .update(payload)
        .eq('id', clienteEditando.id);
      error = updateError;
    } else {
      const { error: insertError } = await supabase
        .from('clientes')
        .insert([payload]);
      error = insertError;
    }

    setGuardando(false);

    if (error) {
      console.error('Error saving cliente:', error);
      mostrarToast('Error al guardar cliente', 'error');
    } else {
      mostrarToast(clienteEditando ? 'Cliente actualizado' : 'Cliente guardado');
      cerrarFormulario();
      fetchClientes();
    }
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

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-roma-leaf/30 backdrop-blur-md p-6 rounded-[24px] border border-white/10 shadow-sm">
        <div>
          <h1 className="text-[28px] font-black text-white tracking-tight flex items-center gap-3">
            <Users className="text-white/80" size={32} />
            Gestión de Clientes
          </h1>
          <p className="text-white/60 font-medium mt-1">
            Agenda de contactos y notas para repesca.
          </p>
        </div>
        <button 
          onClick={() => abrirFormulario()}
          className="flex items-center gap-2 bg-white hover:bg-white/90 text-roma-dark font-bold py-3.5 px-6 rounded-2xl shadow-lg transition-all hover:-translate-y-0.5 active:translate-y-0"
        >
          <PlusCircle className="h-5 w-5" />
          Nuevo Cliente
        </button>
      </div>

      <div className="bg-roma-leaf/30 backdrop-blur-md border border-white/10 rounded-[28px] shadow-sm overflow-hidden p-6">
        {cargando ? (
          <div className="text-center py-12 text-white/40 font-medium">Cargando clientes...</div>
        ) : clientes.length === 0 ? (
          <div className="text-center py-12 text-white/40 font-medium flex flex-col items-center gap-3">
            <Users size={48} className="text-white/20" />
            No hay clientes registrados.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clientes.map(cliente => (
              <div key={cliente.id} className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-white/30 hover:bg-white/10 transition-all group relative">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-bold text-white text-lg">{cliente.nombre} {cliente.apellido}</h3>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => abrirFormulario(cliente)} className="text-white/40 hover:text-white"><Pencil size={18} /></button>
                    <button onClick={() => handleBorrar(cliente.id)} className="text-white/40 hover:text-red-400"><Trash2 size={18} /></button>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {cliente.telefono && (
                    <div className="flex items-center gap-2 text-sm text-white/70 font-medium">
                      <Phone size={16} className="text-white/40" /> {cliente.telefono}
                    </div>
                  )}
                  {cliente.origen && (
                    <div className="flex items-center gap-2 text-sm text-white/70 font-medium">
                      <MapPin size={16} className="text-white/40" /> {cliente.origen}
                    </div>
                  )}
                  {cliente.descripcion && (
                    <div className="flex items-start gap-2 text-sm text-white/60 bg-black/20 p-3 rounded-xl border border-white/5 mt-2">
                      <AlignLeft size={16} className="text-white/40 shrink-0 mt-0.5" /> 
                      <span className="line-clamp-3">{cliente.descripcion}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={cerrarFormulario}></div>
          <div className="relative bg-roma-olive border border-white/10 w-full max-w-2xl rounded-[32px] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
            <div className="p-6 sm:p-8 border-b border-white/10 flex justify-between items-center bg-black/20">
              <h2 className="text-2xl font-black text-white flex items-center gap-3">
                <Users className="text-white/80" />
                {clienteEditando ? 'Editar Cliente' : 'Nuevo Cliente'}
              </h2>
              <button onClick={cerrarFormulario} className="p-2 bg-white/10 text-white/50 hover:text-white hover:bg-white/20 rounded-full border border-white/10 shadow-sm transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 sm:p-8 overflow-y-auto">
              <form id="cliente-form" onSubmit={handleSubmit} className="space-y-6">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-white/60 uppercase tracking-wider">Nombre</label>
                    <input 
                      type="text" 
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      required
                      className="w-full bg-black/20 border border-white/10 text-white placeholder-white/30 text-sm rounded-xl focus:ring-white/30 focus:border-white/30 block p-3.5 transition-colors outline-none"
                      placeholder="Ej. Juan"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-white/60 uppercase tracking-wider">Apellido</label>
                    <input 
                      type="text" 
                      value={apellido}
                      onChange={(e) => setApellido(e.target.value)}
                      required
                      className="w-full bg-black/20 border border-white/10 text-white placeholder-white/30 text-sm rounded-xl focus:ring-white/30 focus:border-white/30 block p-3.5 transition-colors outline-none"
                      placeholder="Ej. Pérez"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-white/60 uppercase tracking-wider">Teléfono</label>
                    <input 
                      type="text" 
                      value={telefono}
                      onChange={(e) => setTelefono(e.target.value)}
                      className="w-full bg-black/20 border border-white/10 text-white placeholder-white/30 text-sm rounded-xl focus:ring-white/30 focus:border-white/30 block p-3.5 transition-colors outline-none"
                      placeholder="Ej. +54 9 11 1234-5678"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-white/60 uppercase tracking-wider">De dónde es (Origen)</label>
                    <input 
                      type="text" 
                      value={origen}
                      onChange={(e) => setOrigen(e.target.value)}
                      className="w-full bg-black/20 border border-white/10 text-white placeholder-white/30 text-sm rounded-xl focus:ring-white/30 focus:border-white/30 block p-3.5 transition-colors outline-none"
                      placeholder="Ej. Bahía Blanca"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-white/60 uppercase tracking-wider">Descripción / Notas (Repesca)</label>
                  <textarea 
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    rows={4}
                    className="w-full bg-black/20 border border-white/10 text-white placeholder-white/30 text-sm rounded-xl focus:ring-white/30 focus:border-white/30 block p-3.5 transition-colors resize-none outline-none"
                    placeholder="Anotar detalles, intereses del cliente, presupuesto, zona buscada, etc."
                  />
                </div>
              </form>
            </div>

            <div className="p-6 sm:p-8 border-t border-white/10 bg-black/20 flex justify-end gap-3">
              <button 
                type="button" 
                onClick={cerrarFormulario}
                className="px-6 py-3.5 rounded-xl font-bold text-white bg-white/10 border border-white/20 hover:bg-white/20 transition-colors"
              >
                Cancelar
              </button>
              <button 
                type="submit"
                form="cliente-form"
                disabled={guardando}
                className="px-8 py-3.5 rounded-xl font-bold text-roma-dark bg-white hover:bg-white/90 shadow-lg transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100"
              >
                {guardando ? 'Guardando...' : 'Guardar Cliente'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
