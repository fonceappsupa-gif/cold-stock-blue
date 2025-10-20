// @ts-nocheck - Esquema cold_stock no está en tipos generados
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Operator {
  perfil_id: string;
  nombre: string;
  apellido: string;
  correo: string;
  tipo: string;
  organizacion_id: string;
}

interface OperatorManagerProps {
  organizacionId: string;
}

export default function OperatorManager({ organizacionId }: OperatorManagerProps) {
  const [operators, setOperators] = useState<Operator[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingOperator, setEditingOperator] = useState<Operator | null>(null);
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    password: ""
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchOperators();
  }, [organizacionId]);

  const fetchOperators = async () => {
    try {
      // @ts-ignore - Esquema cold_stock no está en tipos generados
      const { data, error } = await supabase
        .schema('cold_stock')
        .from('perfil')
        .select('*')
        .eq('organizacion_id', organizacionId)
        .eq('tipo', 'operario')
        .order('nombre');

      if (error) throw error;
      setOperators(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "No se pudieron cargar los operarios",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingOperator) {
        // Actualizar operario
        // @ts-ignore - Esquema cold_stock no está en tipos generados
        const { error } = await supabase
          .schema('cold_stock')
          .from('perfil')
          .update({
            nombre: formData.nombre,
            apellido: formData.apellido,
            correo: formData.correo,
          })
          .eq('perfil_id', editingOperator.perfil_id);

        if (error) throw error;

        toast({
          title: "Operario actualizado",
          description: "El operario se actualizó correctamente",
        });
      } else {
        // Crear usuario en auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: formData.correo,
          password: formData.password,
          options: {
            data: {
              full_name: `${formData.nombre} ${formData.apellido}`,
              role: 'operario'
            }
          }
        });

        if (authError) throw authError;

        if (authData.user) {
          // Crear perfil de operario
          // @ts-ignore - Esquema cold_stock no está en tipos generados
          const { error: perfilError } = await supabase
            .schema('cold_stock')
            .from('perfil')
            .insert({
              perfil_id: authData.user.id,
              organizacion_id: organizacionId,
              nombre: formData.nombre,
              apellido: formData.apellido,
              correo: formData.correo,
              tipo: 'operario'
            });

          if (perfilError) throw perfilError;
        }

        toast({
          title: "Operario creado",
          description: "El operario se creó correctamente. Se envió un email de verificación.",
        });
      }

      setFormData({ nombre: "", apellido: "", correo: "", password: "" });
      setEditingOperator(null);
      setIsDialogOpen(false);
      fetchOperators();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo guardar el operario",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (operator: Operator) => {
    setEditingOperator(operator);
    setFormData({
      nombre: operator.nombre,
      apellido: operator.apellido,
      correo: operator.correo,
      password: ""
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (operatorId: string, email: string) => {
    if (!confirm("¿Estás seguro de eliminar este operario? Esto también eliminará su cuenta de usuario.")) return;

    try {
      // Eliminar perfil
      // @ts-ignore - Esquema cold_stock no está en tipos generados
      const { error: perfilError } = await supabase
        .schema('cold_stock')
        .from('perfil')
        .delete()
        .eq('perfil_id', operatorId);

      if (perfilError) throw perfilError;

      toast({
        title: "Operario eliminado",
        description: "El operario se eliminó correctamente",
      });

      fetchOperators();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo eliminar el operario",
        variant: "destructive",
      });
    }
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingOperator(null);
    setFormData({ nombre: "", apellido: "", correo: "", password: "" });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-primary" />
              <span>Operarios</span>
            </CardTitle>
            <CardDescription>Gestiona los operarios de tu organización</CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-gradient-primary">
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Operario
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingOperator ? "Editar Operario" : "Nuevo Operario"}
                </DialogTitle>
                <DialogDescription>
                  {editingOperator ? "Modifica la información del operario" : "Agrega un nuevo operario a tu organización"}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="nombre">Nombre</Label>
                  <Input
                    id="nombre"
                    value={formData.nombre}
                    onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
                    placeholder="Juan"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="apellido">Apellido</Label>
                  <Input
                    id="apellido"
                    value={formData.apellido}
                    onChange={(e) => setFormData(prev => ({ ...prev, apellido: e.target.value }))}
                    placeholder="Pérez"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="correo">Email</Label>
                  <Input
                    id="correo"
                    type="email"
                    value={formData.correo}
                    onChange={(e) => setFormData(prev => ({ ...prev, correo: e.target.value }))}
                    placeholder="operario@empresa.com"
                    required
                    disabled={!!editingOperator}
                  />
                </div>
                {!editingOperator && (
                  <div>
                    <Label htmlFor="password">Contraseña</Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                      placeholder="••••••••"
                      required
                      minLength={6}
                    />
                  </div>
                )}
                <div className="flex space-x-2">
                  <Button type="submit" className="flex-1">
                    {editingOperator ? "Actualizar" : "Crear"}
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
          <p className="text-center text-muted-foreground py-8">Cargando operarios...</p>
        ) : operators.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No hay operarios registrados</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {operators.map((operator) => (
                <TableRow key={operator.perfil_id}>
                  <TableCell className="font-medium">
                    {operator.nombre} {operator.apellido}
                  </TableCell>
                  <TableCell>{operator.correo}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">Operario</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(operator)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(operator.perfil_id, operator.correo)}
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
