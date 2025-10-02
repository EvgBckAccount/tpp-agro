// src/types.ts
export type Product = {
  id: number;
  sku: string;
  name: string;
  category: string;
  price: number;
  currency: string;
  stock: number;
  oem?: string;
  shortDescription?: string;
  imageUrl?: string;
};

export type CartLine = {
  product: Product;
  qty: number;
};

export type OrderItem = {
  productId: number;
  qty: number;
  price: number;
};

export type OrderStatus = "pending" | "confirmed" | "shipped" | "done";

export type OrderPayload = {
  customerName: string;
  phone: string;
  address: string;
  note?: string;
  items: OrderItem[];
  total: number;
  createdAt: string;
  status: OrderStatus;
};

export type Order = OrderPayload & { id: number };
