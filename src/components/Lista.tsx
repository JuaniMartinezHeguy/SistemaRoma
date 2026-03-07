"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Trash2, Star, MapPin, Home, Building2, TreePine } from "lucide-react";

interface Propiedad {
  id: number;
  titulo: string;
  descripcion: string;
  precio: number;
  tipo_propiedad: string;
  operacion: string;
  ubicacion: string;
  dimensiones: string;
  imagen_url: string;
  destacada: boolean;
}

interface ListaProps {
  propiedades: Propiedad[];
  onEditar: (prop: Propiedad) => void;
  onBorrar: (id: number) => void;
}

export default function Lista({ propiedades, onEditar, onBorrar }: ListaProps) {
  const getPropertyIcon = (tipo: string) => {
    switch (tipo.toLowerCase()) {
      case "casa":
        return <Home className="h-4 w-4" />;
      case "departamento":
        return <Building2 className="h-4 w-4" />;
      case "terreno":
        return <TreePine className="h-4 w-4" />;
      default:
        return <Home className="h-4 w-4" />;
    }
  };

  const formatPrice = (precio: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(precio);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">
            Inventario de Propiedades
          </h1>
          <p className="text-muted-foreground mt-1">
            Gestiona todas tus propiedades desde aquí
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            variant="secondary"
            className="bg-primary/10 text-primary border-primary/20 px-3 py-1.5"
          >
            {propiedades.length} propiedades
          </Badge>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-border/50 bg-card shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Home className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-xl font-bold text-foreground">
                  {propiedades.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <Star className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Destacadas</p>
                <p className="text-xl font-bold text-foreground">
                  {propiedades.filter((p) => p.destacada).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <Building2 className="h-5 w-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">En Venta</p>
                <p className="text-xl font-bold text-foreground">
                  {propiedades.filter((p) => p.operacion === "Venta").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card className="border-border/50 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="font-semibold text-foreground">
                  Propiedad
                </TableHead>
                <TableHead className="font-semibold text-foreground">
                  Tipo
                </TableHead>
                <TableHead className="font-semibold text-foreground">
                  Operación
                </TableHead>
                <TableHead className="font-semibold text-foreground">
                  Ubicación
                </TableHead>
                <TableHead className="font-semibold text-foreground text-right">
                  Precio
                </TableHead>
                <TableHead className="font-semibold text-foreground text-center">
                  Acciones
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {propiedades.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-32 text-center text-muted-foreground"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <Home className="h-10 w-10 text-muted-foreground/50" />
                      <p>No hay propiedades cargadas</p>
                      <p className="text-sm">
                        Comienza agregando tu primera propiedad
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                propiedades.map((prop) => (
                  <TableRow
                    key={prop.id}
                    className="group hover:bg-muted/30 transition-colors"
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                          {prop.imagen_url ? (
                            <img
                              src={prop.imagen_url}
                              alt={prop.titulo}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center">
                              <Home className="h-5 w-5 text-muted-foreground" />
                            </div>
                          )}
                          {prop.destacada && (
                            <div className="absolute top-0.5 right-0.5">
                              <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-foreground truncate max-w-[200px]">
                            {prop.titulo}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {prop.dimensiones}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className="gap-1.5 bg-secondary text-secondary-foreground"
                      >
                        {getPropertyIcon(prop.tipo_propiedad)}
                        {prop.tipo_propiedad}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`${
                          prop.operacion === "Venta"
                            ? "bg-primary/10 text-primary border-primary/20"
                            : "bg-blue-500/10 text-blue-600 border-blue-500/20"
                        }`}
                        variant="outline"
                      >
                        {prop.operacion}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5" />
                        <span className="text-sm">{prop.ubicacion}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="font-semibold text-foreground">
                        {formatPrice(prop.precio)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10"
                          onClick={() => onEditar(prop)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                          onClick={() => onBorrar(prop.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
