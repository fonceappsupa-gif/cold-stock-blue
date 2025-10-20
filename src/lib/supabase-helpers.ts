// Helper para suprimir errores de TypeScript con el esquema cold_stock
// El esquema cold_stock no está en los tipos generados automáticamente

export const getColdStockClient = (supabase: any) => ({
  from: (table: string) => {
    // @ts-ignore
    return supabase.schema('cold_stock').from(table);
  }
});
