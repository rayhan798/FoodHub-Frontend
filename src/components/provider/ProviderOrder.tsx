"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Loader2, RefreshCcw, Eye } from "lucide-react";
import { useOrders, OrderStatus } from "../../hooks/useProviderOrders";

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

  const getStatusColor = (status: OrderStatus) => {
    const colors = {
      PENDING: "bg-amber-100 text-amber-700",
      PREPARING: "bg-blue-100 text-blue-700",
      READY: "bg-purple-100 text-purple-700",
      DELIVERED: "bg-green-100 text-green-700",
      CANCELLED: "bg-red-100 text-red-700",
    };
    return colors[status] || "bg-slate-100 text-slate-700";
  };

  const filteredOrders = orders.filter(o => 
    o.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
    o.customer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Order Management</h1>
          <p className="text-slate-500">Manage your kitchen's incoming orders.</p>
        </div>
        <Button onClick={fetchOrders} variant="outline" disabled={loading} className="rounded-xl gap-2">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCcw className="h-4 w-4" />}
          Refresh
        </Button>
      </div>

      <Card className="rounded-2xl border-slate-100 shadow-sm overflow-hidden bg-white">
        <CardHeader className="p-4 border-b border-slate-50">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search Order ID or Customer..."
              className="pl-10 rounded-xl border-slate-200"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center">
              <Loader2 className="h-10 w-10 animate-spin text-orange-600 mb-2" />
              <p className="text-slate-500">Loading orders...</p>
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow>
                  <TableHead className="pl-6">Order Info</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right pr-6">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => (
                    <TableRow key={order.id} className="hover:bg-slate-50/30 transition-colors">
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
                        <Select defaultValue={order.status} onValueChange={(val) => updateStatus(order.id, val)}>
                          <SelectTrigger className={`w-[130px] h-8 rounded-full text-[11px] font-bold border-none ${getStatusColor(order.status)}`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl shadow-xl">
                            {["PENDING", "PREPARING", "READY", "DELIVERED", "CANCELLED"].map(s => (
                               <SelectItem key={s} value={s}>{s.charAt(0) + s.slice(1).toLowerCase()}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <Button
                          onClick={() => router.push(`/dashboard/provider/orders/${order.id}`)}
                          variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-orange-600 rounded-full"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow><TableCell colSpan={5} className="text-center py-20 text-slate-500">No orders found.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}