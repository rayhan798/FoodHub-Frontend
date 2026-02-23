"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation"; 
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Minus, Plus, Trash2, ArrowLeft, ShoppingBag } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "react-hot-toast";
import { useCart } from "@/hooks/useCustomerCart";

export default function CartPage() {
  const router = useRouter(); 
  const { cartItems, loading, updateQuantity, removeItem, subtotal, deliveryFee, total } = useCart();

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }
    toast.loading("Preparing your order...");
    router.push("/checkout"); 
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-slate-400">Loading your cart...</div>;

  if (cartItems.length === 0) {
    return <EmptyCartView />;
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-6xl">
      <header className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="icon" asChild className="rounded-full">
          <Link href="/meals"><ArrowLeft className="h-5 w-5" /></Link>
        </Button>
        <h1 className="text-3xl font-bold">Shopping Cart</h1>
        <span className="text-slate-400 font-medium">({cartItems.length} items)</span>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <CartItemRow 
              key={item.id} 
              item={item} 
              onUpdate={updateQuantity} 
              onRemove={removeItem} 
            />
          ))}
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <OrderSummary 
            subtotal={subtotal} 
            deliveryFee={deliveryFee} 
            total={total} 
            onCheckout={handleCheckout} 
          />
        </div>
      </div>
    </div>
  );
}

// --- Sub-components for better organization ---

function EmptyCartView() {
  return (
    <div className="container mx-auto px-4 py-20 text-center">
      <div className="flex justify-center mb-6">
        <div className="bg-slate-100 p-6 rounded-full text-slate-400">
          <ShoppingBag className="h-12 w-12" />
        </div>
      </div>
      <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
      <p className="text-slate-500 mb-8">Looks like you haven't added anything to your cart yet.</p>
      <Button asChild className="bg-orange-600 hover:bg-orange-700 h-12 px-8 rounded-xl font-bold">
        <Link href="/meals">Browse Meals</Link>
      </Button>
    </div>
  );
}

function CartItemRow({ item, onUpdate, onRemove }: { item: any, onUpdate: any, onRemove: any }) {
  return (
    <Card className="overflow-hidden border-slate-100 shadow-sm rounded-2xl">
      <CardContent className="p-4 flex gap-4 sm:gap-6">
        <div className="relative h-24 w-24 rounded-2xl overflow-hidden flex-shrink-0">
          <Image src={item.image} alt={item.name} fill className="object-cover" unoptimized />
        </div>
        <div className="flex-1 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold text-lg">{item.name}</h3>
              <p className="text-sm text-slate-500">Kitchen: <span className="text-orange-600">{item.providerName}</span></p>
            </div>
            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-red-500" onClick={() => onRemove(item.id)}>
              <Trash2 className="h-5 w-5" />
            </Button>
          </div>
          <div className="flex justify-between items-end mt-4">
            <div className="font-extrabold text-xl">${(item.price * item.quantity).toFixed(2)}</div>
            <div className="flex items-center border border-slate-200 rounded-xl px-2 py-1">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onUpdate(item.id, -1)}><Minus className="h-4 w-4" /></Button>
              <span className="w-10 text-center font-bold">{item.quantity}</span>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onUpdate(item.id, 1)}><Plus className="h-4 w-4" /></Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function OrderSummary({ subtotal, deliveryFee, total, onCheckout }: any) {
  return (
    <Card className="rounded-3xl border-none shadow-xl bg-white sticky top-24 overflow-hidden">
      <div className="h-2 bg-orange-600 w-full" />
      <CardContent className="p-8 space-y-6">
        <h2 className="text-2xl font-bold">Summary</h2>
        <div className="space-y-4">
          <div className="flex justify-between text-slate-500 font-medium">
            <span>Subtotal</span>
            <span className="text-slate-900">${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-slate-500 font-medium">
            <span>Delivery Fee</span>
            <span className="text-green-600">${deliveryFee.toFixed(2)}</span>
          </div>
          <Separator />
          <div className="flex justify-between items-center pt-2">
            <span className="text-lg font-bold">Grand Total</span>
            <span className="text-3xl font-black text-orange-600">${total.toFixed(2)}</span>
          </div>
        </div>
        <Button onClick={onCheckout} className="w-full bg-orange-600 h-14 rounded-2xl text-lg font-bold">
          Proceed to Checkout
        </Button>
      </CardContent>
    </Card>
  );
}