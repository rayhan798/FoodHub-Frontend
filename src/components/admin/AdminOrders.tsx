"use client";

import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
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
import { useAdminOrders } from "../../hooks/useAdminOrders";

export default function AdminAllOrdersPage() {
  const {
    loading,
    searchTerm,
    setSearchTerm,
    actionLoading,
    filteredOrders,
    handleCancelOrder
  } = useAdminOrders();

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      DELIVERED: "bg-green-100 text-green-700 hover:bg-green-100",
      READY: "bg-blue-100 text-blue-700 hover:bg-blue-100",
      PREPARING: "bg-indigo-100 text-indigo-700 hover:bg-indigo-100",
      PENDING: "bg-amber-100 text-amber-700 hover:bg-amber-100",
      CANCELLED: "bg-red-100 text-red-700 hover:bg-red-100",
    };
    return (
      <Badge className={`${styles[status] || "bg-slate-100"} border-none rounded-full px-3 capitalize`}>
        {status?.toLowerCase().replace('_', ' ')}
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
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow>
                <TableHead className="pl-6">Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Provider</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead className="text-right pr-6">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-20 text-slate-400">
                    <div className="flex flex-col items-center gap-2">
                       <Search className="h-8 w-8 opacity-20" />
                       <p>No real-time orders found in the system.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredOrders.map((order) => (
                  <TableRow key={order.id} className="hover:bg-slate-50/50 transition-colors group">
                    <TableCell className="pl-6 font-mono text-xs font-semibold text-orange-600">
                      #{order.id.slice(-8).toUpperCase()}
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
                      ${Number(order.totalPrice).toFixed(2)}
                    </TableCell>
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                    <TableCell className="text-slate-500 text-xs">
                      {new Date(order.createdAt).toLocaleString('en-GB', {
                        day: '2-digit', month: 'short', year: 'numeric',
                        hour: '2-digit', minute: '2-digit'
                      })}
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-slate-100 rounded-full">
                            <MoreVertical className="h-4 w-4 text-slate-400" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-xl w-40 shadow-xl border-slate-100">
                          <DropdownMenuItem className="gap-2 cursor-pointer py-2 text-slate-600">
                            <Eye className="h-4 w-4" /> View Details
                          </DropdownMenuItem>
                          {order.status !== "CANCELLED" && order.status !== "DELIVERED" && (
                            <DropdownMenuItem 
                              onClick={() => handleCancelOrder(order.id)}
                              className="gap-2 text-red-600 cursor-pointer py-2 focus:bg-red-50 focus:text-red-700"
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
        </CardContent>
      </Card>
    </div>
  );
}