export interface OrderItem {
  productId: number;
  qty: number;
  price: number;
}

export interface OrderPayload {
  customerName: string;
  phone: string;
  address: string;
  note?: string;
  items: OrderItem[];
  total: number;
  createdAt: string;      // ISO
  status: "pending";
}


export interface Order extends OrderPayload {
  id: number;            // json-server додасть сам
}
