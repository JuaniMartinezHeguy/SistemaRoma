import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Loader2, Save, Upload, MapPin, Type, DollarSign, Home, BedDouble, Bath, Ruler, Tractor, Map, CheckCircle2 } from 'lucide-react';
import useOpcionesFiltros from '@/hooks/useOpcionesFiltros';
import { esCiudadRioNegro } from '@/lib/filtrosHelper';

// ─── ESTADO INICIAL ────────────────────────────────────────────────────────────

const ESTADO_INICIAL = {
  tipo_propiedad: 'Casa',
  titulo: '',
  descripcion: '',
  precio: '',
  moneda: 'USD',
  operacion: 'Venta',
  provincia: 'Buenos Aires',
  ubicacion: '',
  coordenadas: '',
  habitaciones: '',
  banos: '',
  superficie: '',
  dimensiones: '',
  tipo_campo: 'Agricola',
  dimensiones_terreno: '',
  estado: 'publicado',
};

// ─── COMPONENTE ───────────────────────────────────────────────────────────────

export default function FormularioPropiedad({ onSubmit: onSubmitExterno, onCancelar, propiedadInicial = null }) {
  const [form, setForm] = useState(ESTADO_INICIAL);
  const [fotosExistentes, setFotosExistentes] = useState([]);
  const [archivos, setArchivos] = useState([]);
  const [loading, setLoading] = useState(false);
  const { ubicacionesBuenosAires = [], ubicacionesRioNegro = [] } = useOpcionesFiltros();

  useEffect(() => {
    if (propiedadInicial) {
      const valSuperficie = propiedadInicial.superficie ?? propiedadInicial.dimensiones ?? propiedadInicial.atributos_especificos?.dimensiones ?? propiedadInicial.mts2 ?? '';
      const provDetectada = propiedadInicial.provincia || (esCiudadRioNegro(propiedadInicial.ubicacion) ? 'Río Negro' : 'Buenos Aires');

      setForm({
        tipo_propiedad: propiedadInicial.tipo_propiedad || 'Casa',
        titulo: propiedadInicial.titulo || '',
        descripcion: propiedadInicial.descripcion || '',
        precio: propiedadInicial.precio ?? '',
        moneda: propiedadInicial.moneda || 'USD',
        operacion: propiedadInicial.operacion || 'Venta',
        provincia: provDetectada,
        ubicacion: propiedadInicial.ubicacion || '',
        coordenadas: propiedadInicial.coordenadas || propiedadInicial.atributos_especificos?.coordenadas || '',
        habitaciones: propiedadInicial.atributos_especificos?.habitaciones ?? propiedadInicial.habitaciones ?? '',
        banos: propiedadInicial.atributos_especificos?.banos ?? propiedadInicial.banos ?? '',
        superficie: valSuperficie,
        dimensiones: valSuperficie,
        tipo_campo: propiedadInicial.atributos_especificos?.tipo_campo || propiedadInicial.tipo_campo || 'Agricola',
        dimensiones_terreno: valSuperficie,
        estado: propiedadInicial.estado || 'publicado',
      });

      const initialMedia = Array.isArray(propiedadInicial.media_urls) && propiedadInicial.media_urls.length > 0
        ? [...propiedadInicial.media_urls]
        : (propiedadInicial.imagen_url ? [propiedadInicial.imagen_url] : (Array.isArray(propiedadInicial.imagenes) ? [...propiedadInicial.imagenes] : []));
      
      setFotosExistentes(initialMedia);
      setArchivos([]);
    } else {
      setForm(ESTADO_INICIAL);
      setFotosExistentes([]);
      setArchivos([]);
    }
  }, [propiedadInicial]);

  const setField = (campo, valor) =>
    setForm((prev) => ({ ...prev, [campo]: valor }));

  const construirPayload = () => {
    const { tipo_propiedad } = form;
    let atributos_especificos = {};

    const supValor = form.superficie || form.dimensiones || form.dimensiones_terreno || null;

    if (tipo_propiedad === 'Casa' || tipo_propiedad === 'Departamento' || tipo_propiedad === 'Local') {
      atributos_especificos = {
        habitaciones: Number(form.habitaciones) || null,
        banos: Number(form.banos) || null,
        dimensiones: supValor,
      };
    } else if (tipo_propiedad === 'Campo') {
      atributos_especificos = {
        dimensiones: supValor,
        tipo_campo: form.tipo_campo,
      };
    } else if (tipo_propiedad === 'Terreno') {
      atributos_especificos = {
        dimensiones: supValor,
      };
    }

    return {
      titulo: form.titulo,
      descripcion: form.descripcion,
      precio: Number(form.precio) || null,
      moneda: form.moneda,
      tipo_propiedad,
      operacion: form.operacion,
      provincia: form.provincia || 'Buenos Aires',
      ubicacion: form.ubicacion,
      coordenadas: form.coordenadas,
      superficie: supValor,
      atributos_especificos,
      media_urls: fotosExistentes,
      imagen_url: fotosExistentes[0] || null,
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
      <div className="flex min-h-full items-center justify-center p-2.5 sm:p-4 py-4 sm:py-8">
        <div className="bg-roma-olive border border-white/10 w-full max-w-4xl rounded-[24px] sm:rounded-[32px] shadow-2xl animate-in zoom-in-95 p-4 sm:p-8 my-auto">

          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                {propiedadInicial ? "Editar Propiedad" : "Nueva Propiedad"}
              </h1>
              {propiedadInicial && (
                <p className="text-xs text-white/60 mt-0.5 font-medium">Modificá los datos del inmueble y guardá los cambios.</p>
              )}
            </div>
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

                {/* Fila 2: Operación + Provincia */}
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
                    <Label className="text-xs font-bold text-white/60 ml-1 uppercase tracking-wider">Provincia *</Label>
                    <Select 
                      value={form.provincia} 
                      onValueChange={(v) => {
                        setField('provincia', v);
                      }}
                    >
                      <SelectTrigger className="h-10 rounded-xl border-white/10 bg-black/20 text-white"><SelectValue placeholder="Seleccionar..." /></SelectTrigger>
                      <SelectContent className="bg-roma-olive text-white border-white/10">
                        <SelectItem value="Buenos Aires">Buenos Aires</SelectItem>
                        <SelectItem value="Río Negro">Río Negro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Fila 3: Ubicación / Ciudad (con sugerencias dinámicas según la provincia) */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-bold text-white/60 ml-1 uppercase tracking-wider">Ciudad / Zona ({form.provincia}) *</Label>
                    {((form.provincia === 'Río Negro' || form.provincia === 'Rio Negro') ? ubicacionesRioNegro : ubicacionesBuenosAires).length > 0 && (
                      <span className="text-[10px] text-white/40">Sugerencias disponibles</span>
                    )}
                  </div>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-3 h-4 w-4 text-white/40" />
                    <Input 
                      list="ciudades-sugeridas-list"
                      value={form.ubicacion} 
                      onChange={(e) => setField('ubicacion', e.target.value)} 
                      className="h-10 pl-10 rounded-xl border-white/10 bg-black/20 text-white placeholder:text-white/30 focus-visible:ring-white/30" 
                      placeholder={form.provincia === 'Río Negro' ? "Ej: Viedma, Las Grutas..." : "Ej: Villalonga, Pedro Luro..."} 
                      required 
                    />
                    <datalist id="ciudades-sugeridas-list">
                      {((form.provincia === 'Río Negro' || form.provincia === 'Rio Negro') ? ubicacionesRioNegro : ubicacionesBuenosAires).map((c) => (
                        <option key={c} value={c} />
                      ))}
                    </datalist>
                  </div>

                  {/* Chips de selección rápida si hay opciones configuradas */}
                  {((form.provincia === 'Río Negro' || form.provincia === 'Rio Negro') ? ubicacionesRioNegro : ubicacionesBuenosAires).length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-0.5">
                      {((form.provincia === 'Río Negro' || form.provincia === 'Rio Negro') ? ubicacionesRioNegro : ubicacionesBuenosAires).map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setField('ubicacion', c)}
                          className={`text-[11px] px-2.5 py-0.5 rounded-lg border transition-all cursor-pointer ${
                            form.ubicacion === c 
                              ? 'bg-white text-roma-olive font-bold border-white shadow-xs' 
                              : 'bg-black/20 text-white/70 hover:text-white border-white/10 hover:border-white/25'
                          }`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Dirección para casas/deptos o Coordenadas GPS para campos/terrenos */}
                {esCasaDeptoLocal ? (
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-white/60 ml-1 uppercase tracking-wider flex items-center justify-between">
                      <span>Dirección exacta para el mapa</span>
                      <span className="text-[10px] text-white/40 normal-case font-normal">Calle y número</span>
                    </Label>
                    <div className="relative">
                      <MapPin className="absolute left-3.5 top-3 h-4 w-4 text-roma-leaf" />
                      <Input
                        value={form.coordenadas}
                        onChange={(e) => setField('coordenadas', e.target.value)}
                        className="h-10 pl-10 rounded-xl border-white/10 bg-black/20 text-white placeholder:text-white/30 focus-visible:ring-white/30"
                        placeholder={`Ej: San Martín 450, ${form.ubicacion || 'Villalonga'}`}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-white/60 ml-1 uppercase tracking-wider flex items-center justify-between">
                      <span>Coordenadas GPS exactas (Mapa)</span>
                      <span className="text-[10px] text-white/40 normal-case font-normal">Latitud, Longitud</span>
                    </Label>
                    <div className="relative">
                      <MapPin className="absolute left-3.5 top-3 h-4 w-4 text-roma-leaf" />
                      <Input
                        value={form.coordenadas}
                        onChange={(e) => setField('coordenadas', e.target.value)}
                        className="h-10 pl-10 rounded-xl border-white/10 bg-black/20 text-white placeholder:text-white/30 focus-visible:ring-white/30"
                        placeholder="Ej: -39.9234, -62.7123"
                      />
                    </div>
                  </div>
                )}

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
                  <div className="grid grid-cols-3 gap-3 p-4 bg-black/20 rounded-2xl border border-white/10">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-white/60 ml-1 uppercase tracking-wider flex items-center gap-1.5"><BedDouble className="h-3.5 w-3.5" /> Habitaciones</Label>
                      <Input type="number" min="0" value={form.habitaciones} onChange={(e) => setField('habitaciones', e.target.value)} className="h-10 rounded-xl border-white/10 bg-black/20 text-white placeholder:text-white/30 focus-visible:ring-white/30" placeholder="0" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-white/60 ml-1 uppercase tracking-wider flex items-center gap-1.5"><Bath className="h-3.5 w-3.5" /> Baños</Label>
                      <Input type="number" min="0" value={form.banos} onChange={(e) => setField('banos', e.target.value)} className="h-10 rounded-xl border-white/10 bg-black/20 text-white placeholder:text-white/30 focus-visible:ring-white/30" placeholder="0" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-white/60 ml-1 uppercase tracking-wider flex items-center gap-1.5"><Ruler className="h-3.5 w-3.5" /> Superficie (m²)</Label>
                      <Input type="text" value={form.superficie} onChange={(e) => { setField('superficie', e.target.value); setField('dimensiones', e.target.value); }} className="h-10 rounded-xl border-white/10 bg-black/20 text-white placeholder:text-white/30 focus-visible:ring-white/30" placeholder="Ej: 150" />
                    </div>
                  </div>
                )}
                {esCampo && (
                  <div className="grid grid-cols-2 gap-4 p-4 bg-black/20 rounded-2xl border border-white/10">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-white/60 ml-1 uppercase tracking-wider flex items-center gap-1.5"><Ruler className="h-3.5 w-3.5" /> Hectáreas / Superficie</Label>
                      <Input type="text" value={form.dimensiones} onChange={(e) => { setField('dimensiones', e.target.value); setField('superficie', e.target.value); }} className="h-10 rounded-xl border-white/10 bg-black/20 text-white placeholder:text-white/30 focus-visible:ring-white/30" placeholder="Ej: 250" />
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
                      <Label className="text-xs font-bold text-white/60 ml-1 uppercase tracking-wider flex items-center gap-1.5"><Ruler className="h-3.5 w-3.5" /> Superficie / Dimensiones (m²)</Label>
                      <Input type="text" value={form.dimensiones_terreno} onChange={(e) => { setField('dimensiones_terreno', e.target.value); setField('superficie', e.target.value); setField('dimensiones', e.target.value); }} className="h-10 rounded-xl border-white/10 bg-black/20 text-white placeholder:text-white/30 focus-visible:ring-white/30" placeholder="Ej: 500 m²" />
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
                <div className="flex items-center justify-between mb-1.5">
                  <Label className="text-xs font-bold text-white/60 ml-1 uppercase tracking-wider">
                    Fotos de la propiedad ({fotosExistentes.length + archivos.length})
                  </Label>
                  {fotosExistentes.length > 0 && (
                    <span className="text-[10px] text-white/40">{fotosExistentes.length} guardada{fotosExistentes.length > 1 ? 's' : ''}</span>
                  )}
                </div>
                <div className="flex-1 flex flex-col gap-3 p-4 border-2 border-dashed border-white/20 rounded-2xl bg-black/20 hover:bg-white/5 transition-all text-center overflow-hidden">

                  {(fotosExistentes.length > 0 || archivos.length > 0) ? (
                    <div className="flex-1 overflow-y-auto pr-1 max-h-[300px]">
                      <div className="grid grid-cols-3 gap-2 w-full">
                        {/* Fotos existentes previamente guardadas */}
                        {fotosExistentes.map((url, i) => (
                          <div key={`existente-${i}`} className="relative group rounded-lg overflow-hidden border border-white/10 aspect-square shadow-sm bg-black/30">
                            <img src={url} alt={`Foto guardada ${i + 1}`} className="w-full h-full object-cover" />
                            <span className="absolute bottom-1 left-1 bg-black/70 backdrop-blur-xs text-[9px] font-bold text-white px-1.5 py-0.5 rounded border border-white/10">
                              Guardada
                            </span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                setFotosExistentes(prev => prev.filter((_, index) => index !== i));
                              }}
                              className="absolute top-1 right-1 bg-red-500/90 hover:bg-red-600 text-white p-1 rounded-full shadow-md transition-all scale-95 hover:scale-105 z-10 cursor-pointer"
                              title="Eliminar foto guardada"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}

                        {/* Nuevos archivos por subir */}
                        {archivos.map((f, i) => (
                          <div key={`nuevo-${i}`} className="relative group rounded-lg overflow-hidden border border-emerald-500/40 aspect-square shadow-sm bg-black/30">
                            <img src={URL.createObjectURL(f)} alt={f.name} className="w-full h-full object-cover" />
                            <span className="absolute bottom-1 left-1 bg-emerald-600/90 backdrop-blur-xs text-[9px] font-bold text-white px-1.5 py-0.5 rounded border border-white/10">
                              Nueva
                            </span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                setArchivos(prev => prev.filter((_, index) => index !== i));
                              }}
                              className="absolute top-1 right-1 bg-red-500/90 hover:bg-red-600 text-white p-1 rounded-full shadow-md transition-all scale-95 hover:scale-105 z-10 cursor-pointer"
                              title="Eliminar foto nueva"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center opacity-60 pointer-events-none py-8">
                      <Upload className="h-10 w-10 text-white/40 mb-3" />
                      <p className="text-sm font-semibold text-white/60">Ninguna foto seleccionada</p>
                    </div>
                  )}

                  <label className="flex flex-col items-center justify-center gap-2 cursor-pointer bg-white/5 border border-white/10 hover:border-white/30 hover:bg-white/10 w-full py-4 rounded-xl transition-all shadow-sm mt-auto">
                    <Upload className="h-5 w-5 text-white/70" />
                    <p className="text-xs text-white/70 font-bold uppercase tracking-tight">
                      {(fotosExistentes.length > 0 || archivos.length > 0) ? 'Agregar más fotos' : 'Hacé clic acá para subir fotos'}
                    </p>
                    <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => setArchivos(prev => [...prev, ...Array.from(e.target.files || [])])} />
                  </label>
                </div>
              </div>

            </div>

            {/* Botón submit */}
            <div className="pt-4 border-t border-white/10">
              <Button type="submit" disabled={loading} className="w-full bg-white hover:bg-white/90 text-roma-dark font-black h-12 rounded-xl shadow-lg transition-all text-sm tracking-wide cursor-pointer">
                {loading ? (
                  <Loader2 className="animate-spin h-5 w-5 mr-2" />
                ) : (
                  <Save className="mr-2 h-5 w-5" />
                )}
                {loading 
                  ? (propiedadInicial ? 'GUARDANDO CAMBIOS...' : 'PUBLICANDO...') 
                  : (propiedadInicial ? 'GUARDAR CAMBIOS' : 'PUBLICAR INMUEBLE')}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
