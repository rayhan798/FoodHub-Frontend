export type OrderStatus = "PENDING" | "PREPARING" | "READY" | "DELIVERED" | "CANCELLED";

export interface AdminOrder {
  id: string;
  totalPrice: number;
  status: OrderStatus;
  createdAt: string;
  customer: { 
    name: string;
    email?: string;
  };
  orderItems: {
    meal: {
      provider: {
        restaurantName: string;
      };
    };
  }[];
}

export interface ApiResponse {
  success: boolean;
  data: AdminOrder[];
}