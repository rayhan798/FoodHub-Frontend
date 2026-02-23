import { Meal } from "../meals/types";

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing" 
  | "shipped"
  | "delivered"
  | "cancelled";

export interface OrderItem {
  meal: Meal;
  quantity: number;
}

export interface Order {
  id: string;
  items: OrderItem[]; 
  total: number;
  status: OrderStatus;
  createdAt: string;
}