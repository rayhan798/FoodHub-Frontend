"use client";

import { useState, useEffect, useMemo } from "react";
import { env } from "@/env";
import { toast } from "react-hot-toast";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, FileDown, Eye, Filter, MoreVertical, Loader2, XCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/* --- Custom BDT Symbol --- */
const BDT = "৳";

/* ================= TYPES ================= */
interface AdminOrder {
  id: string;
  totalPrice: number;
  status: "PENDING" | "PREPARING" | "READY" | "DELIVERED" | "CANCELLED"; 
  createdAt: string;
  customer: {
    name: string;
    email?: string;
  };
  orderItems: {
    meal: {
      name: string; 
      provider: {
        restaurantName: string;
      };
    };
  }[];
}

interface ApiResponse {
  success: boolean;
  data: AdminOrder[];
  message?: string;
}

export default function AdminAllOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      
      const baseUrl = env.NEXT_PUBLIC_API_URL.endsWith('/') 
        ? env.NEXT_PUBLIC_API_URL.slice(0, -1) 
        : env.NEXT_PUBLIC_API_URL;

      const res = await fetch(`${baseUrl}/orders`, {
        method: "GET",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include", 
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Failed to fetch orders");
      }

      if (Array.isArray(result)) {
        setOrders(result);
      } else if (result && result.data && Array.isArray(result.data)) {
        setOrders(result.data);
      } else {
        setOrders([]);
      }

    } catch (err: any) {
      toast.error(err.message || "Could not load orders from server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCancelOrder = async (orderId: string) => {
    if (!confirm("Are you sure you want to cancel this order?")) return;

    try {
      setActionLoading(orderId);
      const baseUrl = env.NEXT_PUBLIC_API_URL.endsWith('/') 
        ? env.NEXT_PUBLIC_API_URL.slice(0, -1) 
        : env.NEXT_PUBLIC_API_URL;

      const res = await fetch(`${baseUrl}/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "CANCELLED" }),
        credentials: "include",
      });

      const result = await res.json();

      if (!res.ok) throw new Error(result.message || "Failed to cancel order");

      toast.success("Order cancelled successfully");
      fetchOrders(); 
    } catch (err: any) {
      toast.error(err.message || "Could not cancel order");
    } finally {
      setActionLoading(null);
    }
  };

  const filteredOrders = useMemo(() => {
    if (!Array.isArray(orders)) return [];
    return orders.filter((order) => {
      const searchStr = searchTerm.toLowerCase();
      const customerName = order.customer?.name?.toLowerCase() || "";
      const providerName = order.orderItems?.[0]?.meal?.provider?.restaurantName?.toLowerCase() || "";
      const orderId = order.id?.toLowerCase() || "";

      return (
        orderId.includes(searchStr) ||
        customerName.includes(searchStr) ||
        providerName.includes(searchStr)
      );
    });
  }, [orders, searchTerm]);

  const getStatusBadge = (status: AdminOrder["status"]) => {
    const styles = {
      DELIVERED: "bg-green-100 text-green-700 hover:bg-green-100",
      READY: "bg-blue-100 text-blue-700 hover:bg-blue-100",
      PREPARING: "bg-indigo-100 text-indigo-700 hover:bg-indigo-100",
      PENDING: "bg-amber-100 text-amber-700 hover:bg-amber-100",
      CANCELLED: "bg-red-100 text-red-700 hover:bg-red-100",
    };
    return (
      <Badge className={`${styles[status] || "bg-slate-100"} border-none rounded-full px-3 capitalize`}>
        {status?.toLowerCase().replace('_', ' ') || 'Unknown'}
      </Badge>
    );
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
      <Loader2 className="h-10 w-10 animate-spin text-orange-600" />
      <p className="text-slate-500 animate-pulse">Syncing orders with database...</p>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">All Orders</h1>
          <p className="text-slate-500 text-sm">Real-time monitoring of all platform transactions.</p>
        </div>
        <Button className="bg-slate-900 text-white hover:bg-slate-800 rounded-xl gap-2 shadow-lg">
          <FileDown className="h-4 w-4" /> Export Report
        </Button>
      </div>

      <Card className="rounded-2xl border-slate-100 shadow-sm overflow-hidden bg-white">
        <CardHeader className="p-4 border-b border-slate-50 flex flex-row items-center justify-between space-y-0 gap-4">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Search by ID, Customer or Provider..." 
              className="pl-10 rounded-xl bg-slate-50/50 border-slate-100 focus:ring-orange-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" size="sm" className="gap-2 rounded-xl border-slate-200">
            <Filter className="h-4 w-4" /> Filter
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow>
                  <TableHead className="pl-6 text-slate-600 font-bold uppercase text-[11px]">Order ID</TableHead>
                  <TableHead className="text-slate-600 font-bold uppercase text-[11px]">Customer</TableHead>
                  <TableHead className="text-slate-600 font-bold uppercase text-[11px]">Provider</TableHead>
                  <TableHead className="text-slate-600 font-bold uppercase text-[11px]">Amount</TableHead>
                  <TableHead className="text-slate-600 font-bold uppercase text-[11px]">Status</TableHead>
                  <TableHead className="text-slate-600 font-bold uppercase text-[11px]">Date & Time</TableHead>
                  <TableHead className="text-right pr-6 text-slate-600 font-bold uppercase text-[11px]">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-20 text-slate-400">
                      <div className="flex flex-col items-center gap-2">
                         <Search className="h-8 w-8 opacity-20" />
                         <p>No real-time orders found in the system.</p>
                         <Button variant="ghost" onClick={fetchOrders} className="text-orange-600">Retry</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOrders.map((order) => (
                    <TableRow key={order.id} className="hover:bg-slate-50/50 transition-colors group">
                      <TableCell className="pl-6 font-mono text-xs font-semibold text-orange-600">
                        #{order.id ? order.id.slice(-8).toUpperCase() : "N/A"}
                      </TableCell>
                      
                      <TableCell className="font-medium text-slate-700">
                        {order.customer?.name || "Guest User"}
                      </TableCell>
                      
                      <TableCell>
                        <Badge variant="secondary" className="bg-slate-100 text-slate-700 border-none font-normal">
                          {order.orderItems?.[0]?.meal?.provider?.restaurantName || "N/A"}
                        </Badge>
                      </TableCell>
                      
                      <TableCell className="font-bold text-slate-900">
                        {BDT}{Number(order.totalPrice || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </TableCell>
                      
                      <TableCell>{getStatusBadge(order.status)}</TableCell>
                      
                      <TableCell className="text-slate-500 text-xs">
                        {order.createdAt ? new Date(order.createdAt).toLocaleString('en-GB', {
                          day: '2-digit', month: 'short', year: 'numeric',
                          hour: '2-digit', minute: '2-digit'
                        }) : "N/A"}
                      </TableCell>
                      
                      <TableCell className="text-right pr-6">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-slate-100 rounded-full">
                              <MoreVertical className="h-4 w-4 text-slate-400" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="rounded-xl w-44 shadow-xl border-slate-100">
                            <DropdownMenuItem className="gap-2 cursor-pointer py-2 text-slate-600">
                              <Eye className="h-4 w-4" /> View Details
                            </DropdownMenuItem>
                            
                            {order.status !== "CANCELLED" && order.status !== "DELIVERED" && (
                              <DropdownMenuItem 
                                onClick={() => handleCancelOrder(order.id)}
                                className="gap-2 text-red-600 cursor-pointer py-2 focus:bg-red-50 focus:text-red-700 font-medium"
                                disabled={actionLoading === order.id}
                              >
                                {actionLoading === order.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <XCircle className="h-4 w-4" />
                                )}
                                Cancel Order
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}