// @ts-nocheck
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Edit, TrendingUp, Package, CalendarIcon, Filter, BarChart3 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';
import EditOrganizationModal from "./EditOrganizationModal";
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, eachDayOfInterval, eachWeekOfInterval, eachMonthOfInterval } from 'date-fns';
import { es } from 'date-fns/locale';

interface DataDashboardProps {
  organizacionId: string;
}

export default function DataDashboardEnhanced({ organizacionId }: DataDashboardProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [organizacionNombre, setOrganizacionNombre] = useState("");
  const [movimientosData, setMovimientosData] = useState([]);
  const [productosData, setProductosData] = useState([]);
  const [stockHistoryData, setStockHistoryData] = useState([]);
  const [topMovedProductsData, setTopMovedProductsData] = useState([]);
  const [leastMovedProductsData, setLeastMovedProductsData] = useState([]);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [startDate, setStartDate] = useState<Date>(new Date(new Date().getFullYear(), 0, 1));
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [groupBy, setGroupBy] = useState<'day' | 'week' | 'month' | 'year'>('month');
  const { toast } = useToast();

  useEffect(() => {
    if (organizacionId) {
      fetchOrganizacion();
      fetchMovimientosData();
      fetchProductosData();
      fetchAllProducts();
      fetchTopAndLeastMovedProducts();
    }
  }, [organizacionId, startDate, endDate, groupBy]);

  useEffect(() => {
    if (selectedProductId && organizacionId) {
      fetchStockHistory();
    }
  }, [selectedProductId, organizacionId, startDate, endDate]);

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
        .gte('fecha', startDate.toISOString())
        .lte('fecha', endDate.toISOString())
        .order('fecha', { ascending: true });

      if (error) throw error;

      const grouped = groupMovimientosData(data || []);
      setMovimientosData(grouped);
    } catch (error: any) {
      console.error("Error fetching movements data:", error);
    }
  };

  const groupMovimientosData = (data: any[]) => {
    let intervals: Date[] = [];
    
    switch (groupBy) {
      case 'day':
        intervals = eachDayOfInterval({ start: startDate, end: endDate });
        break;
      case 'week':
        intervals = eachWeekOfInterval({ start: startDate, end: endDate });
        break;
      case 'month':
        intervals = eachMonthOfInterval({ start: startDate, end: endDate });
        break;
      case 'year':
        intervals = Array.from(
          { length: endDate.getFullYear() - startDate.getFullYear() + 1 },
          (_, i) => new Date(startDate.getFullYear() + i, 0, 1)
        );
        break;
    }

    return intervals.map(interval => {
      const intervalEnd = groupBy === 'day' ? interval :
                         groupBy === 'week' ? endOfWeek(interval, { locale: es }) :
                         groupBy === 'month' ? endOfMonth(interval) :
                         endOfYear(interval);

      const movimientosInInterval = data.filter(mov => {
        const movDate = new Date(mov.fecha);
        return movDate >= interval && movDate <= intervalEnd;
      });

      const label = groupBy === 'day' ? format(interval, 'dd MMM', { locale: es }) :
                   groupBy === 'week' ? `Sem ${format(interval, 'w', { locale: es })}` :
                   groupBy === 'month' ? format(interval, 'MMM yyyy', { locale: es }) :
                   format(interval, 'yyyy', { locale: es });

      return {
        fecha: label,
        entradas: movimientosInInterval.filter(m => m.tipo === 'entrada').reduce((sum, m) => sum + m.cantidad, 0),
        salidas: movimientosInInterval.filter(m => m.tipo === 'salida').reduce((sum, m) => sum + m.cantidad, 0),
      };
    }).filter(item => item.entradas > 0 || item.salidas > 0);
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

  const fetchAllProducts = async () => {
    try {
      const { data, error } = await supabase
        .schema('cold_stock')
        .from('producto')
        .select('producto_id, nombre')
        .eq('organizacion_id', organizacionId);

      if (error) throw error;
      setAllProducts(data || []);
      
      if (data && data.length > 0 && !selectedProductId) {
        setSelectedProductId(data[0].producto_id);
      }
    } catch (error: any) {
      console.error("Error fetching products:", error);
    }
  };

  const fetchStockHistory = async () => {
    if (!selectedProductId) return;
    
    try {
      const { data: movimientos, error: movError } = await supabase
        .schema('cold_stock')
        .from('movimiento')
        .select('*')
        .eq('organizacion_id', organizacionId)
        .eq('producto_id', selectedProductId)
        .gte('fecha', startDate.toISOString())
        .lte('fecha', endDate.toISOString())
        .order('fecha', { ascending: true });

      if (movError) throw movError;

      const producto = allProducts.find(p => p.producto_id === selectedProductId);
      if (!producto) return;

      // Calculate cumulative stock
      let cumulativeStock = 0;
      const historyData = (movimientos || []).map((mov: any) => {
        const cantidad = mov.tipo === 'entrada' ? mov.cantidad : -mov.cantidad;
        cumulativeStock += cantidad;
        return {
          fecha: format(new Date(mov.fecha), 'dd MMM', { locale: es }),
          stock: cumulativeStock
        };
      });

      setStockHistoryData(historyData);
    } catch (error: any) {
      console.error("Error fetching stock history:", error);
    }
  };

  const fetchTopAndLeastMovedProducts = async () => {
    try {
      const { data: movimientos, error } = await supabase
        .schema('cold_stock')
        .from('movimiento')
        .select('producto_id, cantidad')
        .eq('organizacion_id', organizacionId)
        .gte('fecha', startDate.toISOString())
        .lte('fecha', endDate.toISOString());

      if (error) throw error;

      // Group by product and sum quantities
      const productMovements: { [key: string]: number } = {};
      (movimientos || []).forEach((mov: any) => {
        if (!productMovements[mov.producto_id]) {
          productMovements[mov.producto_id] = 0;
        }
        productMovements[mov.producto_id] += mov.cantidad;
      });

      // Get product names
      const productIds = Object.keys(productMovements);
      const { data: productos, error: prodError } = await supabase
        .schema('cold_stock')
        .from('producto')
        .select('producto_id, nombre')
        .in('producto_id', productIds);

      if (prodError) throw prodError;

      // Combine data
      const combined = (productos || []).map((prod: any) => ({
        nombre: prod.nombre.length > 20 ? prod.nombre.substring(0, 20) + '...' : prod.nombre,
        movimientos: productMovements[prod.producto_id] || 0
      }));

      // Sort and get top 5 and least 5
      const sorted = combined.sort((a, b) => b.movimientos - a.movimientos);
      setTopMovedProductsData(sorted.slice(0, 5));
      setLeastMovedProductsData(sorted.slice(-5).reverse());
    } catch (error: any) {
      console.error("Error fetching top/least moved products:", error);
    }
  };

  return (
    <div className="space-y-6">
      <style>{`
        .glass-card {
          background: rgba(15, 23, 42, 0.7);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(56, 189, 248, 0.2);
        }
      `}</style>
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Datos y Análisis</h2>
          <p className="text-cyan-200">
            Visualiza el comportamiento de tu inventario
          </p>
        </div>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setIsEditModalOpen(true)}
          className="text-black border-cyan-500/50 hover:bg-cyan-500/20 hover:text-white"
        >
          <Edit className="h-4 w-4 mr-2" />
          Editar Organización
        </Button>
      </div>

      {/* Filters */}
      <Card className="glass-card border-cyan-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Filter className="h-5 w-5 text-cyan-400" />
            Filtros de Visualización
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-cyan-200">Fecha Inicio</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal text-black border-cyan-500/50 hover:bg-cyan-500/20 hover:text-white",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, 'PPP', { locale: es }) : <span>Seleccionar fecha</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 pointer-events-auto">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={(date) => date && setStartDate(date)}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-cyan-200">Fecha Fin</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal text-black border-cyan-500/50 hover:bg-cyan-500/20 hover:text-white",
                      !endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, 'PPP', { locale: es }) : <span>Seleccionar fecha</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 pointer-events-auto">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={(date) => date && setEndDate(date)}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-cyan-200">Agrupar por</label>
              <Select value={groupBy} onValueChange={(value: any) => setGroupBy(value)}>
                <SelectTrigger className="text-black border-cyan-500/50 hover:bg-cyan-500/20 hover:text-white">
                  <SelectValue placeholder="Seleccionar agrupación" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">Días</SelectItem>
                  <SelectItem value="week">Semanas</SelectItem>
                  <SelectItem value="month">Meses</SelectItem>
                  <SelectItem value="year">Años</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-card border-cyan-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <TrendingUp className="h-5 w-5 text-cyan-400" />
              Movimientos de Inventario
            </CardTitle>
            <CardDescription className="text-cyan-200">
              Entradas y salidas en el período seleccionado
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={movimientosData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(56, 189, 248, 0.1)" />
                <XAxis dataKey="fecha" stroke="#a5f3fc" />
                <YAxis stroke="#a5f3fc" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                    border: '1px solid rgba(56, 189, 248, 0.2)',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
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

        <Card className="glass-card border-cyan-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Package className="h-5 w-5 text-cyan-400" />
              Stock por Producto
            </CardTitle>
            <CardDescription className="text-cyan-200">
              Niveles actuales de inventario
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={productosData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(56, 189, 248, 0.1)" />
                <XAxis dataKey="nombre" angle={-45} textAnchor="end" height={80} stroke="#a5f3fc" />
                <YAxis stroke="#a5f3fc" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                    border: '1px solid rgba(56, 189, 248, 0.2)',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
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

        <Card className="glass-card border-cyan-500/20 lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <BarChart3 className="h-5 w-5 text-cyan-400" />
              Trazabilidad de Stock por Producto
            </CardTitle>
            <CardDescription className="text-cyan-200">
              Evolución del inventario en el tiempo para un producto específico
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <label className="text-sm font-medium text-cyan-200 mb-2 block">Seleccionar Producto</label>
              <Select value={selectedProductId} onValueChange={setSelectedProductId}>
                <SelectTrigger className="w-full bg-slate-800/50 border-cyan-500/50 text-white">
                  <SelectValue placeholder="Seleccionar producto" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-cyan-500/50">
                  {allProducts.map((producto) => (
                    <SelectItem key={producto.producto_id} value={producto.producto_id} className="text-white hover:bg-cyan-500/20">
                      {producto.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={stockHistoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(56, 189, 248, 0.1)" />
                <XAxis dataKey="fecha" stroke="#a5f3fc" />
                <YAxis stroke="#a5f3fc" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                    border: '1px solid rgba(56, 189, 248, 0.2)',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="stock"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  name="Stock"
                  dot={{ fill: 'hsl(var(--primary))' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="glass-card border-cyan-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <TrendingUp className="h-5 w-5 text-cyan-400" />
              Top 5 Productos Más Movidos
            </CardTitle>
            <CardDescription className="text-cyan-200">
              Productos con mayor cantidad de movimientos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topMovedProductsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(56, 189, 248, 0.1)" />
                <XAxis dataKey="nombre" angle={-45} textAnchor="end" height={100} stroke="#a5f3fc" />
                <YAxis stroke="#a5f3fc" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                    border: '1px solid rgba(56, 189, 248, 0.2)',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
                <Legend />
                <Bar 
                  dataKey="movimientos" 
                  fill="hsl(var(--primary))" 
                  name="Cantidad Total Movida"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="glass-card border-cyan-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <TrendingUp className="h-5 w-5 text-cyan-400" />
              Top 5 Productos Menos Movidos
            </CardTitle>
            <CardDescription className="text-cyan-200">
              Productos con menor cantidad de movimientos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={leastMovedProductsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(56, 189, 248, 0.1)" />
                <XAxis dataKey="nombre" angle={-45} textAnchor="end" height={100} stroke="#a5f3fc" />
                <YAxis stroke="#a5f3fc" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                    border: '1px solid rgba(56, 189, 248, 0.2)',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
                <Legend />
                <Bar 
                  dataKey="movimientos" 
                  fill="hsl(var(--destructive))" 
                  name="Cantidad Total Movida"
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
