// @ts-nocheck
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface EditOrganizationModalProps {
  organizacionId: string;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

export default function EditOrganizationModal({ 
  organizacionId, 
  isOpen, 
  onClose,
  onUpdate 
}: EditOrganizationModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [nombre, setNombre] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen && organizacionId) {
      fetchOrganizacion();
    }
  }, [isOpen, organizacionId]);

  const fetchOrganizacion = async () => {
    try {
      const { data, error } = await supabase
        .schema('cold_stock')
        .from('organizacion')
        .select('nombre')
        .eq('organizacion_id', organizacionId)
        .single();

      if (error) throw error;
      if (data) {
        setNombre((data as any).nombre || "");
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
        .update({ nombre })
        .eq('organizacion_id', organizacionId);

      if (error) throw error;

      toast({
        title: "¡Éxito!",
        description: "Nombre de la organización actualizado",
      });

      onUpdate();
      onClose();
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Organización</DialogTitle>
          <DialogDescription>
            Actualiza el nombre de tu organización
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <Label htmlFor="nombre">Nombre de la Organización</Label>
            <Input
              id="nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Nombre de la organización"
              required
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Guardando..." : "Guardar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
