"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { CreditCard, Truck, MapPin, ChevronRight, Loader2 } from "lucide-react";
import { useCheckout } from "@/hooks/useCheckout";

export default function CheckoutPage() {
  const {
    formData,
    cartItems,
    subtotal,
    deliveryFee,
    total,
    isSubmitting,
    loading,
    handleInputChange,
    handlePlaceOrder
  } = useCheckout();

  if (loading) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <Loader2 className="animate-spin h-8 w-8 text-orange-600" />
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-10 max-w-6xl">
      <nav className="flex items-center gap-2 mb-8 text-sm text-slate-500">
        <Link href="/cart" className="hover:text-orange-600">Cart</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-slate-900 font-medium">Checkout</span>
      </nav>

      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          <section className="space-y-4">
            <div className="flex items-center gap-2 font-semibold text-lg text-slate-800">
              <MapPin className="h-5 w-5 text-orange-600" />
              <h2>Delivery Address</h2>
            </div>
            <Card className="rounded-2xl border-slate-100 shadow-sm">
              <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput label="First Name *" id="firstName" value={formData.firstName} onChange={handleInputChange} placeholder="John" />
                <FormInput label="Last Name" id="lastName" value={formData.lastName} onChange={handleInputChange} placeholder="Doe" />
                <div className="md:col-span-2">
                  <FormInput label="Street Address *" id="address" value={formData.address} onChange={handleInputChange} placeholder="House #1, Road #1" />
                </div>
                <FormInput label="City *" id="city" value={formData.city} onChange={handleInputChange} placeholder="Dhaka" />
                <FormInput label="Phone *" id="phone" value={formData.phone} onChange={handleInputChange} placeholder="017XXXXXXXX" />
              </CardContent>
            </Card>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-2 font-semibold text-lg text-slate-800">
              <CreditCard className="h-5 w-5 text-orange-600" />
              <h2>Payment Method</h2>
            </div>
            <Card className="rounded-2xl border-slate-100 shadow-sm">
              <CardContent className="p-6">
                <RadioGroup defaultValue="cod" className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Label htmlFor="cod" className="flex flex-col items-center justify-between rounded-xl border-2 p-4 cursor-pointer hover:bg-slate-50 transition-colors">
                    <RadioGroupItem value="cod" id="cod" className="sr-only" />
                    <Truck className="mb-2 h-6 w-6 text-orange-600" />
                    <span className="font-bold">Cash on Delivery</span>
                  </Label>
                </RadioGroup>
              </CardContent>
            </Card>
          </section>
        </div>

        <aside className="lg:col-span-1">
          <Card className="rounded-3xl border-slate-100 shadow-lg sticky top-24">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-slate-600">{item.name} <span className="text-xs">x{item.quantity}</span></span>
                    <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <Separator />
              <div className="space-y-2">
                <SummaryRow label="Subtotal" value={subtotal} />
                <SummaryRow label="Delivery" value={deliveryFee} isFree={deliveryFee === 0} />
                <div className="flex justify-between text-xl font-bold pt-2 text-slate-900">
                  <span>Total</span>
                  <span className="text-orange-600">${total.toFixed(2)}</span>
                </div>
              </div>
              <Button 
                onClick={handlePlaceOrder} 
                className="w-full bg-orange-600 hover:bg-orange-700 h-12 rounded-xl mt-4 font-bold transition-all"
                disabled={isSubmitting}
              >
                {isSubmitting ? <Loader2 className="animate-spin mr-2" /> : "Place Order"}
              </Button>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}

// Small helper components to keep the main JSX clean
function FormInput({ label, ...props }: any) {
  return (
    <div className="space-y-2">
      <Label htmlFor={props.id}>{label}</Label>
      <Input {...props} className="rounded-xl" />
    </div>
  );
}

function SummaryRow({ label, value, isFree }: any) {
  return (
    <div className="flex justify-between text-slate-600">
      <span>{label}</span>
      <span className={isFree ? "text-green-600" : ""}>
        {isFree ? "Free" : `$${value.toFixed(2)}`}
      </span>
    </div>
  );
}