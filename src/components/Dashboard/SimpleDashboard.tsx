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
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="bg-slate-900/70 backdrop-filter backdrop-blur-xl border-b border-cyan-500/20 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-cyan-400 to-blue-600 p-2 rounded-lg">
                <Snowflake className="h-6 w-6 text-white animate-spin" style={{ animationDuration: '3s' }} />
              </div>
              <span className="text-2xl font-bold text-white" style={{
                textShadow: '0 0 10px rgba(56, 189, 248, 0.5)'
              }}>
                Cold Stock
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-slate-300">
                {user?.user_metadata?.full_name || user?.email}
              </span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleLogout}
                className="border-cyan-500/30 text-cyan-100 hover:bg-cyan-500/20"
              >
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
              <h1 className="text-3xl font-bold text-white" style={{
                textShadow: '0 0 10px rgba(56, 189, 248, 0.3)'
              }}>Dashboard de Inventario</h1>
              <p className="text-slate-300">
                Bienvenido a Cold Stock - Control inteligente de inventarios
              </p>
            </div>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                className="border-cyan-500/30 text-cyan-100 hover:bg-cyan-500/20"
              >
                <Settings className="h-4 w-4 mr-2" />
                Configuración
              </Button>
              <Button 
                size="sm" 
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/30"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Producto
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-slate-900/70 backdrop-filter backdrop-blur-xl border-cyan-500/20 hover:border-cyan-500/50 hover:shadow-cyan-500/30 transition-all duration-300 hover:scale-105">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white">Total Productos</CardTitle>
                <Package className="h-4 w-4 text-cyan-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-cyan-100">{mockStats.totalProducts}</div>
                <p className="text-xs text-slate-300">
                  Productos registrados
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/70 backdrop-filter backdrop-blur-xl border-cyan-500/20 hover:border-cyan-500/50 hover:shadow-cyan-500/30 transition-all duration-300 hover:scale-105">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white">Stock Total</CardTitle>
                <BarChart3 className="h-4 w-4 text-cyan-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-cyan-100">{mockStats.totalStock}</div>
                <p className="text-xs text-slate-300">
                  Unidades en inventario
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/70 backdrop-filter backdrop-blur-xl border-cyan-500/20 hover:border-cyan-500/50 hover:shadow-cyan-500/30 transition-all duration-300 hover:scale-105">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white">Usuarios</CardTitle>
                <Users className="h-4 w-4 text-cyan-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-cyan-100">{mockStats.totalUsers}</div>
                <p className="text-xs text-slate-300">
                  Usuarios activos
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/70 backdrop-filter backdrop-blur-xl border-red-500/30 hover:border-red-500/50 hover:shadow-red-500/30 transition-all duration-300 hover:scale-105">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white">Próximos a Vencer</CardTitle>
                <AlertTriangle className="h-4 w-4 text-red-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-400">{mockStats.expiringSoon}</div>
                <p className="text-xs text-slate-300">
                  En los próximos 7 días
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 bg-slate-900/70 backdrop-filter backdrop-blur-xl border-cyan-500/20">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white">
                  <Calendar className="h-5 w-5 text-cyan-400" />
                  <span>Alertas de Vencimiento</span>
                </CardTitle>
                <CardDescription className="text-slate-300">
                  Productos que requieren atención inmediata
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
                    <div>
                      <p className="font-medium text-white">Productos próximos a vencer</p>
                      <p className="text-sm text-slate-300">
                        {mockStats.expiringSoon} productos vencen en 7 días
                      </p>
                    </div>
                    <Badge className="bg-red-500/30 text-red-100 border-red-500/50">Urgente</Badge>
                  </div>
                  
                  <div className="text-center py-8">
                    <p className="text-slate-300 mb-4">
                      Esta es una demostración del sistema Cold Stock
                    </p>
                    <p className="text-sm text-slate-400">
                      Para acceder a datos reales, configure la conexión con su base de datos
                    </p>
                  </div>
                  
                  <Button variant="outline" className="w-full border-cyan-500/30 text-cyan-100 hover:bg-cyan-500/20">
                    Ver Todos los Vencimientos
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/70 backdrop-filter backdrop-blur-xl border-cyan-500/20">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white">
                  <TrendingUp className="h-5 w-5 text-cyan-400" />
                  <span>Acciones Rápidas</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start border-cyan-500/30 text-cyan-100 hover:bg-cyan-500/20">
                  <Package className="h-4 w-4 mr-2" />
                  Agregar Producto
                </Button>
                <Button variant="outline" className="w-full justify-start border-cyan-500/30 text-cyan-100 hover:bg-cyan-500/20">
                  <Users className="h-4 w-4 mr-2" />
                  Gestionar Usuarios
                </Button>
                <Button variant="outline" className="w-full justify-start border-cyan-500/30 text-cyan-100 hover:bg-cyan-500/20">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Ver Reportes
                </Button>
                <Button variant="outline" className="w-full justify-start border-cyan-500/30 text-cyan-100 hover:bg-cyan-500/20">
                  <Settings className="h-4 w-4 mr-2" />
                  Configuración
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Feature Showcase */}
          <Card className="bg-slate-900/70 backdrop-filter backdrop-blur-xl border-cyan-500/20">
            <CardHeader>
              <CardTitle className="text-white">Características de Cold Stock</CardTitle>
              <CardDescription className="text-slate-300">
                Sistema completo de gestión de inventarios con control de caducidad
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4 shadow-lg shadow-cyan-500/30">
                    <Calendar className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold mb-2 text-white">Control de Caducidad</h3>
                  <p className="text-sm text-slate-300">
                    Alertas automáticas para productos próximos a vencer
                  </p>
                </div>
                
                <div className="text-center p-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4 shadow-lg shadow-cyan-500/30">
                    <BarChart3 className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold mb-2 text-white">Dashboard Interactivo</h3>
                  <p className="text-sm text-slate-300">
                    Visualización en tiempo real de métricas importantes
                  </p>
                </div>
                
                <div className="text-center p-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4 shadow-lg shadow-cyan-500/30">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold mb-2 text-white">Gestión de Equipos</h3>
                  <p className="text-sm text-slate-300">
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