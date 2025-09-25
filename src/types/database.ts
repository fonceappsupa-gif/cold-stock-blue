// Types for the existing cold_stock schema
export interface Organizacion {
  organizacion_id: string;
  nombre: string;
  foto?: string;
}

export interface Perfil {
  perfil_id: string;
  organizacion_id?: string;
  nombre: string;
  apellido: string;
  correo: string;
  tipo: 'admin' | 'operario';
}

export interface Producto {
  producto_id: string;
  organizacion_id?: string;
  nombre: string;
}

export interface Lote {
  lote_id: string;
  organizacion_id?: string;
  producto_id?: string;
  cantidad: number;
  fecha_vencimiento: string;
  created_at?: string;
}

export interface Movimiento {
  movimiento_id: string;
  organizacion_id?: string;
  producto_id?: string;
  tipo: string;
  cantidad: number;
  fecha?: string;
}

export interface StockProducto {
  producto_id?: string;
  producto_nombre?: string;
  organizacion_id?: string;
  stock_actual?: number;
  lotes_activos?: number;
}