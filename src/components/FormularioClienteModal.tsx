import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Users, X } from 'lucide-react';

interface FormularioClienteModalProps {
  isOpen: boolean;
  clienteEditando?: any;
  onClose: () => void;
  onGuardadoExitoso: () => void;
  mostrarToast: (texto: string, tipo?: 'success' | 'error') => void;
}

export default function FormularioClienteModal({
  isOpen,
  clienteEditando,
  onClose,
  onGuardadoExitoso,
  mostrarToast,
}: FormularioClienteModalProps) {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [telefono, setTelefono] = useState('');
  const [origen, setOrigen] = useState('');
  const [tipoPropiedad, setTipoPropiedad] = useState('');
  const [operacion, setOperacion] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    if (clienteEditando) {
      setNombre(clienteEditando.nombre || '');
      setApellido(clienteEditando.apellido || '');
      setTelefono(clienteEditando.telefono || '');
      setOrigen(clienteEditando.origen || '');
      setTipoPropiedad(clienteEditando.tipo_propiedad || '');
      setOperacion(clienteEditando.operacion || '');
      setDescripcion(clienteEditando.descripcion || '');
    } else {
      setNombre('');
      setApellido('');
      setTelefono('');
      setOrigen('');
      setTipoPropiedad('');
      setOperacion('');
      setDescripcion('');
    }
  }, [clienteEditando, isOpen]);

  if (!isOpen) return null;

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
      tipo_propiedad: tipoPropiedad,
      operacion,
      descripcion,
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
      onGuardadoExitoso();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-roma-olive border border-white/15 w-full max-w-2xl rounded-[28px] sm:rounded-[32px] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300 flex flex-col max-h-[92vh] my-auto">

        {/* ENCABEZADO */}
        <div className="p-5 sm:p-7 border-b border-white/10 flex justify-between items-center bg-black/20 shrink-0">
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2.5">
            <Users className="text-white/80 h-6 w-6 sm:h-7 sm:w-7" />
            {clienteEditando ? 'Editar Cliente' : 'Nuevo Cliente'}
          </h2>
          <button onClick={onClose} className="p-2 bg-white/10 text-white/60 hover:text-white hover:bg-white/20 rounded-full border border-white/10 transition-colors cursor-pointer">
            <X size={18} />
          </button>
        </div>

        {/* CUERPO FORMULARIO */}
        <div className="p-5 sm:p-8 overflow-y-auto space-y-4 sm:space-y-6">
          <form id="cliente-modal-form" onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-white/70 uppercase tracking-wider">Nombre *</label>
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                  className="w-full bg-black/25 border border-white/15 text-white placeholder-white/30 text-base sm:text-sm rounded-xl focus:ring-white/30 focus:border-white/30 block p-3 sm:p-3.5 transition-colors outline-none"
                  placeholder="Ej. Juan"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-white/70 uppercase tracking-wider">Apellido *</label>
                <input
                  type="text"
                  value={apellido}
                  onChange={(e) => setApellido(e.target.value)}
                  required
                  className="w-full bg-black/25 border border-white/15 text-white placeholder-white/30 text-base sm:text-sm rounded-xl focus:ring-white/30 focus:border-white/30 block p-3 sm:p-3.5 transition-colors outline-none"
                  placeholder="Ej. Pérez"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-white/70 uppercase tracking-wider">Teléfono</label>
                <input
                  type="text"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  className="w-full bg-black/25 border border-white/15 text-white placeholder-white/30 text-base sm:text-sm rounded-xl focus:ring-white/30 focus:border-white/30 block p-3 sm:p-3.5 transition-colors outline-none"
                  placeholder="Ej. +54 9 11 1234-5678"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-white/70 uppercase tracking-wider">De dónde es (Origen)</label>
                <input
                  type="text"
                  value={origen}
                  onChange={(e) => setOrigen(e.target.value)}
                  className="w-full bg-black/25 border border-white/15 text-white placeholder-white/30 text-base sm:text-sm rounded-xl focus:ring-white/30 focus:border-white/30 block p-3 sm:p-3.5 transition-colors outline-none"
                  placeholder="Ej. Bahía Blanca"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-white/70 uppercase tracking-wider">Tipo de Propiedad buscada</label>
                <select
                  value={tipoPropiedad}
                  onChange={(e) => setTipoPropiedad(e.target.value)}
                  className="w-full bg-black/25 border border-white/15 text-white text-base sm:text-sm rounded-xl focus:ring-white/30 focus:border-white/30 block p-3 sm:p-3.5 transition-colors outline-none cursor-pointer"
                >
                  <option value="" className="bg-roma-dark text-white">Sin especificar</option>
                  <option value="Casa" className="bg-roma-dark text-white">Casa</option>
                  <option value="Departamento" className="bg-roma-dark text-white">Departamento</option>
                  <option value="Campo" className="bg-roma-dark text-white">Campo</option>
                  <option value="Terreno" className="bg-roma-dark text-white">Terreno / Lote</option>
                  <option value="Local" className="bg-roma-dark text-white">Local Comercial</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-white/70 uppercase tracking-wider">Operación de interés</label>
                <select
                  value={operacion}
                  onChange={(e) => setOperacion(e.target.value)}
                  className="w-full bg-black/25 border border-white/15 text-white text-base sm:text-sm rounded-xl focus:ring-white/30 focus:border-white/30 block p-3 sm:p-3.5 transition-colors outline-none cursor-pointer"
                >
                  <option value="" className="bg-roma-dark text-white">Sin especificar</option>
                  <option value="Compra" className="bg-roma-dark text-white">Compra</option>
                  <option value="Venta" className="bg-roma-dark text-white">Venta</option>
                  <option value="Alquiler" className="bg-roma-dark text-white">Alquiler</option>
                  <option value="Tasación" className="bg-roma-dark text-white">Tasación</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-white/70 uppercase tracking-wider">Descripción / Notas (Repesca)</label>
              <textarea
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                rows={3}
                className="w-full bg-black/25 border border-white/15 text-white placeholder-white/30 text-base sm:text-sm rounded-xl focus:ring-white/30 focus:border-white/30 block p-3 sm:p-3.5 transition-colors resize-none outline-none"
                placeholder="Anotar detalles, intereses del cliente, presupuesto, zona buscada, etc. (El buscador encontrará cualquier palabra escrita aquí)"
              />
            </div>
          </form>
        </div>

        {/* PIE Y BOTONES */}
        <div className="p-4 sm:p-6 border-t border-white/10 bg-black/20 flex flex-col-reverse sm:flex-row justify-end gap-2.5 sm:gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-3 sm:py-3.5 rounded-xl font-bold text-white bg-white/10 border border-white/20 hover:bg-white/20 transition-colors cursor-pointer text-sm"
          >
            Cancelar
          </button>
          <button
            type="submit"
            form="cliente-modal-form"
            disabled={guardando}
            className="w-full sm:w-auto px-8 py-3 sm:py-3.5 rounded-xl font-bold text-roma-dark bg-white hover:bg-white/90 shadow-lg transition-all active:scale-95 disabled:opacity-50 cursor-pointer text-sm"
          >
            {guardando ? 'Guardando...' : 'Guardar Cliente'}
          </button>
        </div>
      </div>
    </div>
  );
}
