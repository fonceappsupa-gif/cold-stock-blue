// @ts-nocheck - Esquema cold_stock no está en tipos generados
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit, Trash2, Package } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Product {
  producto_id: string;
  nombre: string;
  organizacion_id: string;
}

interface ProductManagerProps {
  organizacionId: string;
}

export default function ProductManager({ organizacionId }: ProductManagerProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({ nombre: "" });
  const { toast } = useToast();

  useEffect(() => {
    fetchProducts();
  }, [organizacionId]);

  const fetchProducts = async () => {
    try {
      // @ts-ignore - Esquema cold_stock no está en tipos generados
      const { data, error } = await supabase
        .schema('cold_stock')
        .from('producto')
        .select('*')
        .eq('organizacion_id', organizacionId)
        .order('nombre');

      if (error) throw error;
      setProducts(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "No se pudieron cargar los productos",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingProduct) {
        // Actualizar producto
        // @ts-ignore - Esquema cold_stock no está en tipos generados
        const { error } = await supabase
          .schema('cold_stock')
          .from('producto')
          .update({ nombre: formData.nombre })
          .eq('producto_id', editingProduct.producto_id);

        if (error) throw error;

        toast({
          title: "Producto actualizado",
          description: "El producto se actualizó correctamente",
        });
      } else {
        // Crear producto
        // @ts-ignore - Esquema cold_stock no está en tipos generados
        const { error } = await supabase
          .schema('cold_stock')
          .from('producto')
          .insert({
            nombre: formData.nombre,
            organizacion_id: organizacionId,
          });

        if (error) throw error;

        toast({
          title: "Producto creado",
          description: "El producto se creó correctamente",
        });
      }

      setFormData({ nombre: "" });
      setEditingProduct(null);
      setIsDialogOpen(false);
      fetchProducts();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo guardar el producto",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({ nombre: product.nombre });
    setIsDialogOpen(true);
  };

  const handleDelete = async (productId: string) => {
    if (!confirm("¿Estás seguro de eliminar este producto?")) return;

    try {
      // @ts-ignore - Esquema cold_stock no está en tipos generados
      const { error } = await supabase
        .schema('cold_stock')
        .from('producto')
        .delete()
        .eq('producto_id', productId);

      if (error) throw error;

      toast({
        title: "Producto eliminado",
        description: "El producto se eliminó correctamente",
      });

      fetchProducts();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo eliminar el producto",
        variant: "destructive",
      });
    }
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingProduct(null);
    setFormData({ nombre: "" });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <Package className="h-5 w-5 text-primary" />
              <span>Productos</span>
            </CardTitle>
            <CardDescription>Gestiona los productos de tu inventario</CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-gradient-primary">
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Producto
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingProduct ? "Editar Producto" : "Nuevo Producto"}
                </DialogTitle>
                <DialogDescription>
                  {editingProduct ? "Modifica la información del producto" : "Agrega un nuevo producto al inventario"}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="nombre">Nombre del Producto</Label>
                  <Input
                    id="nombre"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ nombre: e.target.value })}
                    placeholder="Ej: Leche Deslactosada"
                    required
                  />
                </div>
                <div className="flex space-x-2">
                  <Button type="submit" className="flex-1">
                    {editingProduct ? "Actualizar" : "Crear"}
                  </Button>
                  <Button type="button" variant="outline" onClick={handleDialogClose}>
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
          <p className="text-center text-muted-foreground py-8">Cargando productos...</p>
        ) : products.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No hay productos registrados</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.producto_id}>
                  <TableCell className="font-medium">{product.nombre}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(product)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(product.producto_id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
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
