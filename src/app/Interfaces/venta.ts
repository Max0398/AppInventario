import { DetalleVenta } from "./detalle-venta";

export interface Venta {
  order_id?: number;
  status: string;
  total: number;
  order_date: string | null;
  customer_id: number;
  products: DetalleVenta[];
  customer_name?:string
}
