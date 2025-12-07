import type { Supplier } from './suppliers';
import type { Product } from './products';

export type PurchaseOrder = {
  id: string;
  supplier_id: string;
  status: 'PEDIDO' | 'ENTREGADO' | 'CANCELADO';
  total_cost?: number;
  created_at: string;
  supplier?: Supplier; // Optionally, to include supplier details directly when fetching
  items?: PurchaseOrderItem[]; // Add this line
};

export type PurchaseOrderItem = {
  id: string;
  purchase_order_id: string;
  product_id: string;
  quantity: number;
  cost?: number;
  subtotal?: number;
  product?: Product; // Optionally, to include product details directly when fetching
};
