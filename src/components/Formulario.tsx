"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Upload, X, Loader2, Save, Star, Ruler, MapPin, Type } from "lucide-react";

interface FormData {
  titulo: string; descripcion: string; precio: string;
  tipo_propiedad: string; operacion: string; ubicacion: string;
  dimensiones: string; imagen_url: string; destacada: boolean;
}

interface FormularioProps {
  formData: FormData; setFormData: (data: FormData) => void;
  onSubmit: (e: React.FormEvent) => void; loading: boolean;
  editandoId: number | null; archivoImagen: File | null;
  setArchivoImagen: (file: File | null) => void; onCancelar: () => void;
}

export default function Formulario({
  formData, setFormData, onSubmit, loading, editandoId,
  archivoImagen, setArchivoImagen, onCancelar,
}: FormularioProps) {

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="bg-roma-olive w-full max-w-lg rounded-[32px] shadow-2xl relative border border-white/10 overflow-hidden animate-in zoom-in-95">
        <Button variant="ghost" size="icon" className="absolute top-5 right-5 text-white/50 hover:text-white hover:bg-white/10" onClick={onCancelar}>
          <X className="h-5 w-5" />
        </Button>

        <div className="p-8">
          <h1 className="text-2xl font-bold text-white mb-6 tracking-tight">
            {editandoId ? "Editar Propiedad" : "Nueva Propiedad"}
          </h1>

          <form onSubmit={onSubmit} className="space-y-5">
            {/* Título */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-white/60 ml-1 uppercase tracking-wider">Título</Label>
              <div className="relative">
                <Type className="absolute left-4 top-3 h-4 w-4 text-white/40" />
                <Input value={formData.titulo} onChange={e => handleInputChange("titulo", e.target.value)} className="h-10 pl-11 rounded-xl border-white/10 bg-black/20 text-white placeholder:text-white/30 focus-visible:ring-white/30" placeholder="Ej: Casa en el centro" required />
              </div>
            </div>

            {/* Ubicación y Dimensiones */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-white/60 ml-1 uppercase tracking-wider">Ubicación</Label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-3 h-4 w-4 text-white/40" />
                  <Input value={formData.ubicacion} onChange={e => handleInputChange("ubicacion", e.target.value)} className="h-10 pl-11 rounded-xl border-white/10 bg-black/20 text-white placeholder:text-white/30 focus-visible:ring-white/30" placeholder="Ciudad" required />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-white/60 ml-1 uppercase tracking-wider">Dimensiones</Label>
                <div className="relative">
                  <Ruler className="absolute left-4 top-3 h-4 w-4 text-white/40" />
                  <Input value={formData.dimensiones} onChange={e => handleInputChange("dimensiones", e.target.value)} className="h-10 pl-11 rounded-xl border-white/10 bg-black/20 text-white placeholder:text-white/30 focus-visible:ring-white/30" placeholder="180 m²" />
                </div>
              </div>
            </div>

            {/* Precio y Tipo */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-white/60 ml-1 uppercase tracking-wider">Precio (USD)</Label>
                <Input type="number" value={formData.precio} onChange={e => handleInputChange("precio", e.target.value)} className="h-10 rounded-xl border-white/10 bg-black/20 text-white placeholder:text-white/30 focus-visible:ring-white/30" placeholder="0.00" required />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-white/60 ml-1 uppercase tracking-wider">Tipo</Label>
                <Select value={formData.tipo_propiedad} onValueChange={v => handleInputChange("tipo_propiedad", v)}>
                  <SelectTrigger className="h-10 rounded-xl border-white/10 bg-black/20 text-white"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-roma-olive text-white border-white/10">
                    <SelectItem value="Casa">Casa</SelectItem>
                    <SelectItem value="Campo">Campo</SelectItem>
                    <SelectItem value="Lote">Lote</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Subida de Imagen compacta */}
            <label htmlFor="imagen" className="flex items-center justify-center gap-3 p-4 border-2 border-dashed border-white/20 rounded-2xl cursor-pointer hover:bg-white/5 transition-all text-center bg-black/20">
               <Upload className="h-5 w-5 text-white/70" />
               <p className="text-xs text-white/70 font-bold uppercase tracking-tight">{archivoImagen ? "Imagen Lista" : "Subir foto principal"}</p>
               <input id="imagen" type="file" accept="image/*" onChange={e => setArchivoImagen(e.target.files?.[0] || null)} className="hidden" />
            </label>

            {/* Destacar */}
            <div className="flex items-center justify-between bg-black/20 p-3 rounded-xl border border-white/10">
              <div className="flex items-center gap-2.5 text-white">
                <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                <span className="font-bold text-xs uppercase tracking-wider">Destacar</span>
              </div>
              <Switch checked={formData.destacada} onCheckedChange={v => handleInputChange("destacada", v)} />
            </div>

            {/* Botón Principal */}
            <Button type="submit" disabled={loading} className="w-full bg-white hover:bg-white/90 text-roma-dark font-black h-12 rounded-xl shadow-lg transition-all">
              {loading ? <Loader2 className="animate-spin h-5 w-5" /> : <Save className="mr-2 h-4 w-4" />}
              {editandoId ? "GUARDAR CAMBIOS" : "PUBLICAR INMUEBLE"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}