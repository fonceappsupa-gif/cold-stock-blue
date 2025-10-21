// @ts-nocheck - Esquema cold_stock no está en tipos generados
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, ArrowUpDown, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface Product {
  producto_id: string;
  nombre: string;
}

interface Movement {
  movimiento_id: string;
  producto_id: string;
  tipo: string;
  cantidad: number;
  fecha: string;
  producto?: { nombre: string };
}

interface MovementManagerProps {
  organizacionId?: string;
  onUpdate?: () => void;
}

export default function MovementManager({ organizacionId, onUpdate }: MovementManagerProps) {
  const [movements, setMovements] = useState<Movement[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    producto_id: "",
    tipo: "entrada",
    cantidad: 0,
    fecha_vencimiento: ""
  });
  const { toast } = useToast();

  useEffect(() => {
    if (organizacionId) {
      fetchData();
    }
  }, [organizacionId]);

  const fetchData = async () => {
    if (!organizacionId) return;
    
    try {
      // @ts-ignore - Esquema cold_stock no está en tipos generados
      const { data: productsData, error: productsError } = await supabase
        .schema('cold_stock')
        .from('producto')
        .select('producto_id, nombre')
        .eq('organizacion_id', organizacionId);

      if (productsError) throw productsError;
      setProducts(productsData || []);

      // @ts-ignore - Esquema cold_stock no está en tipos generados
      const { data: movementsData, error: movementsError } = await supabase
        .schema('cold_stock')
        .from('movimiento')
        .select('*')
        .eq('organizacion_id', organizacionId)
        .order('fecha', { ascending: false })
        .limit(50);

      if (movementsError) throw movementsError;
      
      // Enriquecer movimientos con nombres de productos
      const enrichedMovements = (movementsData || []).map((mov: any) => {
        const product = (productsData || []).find((p: any) => p.producto_id === mov.producto_id);
        return {
          ...mov,
          producto: product ? { nombre: product.nombre } : undefined
        };
      });

      setMovements(enrichedMovements);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "No se pudieron cargar los datos",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Si es entrada, crear lote
      if (formData.tipo === "entrada") {
        // @ts-ignore - Esquema cold_stock no está en tipos generados
        const { error: loteError } = await supabase
          .schema('cold_stock')
          .from('lote')
          .insert({
            organizacion_id: organizacionId,
            producto_id: formData.producto_id,
            cantidad: formData.cantidad,
            fecha_vencimiento: formData.fecha_vencimiento
          });

        if (loteError) throw loteError;
      }

      // Crear movimiento
      // @ts-ignore - Esquema cold_stock no está en tipos generados
      const { error: movError } = await supabase
        .schema('cold_stock')
        .from('movimiento')
        .insert({
          organizacion_id: organizacionId,
          producto_id: formData.producto_id,
          tipo: formData.tipo,
          cantidad: formData.cantidad
        });

      if (movError) throw movError;

      toast({
        title: "Movimiento registrado",
        description: `${formData.tipo === 'entrada' ? 'Entrada' : 'Salida'} registrada correctamente`,
      });

      setFormData({ producto_id: "", tipo: "entrada", cantidad: 0, fecha_vencimiento: "" });
      setIsDialogOpen(false);
      fetchData();
      
      // Llamar callback de actualización si existe
      if (onUpdate) {
        onUpdate();
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo registrar el movimiento",
        variant: "destructive",
      });
    }
  };

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'entrada': return 'bg-green-500/10 text-green-600 dark:text-green-400';
      case 'salida': return 'bg-red-500/10 text-red-600 dark:text-red-400';
      default: return 'bg-blue-500/10 text-blue-600 dark:text-blue-400';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <ArrowUpDown className="h-5 w-5 text-primary" />
              <span>Movimientos de Inventario</span>
            </CardTitle>
            <CardDescription>Registra entradas y salidas de productos</CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-gradient-primary">
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Movimiento
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Registrar Movimiento</DialogTitle>
                <DialogDescription>
                  Registra una entrada o salida de inventario
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="producto">Producto</Label>
                  <Select
                    value={formData.producto_id}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, producto_id: value }))}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un producto" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map(product => (
                        <SelectItem key={product.producto_id} value={product.producto_id}>
                          {product.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="tipo">Tipo de Movimiento</Label>
                  <Select
                    value={formData.tipo}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, tipo: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="entrada">Entrada</SelectItem>
                      <SelectItem value="salida">Salida</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="cantidad">Cantidad</Label>
                  <Input
                    id="cantidad"
                    type="number"
                    min="1"
                    value={formData.cantidad || ""}
                    onChange={(e) => setFormData(prev => ({ ...prev, cantidad: parseInt(e.target.value) || 0 }))}
                    placeholder="0"
                    required
                  />
                </div>

                {formData.tipo === "entrada" && (
                  <div>
                    <Label htmlFor="fecha_vencimiento">Fecha de Vencimiento</Label>
                    <Input
                      id="fecha_vencimiento"
                      type="date"
                      value={formData.fecha_vencimiento}
                      onChange={(e) => setFormData(prev => ({ ...prev, fecha_vencimiento: e.target.value }))}
                      required
                    />
                  </div>
                )}

                <div className="flex space-x-2">
                  <Button type="submit" className="flex-1">
                    Registrar
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p className="text-center text-muted-foreground py-8">Cargando movimientos...</p>
        ) : movements.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No hay movimientos registrados</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>Producto</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead className="text-right">Cantidad</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {movements.map((movement) => (
                <TableRow key={movement.movimiento_id}>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{format(new Date(movement.fecha), 'dd/MM/yyyy HH:mm')}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    {movement.producto?.nombre || 'Producto desconocido'}
                  </TableCell>
                  <TableCell>
                    <Badge className={getTipoColor(movement.tipo)}>
                      {movement.tipo.charAt(0).toUpperCase() + movement.tipo.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {movement.tipo === 'entrada' ? '+' : '-'}{movement.cantidad}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
