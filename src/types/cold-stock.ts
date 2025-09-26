// Cold Stock Database Types based on actual schema
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
  tipo: string;
}

export interface Producto {
  producto_id: string;
  nombre: string;
  organizacion_id?: string;
}

export interface Lote {
  lote_id: string;
  organizacion_id?: string;
  producto_id?: string;
  cantidad: number;
  fecha_vencimiento: string;
  created_at?: string;
}

export interface StockProducto {
  producto_id?: string;
  producto_nombre?: string;
  organizacion_id?: string;
  stock_actual?: number;
  lotes_activos?: number;
}

export interface Movimiento {
  movimiento_id: string;
  organizacion_id?: string;
  producto_id?: string;
  tipo: string;
  cantidad: number;
  fecha?: string;
}

export type UserRole = 'admin' | 'operario';

// Helper interfaces for forms
export interface NewProduct {
  nombre: string;
  organizacion_id?: string;
}

export interface NewLote {
  organizacion_id?: string;
  producto_id?: string;
  cantidad: number;
  fecha_vencimiento: string;
}

export interface NewMovimiento {
  organizacion_id?: string;
  producto_id?: string;
  tipo: string;
  cantidad: number;
}