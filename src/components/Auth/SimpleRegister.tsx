// @ts-nocheck - Esquema cold_stock no está en tipos generados
import { useState, useEffect } from "react";
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
  const [snowflakes, setSnowflakes] = useState([]);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
    organizationName: "",
    organizationDescription: ""
  });

  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const newSnowflakes = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      animationDuration: `${Math.random() * 3 + 2}s`,
      animationDelay: `${Math.random() * 5}s`,
      size: Math.random() * 8 + 4,
      opacity: Math.random() * 0.5 + 0.2
    }));
    setSnowflakes(newSnowflakes);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Registrar usuario
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password
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
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 overflow-hidden relative">
      {/* Snowfall Effect */}
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        {snowflakes.map((flake) => (
          <div
            key={flake.id}
            className="absolute animate-fall"
            style={{
              left: flake.left,
              top: '-20px',
              width: `${flake.size}px`,
              height: `${flake.size}px`,
              animationDuration: flake.animationDuration,
              animationDelay: flake.animationDelay,
              opacity: flake.opacity
            }}
          >
            <Snowflake className="text-cyan-300 w-full h-full" />
          </div>
        ))}
      </div>

      <style>{`
        @keyframes fall {
          0% {
            transform: translateY(-20px) rotate(0deg);
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
          }
        }
        .animate-fall {
          animation: fall linear infinite;
        }
      `}</style>

      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950"></div>
      <div className="absolute top-20 left-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 text-cyan-400 hover:text-cyan-300 transition-colors mb-4">
            <ArrowLeft className="h-4 w-4" />
            <span>Volver al inicio</span>
          </Link>
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="bg-gradient-to-br from-cyan-400 to-blue-600 p-2 rounded-lg">
              <Snowflake className="h-8 w-8 text-white animate-spin" style={{ animationDuration: '3s' }} />
            </div>
            <span className="text-3xl font-bold text-white" style={{
              textShadow: '0 0 10px rgba(56, 189, 248, 0.5), 0 0 20px rgba(56, 189, 248, 0.3)'
            }}>
              Cold Stock
            </span>
          </div>
          <h1 className="text-3xl font-bold mb-2 text-white">Crear Cuenta de Administrador</h1>
          <p className="text-slate-300">
            Regístrate como administrador para gestionar tu inventario
          </p>
        </div>

        <Card className="bg-slate-900/70 backdrop-filter backdrop-blur-xl border border-cyan-500/20 shadow-2xl shadow-cyan-500/20">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-white">
              <User className="h-5 w-5 text-cyan-400" />
              <span>Información del Administrador</span>
            </CardTitle>
            <CardDescription className="text-slate-300">
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
              <div className="border-t border-cyan-500/20 pt-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Building2 className="h-5 w-5 text-cyan-400" />
                  <span className="font-semibold text-white">Información de la Organización</span>
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
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold shadow-xl hover:shadow-cyan-500/50 transition-all duration-300 hover:scale-105" 
                disabled={isLoading}
              >
                {isLoading ? "Creando cuenta..." : "Crear Cuenta"}
              </Button>

              <div className="text-center">
                <p className="text-sm text-slate-300">
                  ¿Ya tienes cuenta?{" "}
                  <Link to="/login" className="text-cyan-400 hover:text-cyan-300 hover:underline">
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