// @ts-nocheck - Esquema cold_stock no está en tipos generados
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Package, 
  Users, 
  AlertTriangle, 
  BarChart3,
  LogOut,
  Snowflake,
  ArrowUpDown,
  LineChart
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import ProductManager from "./ProductManager";
import OperatorManager from "./OperatorManager";
import MovementManager from "./MovementManager";
import DataDashboardEnhanced from "./DataDashboardEnhanced";

export default function FullAdminDashboard() {
  const [user, setUser] = useState<any>(null);
  const [organizacionId, setOrganizacionId] = useState<string>("");
  const [organizacionNombre, setOrganizacionNombre] = useState<string>("");
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOperators: 0,
    expiringSoon7: 0,
    expiringSoon3: 0,
    totalStock: 0
  });
  const [expiringLots, setExpiringLots] = useState<any[]>([]);
  const [visibleLotsCount, setVisibleLotsCount] = useState(5);

  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        // Obtener perfil del usuario
        // @ts-ignore - Esquema cold_stock no está en tipos generados
        const { data: perfilData, error: perfilError } = await supabase
          .schema('cold_stock')
          .from('perfil')
          .select('organizacion_id')
          .eq('perfil_id', user.id)
          .single();

        if (perfilError) throw perfilError;

        if (perfilData) {
          // @ts-ignore - Acceso a propiedades del esquema cold_stock
          const orgId = (perfilData as any).organizacion_id;
          setOrganizacionId(orgId);
          fetchStats(orgId);
          fetchOrganizacionNombre(orgId);
        }
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo cargar la información del usuario",
        variant: "destructive",
      });
    }
  };

  const fetchOrganizacionNombre = async (orgId: string) => {
    try {
      const { data, error } = await supabase
        .schema('cold_stock')
        .from('organizacion')
        .select('nombre')
        .eq('organizacion_id', orgId)
        .single();

      if (error) throw error;
      if (data) {
        setOrganizacionNombre((data as any).nombre || "");
      }
    } catch (error: any) {
      console.error("Error fetching organization name:", error);
    }
  };

  const fetchStats = async (orgId: string) => {
    try {
      // Obtener total de productos
      const { data: productsData } = await supabase
        .schema('cold_stock')
        .from('producto')
        .select('producto_id', { count: 'exact' })
        .eq('organizacion_id', orgId);

      // Obtener total de operarios
      const { data: operatorsData } = await supabase
        .schema('cold_stock')
        .from('perfil')
        .select('perfil_id', { count: 'exact' })
        .eq('organizacion_id', orgId)
        .eq('tipo', 'operario');

      // Obtener stock total
      const { data: stockData } = await supabase
        .schema('cold_stock')
        .from('stock_producto')
        .select('stock_actual')
        .eq('organizacion_id', orgId);

      const totalStock = (stockData || []).reduce((sum: number, item: any) => sum + (item.stock_actual || 0), 0);

      // Obtener lotes con información de productos
      const { data: lotes } = await supabase
        .schema('cold_stock')
        .from('lote')
        .select('lote_id, fecha_vencimiento, cantidad, producto_id')
        .eq('organizacion_id', orgId);

      const lotesConProductos = await Promise.all((lotes || []).map(async (lote: any) => {
        const { data: producto } = await supabase
          .schema('cold_stock')
          .from('producto')
          .select('nombre')
          .eq('producto_id', lote.producto_id)
          .single();
        
        // Calcular días usando UTC-5 (Colombia)
        const ahora = new Date();
        const hoyColombia = new Date(ahora.getTime() - (5 * 60 * 60 * 1000));
        const hoyInicio = new Date(hoyColombia.getFullYear(), hoyColombia.getMonth(), hoyColombia.getDate());
        
        const fechaVencimiento = new Date(lote.fecha_vencimiento + 'T00:00:00-05:00');
        const vencimientoInicio = new Date(fechaVencimiento.getFullYear(), fechaVencimiento.getMonth(), fechaVencimiento.getDate());
        
        const diasParaVencer = Math.ceil((vencimientoInicio.getTime() - hoyInicio.getTime()) / (1000 * 60 * 60 * 24));
        
        return {
          ...lote,
          producto_nombre: producto?.nombre || 'Desconocido',
          dias_para_vencer: diasParaVencer
        };
      }));

      const expiringSoon7 = lotesConProductos.filter(l => l.dias_para_vencer <= 7 && l.dias_para_vencer >= 0 && l.cantidad > 0).length;
      const expiringSoon3 = lotesConProductos.filter(l => l.dias_para_vencer <= 3 && l.dias_para_vencer >= 0 && l.cantidad > 0).length;
      
      // Ordenar por días para vencer (los más próximos primero) y filtrar lotes con stock > 0
      const sortedExpiringLots = lotesConProductos
        .filter(l => l.dias_para_vencer >= 0 && l.dias_para_vencer <= 7 && l.cantidad > 0)
        .sort((a, b) => a.dias_para_vencer - b.dias_para_vencer);

      setExpiringLots(sortedExpiringLots);

      setStats({
        totalProducts: productsData?.length || 0,
        totalOperators: operatorsData?.length || 0,
        expiringSoon7,
        expiringSoon3,
        totalStock: totalStock
      });
    } catch (error: any) {
      console.error("Error fetching stats:", error);
    }
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

  if (!organizacionId) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p>Cargando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="glass-card sticky top-0 z-50 border-b border-cyan-500/20">
        <style>{`
          .glass-card {
            background: rgba(15, 23, 42, 0.7);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(56, 189, 248, 0.2);
          }
        `}</style>
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-to-br from-cyan-400 to-blue-600 p-2 rounded-lg">
                <Snowflake className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">
                {organizacionNombre || "Cold Stock"}
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
                className="text-black border-cyan-500/50 hover:bg-cyan-500/20 hover:text-white"
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
          <div>
            <h1 className="text-3xl font-bold text-white">Dashboard Administrativo</h1>
            <p className="text-slate-300">
              Gestiona productos, operarios y movimientos de inventario
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <Card className="glass-card border-cyan-500/20 hover:border-cyan-500/50 transition-all duration-300 hover:scale-105">
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

            <Card className="glass-card border-cyan-500/20 hover:border-cyan-500/50 transition-all duration-300 hover:scale-105">
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

            <Card className="glass-card border-cyan-500/20 hover:border-cyan-500/50 transition-all duration-300 hover:scale-105">
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

            <Card className="glass-card border-orange-500/40 hover:border-orange-500/60 transition-all duration-300 hover:scale-105">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white">Vencen en 7 días</CardTitle>
                <AlertTriangle className="h-4 w-4 text-orange-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-400">{stats.expiringSoon7}</div>
                <p className="text-xs text-orange-200">
                  Lotes próximos
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card border-red-500/40 hover:border-red-500/60 transition-all duration-300 hover:scale-105">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white">Vencen en 3 días</CardTitle>
                <AlertTriangle className="h-4 w-4 text-red-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-400">{stats.expiringSoon3}</div>
                <p className="text-xs text-red-200">
                  Lotes críticos
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Lotes Próximos a Vencer */}
          {expiringLots.length > 0 && (
            <Card className="glass-card border-orange-500/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <AlertTriangle className="h-5 w-5 text-orange-400" />
                  Lotes Próximos a Vencer
                </CardTitle>
                <CardDescription className="text-cyan-200">
                  Productos que requieren atención urgente
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {expiringLots.slice(0, visibleLotsCount).map((lote) => (
                    <div 
                      key={lote.lote_id} 
                      className={`flex items-center justify-between p-3 rounded-lg border ${
                        lote.dias_para_vencer <= 3 ? 'bg-red-500/10 border-red-500/30' : 'bg-orange-500/10 border-orange-500/30'
                      }`}
                    >
                      <div className="flex-1">
                        <p className="font-medium text-white">{lote.producto_nombre}</p>
                        <p className="text-sm text-cyan-200">
                          Lote: {lote.lote_id} • Cantidad: {lote.cantidad}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge className={lote.dias_para_vencer <= 3 ? 'bg-red-500/20 text-red-300 border-red-500/50' : 'bg-orange-500/20 text-orange-300 border-orange-500/50'}>
                          {lote.dias_para_vencer === 0 ? 'Vence hoy' : 
                           lote.dias_para_vencer === 1 ? 'Vence mañana' : 
                           `${lote.dias_para_vencer} días`}
                        </Badge>
                        <p className="text-xs text-cyan-300 mt-1">
                          {new Date(lote.fecha_vencimiento).toLocaleDateString('es-ES')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                {expiringLots.length > 5 && (
                  <div className="mt-4 flex justify-center">
                    {visibleLotsCount < expiringLots.length ? (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setVisibleLotsCount(prev => Math.min(prev + 5, expiringLots.length))}
                        className="text-black border-cyan-500/50 hover:bg-cyan-500/20 hover:text-white"
                      >
                        Mostrar más
                      </Button>
                    ) : (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setVisibleLotsCount(5)}
                        className="text-cyan-100 border-cyan-500/50 hover:bg-cyan-500/20"
                      >
                        Ocultar
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Tabs de gestión */}
          <Tabs defaultValue="data" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="data">
                <LineChart className="h-4 w-4 mr-2" />
                Datos
              </TabsTrigger>
              <TabsTrigger value="products">
                <Package className="h-4 w-4 mr-2" />
                Productos
              </TabsTrigger>
              <TabsTrigger value="operators">
                <Users className="h-4 w-4 mr-2" />
                Operarios
              </TabsTrigger>
              <TabsTrigger value="movements">
                <ArrowUpDown className="h-4 w-4 mr-2" />
                Movimientos
              </TabsTrigger>
            </TabsList>
            <TabsContent value="data" className="mt-6">
              <DataDashboardEnhanced organizacionId={organizacionId} />
            </TabsContent>
            <TabsContent value="products" className="mt-6">
              <ProductManager organizacionId={organizacionId} />
            </TabsContent>
            <TabsContent value="operators" className="mt-6">
              <OperatorManager organizacionId={organizacionId} />
            </TabsContent>
            <TabsContent value="movements" className="mt-6">
              <MovementManager organizacionId={organizacionId} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
