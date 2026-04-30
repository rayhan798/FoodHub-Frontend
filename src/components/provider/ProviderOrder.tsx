"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Loader2, RefreshCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// ================= TYPES =================
type OrderStatus =
  | "PENDING"
  | "PREPARING"
  | "READY"
  | "DELIVERED"
  | "CANCELLED";

interface ProviderOrder {
  id: string;
  customer: string;
  items: string;
  total: number;
  status: OrderStatus;
  createdAt: string;
}

// ================= PAGE =================
export default function ProviderOrdersPage() {
  const [orders, setOrders] = useState<ProviderOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const router = useRouter();
  
  // API URL handling: rewriting to relative path for Next.js rewrites/proxy support
  const API_BASE = "/api"; 

  // ================= STATUS COLORS =================
  const getStatusStyle = (status: OrderStatus) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-700";
      case "PREPARING":
        return "bg-blue-100 text-blue-700";
      case "READY":
        return "bg-purple-100 text-purple-700";
      case "DELIVERED":
        return "bg-green-100 text-green-700";
      case "CANCELLED":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // ================= FETCH ORDERS =================
  const fetchOrders = useCallback(async () => {
    setLoading(true);
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
        const mapped = data.data.map((order: any) => ({
          id: order.id,
          customer: order.customer?.name || "Guest",
          items:
            order.orderItems
              ?.map((i: any) => `${i.quantity}x ${i.meal?.name}`)
              .join(", ") || "No items",
          total: order.totalPrice,
          status: order.status,
          createdAt: new Date(order.createdAt).toLocaleString(),
        }));
        setOrders(mapped);
      }
    } catch (error) {
      toast.error("Could not connect to the server");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // ================= STATUS UPDATE (FIXED ROUTE) =================
  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    const prevOrders = [...orders];

    // Optimistic UI Update
    setOrders((current) =>
      current.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );

    const toastId = toast.loading("Updating order status...");

    try {
      const res = await fetch(`${API_BASE}/orders/${orderId}/status`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to update status");
      }

      toast.success(`Order is now ${newStatus.toLowerCase()}`, { id: toastId });
    } catch (err: any) {
      setOrders(prevOrders);
      toast.error(err.message || "Update failed", { id: toastId });
    }
  };

  // ================= FILTER =================
  const filtered = orders.filter(
    (o) =>
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Kitchen Orders</h1>
          <p className="text-muted-foreground">Manage and track your kitchen's incoming orders</p>
        </div>

        <Button onClick={fetchOrders} disabled={loading} variant="outline" className="gap-2">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCcw className="h-4 w-4" />}
          Refresh
        </Button>
      </div>

      {/* SEARCH & TABLE CARD */}
      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <div className="relative">
            <Input
              placeholder="Search by Order ID or Customer Name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-4 max-w-md"
            />
          </div>
        </CardHeader>

        <CardContent>
          {loading && orders.length === 0 ? (
            <div className="py-20 flex flex-col items-center justify-center text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin mb-2" />
              <p>Loading your orders...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-20 text-center text-muted-foreground">
              No orders found matching your search.
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader className="bg-slate-50/50">
                  <TableRow>
                    <TableHead className="font-bold">Order ID</TableHead>
                    <TableHead className="font-bold">Customer</TableHead>
                    <TableHead className="font-bold">Items</TableHead>
                    <TableHead className="font-bold">Total</TableHead>
                    <TableHead className="font-bold">Status</TableHead>
                    <TableHead className="text-right font-bold">Actions</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {filtered.map((order) => (
                    <TableRow key={order.id} className="hover:bg-slate-50/30 transition-colors">
                      <TableCell className="font-medium text-blue-600">
                        #{order.id.slice(-6).toUpperCase()}
                      </TableCell>
                      <TableCell>{order.customer}</TableCell>
                      <TableCell className="max-w-[200px] truncate" title={order.items}>
                        {order.items}
                      </TableCell>
                      <TableCell className="font-semibold">
                        ৳{order.total.toLocaleString()}
                      </TableCell>

                      <TableCell>
                        <div
                          className={`px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold w-fit ${getStatusStyle(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </div>
                      </TableCell>

                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Select
                            value={order.status}
                            onValueChange={(val: OrderStatus) =>
                              handleStatusChange(order.id, val)
                            }
                          >
                            <SelectTrigger className="w-[120px] h-8 text-xs">
                              <SelectValue />
                            </SelectTrigger>

                            <SelectContent>
                              <SelectItem value="PENDING">Pending</SelectItem>
                              <SelectItem value="PREPARING">Preparing</SelectItem>
                              <SelectItem value="READY">Ready</SelectItem>
                              <SelectItem value="DELIVERED">Delivered</SelectItem>
                              <SelectItem value="CANCELLED">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>

                          <Button
                            variant="secondary"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => router.push(`/orders/${order.id}`)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}