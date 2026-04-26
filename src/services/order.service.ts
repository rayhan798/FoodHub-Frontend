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
  // ১. ক্রিয়েট অর্ডার (আগের মতোই)
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

  // ২. গেট অল অর্ডারস (লিস্ট ভিউ এর জন্য)
getOrders: async function (options: RequestInit = {}) {
  try {
    const cookieStore = await cookies();
    
    // options কে স্প্রেড করা হয়েছে যাতে { cache: "no-store" } কাজ করে
    const res = await fetch(`${API_URL}/orders`, {
      ...options, 
      headers: { 
        ...options.headers, // যদি আগে থেকে কোনো হেডার থাকে তাও থাকবে
        Cookie: cookieStore.toString() 
      },
      // tags রাখা হয়েছে অন-ডিমান্ড রিভ্যালিডেশনের জন্য
      next: { tags: ["orders"] }
    });

    if (!res.ok) throw new Error("Failed to fetch orders");
    
    const json = await res.json();
    const rawData = json.data || json;
    
    // ডাটা ম্যাপিং লজিক আগের মতোই থাকছে
    const orders: Order[] = rawData.map((order: any) => ({
      id: order.id,
      date: order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "N/A",
      total: order.totalPrice || order.total || 0,
      status: order.status,
      items: (order.orderItems || []).map((item: any) => item.meal?.name || "Item"),
      provider: "Kitchen",
    }));

    return { data: orders, error: null };
  } catch (err: any) {
    return { data: [], error: err.message || "Something went wrong" };
  }
},

  // ৩. ✅ সিঙ্গেল অর্ডার ডিটেইলস (ইমেজ এবং প্রাইস ফিক্সড)
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
      
      // ✅ এখানে আমরা পুরো ডাটা পাঠাবো যাতে page.tsx ইমেজ এবং আইটেম প্রাইস পায়
      return { data: result.data || result, error: null };
    } catch (err: unknown) {
      const errMessage = err instanceof Error ? err.message : "Order not found";
      return { data: null, error: errMessage };
    }
  },
};