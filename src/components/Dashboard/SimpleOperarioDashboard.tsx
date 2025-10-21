// @ts-nocheck - Esquema cold_stock no está en tipos generados
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Package, 
  AlertTriangle, 
  TrendingUp,
  LogOut,
  Snowflake,
  BarChart3
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import MovementManager from "./MovementManager";

export default function SimpleOperarioDashboard() {
  const [user, setUser] = useState<any>(null);
  const [organizacionId, setOrganizacionId] = useState<string>("");
  const [organizacionNombre, setOrganizacionNombre] = useState<string>("");
  const [stats, setStats] = useState({
    totalProducts: 0,
    expiringSoon: 0,
    totalStock: 0,
    recentMovements: 0
  });

  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchUserData();
    fetchStats();
  }, []);

  const fetchUserData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
    
    if (user) {
      // Obtener organizacion_id del perfil
      const { data: perfilData } = await supabase
        .schema('cold_stock')
        .from('perfil')
        .select('organizacion_id')
        .eq('perfil_id', user.id)
        .single();
      
      if (perfilData) {
        const orgId = (perfilData as any).organizacion_id;
        setOrganizacionId(orgId);
        fetchOrganizacionNombre(orgId);
      }
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

  const fetchStats = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Obtener organización del usuario
      const { data: perfilData } = await supabase
        .schema('cold_stock')
        .from('perfil')
        .select('organizacion_id')
        .eq('perfil_id', user.id)
        .single();

      if (!perfilData) return;

      // Obtener estadísticas
      const { data: productos } = await supabase
        .schema('cold_stock')
        .from('producto')
        .select('*')
        .eq('organizacion_id', perfilData.organizacion_id);

      const { data: lotes } = await supabase
        .schema('cold_stock')
        .from('lote')
        .select('*')
        .eq('organizacion_id', perfilData.organizacion_id);

      const { data: movimientos } = await supabase
        .schema('cold_stock')
        .from('movimiento')
        .select('*')
        .eq('organizacion_id', perfilData.organizacion_id)
        .gte('fecha_hora', new Date(new Date().setHours(0, 0, 0, 0)).toISOString());

      const today = new Date();
      const expiringSoon = lotes?.filter(l => {
        const expiry = new Date(l.fecha_vencimiento);
        const diffDays = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        return diffDays <= 7 && diffDays >= 0;
      }).length || 0;

      const totalStock = lotes?.reduce((sum, l) => sum + (l.cantidad || 0), 0) || 0;

      setStats({
        totalProducts: productos?.length || 0,
        expiringSoon,
        totalStock,
        recentMovements: movimientos?.length || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
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
              <Badge variant="secondary">Operario</Badge>
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
            <h1 className="text-3xl font-bold">Dashboard de Operario</h1>
            <p className="text-muted-foreground">
              Gestiona movimientos de inventario
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
                  Productos disponibles
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

            <Card className="hover:shadow-cold transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Movimientos Hoy</CardTitle>
                <TrendingUp className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.recentMovements}</div>
                <p className="text-xs text-muted-foreground">
                  Registros del día
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="movements" className="space-y-4">
            <TabsList>
              <TabsTrigger value="movements">Movimientos</TabsTrigger>
            </TabsList>

            <TabsContent value="movements" className="space-y-4">
              <MovementManager organizacionId={organizacionId} onUpdate={fetchStats} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}