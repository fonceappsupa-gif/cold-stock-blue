// @ts-nocheck - Esquema cold_stock no está en tipos generados
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface OrganizationManagerProps {
  organizacionId: string;
}

export default function OrganizationManager({ organizacionId }: OrganizationManagerProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [organizacion, setOrganizacion] = useState({
    nombre: ""
  });

  const { toast } = useToast();

  useEffect(() => {
    if (organizacionId) {
      fetchOrganizacion();
    }
  }, [organizacionId]);

  const fetchOrganizacion = async () => {
    try {
      const { data, error } = await supabase
        .schema('cold_stock')
        .from('organizacion')
        .select('*')
        .eq('organizacion_id', organizacionId)
        .single();

      if (error) throw error;

      if (data) {
        setOrganizacion({
          nombre: (data as any).nombre || ""
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo cargar la organización",
        variant: "destructive",
      });
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase
        .schema('cold_stock')
        .from('organizacion')
        .update({
          nombre: organizacion.nombre
        })
        .eq('organizacion_id', organizacionId);

      if (error) throw error;

      toast({
        title: "¡Éxito!",
        description: "Organización actualizada correctamente",
      });

      fetchOrganizacion();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo actualizar la organización",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Building2 className="h-5 w-5 text-primary" />
          <span>Información de la Organización</span>
        </CardTitle>
        <CardDescription>
          Edita los datos de tu organización
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <Label htmlFor="nombre">Nombre de la Organización</Label>
            <Input
              id="nombre"
              value={organizacion.nombre}
              onChange={(e) => setOrganizacion({ ...organizacion, nombre: e.target.value })}
              placeholder="Nombre de la organización"
              required
            />
          </div>

          <Button 
            type="submit" 
            disabled={isLoading}
            className="bg-gradient-primary"
          >
            {isLoading ? "Guardando..." : "Guardar Cambios"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
