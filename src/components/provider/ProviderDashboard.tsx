"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  DollarSign, 
  Package, 
  TrendingUp, 
  Users, 
  ArrowUpRight,
  Clock,
  Loader2,
  AlertCircle,
  RefreshCcw
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

// --- Types & Interfaces ---
type OrderStatus = "PENDING" | "PREPARING" | "READY" | "DELIVERED" | "CANCELLED" | "PROCESSING";

interface Order {
  id: string;
  customer: string;
  meal: string;
  amount: number;
  status: OrderStatus;
  date: string;
}

interface DashboardStat {
  label: string;
  value: string;
  icon: typeof DollarSign;
  trend: string;
  color: string;
}

export default function ProviderDashboard() {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>([]); 
  const [stats, setStats] = useState<DashboardStat[]>([]); 
  const router = useRouter();

  const API_BASE = "/api"; 

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/orders`, {
        method: "GET",
        credentials: "include", 
      });

      if (res.status === 401) {
        toast.error("Session expired. Please login again.");
        router.push("/login");
        return;
      }

      const data = await res.json();

      if (data.success) {
        const rawData = data.data || [];

        const mapped: Order[] = rawData.slice(0, 5).map((order: any) => ({
          id: order.id,
          customer: order.customer?.name || "Guest",
          meal: order.orderItems
              ?.map((i: any) => `${i.quantity}x ${i.meal?.name}`)
              .join(", ") || "No items",
          amount: order.totalPrice,
          status: order.status,
          date: new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }));
        setOrders(mapped);

        const totalRevenue = rawData
          .filter((o: any) => o.status === "DELIVERED")
          .reduce((acc: number, curr: any) => acc + curr.totalPrice, 0);
        
        const activeOrdersCount = rawData.filter((o: any) => 
          ["PENDING", "PREPARING", "READY", "PROCESSING"].includes(o.status)
        ).length;

        const uniqueCustomers = new Set(rawData.map((o: any) => o.customerId)).size;
        
        const deliveredOrders = rawData.filter((o: any) => o.status === "DELIVERED").length;
        const successRate = rawData.length > 0 
          ? Math.round((deliveredOrders / rawData.length) * 100) 
          : 0;

        setStats([
          { label: "Total Revenue", value: `৳${totalRevenue.toLocaleString()}`, icon: DollarSign, trend: "+12.5%", color: "text-green-600" },
          { label: "Active Orders", value: activeOrdersCount.toString(), icon: Package, trend: "Current", color: "text-orange-600" },
          { label: "Total Customers", value: uniqueCustomers.toString(), icon: Users, trend: "+10%", color: "text-blue-600" },
          { label: "Success Rate", value: `${successRate}%`, icon: TrendingUp, trend: "Real-time", color: "text-purple-600" },
        ]);
      } else {
        setError(data.message || "Failed to fetch data");
      }
    } catch (err: any) {
      setError("Could not connect to the server. Please check your connection.");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const getStatusStyle = (status: OrderStatus) => {
    switch (status) {
      case "PENDING": return "bg-yellow-100 text-yellow-700";
      case "PREPARING": return "bg-blue-100 text-blue-700";
      case "READY": return "bg-purple-100 text-purple-700";
      case "DELIVERED": return "bg-green-100 text-green-700";
      case "CANCELLED": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col h-[80vh] items-center justify-center space-y-4">
        <Loader2 className="h-12 w-12 animate-spin text-orange-600" />
        <p className="text-slate-500 animate-pulse font-medium">Loading your dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col h-[80vh] items-center justify-center text-center px-4">
        <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-slate-800">Access Denied</h2>
        <p className="text-slate-500 mt-2 max-w-md">{error}</p>
        <Button onClick={fetchDashboardData} className="mt-6 bg-orange-600 hover:bg-orange-700 rounded-xl px-8">
          <RefreshCcw className="mr-2 h-4 w-4" /> Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard Overview</h1>
        <p className="text-slate-500">Welcome back! Manage your kitchen activity here.</p>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.label} className="rounded-2xl border-slate-100 shadow-sm group hover:border-orange-200 transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-wider">{stat.label}</CardTitle>
              <div className="p-2 rounded-lg bg-slate-50 group-hover:bg-white transition-colors">
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-black text-slate-900">{stat.value}</div>
              <p className="text-xs text-slate-400 mt-2">
                <span className="text-green-500 font-bold">{stat.trend}</span> vs last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* RECENT ORDERS TABLE */}
        <Card className="lg:col-span-2 rounded-3xl border-slate-100 shadow-sm overflow-hidden bg-white">
          <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50 pb-6">
            <CardTitle className="text-xl font-bold">Recent Orders</CardTitle>
            <Button 
              variant="ghost" 
              className="text-orange-600 font-bold hover:text-orange-700 hover:bg-orange-50 rounded-xl"
              onClick={() => router.push("/provider/orders")}
            >
              View All
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-50/50">
                  <TableRow>
                    <TableHead className="pl-8 py-4 font-bold">Order ID</TableHead>
                    <TableHead className="font-bold">Items</TableHead>
                    <TableHead className="font-bold">Total</TableHead>
                    <TableHead className="font-bold">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.length > 0 ? orders.map((order) => (
                    <TableRow key={order.id} className="hover:bg-slate-50/50 transition-colors border-slate-50">
                      <TableCell className="pl-8 font-medium text-blue-600 text-xs">
                        #{order.id.slice(-6).toUpperCase()}
                      </TableCell>
                      <TableCell>
                        <div className="font-bold text-slate-900 truncate max-w-[150px]">{order.meal}</div>
                        <div className="text-[10px] text-slate-400 font-medium">{order.customer}</div>
                      </TableCell>
                      <TableCell className="font-black text-slate-900">৳{order.amount.toLocaleString()}</TableCell>
                      <TableCell>
                        <div className={`px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold w-fit ${getStatusStyle(order.status)}`}>
                          {order.status}
                        </div>
                      </TableCell>
                    </TableRow>
                  )) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-20 text-slate-400">
                        No recent orders found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* ACTIVITY FEED */}
        <Card className="rounded-3xl border-slate-100 shadow-sm overflow-hidden bg-white">
          <CardHeader className="border-b border-slate-50 pb-6">
            <CardTitle className="text-xl font-bold">Latest Activity</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:h-full before:w-0.5 before:bg-slate-100">
              {orders.map((order) => (
                <div key={order.id} className="relative flex gap-4 items-center">
                  <div className="h-10 w-10 rounded-full bg-white border-2 border-slate-100 flex items-center justify-center shrink-0 z-10">
                    <Clock className="h-5 w-5 text-slate-400" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">Order #{order.id.slice(-4)} placed</p>
                    <p className="text-xs text-slate-400 font-medium">{order.date} • {order.customer}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}