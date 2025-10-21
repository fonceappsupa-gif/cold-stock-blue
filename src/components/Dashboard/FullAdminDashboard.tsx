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
  Building2
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import ProductManager from "./ProductManager";
import OperatorManager from "./OperatorManager";
import MovementManager from "./MovementManager";
import OrganizationManager from "./OrganizationManager";

export default function FullAdminDashboard() {
  const [user, setUser] = useState<any>(null);
  const [organizacionId, setOrganizacionId] = useState<string>("");
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOperators: 0,
    expiringSoon: 0,
    totalStock: 0
  });

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
          setOrganizacionId((perfilData as any).organizacion_id);
          fetchStats((perfilData as any).organizacion_id);
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

  const fetchStats = async (orgId: string) => {
    try {
      // Obtener total de productos
      // @ts-ignore - Esquema cold_stock no está en tipos generados
      const { data: productsData } = await supabase
        .schema('cold_stock')
        .from('producto')
        .select('producto_id', { count: 'exact' })
        .eq('organizacion_id', orgId);

      // Obtener total de operarios
      // @ts-ignore - Esquema cold_stock no está en tipos generados
      const { data: operatorsData } = await supabase
        .schema('cold_stock')
        .from('perfil')
        .select('perfil_id', { count: 'exact' })
        .eq('organizacion_id', orgId)
        .eq('tipo', 'operario');

      // Obtener stock total
      // @ts-ignore - Esquema cold_stock no está en tipos generados
      const { data: stockData } = await supabase
        .schema('cold_stock')
        .from('stock_producto')
        .select('stock_actual')
        .eq('organizacion_id', orgId);

      const totalStock = (stockData || []).reduce((sum: number, item: any) => sum + (item.stock_actual || 0), 0);

      setStats({
        totalProducts: productsData?.length || 0,
        totalOperators: operatorsData?.length || 0,
        expiringSoon: 0,
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
                Cold Stock
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                <CardTitle className="text-sm font-medium">Próximos a Vencer</CardTitle>
                <AlertTriangle className="h-4 w-4 text-destructive" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-destructive">{stats.expiringSoon}</div>
                <p className="text-xs text-muted-foreground">
                  En los próximos 7 días
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Tabs de gestión */}
          <Tabs defaultValue="organization" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="organization">
                <Building2 className="h-4 w-4 mr-2" />
                Organización
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
            <TabsContent value="organization" className="mt-6">
              <OrganizationManager organizacionId={organizacionId} />
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
