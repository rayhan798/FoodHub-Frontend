"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Loader2, RefreshCcw, Eye, Utensils } from "lucide-react";
import { useOrders, OrderStatus } from "../../hooks/useProviderOrders";
import { env } from "@/env";

// UI Components
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ProviderOrdersPage() {
  const { orders, loading, fetchOrders, updateStatus } = useOrders();
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();


  const getFullImageUrl = (path: string | undefined | null) => {
    if (!path) return null;
    if (path.startsWith("http")) return path;
    const baseUrl = env.NEXT_PUBLIC_API_URL.replace("/api", "");
    return `${baseUrl}/${path.replace(/\\/g, "/").replace(/^\//, "")}`;
  };

  const getStatusColor = (status: OrderStatus) => {
    const colors = {
      PENDING: "bg-amber-100 text-amber-700",
      PREPARING: "bg-blue-100 text-blue-700",
      READY: "bg-purple-100 text-purple-700",
      DELIVERED: "bg-green-100 text-green-700",
      CANCELLED: "bg-red-100 text-red-700",
    };
    return (colors as any)[status] || "bg-slate-100 text-slate-700";
  };

  const filteredOrders = orders.filter(o => 
    o.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
    o.customer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Order Management</h1>
          <p className="text-slate-500">Manage your kitchen's incoming orders and status updates.</p>
        </div>
        <Button onClick={fetchOrders} variant="outline" disabled={loading} className="rounded-xl gap-2 shadow-sm">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCcw className="h-4 w-4" />}
          Refresh List
        </Button>
      </div>

      <Card className="rounded-2xl border-slate-100 shadow-sm overflow-hidden bg-white">
        <CardHeader className="p-4 border-b border-slate-50 bg-slate-50/30">
          <div className="relative w-full max-sm:max-w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search Order ID or Customer..."
              className="pl-10 rounded-xl border-slate-200 bg-white focus-visible:ring-orange-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center">
              <Loader2 className="h-10 w-10 animate-spin text-orange-600 mb-2" />
              <p className="text-slate-500 font-medium">Fetching orders...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-50/50">
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="pl-6 py-4">Order Info</TableHead>
                    <TableHead>Customer & Items</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right pr-6">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.length > 0 ? (
                    filteredOrders.map((order: any) => (
                      <TableRow key={order.id} className="hover:bg-slate-50/30 transition-colors group">
                        <TableCell className="pl-6 py-4">
                          <div className="font-bold text-slate-900">#{order.id.slice(-6).toUpperCase()}</div>
                          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{order.createdAt}</div>
                        </TableCell>
                        
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center">
                              {order.mealImage ? (
                                <img 
                                  src={getFullImageUrl(order.mealImage)!} 
                                  alt="Meal" 
                                  className="h-full w-full object-cover transition-transform group-hover:scale-110"
                                  onError={(e) => { e.currentTarget.src = "https://placehold.co/100x100?text=Food"; }}
                                />
                              ) : (
                                <Utensils className="h-4 w-4 text-slate-400" />
                              )}
                            </div>
                            <div className="min-w-0">
                              <div className="font-bold text-slate-800 truncate">{order.customer}</div>
                              <div className="text-xs text-slate-500 truncate max-w-[200px] italic">{order.items}</div>
                            </div>
                          </div>
                        </TableCell>

                        <TableCell className="font-black text-slate-900">
                          ${Number(order.total || 0).toFixed(2)}
                        </TableCell>

                        <TableCell>
                          <Select defaultValue={order.status} onValueChange={(val) => updateStatus(order.id, val as OrderStatus)}>
                            <SelectTrigger className={`w-[130px] h-8 rounded-full text-[11px] font-black border-none shadow-sm ${getStatusColor(order.status as OrderStatus)}`}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl shadow-2xl border-slate-100">
                              {["PENDING", "PREPARING", "READY", "DELIVERED", "CANCELLED"].map(s => (
                                 <SelectItem key={s} value={s} className="text-xs font-medium">
                                   {s.charAt(0) + s.slice(1).toLowerCase()}
                                 </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>

                        <TableCell className="text-right pr-6">
                          <Button
                            onClick={() => router.push(`/dashboard/provider/orders/${order.id}`)}
                            variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded-full transition-colors"
                          >
                            <Eye className="h-5 w-5" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-20">
                        <div className="flex flex-col items-center gap-2 opacity-40">
                          <Utensils className="h-10 w-10" />
                          <p className="font-medium text-slate-500">No orders found.</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}