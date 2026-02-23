import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { DollarSign, Package, Users, TrendingUp } from "lucide-react";
import { Order, DashboardStat, ApiOrderResponse } from "@/types/providerDashboard";

export function useProviderDashboard() {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStat[]>([
    { label: "Total Revenue", value: "$0.00", icon: DollarSign, trend: "0%", color: "text-green-600" },
    { label: "Active Orders", value: "0", icon: Package, trend: "0 new", color: "text-orange-600" },
    { label: "Total Customers", value: "0", icon: Users, trend: "0%", color: "text-blue-600" },
    { label: "Success Rate", value: "0%", icon: TrendingUp, trend: "0%", color: "text-purple-600" },
  ]);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      const response = await fetch(`${apiUrl}/orders`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const result = await response.json();

      if (response.ok && result.success) {
        const rawData: ApiOrderResponse[] = result.data || [];

        const mappedOrders: Order[] = rawData.slice(0, 5).map((order) => ({
          id: order.id,
          customer: order.customer?.name || "Guest User",
          meal: order.orderItems?.[0]?.meal?.name || "Multiple Items",
          amount: order.totalPrice,
          status: order.status,
          date: new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }));
        setOrders(mappedOrders);

        const totalRevenue = rawData
          .filter((o) => o.status === "DELIVERED")
          .reduce((acc, curr) => acc + curr.totalPrice, 0);
        
        const activeOrdersCount = rawData.filter((o) => 
          ["PENDING", "PREPARING", "READY", "PROCESSING"].includes(o.status)
        ).length;

        const uniqueCustomers = new Set(rawData.map((o) => o.customerId)).size;
        const deliveredOrders = rawData.filter((o) => o.status === "DELIVERED").length;
        const successRate = rawData.length > 0 ? Math.round((deliveredOrders / rawData.length) * 100) : 0;

        setStats([
          { label: "Total Revenue", value: `$${totalRevenue.toFixed(2)}`, icon: DollarSign, trend: "+12.5%", color: "text-green-600" },
          { label: "Active Orders", value: activeOrdersCount.toString(), icon: Package, trend: "Current", color: "text-orange-600" },
          { label: "Total Customers", value: uniqueCustomers.toString(), icon: Users, trend: "+10%", color: "text-blue-600" },
          { label: "Success Rate", value: `${successRate}%`, icon: TrendingUp, trend: "Real-time", color: "text-purple-600" },
        ]);
      } else {
        if (response.status === 401 || response.status === 403) {
          router.replace("/login");
        } else {
          const errMsg = result.message || "Failed to load dashboard data";
          setError(errMsg);
          toast.error(errMsg);
        }
      }
    } catch (error) {
      const errMsg = "Network error! Server might be offline.";
      setError(errMsg);
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [router]);

  return { loading, error, orders, stats, fetchDashboardData, router };
}