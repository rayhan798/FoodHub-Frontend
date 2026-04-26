"use client";

import { useState, useEffect, useCallback } from "react";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Search, Loader2, RefreshCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useRouter } from "next/navigation"; 
import { updateOrderStatusAction } from "@/hooks/orderStatus";

// Type Definitions
type OrderStatus = "PENDING" | "PREPARING" | "READY" | "DELIVERED" | "CANCELLED";

interface ProviderOrder {
  id: string;
  customer: string;
  items: string;
  total: number;
  status: OrderStatus;
  createdAt: string;
}

interface ApiOrder {
  id: string;
  status: OrderStatus;
  totalPrice: number;
  createdAt: string;
  customer?: { name: string };
  orderItems?: Array<{ quantity: number; meal?: { name: string } }>;
}

export default function ProviderOrdersPage() {
  const [orders, setOrders] = useState<ProviderOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter(); 

  // 1. Function to get access token from cookies
  const getAccessToken = useCallback(() => {
    if (typeof document === "undefined") return null;
    const name = "accessToken=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      const c = ca[i].trim();
      if (c.indexOf(name) === 0) return c.substring(name.length, c.length);
    }
    return null;
  }, []);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      const token = getAccessToken();

      const response = await fetch(`${apiUrl}/orders`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        credentials: "include", 
      });

      const result = await response.json();

      if (result.success && result.data) {
        const mappedOrders = result.data.map((order: ApiOrder) => ({
          id: order.id,
          customer: order.customer?.name || "Guest User",
          items: order.orderItems?.map((item) => `${item.quantity}x ${item.meal?.name}`).join(", ") || "No items",
          total: order.totalPrice,
          status: order.status,
          createdAt: new Date(order.createdAt).toLocaleString('en-GB'),
        }));
        setOrders(mappedOrders);
      } else {
        setOrders([]);
        if (response.status === 401) {
          toast.error("Session expired! Please login again.");
          router.push("/login");
        }
      }
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Could not connect to the server.");
    } finally {
      setLoading(false);
    }
  }, [getAccessToken, router]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // 2. Status Update Handler
  const handleStatusChange = async (orderId: string, newStatus: string) => {
    const loadingToast = toast.loading("Updating order status...");
    
    try {
      const result = await updateOrderStatusAction(orderId, newStatus);
      
      if (result.success) {
        setOrders((prev) => 
          prev.map((order) => 
            order.id === orderId 
              ? { ...order, status: newStatus as OrderStatus } 
              : order
          )
        );
        toast.success("Status updated successfully!", { id: loadingToast });
      } else {
        const errorMsg = result.error || "Update failed";
        if (errorMsg.toLowerCase().includes("unauthorized") || errorMsg.includes("session")) {
          toast.error("Your session expired. Redirecting to login...", { id: loadingToast });
          setTimeout(() => router.push("/login"), 2000);
          return;
        }
        throw new Error(errorMsg);
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Update failed!";
      toast.error(errorMessage, { id: loadingToast });
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case "PENDING": return "bg-amber-100 text-amber-700";
      case "PREPARING": return "bg-blue-100 text-blue-700";
      case "READY": return "bg-purple-100 text-purple-700";
      case "DELIVERED": return "bg-green-100 text-green-700";
      case "CANCELLED": return "bg-red-100 text-red-700";
      default: return "bg-slate-100 text-slate-700";
    }
  };

  const filteredOrders = orders.filter((order) => 
    order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.customer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Order Management</h1>
          <p className="text-slate-500">View and manage all orders from your kitchen.</p>
        </div>
        <Button onClick={fetchOrders} variant="outline" disabled={loading} className="rounded-xl flex gap-2">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCcw className="h-4 w-4" />}
          Refresh
        </Button>
      </div>

      <Card className="rounded-2xl border-slate-100 shadow-sm overflow-hidden bg-white">
        <CardHeader className="p-4 border-b border-slate-50">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Search by Order ID or Customer..." 
              className="pl-10 rounded-xl border-slate-200" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="p-0 pt-0">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center">
              <Loader2 className="h-10 w-10 animate-spin text-orange-600 mb-4" />
              <p className="text-slate-500">Loading orders...</p>
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow>
                  <TableHead className="pl-6">Order Info</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Total Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right pr-6">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="pl-6 py-4">
                        <div className="font-bold text-slate-900">#{order.id.slice(-6).toUpperCase()}</div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase">{order.createdAt}</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-semibold text-slate-800">{order.customer}</div>
                        <div className="text-xs text-slate-500 truncate max-w-[180px]">{order.items}</div>
                      </TableCell>
                      <TableCell className="font-bold text-slate-900">${order.total.toFixed(2)}</TableCell>
                      <TableCell>
                        <Select 
                          defaultValue={order.status} 
                          onValueChange={(val) => handleStatusChange(order.id, val)}
                        >
                          <SelectTrigger className={`w-[130px] h-8 rounded-full text-[11px] font-bold border-none ${getStatusColor(order.status)}`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl shadow-xl">
                            <SelectItem value="PENDING">Pending</SelectItem>
                            <SelectItem value="PREPARING">Preparing</SelectItem>
                            <SelectItem value="READY">Ready</SelectItem>
                            <SelectItem value="DELIVERED">Delivered</SelectItem>
                            <SelectItem value="CANCELLED">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        {/* Dynamic Action Button */}
                        <Button 
                          onClick={() => router.push(`/orders/${order.id}`)}
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-slate-400 hover:text-orange-600 rounded-full"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-20 text-slate-500">
                      No orders found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}