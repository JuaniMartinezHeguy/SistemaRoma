import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  Upload, Trash2, Copy, CheckCircle, 
  Image as ImageIcon, Link2, Loader2, ExternalLink 
} from 'lucide-react';

interface Plantilla {
  id: number;
  slug: string;
  imagen_url: string;
  created_at: string;
}

interface PlantillasAdminProps {
  mostrarToast: (texto: string, tipo?: 'success' | 'error') => void;
}

export default function PlantillasAdmin({ mostrarToast }: PlantillasAdminProps) {
  const [plantillas, setPlantillas] = useState<Plantilla[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [slug, setSlug] = useState('');
  const [archivo, setArchivo] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Dominio base para los links
  const BASE_DOMAIN = 'romartinez.com.ar';

  useEffect(() => {
    fetchPlantillas();
  }, []);

  const fetchPlantillas = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('plantillas')
      .select('*')
      .order('id', { ascending: false });

    if (!error && data) {
      setPlantillas(data);
    }
    setLoading(false);
  };

  const handleFileChange = (file: File) => {
    if (!file.type.startsWith('image/')) {
      mostrarToast('Solo se permiten archivos de imagen', 'error');
      return;
    }
    setArchivo(file);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileChange(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => setDragOver(false);

  const sanitizeSlug = (value: string) => {
    return value
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9\-]/g, '')
      .replace(/--+/g, '-')
      .replace(/^-|-$/g, '');
  };

  const handleSubmit = async () => {
    if (!archivo) {
      mostrarToast('Seleccioná una imagen', 'error');
      return;
    }
    if (!slug.trim()) {
      mostrarToast('Escribí un slug para el link', 'error');
      return;
    }

    const cleanSlug = sanitizeSlug(slug);
    if (!cleanSlug) {
      mostrarToast('El slug no es válido', 'error');
      return;
    }

    // Verificar que no exista el slug
    const { data: existing } = await supabase
      .from('plantillas')
      .select('id')
      .eq('slug', cleanSlug)
      .limit(1)
      .single();

    if (existing) {
      mostrarToast(`El slug "${cleanSlug}" ya está en uso`, 'error');
      return;
    }

    setUploading(true);

    try {
      // Subir imagen al bucket 'plantillas'
      const ext = archivo.name.split('.').pop();
      const nombre = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from('plantillas')
        .upload(nombre, archivo);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('plantillas')
        .getPublicUrl(nombre);

      // Insertar en la tabla
      const { error: insertError } = await supabase
        .from('plantillas')
        .insert([{ slug: cleanSlug, imagen_url: publicUrl }]);

      if (insertError) throw insertError;

      mostrarToast('¡Plantilla publicada!');
      setSlug('');
      setArchivo(null);
      setPreview(null);
      fetchPlantillas();
    } catch (error: any) {
      console.error('Error subiendo plantilla:', error);
      const msg = error?.message || error?.error || JSON.stringify(error) || 'Error al subir la plantilla';
      mostrarToast(msg, 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (plantilla: Plantilla) => {
    if (!confirm(`¿Eliminar la plantilla "/${plantilla.slug}"?`)) return;

    try {
      // Extraer el nombre del archivo del URL para eliminarlo del storage
      const urlParts = plantilla.imagen_url.split('/');
      const fileName = urlParts[urlParts.length - 1];
      
      await supabase.storage.from('plantillas').remove([fileName]);
      const { error } = await supabase.from('plantillas').delete().eq('id', plantilla.id);
      
      if (error) throw error;
      
      mostrarToast('Plantilla eliminada');
      fetchPlantillas();
    } catch (error: any) {
      mostrarToast(error.message || 'Error al eliminar', 'error');
    }
  };

  const copyLink = (plantillaSlug: string, id: number) => {
    navigator.clipboard.writeText(`${BASE_DOMAIN}/${plantillaSlug}`);
    setCopiedId(id);
    mostrarToast('Link copiado al portapapeles');
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-roma-leaf/30 backdrop-blur-md p-5 sm:p-6 rounded-[24px] border border-white/10 shadow-sm">
        <div>
          <h1 className="text-2xl sm:text-[28px] font-black text-white tracking-tight flex items-center gap-3">
            <ImageIcon className="h-7 w-7 text-white/80" />
            Plantillas
          </h1>
          <p className="text-xs sm:text-sm text-white/60 font-medium mt-1">
            Subí imágenes de plantillas y compartilas con un link corto para ManyChat.
          </p>
        </div>
      </div>

      {/* FORMULARIO DE SUBIDA */}
      <div className="bg-roma-leaf/30 backdrop-blur-md border border-white/10 rounded-[24px] sm:rounded-[28px] shadow-sm overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-white/10">
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <Upload className="h-5 w-5 text-white/80" />
            Nueva Plantilla
          </h2>
        </div>

        <div className="p-4 sm:p-6 space-y-5">
          {/* Drop zone para imagen */}
          <div
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`relative border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-all ${
              dragOver
                ? 'border-white/60 bg-white/10'
                : preview
                ? 'border-roma-leaf/50 bg-roma-leaf/10'
                : 'border-white/20 hover:border-white/40 hover:bg-white/5'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileChange(file);
              }}
            />

            {preview ? (
              <div className="flex flex-col items-center gap-3">
                <img
                  src={preview}
                  alt="Preview"
                  className="max-h-48 sm:max-h-64 rounded-xl shadow-lg object-contain"
                />
                <p className="text-white/60 text-xs font-medium">
                  Click para cambiar la imagen
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <div className="h-14 w-14 bg-white/10 rounded-2xl flex items-center justify-center">
                  <ImageIcon className="h-7 w-7 text-white/50" />
                </div>
                <div>
                  <p className="text-white/80 font-bold text-sm">
                    Arrastrá una imagen o hacé click
                  </p>
                  <p className="text-white/40 text-xs mt-1">
                    PNG, JPG, WEBP hasta 10MB
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Campo de slug */}
          <div>
            <label className="block text-white/70 text-xs font-bold uppercase tracking-wider mb-2">
              Link de la plantilla
            </label>
            <div className="flex items-center bg-roma-dark/60 border border-white/15 rounded-xl overflow-hidden focus-within:border-white/40 transition-colors">
              <span className="px-3 sm:px-4 py-3 text-white/40 text-xs sm:text-sm font-medium bg-white/5 border-r border-white/10 whitespace-nowrap select-none">
                {BASE_DOMAIN}/
              </span>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(sanitizeSlug(e.target.value))}
                placeholder="nombre-plantilla"
                className="flex-1 px-3 sm:px-4 py-3 bg-transparent text-white text-sm font-medium placeholder:text-white/30 outline-none"
              />
            </div>
            {slug && (
              <p className="text-white/50 text-[11px] font-medium mt-1.5 flex items-center gap-1.5">
                <Link2 size={12} />
                Link final: <span className="text-white/80">{BASE_DOMAIN}/{sanitizeSlug(slug)}</span>
              </p>
            )}
          </div>

          {/* Botón publicar */}
          <button
            onClick={handleSubmit}
            disabled={uploading || !archivo || !slug.trim()}
            className={`w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl font-bold text-sm transition-all cursor-pointer ${
              uploading || !archivo || !slug.trim()
                ? 'bg-white/10 text-white/30 cursor-not-allowed'
                : 'bg-white hover:bg-white/90 text-roma-dark shadow-lg hover:shadow-xl'
            }`}
          >
            {uploading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Subiendo...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                Publicar Plantilla
              </>
            )}
          </button>
        </div>
      </div>

      {/* LISTA DE PLANTILLAS */}
      <div className="bg-roma-leaf/30 backdrop-blur-md border border-white/10 rounded-[24px] sm:rounded-[28px] shadow-sm overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-white/10">
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <ImageIcon className="h-5 w-5 text-white/80" />
            Plantillas Publicadas
            {plantillas.length > 0 && (
              <span className="bg-white/15 text-white/70 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg ml-2">
                {plantillas.length}
              </span>
            )}
          </h2>
        </div>

        {loading ? (
          <div className="p-8 flex items-center justify-center">
            <div className="w-8 h-8 border-3 border-white/20 border-t-white rounded-full animate-spin" />
          </div>
        ) : plantillas.length === 0 ? (
          <div className="p-8 sm:p-12 text-center">
            <div className="h-16 w-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <ImageIcon className="h-8 w-8 text-white/20" />
            </div>
            <p className="text-white/40 font-medium text-sm">No hay plantillas publicadas todavía.</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {plantillas.map((p) => (
              <div 
                key={p.id} 
                className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 hover:bg-white/5 transition-colors group"
              >
                {/* Miniatura */}
                <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-xl overflow-hidden bg-black/30 shrink-0 border border-white/10">
                  <img 
                    src={p.imagen_url} 
                    alt={p.slug} 
                    className="h-full w-full object-cover"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-white font-bold text-sm truncate">/{p.slug}</span>
                    <span className="bg-white/10 text-white/50 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md shrink-0">
                      ID {p.id}
                    </span>
                  </div>
                  <p className="text-white/40 text-[11px] font-medium mt-0.5 truncate">
                    {BASE_DOMAIN}/{p.slug}
                  </p>
                  <p className="text-white/30 text-[10px] font-medium mt-0.5">
                    {new Date(p.created_at).toLocaleDateString('es-AR', { 
                      day: '2-digit', month: 'short', year: 'numeric' 
                    })}
                  </p>
                </div>

                {/* Acciones */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => copyLink(p.slug, p.id)}
                    className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-xl transition-all cursor-pointer"
                    title="Copiar link"
                  >
                    {copiedId === p.id ? (
                      <CheckCircle size={16} className="text-green-400" />
                    ) : (
                      <Copy size={16} />
                    )}
                  </button>
                  <a
                    href={`/${p.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-xl transition-all cursor-pointer"
                    title="Ver plantilla"
                  >
                    <ExternalLink size={16} />
                  </a>
                  <button
                    onClick={() => handleDelete(p)}
                    className="p-2 text-white/50 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all cursor-pointer"
                    title="Eliminar"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
