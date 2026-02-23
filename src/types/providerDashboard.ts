import { DollarSign } from "lucide-react";

export interface OrderItem {
  meal?: {
    name: string;
  };
}

export interface ApiOrderResponse {
  id: string;
  customerId: string;
  customer?: {
    name: string;
  };
  orderItems?: OrderItem[];
  totalPrice: number;
  status: "PENDING" | "DELIVERED" | "PROCESSING" | "PREPARING" | "READY" | "CANCELLED";
  createdAt: string;
}

export interface Order {
  id: string;
  customer: string;
  meal: string;
  amount: number;
  status: ApiOrderResponse["status"];
  date: string;
}

export interface DashboardStat {
  label: string;
  value: string;
  icon: typeof DollarSign;
  trend: string;
  color: string;
}