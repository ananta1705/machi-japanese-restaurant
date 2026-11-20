export interface OrderItem {
  name: string;
  price: number;
  qty: number;
  subtotal: number;
}

export class Order {
  id: number;
  orderCode: string;
  customerName: string;
  phone: string;
  method: string;
  tableNo?: string;
  address?: string;
  paymentMethod: string;
  notes?: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'DIPROSES' | 'SELESAI' | 'DIBATALKAN';
  createdAt: Date;
}
