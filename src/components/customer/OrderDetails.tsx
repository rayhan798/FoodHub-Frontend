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
import type { OrderDetail, OrderItem, OrderDetailsProps } from "@/types/customerOrderDetails";
import { useOrderDetails } from "@/hooks/useCustomerOrderDetails";

export default function OrderDetails({ order }: OrderDetailsProps) {
  const {
    getImageUrl,
    getStatusColor,
    displayPhone,
    displayAddress,
    displayTotal,
    orderDate,
    itemsList,
    subtotal,
  } = useOrderDetails(order);

  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl">
      <Button variant="ghost" asChild className="mb-6 -ml-2 text-slate-500 hover:text-orange-600 transition-colors">
        <Link href="/orders">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Orders
        </Link>
      </Button>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Order #{order.id?.slice(-6).toUpperCase() || "N/A"}
          </h1>
          <p className="text-slate-500 font-medium">
            Placed on {new Date(orderDate).toLocaleString('en-GB', { 
              day: 'numeric', 
              month: 'long', 
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              hour12: true 
            })}
          </p>
        </div>

        <Badge className={`${getStatusColor(order.status)} border-none px-4 py-1.5 text-xs font-black uppercase tracking-wider`}>
          {order.status || "PENDING"}
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
                  <div key={item.id || index} className="p-5 flex items-center gap-4 hover:bg-slate-50/50 transition-colors">
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
                      <h4 className="font-bold text-slate-800">{item.name}</h4>
                      <p className="text-sm text-slate-500 font-medium">
                        Qty: {item.quantity} × ${Number(item.price).toFixed(2)}
                      </p>
                    </div>
                    <div className="font-black text-slate-900 text-lg">
                      ${(Number(item.price) * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-slate-100 shadow-sm p-8 bg-white">
            <h3 className="font-bold text-lg mb-8 text-slate-900">Order Tracking</h3>
            <div className="space-y-8 relative before:absolute before:left-[17px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
              <TrackingStep 
                icon={<CheckCircle2 className="h-4 w-4 text-green-600" />}
                title="Order Confirmed"
                description="We have received your order"
                active
              />
              <TrackingStep 
                icon={<Clock className="h-4 w-4 text-orange-600" />}
                title="Processing"
                description="Preparing your delicious meal"
                active
              />
              <TrackingStep 
                icon={<Truck className={`h-4 w-4 ${order.status?.toUpperCase() === 'DELIVERED' ? 'text-green-600' : 'text-slate-500'}`} />}
                title="Delivered"
                description="Order has been delivered"
                active={order.status?.toUpperCase() === 'DELIVERED'}
              />
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="rounded-3xl border-slate-100 shadow-sm bg-white overflow-hidden">
            <CardContent className="p-6 space-y-6">
              <SummarySection icon={<MapPin className="h-4 w-4 text-orange-600" />} title="Delivery Address">
                <p className="text-sm font-bold text-slate-700 leading-relaxed">{displayAddress}</p>
                <p className="text-sm text-slate-500 flex items-center gap-2 mt-2 pt-2 border-t border-slate-200">
                  <Phone className="h-3.5 w-3.5" /> {displayPhone}
                </p>
              </SummarySection>

              <SummarySection icon={<CreditCard className="h-4 w-4 text-orange-600" />} title="Payment Info">
                <p className="text-sm font-bold text-slate-700">{order.paymentMethod || "Cash on Delivery"}</p>
              </SummarySection>

              <Separator className="bg-slate-100" />

              <div className="space-y-3 pt-2">
                <PriceRow label="Subtotal" value={subtotal} />
                <PriceRow label="Delivery Fee" value={order.deliveryFee || 0} isHighlight />
                <div className="flex justify-between font-black text-xl pt-4 border-t border-dashed border-slate-200">
                  <span className="text-slate-900">Grand Total</span>
                  <span className="text-orange-600">${Number(displayTotal).toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Small Helper Components for cleaner JSX
function TrackingStep({ icon, title, description, active }: { icon: React.ReactNode, title: string, description: string, active?: boolean }) {
  return (
    <div className={`flex gap-4 relative z-10 ${active ? 'opacity-100' : 'opacity-40'}`}>
      <div className={`h-9 w-9 rounded-full flex items-center justify-center border-4 border-white shadow-sm ${active ? 'bg-orange-50' : 'bg-slate-100'}`}>
        {icon}
      </div>
      <div>
        <p className="font-bold text-sm text-slate-900">{title}</p>
        <p className="text-xs text-slate-500 font-medium">{description}</p>
      </div>
    </div>
  );
}

function SummarySection({ icon, title, children }: { icon: React.ReactNode, title: string, children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-slate-400 text-xs font-black uppercase tracking-widest">
        {icon} {title}
      </div>
      <div className="bg-slate-50 p-3 rounded-2xl">
        {children}
      </div>
    </div>
  );
}

function PriceRow({ label, value, isHighlight }: { label: string, value: number, isHighlight?: boolean }) {
  return (
    <div className="flex justify-between text-sm font-medium text-slate-500">
      <span>{label}</span>
      <span className={isHighlight ? "text-green-600 font-bold" : "text-slate-900"}>${value.toFixed(2)}</span>
    </div>
  );
}