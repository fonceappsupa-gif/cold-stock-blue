import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Package, 
  Users, 
  AlertTriangle, 
  TrendingUp,
  Calendar,
  Plus,
  Settings,
  BarChart3,
  LogOut,
  Snowflake
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export default function SimpleDashboard() {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error",
        description: "Error al cerrar sesión",
        variant: "destructive",
      });
    } else {
      navigate('/');
    }
  };

  const mockStats = {
    totalProducts: 45,
    totalUsers: 3,
    expiringSoon: 8,
    totalStock: 1247
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Snowflake className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Cold Stock
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">
                {user?.user_metadata?.full_name || user?.email}
              </span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Salir
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Dashboard de Inventario</h1>
              <p className="text-muted-foreground">
                Bienvenido a Cold Stock - Control inteligente de inventarios
              </p>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Configuración
              </Button>
              <Button size="sm" className="bg-gradient-primary">
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Producto
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="hover:shadow-cold transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Productos</CardTitle>
                <Package className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockStats.totalProducts}</div>
                <p className="text-xs text-muted-foreground">
                  Productos registrados
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-cold transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Stock Total</CardTitle>
                <BarChart3 className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockStats.totalStock}</div>
                <p className="text-xs text-muted-foreground">
                  Unidades en inventario
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-cold transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Usuarios</CardTitle>
                <Users className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockStats.totalUsers}</div>
                <p className="text-xs text-muted-foreground">
                  Usuarios activos
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-cold transition-all duration-300 border-destructive/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Próximos a Vencer</CardTitle>
                <AlertTriangle className="h-4 w-4 text-destructive" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-destructive">{mockStats.expiringSoon}</div>
                <p className="text-xs text-muted-foreground">
                  En los próximos 7 días
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  <span>Alertas de Vencimiento</span>
                </CardTitle>
                <CardDescription>
                  Productos que requieren atención inmediata
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-destructive/10 rounded-lg">
                    <div>
                      <p className="font-medium">Productos próximos a vencer</p>
                      <p className="text-sm text-muted-foreground">
                        {mockStats.expiringSoon} productos vencen en 7 días
                      </p>
                    </div>
                    <Badge variant="destructive">Urgente</Badge>
                  </div>
                  
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">
                      Esta es una demostración del sistema Cold Stock
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Para acceder a datos reales, configure la conexión con su base de datos
                    </p>
                  </div>
                  
                  <Button variant="outline" className="w-full">
                    Ver Todos los Vencimientos
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <span>Acciones Rápidas</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Package className="h-4 w-4 mr-2" />
                  Agregar Producto
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Users className="h-4 w-4 mr-2" />
                  Gestionar Usuarios
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Ver Reportes
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Settings className="h-4 w-4 mr-2" />
                  Configuración
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Feature Showcase */}
          <Card>
            <CardHeader>
              <CardTitle>Características de Cold Stock</CardTitle>
              <CardDescription>
                Sistema completo de gestión de inventarios con control de caducidad
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4">
                  <div className="w-12 h-12 bg-gradient-cold rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Calendar className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Control de Caducidad</h3>
                  <p className="text-sm text-muted-foreground">
                    Alertas automáticas para productos próximos a vencer
                  </p>
                </div>
                
                <div className="text-center p-4">
                  <div className="w-12 h-12 bg-gradient-cold rounded-lg flex items-center justify-center mx-auto mb-4">
                    <BarChart3 className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Dashboard Interactivo</h3>
                  <p className="text-sm text-muted-foreground">
                    Visualización en tiempo real de métricas importantes
                  </p>
                </div>
                
                <div className="text-center p-4">
                  <div className="w-12 h-12 bg-gradient-cold rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Gestión de Equipos</h3>
                  <p className="text-sm text-muted-foreground">
                    Roles diferenciados para administradores y operarios
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}