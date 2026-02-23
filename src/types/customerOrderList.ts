export type OrderStatus = "DELIVERED" | "PENDING" | "CANCELED" | string;

export interface Order {
  id: string;
  date: string;
  total: number;
  status: OrderStatus;
  items: string[];
  provider: string;
  address?: string;
  phone?: string;
  paymentMethod?: string;
}