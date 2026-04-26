"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  ShoppingBag,
  Clock,
  CheckCircle2,
  XCircle,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";

/* ================= TYPES ================= */

// ব্যাকএন্ড স্ট্যাটাসের সাথে সামঞ্জস্য রেখে টাইপ
export type OrderStatus = "DELIVERED" | "PENDING" | "CANCELED" | string;

export type Order = {
  id: string;
  date: string;
  total: number;
  status: OrderStatus;
  items: string[];
  provider: string;
  // অতিরিক্ত প্রপার্টি যা পেজ কম্পোনেন্টে এরর দিচ্ছিল
  address?: string;
  phone?: string;
  paymentMethod?: string;
};

/* ================= COMPONENT ================= */

const getStatusBadge = (status: OrderStatus) => {
  const s = status.toUpperCase();
  switch (s) {
    case "DELIVERED":
      return (
        <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none px-3">
          Delivered
        </Badge>
      );
    case "PENDING":
      return (
        <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-none px-3">
          Pending
        </Badge>
      );
    case "CANCELED":
      return (
        <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-none px-3">
          Canceled
        </Badge>
      );
    default:
      return <Badge className="bg-slate-100 text-slate-700">{status}</Badge>;
  }
};

const getStatusIcon = (status: OrderStatus) => {
  const s = status.toUpperCase();
  switch (s) {
    case "DELIVERED":
      return <CheckCircle2 className="h-5 w-5 text-green-600" />;
    case "PENDING":
      return <Clock className="h-5 w-5 text-amber-600" />;
    case "CANCELED":
      return <XCircle className="h-5 w-5 text-red-600" />;
    default:
      return <ShoppingBag className="h-5 w-5" />;
  }
};

function OrderItems({ filterStatus, orders }: { filterStatus?: string; orders: Order[] }) {
    const filteredOrders = filterStatus && filterStatus !== "all"
      ? orders.filter((o) => o.status.toUpperCase() === filterStatus.toUpperCase())
      : orders;

    if (!filteredOrders || filteredOrders.length === 0) {
      return (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
          <ShoppingBag className="mx-auto h-12 w-12 text-slate-300 mb-4" />
          <p className="text-slate-500">
            No orders found in this category.
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {filteredOrders.map((order) => (
          <Card
            key={order.id}
            className="overflow-hidden border-slate-100 shadow-sm hover:shadow-md transition-shadow rounded-2xl"
          >
            <CardContent className="p-0">
              <div className="p-6 flex flex-col md:flex-row justify-between gap-6">
                <div className="flex gap-4">
                  <div
                    className={`h-12 w-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      order.status.toUpperCase() === "DELIVERED"
                        ? "bg-green-50"
                        : order.status.toUpperCase() === "PENDING"
                        ? "bg-amber-50"
                        : "bg-red-50"
                    }`}
                  >
                    {getStatusIcon(order.status)}
                  </div>

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
                  <div className="text-xl font-black text-slate-900">
                    ${order.total.toFixed(2)}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full group border-slate-200 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 transition-colors"
                    asChild
                  >
                    <Link href={`/orders/${order.id}`}>
                      View Details
                      <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Items Summary Strip */}
              <div className="px-6 py-3 bg-slate-50/50 border-t border-slate-100 flex gap-2 overflow-x-auto no-scrollbar">
                {order.items.map((item, index) => (
                  <span
                    key={index}
                    className="text-[10px] font-medium bg-white px-2 py-1 rounded-md border border-slate-100 text-slate-600 whitespace-nowrap shadow-sm"
                  >
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
  
  export default function OrdersList({ orders = [] }: { orders: Order[] }) {
    return (
      <div className="container mx-auto px-4 py-10 max-w-4xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">My Orders</h1>
          <p className="text-slate-500 mt-1">
            Track and manage your recent meal orders
          </p>
        </div>

        <Button
          className="bg-orange-600 hover:bg-orange-700 rounded-xl px-6 font-bold shadow-lg shadow-orange-100 transition-all active:scale-[0.98]"
          asChild
        >
          <Link href="/meals">Order Something New</Link>
        </Button>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="bg-slate-100/80 p-1 rounded-2xl h-auto flex flex-wrap md:inline-flex border border-slate-200/50">
          <TabsTrigger value="all" className="rounded-xl py-2.5 px-6 data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all font-semibold">
            All Orders
          </TabsTrigger>
          <TabsTrigger value="PENDING" className="rounded-xl py-2.5 px-6 data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all font-semibold">
            Ongoing
          </TabsTrigger>
          <TabsTrigger value="DELIVERED" className="rounded-xl py-2.5 px-6 data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all font-semibold">
            Completed
          </TabsTrigger>
          <TabsTrigger value="CANCELED" className="rounded-xl py-2.5 px-6 data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all font-semibold">
            Canceled
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="focus-visible:outline-none">
          <OrderItems filterStatus="all" orders={orders} />
        </TabsContent>
        <TabsContent value="PENDING" className="focus-visible:outline-none">
          <OrderItems filterStatus="PENDING" orders={orders} />
        </TabsContent>
        <TabsContent value="DELIVERED" className="focus-visible:outline-none">
          <OrderItems filterStatus="DELIVERED" orders={orders} />
        </TabsContent>
        <TabsContent value="CANCELED" className="focus-visible:outline-none">
          <OrderItems filterStatus="CANCELED" orders={orders} />
        </TabsContent>
      </Tabs>
    </div>
  );
}