export type Order = {
  id: string;
  userId: string;
  date: string; // ISO date
  total: number;
  items: OrderItem[];
  status: 'ENTREGADO' | 'EN_TRANSITO' | 'PROCESANDO' | 'CANCELADO';
};

export type OrderItem = {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  subtotal: number;
};

// Mock orders
const orders: Order[] = [
  {
    id: 'ORD001',
    userId: 'user1',
    date: '2025-11-15',
    total: 89.88,
    status: 'ENTREGADO',
    items: [
      {
        productId: 'P001',
        productName: 'Collar reflectante',
        quantity: 2,
        price: 12.99,
        subtotal: 25.98,
      },
      {
        productId: 'P003',
        productName: 'Snack dental (pack 10)',
        quantity: 5,
        price: 8.5,
        subtotal: 42.5,
      },
    ],
  },
  {
    id: 'ORD002',
    userId: 'user1',
    date: '2025-10-22',
    total: 49.9,
    status: 'ENTREGADO',
    items: [
      {
        productId: 'P002',
        productName: 'Cama ortopédica mediana',
        quantity: 1,
        price: 49.9,
        subtotal: 49.9,
      },
    ],
  },
  {
    id: 'ORD003',
    userId: 'user1',
    date: '2025-09-05',
    total: 21.74,
    status: 'ENTREGADO',
    items: [
      {
        productId: 'P001',
        productName: 'Collar reflectante',
        quantity: 1,
        price: 12.99,
        subtotal: 12.99,
      },
      {
        productId: 'P004',
        productName: 'Juguete pelota resistente',
        quantity: 1,
        price: 7.25,
        subtotal: 7.25,
      },
    ],
  },
];

export default orders;

export const STATUS_LABELS: Record<Order['status'], string> = {
  ENTREGADO: 'Entregado',
  EN_TRANSITO: 'En tránsito',
  PROCESANDO: 'Procesando',
  CANCELADO: 'Cancelado',
};

export const STATUS_COLORS: Record<Order['status'], string> = {
  ENTREGADO: '#28a745',
  EN_TRANSITO: '#17a2b8',
  PROCESANDO: '#ffc107',
  CANCELADO: '#dc3545',
};
