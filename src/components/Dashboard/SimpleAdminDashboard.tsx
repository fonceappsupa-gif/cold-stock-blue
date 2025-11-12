import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Package, 
  Users, 
  AlertTriangle, 
  Plus,
  Settings,
  BarChart3,
  LogOut,
  Snowflake
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export default function SimpleAdminDashboard() {
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({
    totalProducts: 15,
    totalOperators: 3,
    expiringSoon: 5,
    totalStock: 847
  });

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
              <Badge className="bg-cyan-500/20 text-cyan-100 border-cyan-500/50">Admin</Badge>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-slate-300">
                {user?.email}
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
              }}>Dashboard Administrativo</h1>
              <p className="text-slate-300">
                Gestiona productos, operarios y configura tu organización
              </p>
            </div>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                className="border-cyan-500/30 text-cyan-100 hover:bg-cyan-500/20"
              >
                <Plus className="h-4 w-4 mr-2" />
                Agregar Operario
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
                <div className="text-2xl font-bold text-white">{stats.totalProducts}</div>
                <p className="text-xs text-cyan-200">
                  Productos registrados
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/70 backdrop-filter backdrop-blur-xl border-cyan-500/20 hover:border-cyan-500/50 hover:shadow-cyan-500/30 transition-all duration-300 hover:scale-105">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white">Operarios</CardTitle>
                <Users className="h-4 w-4 text-cyan-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{stats.totalOperators}</div>
                <p className="text-xs text-cyan-200">
                  Operarios activos
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/70 backdrop-filter backdrop-blur-xl border-cyan-500/20 hover:border-cyan-500/50 hover:shadow-cyan-500/30 transition-all duration-300 hover:scale-105">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white">Stock Total</CardTitle>
                <BarChart3 className="h-4 w-4 text-cyan-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{stats.totalStock}</div>
                <p className="text-xs text-cyan-200">
                  Unidades en inventario
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/70 backdrop-filter backdrop-blur-xl border-red-500/30 hover:border-red-500/50 hover:shadow-red-500/30 transition-all duration-300 hover:scale-105">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white">Próximos a Vencer</CardTitle>
                <AlertTriangle className="h-4 w-4 text-red-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-400">{stats.expiringSoon}</div>
                <p className="text-xs text-red-200">
                  En los próximos 7 días
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Demo Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-slate-900/70 backdrop-filter backdrop-blur-xl border-cyan-500/20">
              <CardHeader>
                <CardTitle className="text-white">Productos Registrados</CardTitle>
                <CardDescription className="text-cyan-200">
                  Lista de productos en tu organización
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border border-cyan-500/10">
                    <div>
                      <p className="font-medium text-white">Leche Deslactosada</p>
                      <p className="text-sm text-cyan-200">Lácteos • Litros</p>
                    </div>
                    <Badge className="bg-cyan-500/20 text-cyan-100 border-cyan-500/50">Min: 20</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border border-cyan-500/10">
                    <div>
                      <p className="font-medium text-white">Yogurt Natural</p>
                      <p className="text-sm text-cyan-200">Lácteos • Unidad</p>
                    </div>
                    <Badge className="bg-cyan-500/20 text-cyan-100 border-cyan-500/50">Min: 50</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border border-cyan-500/10">
                    <div>
                      <p className="font-medium text-white">Queso Fresco</p>
                      <p className="text-sm text-cyan-200">Lácteos • Kg</p>
                    </div>
                    <Badge className="bg-cyan-500/20 text-cyan-100 border-cyan-500/50">Min: 10</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/70 backdrop-filter backdrop-blur-xl border-cyan-500/20">
              <CardHeader>
                <CardTitle className="text-white">Operarios Activos</CardTitle>
                <CardDescription className="text-cyan-200">
                  Personal de tu organización
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border border-cyan-500/10">
                    <div>
                      <p className="font-medium text-white">María González</p>
                      <p className="text-sm text-cyan-200">maria@empresa.com</p>
                    </div>
                    <Badge className="bg-blue-500/20 text-blue-100 border-blue-500/50">Operario</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border border-cyan-500/10">
                    <div>
                      <p className="font-medium text-white">Carlos Ruiz</p>
                      <p className="text-sm text-cyan-200">carlos@empresa.com</p>
                    </div>
                    <Badge className="bg-blue-500/20 text-blue-100 border-blue-500/50">Operario</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border border-cyan-500/10">
                    <div>
                      <p className="font-medium text-white">Ana López</p>
                      <p className="text-sm text-cyan-200">ana@empresa.com</p>
                    </div>
                    <Badge className="bg-blue-500/20 text-blue-100 border-blue-500/50">Operario</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Feature Demo */}
          <Card className="bg-slate-900/70 backdrop-filter backdrop-blur-xl border-cyan-500/20">
            <CardHeader>
                <CardTitle className="text-white">Sistema Cold Stock - Demo</CardTitle>
                <CardDescription className="text-cyan-200">
                  Esta es una demostración de las capacidades del sistema
                </CardDescription>
            </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-cyan-200 mb-4">
                    🔧 Sistema en desarrollo - Las funcionalidades completas estarán disponibles próximamente
                  </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                    <div className="p-4 border border-cyan-500/20 rounded-lg bg-slate-800/30 hover:bg-slate-800/50 transition-all">
                      <Package className="h-8 w-8 text-cyan-400 mx-auto mb-2" />
                      <h3 className="font-semibold text-white">Gestión de Productos</h3>
                      <p className="text-sm text-cyan-200">
                        Catálogo completo con categorías y unidades
                      </p>
                    </div>
                    <div className="p-4 border border-cyan-500/20 rounded-lg bg-slate-800/30 hover:bg-slate-800/50 transition-all">
                      <Users className="h-8 w-8 text-cyan-400 mx-auto mb-2" />
                      <h3 className="font-semibold text-white">Control de Usuarios</h3>
                      <p className="text-sm text-cyan-200">
                        Roles diferenciados y permisos granulares
                      </p>
                    </div>
                    <div className="p-4 border border-cyan-500/20 rounded-lg bg-slate-800/30 hover:bg-slate-800/50 transition-all">
                      <BarChart3 className="h-8 w-8 text-cyan-400 mx-auto mb-2" />
                      <h3 className="font-semibold text-white">Reportes Avanzados</h3>
                      <p className="text-sm text-cyan-200">
                        Analytics y estadísticas en tiempo real
                      </p>
                    </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}