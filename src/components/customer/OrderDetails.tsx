"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Package,
  MapPin,
  CreditCard,
  Phone,
  CheckCircle2,
  Clock,
  Truck,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

/* ================= TYPES ================= */

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface OrderDetail {
  id: string;
  status: string;
  createdAt?: string;
  date?: string;
  items: OrderItem[];
  totalPrice?: number;
  total?: number;
  subtotal?: number;
  deliveryFee?: number;
  deliveryAddress?: string;
  address?: string;
  customer?: {
    phone?: string;
  };
  phone?: string;
  paymentMethod?: string;
}

/* ================= SAFE HELPERS ================= */

const normalizeStatus = (status?: string) =>
  (status || "").toUpperCase().replace("CANCELLED", "CANCELED");

/* --- BDT Symbol --- */
const BDT = "৳";

/* ================= COMPONENT ================= */

export default function OrderDetails({ order }: { order: OrderDetail }) {
  const getImageUrl = (path?: string) => {
    if (!path || path.includes("undefined")) {
      return "https://placehold.co/150x150?text=Food";
    }
    if (path.startsWith("http")) return path;

    const backendUrl = "http://localhost:5000";
    const cleanPath = path.startsWith("/") ? path : `/${path}`;

    if (!cleanPath.includes("uploads")) {
      return `${backendUrl}/uploads${cleanPath}`;
    }
    return `${backendUrl}${cleanPath}`;
  };

  const getStatusColor = (status?: string) => {
    const s = normalizeStatus(status);

    switch (s) {
      case "DELIVERED":
        return "bg-green-100 text-green-700";
      case "PENDING":
        return "bg-amber-100 text-amber-700";
      case "CANCELED":
        return "bg-red-100 text-red-700";
      default:
        return "bg-blue-100 text-blue-700";
    }
  };

  const itemsList = order?.items ?? [];
  const displayPhone =
    order?.customer?.phone || order?.phone || "Not available";
  const displayAddress =
    order?.deliveryAddress || order?.address || "No address provided";

  const displayTotal =
    Number(order?.totalPrice || order?.total || 0);

  const deliveryFee = Number(order?.deliveryFee || 0);

  const orderDate =
    order?.createdAt || order?.date || new Date().toISOString();

  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl">
      <Button
        variant="ghost"
        asChild
        className="mb-6 -ml-2 text-slate-500 hover:text-orange-600 transition-colors"
      >
        <Link href="/orders">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Orders
        </Link>
      </Button>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Order #{order?.id?.slice(-6).toUpperCase() || "N/A"}
          </h1>

          <p className="text-slate-500 font-medium">
            Placed on{" "}
            {new Date(orderDate).toLocaleString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })}
          </p>
        </div>

        <Badge
          className={`${getStatusColor(
            order?.status
          )} border-none px-4 py-1.5 text-xs font-black uppercase tracking-wider`}
        >
          {order?.status || "PENDING"}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <Card className="rounded-3xl border-slate-100 shadow-sm overflow-hidden bg-white">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100">
              <CardTitle className="text-lg flex items-center gap-2 font-bold">
                <Package className="h-5 w-5 text-orange-600" />
                Order Items ({itemsList.length})
              </CardTitle>
            </CardHeader>

            <CardContent className="p-0">
              <div className="divide-y divide-slate-100">
                {itemsList.map((item, index) => (
                  <div
                    key={item.id || index}
                    className="p-5 flex items-center gap-4 hover:bg-slate-50/50 transition-colors"
                  >
                    <div className="h-16 w-16 relative rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 flex-shrink-0">
                      <Image
                        src={getImageUrl(item.image)}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="64px"
                        unoptimized
                      />
                    </div>

                    <div className="flex-1">
                      <h4 className="font-bold text-slate-800">
                        {item.name}
                      </h4>
                      <p className="text-sm text-slate-500 font-medium">
                        Qty: {item.quantity} × {BDT}
                        {Number(item.price || 0).toLocaleString()}
                      </p>
                    </div>

                    <div className="font-black text-slate-900 text-lg">
                      {BDT}{(Number(item.price || 0) * item.quantity).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* TRACKING */}
          <Card className="rounded-3xl border-slate-100 shadow-sm p-8 bg-white">
            <h3 className="font-bold text-lg mb-8 text-slate-900">
              Order Tracking
            </h3>

            <div className="space-y-8 relative before:absolute before:left-[17px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
              <div className="flex gap-4 relative z-10">
                <div className="h-9 w-9 rounded-full bg-green-100 flex items-center justify-center border-4 border-white shadow-sm">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="font-bold text-sm text-slate-900">
                    Order Confirmed
                  </p>
                  <p className="text-xs text-slate-500">
                    We have received your order
                  </p>
                </div>
              </div>

              <div className="flex gap-4 relative z-10">
                <div className="h-9 w-9 rounded-full bg-orange-100 flex items-center justify-center border-4 border-white shadow-sm">
                  <Clock className="h-4 w-4 text-orange-600" />
                </div>
                <div>
                  <p className="font-bold text-sm text-slate-900">
                    Processing
                  </p>
                  <p className="text-xs text-slate-500">
                    Preparing your delicious meal
                  </p>
                </div>
              </div>

              <div
                className={`flex gap-4 relative z-10 ${
                  normalizeStatus(order?.status) === "DELIVERED"
                    ? "opacity-100"
                    : "opacity-40"
                }`}
              >
                <div
                  className={`h-9 w-9 rounded-full flex items-center justify-center border-4 border-white shadow-sm ${
                    normalizeStatus(order?.status) === "DELIVERED"
                      ? "bg-green-100"
                      : "bg-slate-100"
                  }`}
                >
                  <Truck
                    className={`h-4 w-4 ${
                      normalizeStatus(order?.status) === "DELIVERED"
                        ? "text-green-600"
                        : "text-slate-500"
                    }`}
                  />
                </div>
                <div>
                  <p className="font-bold text-sm text-slate-900">
                    Delivered
                  </p>
                  <p className="text-xs text-slate-500">
                    Order has been delivered
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* SIDEBAR */}
        <div className="space-y-6">
          <Card className="rounded-3xl border-slate-100 shadow-sm bg-white overflow-hidden">
            <CardContent className="p-6 space-y-6">
              <div>
                <div className="flex items-center gap-2 text-slate-400 text-xs font-black uppercase">
                  <MapPin className="h-4 w-4 text-orange-600" />
                  Delivery Address
                </div>

                <div className="bg-slate-50 p-3 rounded-2xl">
                  <p className="text-sm font-bold text-slate-700">
                    {displayAddress}
                  </p>

                  <p className="text-sm text-slate-500 flex items-center gap-2 mt-2 pt-2 border-t border-slate-200">
                    <Phone className="h-3.5 w-3.5" />
                    {displayPhone}
                  </p>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 text-slate-400 text-xs font-black uppercase">
                  <CreditCard className="h-4 w-4 text-orange-600" />
                  Payment Info
                </div>

                <div className="bg-slate-50 p-3 rounded-2xl">
                  <p className="text-sm font-bold text-slate-700">
                    {order?.paymentMethod || "Cash on Delivery"}
                  </p>
                </div>
              </div>

              <Separator className="bg-slate-100" />

              <div className="space-y-3 pt-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>
                    {BDT}{(displayTotal - deliveryFee).toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span>Delivery Fee</span>
                  <span className="text-green-600 font-bold">
                    {BDT}{deliveryFee.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between font-black text-xl pt-4 border-t">
                  <span>Grand Total</span>
                  <span className="text-orange-600">
                    {BDT}{displayTotal.toLocaleString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}