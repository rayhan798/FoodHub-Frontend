import { env } from "@/env";
import { cookies } from "next/headers";
import { Order } from "@/components/customer/OrdersList";
import { revalidateTag } from "next/cache";

const API_URL = env.API_URL;

interface OrderItem {
  meal?: { name: string };
}

interface RawOrder {
  id: string;
  createdAt?: string;
  totalPrice?: number;
  total?: number;
  status: string;
  orderItems?: OrderItem[];
}

export const orderService = {
  createOrder: async function (orderData: { mealId: string; quantity: number; address: string }) {
    try {
      const cookieStore = await cookies();
      const res = await fetch(`${API_URL}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Cookie": cookieStore.toString(),
        },
        body: JSON.stringify(orderData),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Failed to create order");
      revalidateTag("orders", "default");
      return { data: result.data, error: null };
    } catch (err: unknown) {
      const errMessage = err instanceof Error ? err.message : "Failed to create order";
      return { data: null, error: errMessage };
    }
  },

  getOrders: async function () {
    try {
      const cookieStore = await cookies();
      const res = await fetch(`${API_URL}/orders`, {
        headers: { Cookie: cookieStore.toString() },
        next: { tags: ["orders"] }
      });
      if (!res.ok) throw new Error("Failed to fetch orders");
      const json = await res.json();
      const rawData = json.data || json;
      
      const orders: Order[] = rawData.map((order: RawOrder) => ({
        id: order.id,
        date: order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "N/A",
        total: order.totalPrice || order.total || 0,
        status: order.status,
        items: (order.orderItems || []).map((item: OrderItem) => item.meal?.name || "Item"),
        provider: "Kitchen",
      }));
      return { data: orders, error: null };
    } catch (err) {
      return { data: [], error: err };
    }
  },

  getOrderById: async function (id: string) {
    try {
      if (!id || id === "success") return { data: null, error: null };
      const cookieStore = await cookies();
      const res = await fetch(`${API_URL}/orders/${id}`, {
        headers: { Cookie: cookieStore.toString() },
        cache: "no-store",
      });
      if (!res.ok) throw new Error("Order not found");
      const result = await res.json();

      return { data: result.data || result, error: null };
    } catch (err: unknown) {
      const errMessage = err instanceof Error ? err.message : "Order not found";
      return { data: null, error: errMessage };
    }
  },
};