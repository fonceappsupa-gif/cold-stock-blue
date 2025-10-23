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
import DataDashboard from "./DataDashboard";

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
        
        // Calcular días usando UTC para evitar problemas de zona horaria
        const hoy = new Date();
        const hoyUTC = Date.UTC(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
        
        const fechaVencimiento = new Date(lote.fecha_vencimiento);
        const vencimientoUTC = Date.UTC(fechaVencimiento.getFullYear(), fechaVencimiento.getMonth(), fechaVencimiento.getDate());
        
        const diasParaVencer = Math.ceil((vencimientoUTC - hoyUTC) / (1000 * 60 * 60 * 24));
        
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Snowflake className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                {organizacionNombre || "Cold Stock"}
              </span>
              <Badge variant="secondary">Admin</Badge>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">
                {user?.email}
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
          <div>
            <h1 className="text-3xl font-bold">Dashboard Administrativo</h1>
            <p className="text-muted-foreground">
              Gestiona productos, operarios y movimientos de inventario
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <Card className="hover:shadow-cold transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Productos</CardTitle>
                <Package className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalProducts}</div>
                <p className="text-xs text-muted-foreground">
                  Productos registrados
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-cold transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Operarios</CardTitle>
                <Users className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalOperators}</div>
                <p className="text-xs text-muted-foreground">
                  Operarios activos
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-cold transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Stock Total</CardTitle>
                <BarChart3 className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalStock}</div>
                <p className="text-xs text-muted-foreground">
                  Unidades en inventario
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-cold transition-all duration-300 border-destructive/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Vencen en 7 días</CardTitle>
                <AlertTriangle className="h-4 w-4 text-destructive" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-destructive">{stats.expiringSoon7}</div>
                <p className="text-xs text-muted-foreground">
                  Lotes próximos
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-cold transition-all duration-300 border-destructive/40">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Vencen en 3 días</CardTitle>
                <AlertTriangle className="h-4 w-4 text-destructive" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-destructive">{stats.expiringSoon3}</div>
                <p className="text-xs text-muted-foreground">
                  Lotes críticos
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Lotes Próximos a Vencer */}
          {expiringLots.length > 0 && (
            <Card className="border-destructive/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                  Lotes Próximos a Vencer
                </CardTitle>
                <CardDescription>
                  Productos que requieren atención urgente
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {expiringLots.map((lote) => (
                    <div 
                      key={lote.lote_id} 
                      className={`flex items-center justify-between p-3 rounded-lg border ${
                        lote.dias_para_vencer <= 3 ? 'bg-destructive/10 border-destructive/30' : 'bg-muted/50'
                      }`}
                    >
                      <div className="flex-1">
                        <p className="font-medium">{lote.producto_nombre}</p>
                        <p className="text-sm text-muted-foreground">
                          Lote: {lote.lote_id} • Cantidad: {lote.cantidad}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge variant={lote.dias_para_vencer <= 3 ? "destructive" : "secondary"}>
                          {lote.dias_para_vencer === 0 ? 'Vence hoy' : 
                           lote.dias_para_vencer === 1 ? 'Vence mañana' : 
                           `${lote.dias_para_vencer} días`}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(lote.fecha_vencimiento).toLocaleDateString('es-ES')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
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
              <DataDashboard organizacionId={organizacionId} />
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
