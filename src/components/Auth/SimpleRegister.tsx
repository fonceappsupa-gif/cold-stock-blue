// @ts-nocheck - Esquema cold_stock no está en tipos generados
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Snowflake, Building2, User, Mail, Lock, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function SimpleRegister() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
    organizationName: "",
    organizationDescription: ""
  });

  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Registrar usuario
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            role: 'admin'
          }
        }
      });

      if (authError) throw authError;

      if (authData.user) {
        // Crear organización
        // @ts-ignore - Esquema cold_stock no está en tipos generados
        const { data: orgData, error: orgError } = await supabase
          .schema('cold_stock')
          .from('organizacion')
          .insert({
            nombre: formData.organizationName,
          })
          .select()
          .single();

        if (orgError) throw orgError;

        // Crear perfil de admin
        const [nombre, ...apellidoArr] = formData.fullName.split(' ');
        const apellido = apellidoArr.join(' ') || nombre;

        if (!orgData) throw new Error("No se pudo crear la organización");

        // @ts-ignore - Acceso a propiedades del esquema cold_stock
        const orgId = (orgData as any).organizacion_id;

        // @ts-ignore - Esquema cold_stock no está en tipos generados
        const { error: perfilError } = await supabase
          .schema('cold_stock')
          .from('perfil')
          .insert({
            perfil_id: authData.user.id,
            organizacion_id: orgId,
            nombre: nombre,
            apellido: apellido,
            correo: formData.email,
            tipo: 'admin'
          });

        if (perfilError) throw perfilError;

        toast({
          title: "¡Registro exitoso!",
          description: "Tu cuenta y organización han sido creadas. Por favor verifica tu email.",
        });

        navigate('/login');
      }
    } catch (error: any) {
      toast({
        title: "Error en el registro",
        description: error.message || "Ha ocurrido un error durante el registro",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-arctic flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 text-primary hover:opacity-80 transition-opacity mb-4">
            <ArrowLeft className="h-4 w-4" />
            <span>Volver al inicio</span>
          </Link>
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Snowflake className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Cold Stock
            </span>
          </div>
          <h1 className="text-3xl font-bold mb-2">Crear Cuenta de Administrador</h1>
          <p className="text-muted-foreground">
            Regístrate como administrador para gestionar tu inventario
          </p>
        </div>

        <Card className="shadow-frost">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5 text-primary" />
              <span>Información del Administrador</span>
            </CardTitle>
            <CardDescription>
              Crea tu cuenta de administrador
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Información del Usuario */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="fullName">Nombre Completo</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Tu nombre completo"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="admin@empresa.com"
                      className="pl-10 mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="password">Contraseña</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="pl-10 mt-1"
                      minLength={6}
                    />
                  </div>
                </div>
              </div>

              {/* Información de la Organización */}
              <div className="border-t pt-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Building2 className="h-5 w-5 text-primary" />
                  <span className="font-semibold">Información de la Organización</span>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="organizationName">Nombre de la Organización</Label>
                    <Input
                      id="organizationName"
                      name="organizationName"
                      type="text"
                      required
                      value={formData.organizationName}
                      onChange={handleChange}
                      placeholder="Mi Empresa S.A."
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="organizationDescription">Descripción (Opcional)</Label>
                    <Textarea
                      id="organizationDescription"
                      name="organizationDescription"
                      value={formData.organizationDescription}
                      onChange={handleChange}
                      placeholder="Descripción breve de tu organización..."
                      className="mt-1"
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-primary shadow-cold hover:shadow-frost" 
                disabled={isLoading}
              >
                {isLoading ? "Creando cuenta..." : "Crear Cuenta"}
              </Button>

              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  ¿Ya tienes cuenta?{" "}
                  <Link to="/login" className="text-primary hover:underline">
                    Iniciar sesión
                  </Link>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}