"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ShoppingBag, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Order } from "@/types/customerOrderList";
import { useOrderHelpers } from "@/hooks/useCustomerOrderList";

export default function OrdersList({ orders = [] }: { orders: Order[] }) {
  const categories = [
    { label: "All Orders", value: "all" },
    { label: "Ongoing", value: "PENDING" },
    { label: "Completed", value: "DELIVERED" },
    { label: "Canceled", value: "CANCELED" },
  ];

  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">My Orders</h1>
          <p className="text-slate-500 mt-1">Track and manage your recent meal orders</p>
        </div>
        <Button className="bg-orange-600 hover:bg-orange-700 rounded-xl px-6 font-bold shadow-lg shadow-orange-100 transition-all active:scale-[0.98]" asChild>
          <Link href="/meals">Order Something New</Link>
        </Button>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="bg-slate-100/80 p-1 rounded-2xl h-auto flex flex-wrap md:inline-flex border border-slate-200/50">
          {categories.map((cat) => (
            <TabsTrigger key={cat.value} value={cat.value} className="rounded-xl py-2.5 px-6 data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all font-semibold">
              {cat.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map((cat) => (
          <TabsContent key={cat.value} value={cat.value} className="focus-visible:outline-none">
            <OrderItems filterStatus={cat.value} orders={orders} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

function OrderItems({ filterStatus, orders }: { filterStatus: string; orders: Order[] }) {
  const { getStatusBadge, getStatusIcon, filterOrders } = useOrderHelpers();
  const filteredOrders = filterOrders(orders, filterStatus);

  if (!filteredOrders || filteredOrders.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
        <ShoppingBag className="mx-auto h-12 w-12 text-slate-300 mb-4" />
        <p className="text-slate-500">No orders found in this category.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {filteredOrders.map((order) => (
        <Card key={order.id} className="overflow-hidden border-slate-100 shadow-sm hover:shadow-md transition-shadow rounded-2xl">
          <CardContent className="p-0">
            <div className="p-6 flex flex-col md:flex-row justify-between gap-6">
              <div className="flex gap-4">
                <StatusIconContainer status={order.status}>
                  {getStatusIcon(order.status)}
                </StatusIconContainer>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-bold text-lg text-slate-800">#{order.id.slice(-6).toUpperCase()}</h3>
                    {getStatusBadge(order.status)}
                  </div>
                  <p className="text-sm text-slate-500 mt-1">
                    {new Date(order.date).toLocaleDateString()} • {order.items.length} Items
                  </p>
                  <p className="text-sm font-medium mt-1">
                    From: <span className="text-orange-600">{order.provider || "Kitchen"}</span>
                  </p>
                </div>
              </div>

              <div className="flex flex-row md:flex-col justify-between md:items-end gap-2">
                <div className="text-xl font-black text-slate-900">${order.total.toFixed(2)}</div>
                <Button variant="outline" size="sm" className="rounded-full group border-slate-200 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 transition-colors" asChild>
                  <Link href={`/orders/${order.id}`}>
                    View Details
                    <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </div>
            </div>

            <div className="px-6 py-3 bg-slate-50/50 border-t border-slate-100 flex gap-2 overflow-x-auto no-scrollbar">
              {order.items.map((item, index) => (
                <span key={index} className="text-[10px] font-medium bg-white px-2 py-1 rounded-md border border-slate-100 text-slate-600 whitespace-nowrap shadow-sm">
                  {item}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function StatusIconContainer({ status, children }: { status: string; children: React.ReactNode }) {
  const s = status.toUpperCase();
  const bgColor = s === "DELIVERED" ? "bg-green-50" : s === "PENDING" ? "bg-amber-50" : "bg-red-50";
  return (
    <div className={`h-12 w-12 rounded-xl flex items-center justify-center flex-shrink-0 ${bgColor}`}>
      {children}
    </div>
  );
}