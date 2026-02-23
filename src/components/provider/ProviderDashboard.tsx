"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, Clock, Loader2, AlertCircle, RefreshCcw, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProviderDashboard } from "@/hooks/useProviderDashboard";

export default function ProviderDashboard() {
  const { loading, error, orders, stats, fetchDashboardData, router } = useProviderDashboard();

  if (loading) return (
    <div className="flex flex-col h-[80vh] items-center justify-center space-y-4">
      <Loader2 className="h-12 w-12 animate-spin text-orange-600" />
      <p className="text-slate-500 animate-pulse font-medium">Loading your dashboard...</p>
    </div>
  );

  if (error) return (
    <div className="flex flex-col h-[80vh] items-center justify-center text-center px-4">
      <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
      <h2 className="text-2xl font-bold text-slate-800">Something went wrong</h2>
      <p className="text-slate-500 mt-2 max-w-md">{error}</p>
      <Button onClick={fetchDashboardData} className="mt-6 bg-orange-600 hover:bg-orange-700 rounded-xl px-8">
        <RefreshCcw className="mr-2 h-4 w-4" /> Retry Again
      </Button>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard Overview</h1>
        <p className="text-slate-500">Welcome back! Here is what's happening today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.label} className="rounded-2xl border-slate-100 shadow-sm overflow-hidden group hover:border-orange-200 hover:shadow-md transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-wider">{stat.label}</CardTitle>
              <div className="p-2 rounded-lg bg-slate-50 group-hover:bg-white transition-colors">
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-slate-900">{stat.value}</div>
              <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
                <ArrowUpRight className="h-3 w-3 text-green-500" />
                <span className="text-green-500 font-bold">{stat.trend}</span>
                <span className="ml-1">vs last month</span>
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 rounded-[2rem] border-slate-100 shadow-sm overflow-hidden bg-white">
          <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50 pb-6">
            <CardTitle className="text-xl font-bold">Recent Orders</CardTitle>
            <Button 
              variant="ghost" 
              size="sm"
              className="text-orange-600 font-bold hover:text-orange-700 hover:bg-orange-50 rounded-xl"
              onClick={() => router.push("/dashboard/provider/orders")}
            >
              View All Orders
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-50/50">
                  <TableRow className="hover:bg-transparent border-none">
                    <TableHead className="pl-8 py-4 font-bold text-slate-700">Order ID</TableHead>
                    <TableHead className="font-bold text-slate-700">Meal Details</TableHead>
                    <TableHead className="font-bold text-slate-700">Amount</TableHead>
                    <TableHead className="font-bold text-slate-700">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.length > 0 ? orders.map((order) => (
                    <TableRow 
                      key={order.id} 
                      className="hover:bg-slate-50/50 cursor-pointer transition-colors border-slate-50"
                      onClick={() => router.push(`/dashboard/provider/orders/${order.id}`)}
                    >
                      <TableCell className="pl-8 font-bold text-slate-400 text-xs">#{order.id.slice(-6).toUpperCase()}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-bold text-slate-900">{order.meal}</div>
                          <div className="text-xs text-slate-400 font-medium">{order.customer}</div>
                        </div>
                      </TableCell>
                      <TableCell className="font-black text-slate-900">${order.amount.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge className={`
                          border-none hover:bg-transparent capitalize px-3 py-1 rounded-lg font-bold
                          ${order.status === 'PENDING' ? 'bg-amber-100 text-amber-700' : ''}
                          ${['PROCESSING', 'PREPARING', 'READY'].includes(order.status) ? 'bg-blue-100 text-blue-700' : ''}
                          ${order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' : ''}
                          ${order.status === 'CANCELLED' ? 'bg-red-100 text-red-700' : ''}
                        `}>
                          {order.status.toLowerCase()}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  )) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-20">
                         <div className="flex flex-col items-center justify-center space-y-2">
                            <Package className="h-10 w-10 text-slate-200" />
                            <p className="text-slate-400 font-medium">No recent orders found</p>
                         </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Activity Feed */}
        <Card className="rounded-[2rem] border-slate-100 shadow-sm overflow-hidden bg-white">
          <CardHeader className="border-b border-slate-50 pb-6">
            <CardTitle className="text-xl font-bold">Latest Activity</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-slate-100 before:via-slate-100 before:to-transparent">
              {orders.length > 0 ? orders.map((order) => (
                <div key={order.id} className="relative flex gap-4 items-center group">
                  <div className="h-10 w-10 rounded-full bg-white border-2 border-slate-100 flex items-center justify-center shrink-0 z-10 group-hover:border-orange-200 transition-colors">
                    <Clock className="h-5 w-5 text-slate-400 group-hover:text-orange-500 transition-colors" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-slate-800">Order #{order.id.slice(-4)} placed</p>
                    <p className="text-xs text-slate-400 font-medium">{order.date} • {order.customer}</p>
                  </div>
                </div>
              )) : (
                <div className="text-center py-10">
                   <p className="text-sm text-slate-400 font-medium italic">No recent activity</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}