"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Upload, X, Loader2, Save, Star } from "lucide-react";

interface FormData {
  titulo: string;
  descripcion: string;
  precio: string;
  tipo_propiedad: string;
  operacion: string;
  ubicacion: string;
  dimensiones: string;
  imagen_url: string;
  destacada: boolean;
}

interface FormularioProps {
  formData: FormData;
  setFormData: (data: FormData) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
  editandoId: number | null;
  archivoImagen: File | null;
  setArchivoImagen: (file: File | null) => void;
  onCancelar: () => void;
}

export default function Formulario({
  formData,
  setFormData,
  onSubmit,
  loading,
  editandoId,
  archivoImagen,
  setArchivoImagen,
  onCancelar,
}: FormularioProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setArchivoImagen(file);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">
          {editandoId ? "Editar Propiedad" : "Nueva Propiedad"}
        </h1>
        <p className="text-muted-foreground mt-1">
          {editandoId
            ? "Modifica los datos de la propiedad"
            : "Completa el formulario para publicar una nueva propiedad"}
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <Card className="border-border/50 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-foreground">
                  Información Básica
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="titulo" className="text-foreground">
                    Título de la propiedad
                  </Label>
                  <Input
                    id="titulo"
                    value={formData.titulo}
                    onChange={(e) => handleInputChange("titulo", e.target.value)}
                    placeholder="Ej: Casa moderna con jardín"
                    className="bg-background border-input focus-visible:ring-primary"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="descripcion" className="text-foreground">
                    Descripción
                  </Label>
                  <Textarea
                    id="descripcion"
                    value={formData.descripcion}
                    onChange={(e) =>
                      handleInputChange("descripcion", e.target.value)
                    }
                    placeholder="Describe las características principales de la propiedad..."
                    className="bg-background border-input focus-visible:ring-primary min-h-[120px] resize-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="precio" className="text-foreground">
                      Precio (USD)
                    </Label>
                    <Input
                      id="precio"
                      type="number"
                      value={formData.precio}
                      onChange={(e) => handleInputChange("precio", e.target.value)}
                      placeholder="150000"
                      className="bg-background border-input focus-visible:ring-primary"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dimensiones" className="text-foreground">
                      Dimensiones
                    </Label>
                    <Input
                      id="dimensiones"
                      value={formData.dimensiones}
                      onChange={(e) =>
                        handleInputChange("dimensiones", e.target.value)
                      }
                      placeholder="Ej: 120m² cubiertos"
                      className="bg-background border-input focus-visible:ring-primary"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Property Details */}
            <Card className="border-border/50 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-foreground">
                  Detalles de la Propiedad
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="text-foreground">Tipo de propiedad</Label>
                    <Select
                      value={formData.tipo_propiedad}
                      onValueChange={(value) =>
                        handleInputChange("tipo_propiedad", value)
                      }
                    >
                      <SelectTrigger className="bg-background border-input focus:ring-primary">
                        <SelectValue placeholder="Seleccionar tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Casa">Casa</SelectItem>
                        <SelectItem value="Departamento">Departamento</SelectItem>
                        <SelectItem value="Terreno">Terreno</SelectItem>
                        <SelectItem value="Local">Local Comercial</SelectItem>
                        <SelectItem value="Oficina">Oficina</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-foreground">Operación</Label>
                    <Select
                      value={formData.operacion}
                      onValueChange={(value) =>
                        handleInputChange("operacion", value)
                      }
                    >
                      <SelectTrigger className="bg-background border-input focus:ring-primary">
                        <SelectValue placeholder="Seleccionar operación" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Venta">Venta</SelectItem>
                        <SelectItem value="Alquiler">Alquiler</SelectItem>
                        <SelectItem value="Alquiler Temporario">
                          Alquiler Temporario
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-foreground">Ubicación</Label>
                    <Select
                      value={formData.ubicacion}
                      onValueChange={(value) =>
                        handleInputChange("ubicacion", value)
                      }
                    >
                      <SelectTrigger className="bg-background border-input focus:ring-primary">
                        <SelectValue placeholder="Seleccionar ubicación" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Villalonga">Villalonga</SelectItem>
                        <SelectItem value="Stroeder">Stroeder</SelectItem>
                        <SelectItem value="Patagones">Patagones</SelectItem>
                        <SelectItem value="Viedma">Viedma</SelectItem>
                        <SelectItem value="Bahía Blanca">Bahía Blanca</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Image Upload */}
            <Card className="border-border/50 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-foreground">
                  Imagen Principal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(archivoImagen || formData.imagen_url) && (
                    <div className="relative aspect-video rounded-xl overflow-hidden bg-muted">
                      <img
                        src={
                          archivoImagen
                            ? URL.createObjectURL(archivoImagen)
                            : formData.imagen_url
                        }
                        alt="Preview"
                        className="h-full w-full object-cover"
                      />
                      <Button
                        type="button"
                        variant="secondary"
                        size="icon"
                        className="absolute top-2 right-2 h-8 w-8 bg-background/80 backdrop-blur-sm hover:bg-background"
                        onClick={() => {
                          setArchivoImagen(null);
                          handleInputChange("imagen_url", "");
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}

                  <label
                    htmlFor="imagen"
                    className="flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-primary/50 hover:bg-accent/50 transition-colors"
                  >
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Upload className="h-5 w-5 text-primary" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-foreground">
                        Subir imagen
                      </p>
                      <p className="text-xs text-muted-foreground">
                        PNG, JPG hasta 5MB
                      </p>
                    </div>
                    <input
                      id="imagen"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </CardContent>
            </Card>

            {/* Featured Toggle */}
            <Card className="border-border/50 shadow-sm">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                      <Star className="h-5 w-5 text-amber-500" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Destacada</p>
                      <p className="text-xs text-muted-foreground">
                        Mostrar en inicio
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={formData.destacada}
                    onCheckedChange={(checked) =>
                      handleInputChange("destacada", checked)
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex flex-col gap-3">
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium h-11"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Procesando...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    {editandoId ? "Guardar Cambios" : "Publicar Propiedad"}
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onCancelar}
                className="w-full border-border text-foreground hover:bg-accent h-11"
              >
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
