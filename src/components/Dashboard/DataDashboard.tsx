// @ts-nocheck
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, Edit, TrendingUp, TrendingDown, Package } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import EditOrganizationModal from "./EditOrganizationModal";

interface DataDashboardProps {
  organizacionId: string;
}

export default function DataDashboard({ organizacionId }: DataDashboardProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [organizacionNombre, setOrganizacionNombre] = useState("");
  const [movimientosData, setMovimientosData] = useState([]);
  const [productosData, setProductosData] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    if (organizacionId) {
      fetchOrganizacion();
      fetchMovimientosData();
      fetchProductosData();
    }
  }, [organizacionId]);

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
        setOrganizacionNombre((data as any).nombre || "");
      }
    } catch (error: any) {
      console.error("Error fetching organization:", error);
    }
  };

  const fetchMovimientosData = async () => {
    try {
      const { data, error } = await supabase
        .schema('cold_stock')
        .from('movimiento')
        .select('*')
        .eq('organizacion_id', organizacionId)
        .order('fecha_hora', { ascending: false })
        .limit(30);

      if (error) throw error;

      // Agrupar por día y tipo de movimiento
      const grouped = (data || []).reduce((acc: any, mov: any) => {
        const fecha = new Date(mov.fecha_hora).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
        const existing = acc.find((item: any) => item.fecha === fecha);
        
        if (existing) {
          if (mov.tipo_movimiento === 'entrada') {
            existing.entradas += mov.cantidad;
          } else {
            existing.salidas += mov.cantidad;
          }
        } else {
          acc.push({
            fecha,
            entradas: mov.tipo_movimiento === 'entrada' ? mov.cantidad : 0,
            salidas: mov.tipo_movimiento === 'salida' ? mov.cantidad : 0,
          });
        }
        return acc;
      }, []);

      setMovimientosData(grouped.reverse().slice(-10));
    } catch (error: any) {
      console.error("Error fetching movements data:", error);
    }
  };

  const fetchProductosData = async () => {
    try {
      const { data: productos, error: prodError } = await supabase
        .schema('cold_stock')
        .from('producto')
        .select('producto_id, nombre')
        .eq('organizacion_id', organizacionId);

      if (prodError) throw prodError;

      const { data: stock, error: stockError } = await supabase
        .schema('cold_stock')
        .from('stock_producto')
        .select('producto_id, stock_actual')
        .eq('organizacion_id', organizacionId);

      if (stockError) throw stockError;

      const combined = (productos || []).map((prod: any) => {
        const stockData = (stock || []).find((s: any) => s.producto_id === prod.producto_id);
        return {
          nombre: prod.nombre.length > 15 ? prod.nombre.substring(0, 15) + '...' : prod.nombre,
          stock: stockData?.stock_actual || 0
        };
      }).slice(0, 8);

      setProductosData(combined);
    } catch (error: any) {
      console.error("Error fetching products data:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Datos y Análisis</h2>
          <p className="text-muted-foreground">
            Visualiza el comportamiento de tu inventario
          </p>
        </div>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setIsEditModalOpen(true)}
        >
          <Edit className="h-4 w-4 mr-2" />
          Editar Organización
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Movimientos de Inventario
            </CardTitle>
            <CardDescription>
              Entradas y salidas de los últimos días
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={movimientosData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="fecha" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="entradas" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  name="Entradas"
                />
                <Line 
                  type="monotone" 
                  dataKey="salidas" 
                  stroke="hsl(var(--destructive))" 
                  strokeWidth={2}
                  name="Salidas"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              Stock por Producto
            </CardTitle>
            <CardDescription>
              Niveles actuales de inventario
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={productosData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="nombre" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar 
                  dataKey="stock" 
                  fill="hsl(var(--primary))" 
                  name="Stock Actual"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <EditOrganizationModal
        organizacionId={organizacionId}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onUpdate={fetchOrganizacion}
      />
    </div>
  );
}
