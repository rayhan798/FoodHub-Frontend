import { env } from "@/env";
import { cookies } from "next/headers";
import { Order } from "@/components/customer/OrdersList";

const API_URL = env.API_URL;

interface OrderItem {
  meal?: { name: string };
}

export const orderService = {
  // ================= CREATE ORDER =================
  createOrder: async function (orderData: {
    mealId: string;
    quantity: number;
    address: string;
  }) {
    try {
      const cookieStore = await cookies();

      const res = await fetch(`${API_URL}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookieStore.toString(),
        },
        body: JSON.stringify(orderData),

        cache: "no-store",
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Failed to create order");
      }

      return { data: result.data, error: null };
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to create order";

      return { data: null, error: message };
    }
  },

  // ================= GET ALL ORDERS =================
  getOrders: async function (options: RequestInit = {}) {
    try {
      const cookieStore = await cookies();

      const res = await fetch(`${API_URL}/orders`, {
        ...options,
        headers: {
          ...(options.headers || {}),
          Cookie: cookieStore.toString(),
        },

        cache: "no-store",
      });

      if (!res.ok) throw new Error("Failed to fetch orders");

      const json = await res.json();
      const rawData = json.data || json;

      const orders: Order[] = rawData.map((order: any) => ({
        id: order.id,
        date: order.createdAt
          ? new Date(order.createdAt).toLocaleDateString()
          : "N/A",
        total: order.totalPrice || order.total || 0,
        status: order.status,
        items: (order.orderItems || []).map(
          (item: any) => item.meal?.name || "Item"
        ),
        provider: "Kitchen",
      }));

      return { data: orders, error: null };
    } catch (err: any) {
      return {
        data: [],
        error: err.message || "Something went wrong",
      };
    }
  },

  // ================= GET SINGLE ORDER =================
  getOrderById: async function (id: string) {
    try {
      if (!id || id === "success") {
        return { data: null, error: null };
      }

      const cookieStore = await cookies();

      const res = await fetch(`${API_URL}/orders/${id}`, {
        headers: {
          Cookie: cookieStore.toString(),
        },

        cache: "no-store",
      });

      if (!res.ok) throw new Error("Order not found");

      const result = await res.json();

      return {
        data: result.data || result,
        error: null,
      };
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Order not found";

      return { data: null, error: message };
    }
  },
};