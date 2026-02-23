import { useState, useEffect, useMemo } from "react";
import { env } from "@/env";
import { toast } from "react-hot-toast";
import { AdminOrder, ApiResponse } from "../types/adminOrders";

export function useAdminOrders() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/orders`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch orders");
      const result: ApiResponse = await res.json();
      setOrders(result.data || []);
    } catch (err) {
      console.error("Fetch Error:", err);
      toast.error("Could not load orders from server");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    if (!confirm("Are you sure you want to cancel this order?")) return;

    try {
      setActionLoading(orderId);
      const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "CANCELLED" }),
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to cancel order");

      toast.success("Order cancelled successfully");
      fetchOrders();
    } catch (err) {
      toast.error("Could not cancel order");
    } finally {
      setActionLoading(null);
    }
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const searchStr = searchTerm.toLowerCase();
      const customerName = order.customer?.name?.toLowerCase() || "";
      const providerName = order.orderItems?.[0]?.meal?.provider?.restaurantName?.toLowerCase() || "";
      const orderId = order.id.toLowerCase();

      return (
        orderId.includes(searchStr) ||
        customerName.includes(searchStr) ||
        providerName.includes(searchStr)
      );
    });
  }, [orders, searchTerm]);

  useEffect(() => {
    fetchOrders();
  }, []);

  return {
    loading,
    searchTerm,
    setSearchTerm,
    actionLoading,
    filteredOrders,
    handleCancelOrder,
    fetchOrders
  };
}