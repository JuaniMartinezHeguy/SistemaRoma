import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Loader2, Save, Upload, MapPin, Type, DollarSign, Home, BedDouble, Bath, Ruler, Tractor } from 'lucide-react';

// ─── ESTADO INICIAL ────────────────────────────────────────────────────────────

const ESTADO_INICIAL = {
  tipo_propiedad: 'Casa',
  titulo: '',
  descripcion: '',
  precio: '',
  moneda: 'USD',
  operacion: 'Venta',
  ubicacion: '',
  habitaciones: '',
  banos: '',
  dimensiones: '',
  tipo_campo: 'Agricola',
  dimensiones_terreno: '',
  estado: 'publicado',
};

// ─── COMPONENTE ───────────────────────────────────────────────────────────────

export default function FormularioPropiedad({ onSubmit: onSubmitExterno, onCancelar, propiedadInicial = null }) {
  const [form, setForm] = useState(ESTADO_INICIAL);
  const [archivos, setArchivos] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (propiedadInicial) {
      setForm({
        tipo_propiedad: propiedadInicial.tipo_propiedad || '',
        titulo: propiedadInicial.titulo || '',
        descripcion: propiedadInicial.descripcion || '',
        precio: propiedadInicial.precio || '',
        moneda: propiedadInicial.moneda || 'USD',
        operacion: propiedadInicial.operacion || 'Venta',
        ubicacion: propiedadInicial.ubicacion || '',
        habitaciones: propiedadInicial.atributos_especificos?.habitaciones || propiedadInicial.habitaciones || '',
        banos: propiedadInicial.atributos_especificos?.banos || propiedadInicial.banos || '',
        dimensiones: propiedadInicial.atributos_especificos?.dimensiones || propiedadInicial.dimensiones || '',
        tipo_campo: propiedadInicial.atributos_especificos?.tipo_campo || 'Agricola',
        dimensiones_terreno: propiedadInicial.atributos_especificos?.dimensiones || '',
        estado: propiedadInicial.estado || 'publicado',
      });
    }
  }, [propiedadInicial]);

  const setField = (campo, valor) =>
    setForm((prev) => ({ ...prev, [campo]: valor }));

  const construirPayload = (mediaUrls = []) => {
    const { tipo_propiedad } = form;
    let atributos_especificos = {};

    if (tipo_propiedad === 'Casa' || tipo_propiedad === 'Departamento' || tipo_propiedad === 'Local') {
      atributos_especificos = {
        habitaciones: Number(form.habitaciones) || null,
        banos: Number(form.banos) || null,
      };
    } else if (tipo_propiedad === 'Campo') {
      atributos_especificos = {
        dimensiones: form.dimensiones || null,
        tipo_campo: form.tipo_campo,
      };
    } else if (tipo_propiedad === 'Terreno') {
      atributos_especificos = {
        dimensiones: form.dimensiones_terreno || null,
      };
    }

    return {
      titulo: form.titulo,
      descripcion: form.descripcion,
      precio: Number(form.precio) || null,
      moneda: form.moneda,
      tipo_propiedad,
      operacion: form.operacion,
      ubicacion: form.ubicacion,
      atributos_especificos,
      media_urls: mediaUrls,
      estado: form.estado,
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.tipo_propiedad) {
      alert("Por favor selecciona un tipo de propiedad.");
      return;
    }
    setLoading(true);
    try {
      const payload = construirPayload();
      if (onSubmitExterno) {
        await onSubmitExterno(payload, archivos);
      } else {
        console.log('Payload:', payload);
      }
    } finally {
      setLoading(false);
    }
  };

  const { tipo_propiedad } = form;
  const esCasaDeptoLocal = ['Casa', 'Departamento', 'Local'].includes(tipo_propiedad);
  const esCampo = tipo_propiedad === 'Campo';
  const esTerreno = tipo_propiedad === 'Terreno';

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md animate-in fade-in duration-300 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4 py-8">
        <div className="bg-roma-olive border border-white/10 w-full max-w-4xl rounded-[32px] shadow-2xl animate-in zoom-in-95 p-8 my-auto">

          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-white tracking-tight">Nueva Propiedad</h1>
            <Button type="button" variant="ghost" size="icon" className="text-white/50 hover:text-white hover:bg-white/10" onClick={onCancelar}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

              {/* COLUMNA IZQUIERDA: Datos */}
              <div className="space-y-5">
                {/* Fila 1: Tipo + Título */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-white/60 ml-1 uppercase tracking-wider">Tipo *</Label>
                    <Select value={tipo_propiedad} onValueChange={(v) => setField('tipo_propiedad', v)} required>
                      <SelectTrigger className="h-10 rounded-xl border-white/10 bg-black/20 text-white"><SelectValue placeholder="Seleccionar..." /></SelectTrigger>
                      <SelectContent className="bg-roma-olive text-white border-white/10">
                        <SelectItem value="Casa">Casa</SelectItem>
                        <SelectItem value="Departamento">Departamento</SelectItem>
                        <SelectItem value="Local">Local</SelectItem>
                        <SelectItem value="Campo">Campo</SelectItem>
                        <SelectItem value="Terreno">Terreno</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-2 space-y-1.5">
                    <Label className="text-xs font-bold text-white/60 ml-1 uppercase tracking-wider">Título *</Label>
                    <div className="relative">
                      <Type className="absolute left-3.5 top-3 h-4 w-4 text-white/40" />
                      <Input value={form.titulo} onChange={(e) => setField('titulo', e.target.value)} className="h-10 pl-10 rounded-xl border-white/10 bg-black/20 text-white placeholder:text-white/30 focus-visible:ring-white/30" placeholder="Ej: Casa con pileta..." required />
                    </div>
                  </div>
                </div>

                {/* Fila 2: Operación + Ubicación */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-white/60 ml-1 uppercase tracking-wider">Operación</Label>
                    <Select value={form.operacion} onValueChange={(v) => setField('operacion', v)}>
                      <SelectTrigger className="h-10 rounded-xl border-white/10 bg-black/20 text-white"><SelectValue /></SelectTrigger>
                      <SelectContent className="bg-roma-olive text-white border-white/10">
                        <SelectItem value="Venta">Venta</SelectItem>
                        <SelectItem value="Alquiler">Alquiler</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-white/60 ml-1 uppercase tracking-wider">Ubicación *</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3.5 top-3 h-4 w-4 text-white/40" />
                      <Input value={form.ubicacion} onChange={(e) => setField('ubicacion', e.target.value)} className="h-10 pl-10 rounded-xl border-white/10 bg-black/20 text-white placeholder:text-white/30 focus-visible:ring-white/30" placeholder="Ciudad / Localidad" required />
                    </div>
                  </div>
                </div>

                {/* Fila 3: Precio + Moneda */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-white/60 ml-1 uppercase tracking-wider">Precio *</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3.5 top-3 h-4 w-4 text-white/40" />
                      <Input type="number" min="0" value={form.precio} onChange={(e) => setField('precio', e.target.value)} className="h-10 pl-10 rounded-xl border-white/10 bg-black/20 text-white placeholder:text-white/30 focus-visible:ring-white/30" placeholder="0" required />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-white/60 ml-1 uppercase tracking-wider">Moneda</Label>
                    <Select value={form.moneda} onValueChange={(v) => setField('moneda', v)}>
                      <SelectTrigger className="h-10 rounded-xl border-white/10 bg-black/20 text-white"><SelectValue /></SelectTrigger>
                      <SelectContent className="bg-roma-olive text-white border-white/10">
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="ARS">ARS</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Fila 4: Campos condicionales */}
                {esCasaDeptoLocal && (
                  <div className="grid grid-cols-2 gap-4 p-4 bg-black/20 rounded-2xl border border-white/10">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-white/60 ml-1 uppercase tracking-wider flex items-center gap-1.5"><BedDouble className="h-3.5 w-3.5" /> Habitaciones</Label>
                      <Input type="number" min="0" value={form.habitaciones} onChange={(e) => setField('habitaciones', e.target.value)} className="h-10 rounded-xl border-white/10 bg-black/20 text-white placeholder:text-white/30 focus-visible:ring-white/30" placeholder="0" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-white/60 ml-1 uppercase tracking-wider flex items-center gap-1.5"><Bath className="h-3.5 w-3.5" /> Baños</Label>
                      <Input type="number" min="0" value={form.banos} onChange={(e) => setField('banos', e.target.value)} className="h-10 rounded-xl border-white/10 bg-black/20 text-white placeholder:text-white/30 focus-visible:ring-white/30" placeholder="0" />
                    </div>
                  </div>
                )}
                {esCampo && (
                  <div className="grid grid-cols-2 gap-4 p-4 bg-black/20 rounded-2xl border border-white/10">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-white/60 ml-1 uppercase tracking-wider flex items-center gap-1.5"><Ruler className="h-3.5 w-3.5" /> Hectáreas</Label>
                      <Input type="text" value={form.dimensiones} onChange={(e) => setField('dimensiones', e.target.value)} className="h-10 rounded-xl border-white/10 bg-black/20 text-white placeholder:text-white/30 focus-visible:ring-white/30" placeholder="Ej: 250" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-white/60 ml-1 uppercase tracking-wider flex items-center gap-1.5"><Tractor className="h-3.5 w-3.5" /> Tipo de Campo</Label>
                      <Select value={form.tipo_campo} onValueChange={(v) => setField('tipo_campo', v)}>
                        <SelectTrigger className="h-10 rounded-xl border-white/10 bg-black/20 text-white"><SelectValue /></SelectTrigger>
                        <SelectContent className="bg-roma-olive text-white border-white/10">
                          <SelectItem value="Agricola">Agrícola</SelectItem>
                          <SelectItem value="Ganadero">Ganadero</SelectItem>
                          <SelectItem value="Mixto">Mixto</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
                {esTerreno && (
                  <div className="p-4 bg-black/20 rounded-2xl border border-white/10">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-white/60 ml-1 uppercase tracking-wider flex items-center gap-1.5"><Ruler className="h-3.5 w-3.5" /> Dimensiones (m²)</Label>
                      <Input type="text" value={form.dimensiones_terreno} onChange={(e) => setField('dimensiones_terreno', e.target.value)} className="h-10 rounded-xl border-white/10 bg-black/20 text-white placeholder:text-white/30 focus-visible:ring-white/30" placeholder="Ej: 500 m²" />
                    </div>
                  </div>
                )}

                {/* Fila 5: Descripción */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-white/60 ml-1 uppercase tracking-wider">Descripción</Label>
                  <textarea
                    value={form.descripcion}
                    onChange={(e) => setField('descripcion', e.target.value)}
                    placeholder="Describí la propiedad..."
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border border-white/10 bg-black/20 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/30 resize-none transition"
                  />
                </div>

                {/* Fila 6: Estado de Publicación */}
                <div className="space-y-1.5 pt-2">
                  <Label className="text-xs font-bold text-white/60 ml-1 uppercase tracking-wider">Estado de Publicación</Label>
                  <Select value={form.estado} onValueChange={(v) => setField('estado', v)}>
                    <SelectTrigger className="h-10 rounded-xl border-white/10 bg-black/20 text-white"><SelectValue /></SelectTrigger>
                    <SelectContent className="bg-roma-olive text-white border-white/10">
                      <SelectItem value="publicado">Publicado (Visible)</SelectItem>
                      <SelectItem value="borrador">Borrador (Oculto)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* COLUMNA DERECHA: Fotos */}
              <div className="flex flex-col h-full">
                <Label className="text-xs font-bold text-white/60 ml-1 uppercase tracking-wider mb-1.5">Fotos de la propiedad</Label>
                <div className="flex-1 flex flex-col gap-3 p-4 border-2 border-dashed border-white/20 rounded-2xl bg-black/20 hover:bg-white/5 transition-all text-center overflow-hidden">

                  {archivos.length > 0 ? (
                    <div className="flex-1 overflow-y-auto pr-1">
                      <div className="grid grid-cols-3 gap-2 w-full">
                        {archivos.map((f, i) => (
                          <div key={i} className="relative group rounded-lg overflow-hidden border border-white/10 aspect-square shadow-sm">
                            <img src={URL.createObjectURL(f)} alt={f.name} className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                setArchivos(prev => prev.filter((_, index) => index !== i));
                              }}
                              className="absolute top-1 right-1 bg-red-500/90 hover:bg-red-600 text-white p-1 rounded-full shadow-md transition-all scale-95 hover:scale-105 z-10"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center opacity-60 pointer-events-none">
                      <Upload className="h-10 w-10 text-white/40 mb-3" />
                      <p className="text-sm font-semibold text-white/60">Ninguna foto seleccionada</p>
                    </div>
                  )}

                  <label className="flex flex-col items-center justify-center gap-2 cursor-pointer bg-white/5 border border-white/10 hover:border-white/30 hover:bg-white/10 w-full py-4 rounded-xl transition-all shadow-sm mt-auto">
                    <Upload className="h-5 w-5 text-white/70" />
                    <p className="text-xs text-white/70 font-bold uppercase tracking-tight">
                      {archivos.length > 0 ? 'Agregar más fotos' : 'Hacé clic acá para subir fotos'}
                    </p>
                    <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => setArchivos(prev => [...prev, ...Array.from(e.target.files || [])])} />
                  </label>
                </div>
              </div>

            </div>

            {/* Botón submit */}
            <div className="pt-4 border-t border-white/10">
              <Button type="submit" disabled={loading} className="w-full bg-white hover:bg-white/90 text-roma-dark font-black h-12 rounded-xl shadow-lg transition-all text-sm tracking-wide">
                {loading ? <Loader2 className="animate-spin h-5 w-5 mr-2" /> : <Save className="mr-2 h-5 w-5" />}
                {loading ? 'PUBLICANDO...' : 'PUBLICAR INMUEBLE'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
