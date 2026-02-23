import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { updateOrderStatusAction } from "@/hooks/orderStatus";

export type OrderStatus = "PENDING" | "PREPARING" | "READY" | "DELIVERED" | "CANCELLED";

export interface ProviderOrder {
  id: string;
  customer: string;
  items: string;
  total: number;
  status: OrderStatus;
  createdAt: string;
}

export function useOrders() {
  const [orders, setOrders] = useState<ProviderOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const getAccessToken = useCallback(() => {
    if (typeof document === "undefined") return null;
    const match = document.cookie.match(new RegExp('(^| )accessToken=([^;]+)'));
    return match ? match[2] : null;
  }, []);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      const token = getAccessToken();

      const response = await fetch(`${apiUrl}/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const result = await response.json();

      if (result.success && result.data) {
        const mapped = result.data.map((order: any) => ({
          id: order.id,
          customer: order.customer?.name || "Guest User",
          items: order.orderItems?.map((i: any) => `${i.quantity}x ${i.meal?.name}`).join(", ") || "No items",
          total: order.totalPrice,
          status: order.status,
          createdAt: new Date(order.createdAt).toLocaleString("en-GB"),
        }));
        setOrders(mapped);
      } else if (response.status === 401) {
        toast.error("Session expired!");
        router.push("/login");
      }
    } catch (error) {
      toast.error("Server connection failed.");
    } finally {
      setLoading(false);
    }
  }, [getAccessToken, router]);

  const updateStatus = async (orderId: string, newStatus: string) => {
    const tid = toast.loading("Updating status...");
    try {
      const result = await updateOrderStatusAction(orderId, newStatus);
      if (result.success) {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus as OrderStatus } : o));
        toast.success("Updated!", { id: tid });
      } else {
        throw new Error(result.error);
      }
    } catch (err: any) {
      toast.error(err.message || "Failed", { id: tid });
    }
  };

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  return { orders, loading, fetchOrders, updateStatus, setOrders };
}