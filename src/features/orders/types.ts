import { Meal } from "../meals/types";

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing" // ব্যাকএন্ড রাউট অনুযায়ী preparing যোগ করা হলো
  | "shipped"
  | "delivered"
  | "cancelled";

export interface OrderItem {
  meal: Meal;
  quantity: number;
}

export interface Order {
  id: string;
  items: OrderItem[]; // সাধারণত অর্ডারে আইটেম এবং কোয়ান্টিটি থাকে
  total: number;
  status: OrderStatus;
  createdAt: string;
}