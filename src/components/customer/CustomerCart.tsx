"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation"; 
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Minus, Plus, Trash2, ArrowLeft, ShoppingBag } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "react-hot-toast";

/* --- Currency Symbol Configuration --- */
const BDT = "৳";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  providerName: string;
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter(); 

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
    setLoading(false);
  }, []);

  const updateStorage = (updatedItems: CartItem[]) => {
    setCartItems(updatedItems);
    localStorage.setItem("cart", JSON.stringify(updatedItems));
    window.dispatchEvent(new Event("cart-updated"));
  };

  const updateQuantity = (id: string, delta: number) => {
    const updated = cartItems.map(item =>
      item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    );
    updateStorage(updated);
  };

  const removeItem = (id: string) => {
    const updated = cartItems.filter(item => item.id !== id);
    updateStorage(updated);
    toast.success("Item removed from cart");
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }

    toast.loading("Preparing your order...");
    router.push("/checkout"); 
  };

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const deliveryFee = cartItems.length > 0 ? 50.00 : 0; // Adjusted for BDT context
  const total = subtotal + deliveryFee;

  if (loading) return <div className="min-h-screen" />;

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-slate-100 p-6 rounded-full text-slate-400">
            <ShoppingBag className="h-12 w-12" />
          </div>
        </div>
        <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
        <p className="text-slate-500 mb-8">Looks like you haven&apos;t added anything to your cart yet.</p>
        <Button asChild className="bg-orange-600 hover:bg-orange-700 h-12 px-8 rounded-xl font-bold">
          <Link href="/meals">Browse Meals</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-6xl">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="icon" asChild className="rounded-full hover:bg-slate-100">
          <Link href="/meals"><ArrowLeft className="h-5 w-5" /></Link>
        </Button>
        <h1 className="text-3xl font-bold">Shopping Cart</h1>
        <span className="text-slate-400 font-medium">({cartItems.length} items)</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <Card key={item.id} className="overflow-hidden border-slate-100 shadow-sm rounded-2xl hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex gap-4 sm:gap-6">
                  <div className="relative h-24 w-24 sm:h-28 sm:w-28 rounded-2xl overflow-hidden flex-shrink-0 bg-slate-50">
                    <Image src={item.image} alt={item.name} fill className="object-cover" unoptimized={true} />
                  </div>

                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-lg text-slate-800 leading-tight">{item.name}</h3>
                        <p className="text-sm text-slate-500 mt-1">Kitchen: <span className="text-orange-600 font-medium">{item.providerName}</span></p>
                      </div>
                      <Button variant="ghost" size="icon" className="text-slate-400 hover:text-red-500 hover:bg-red-50 -mt-2 -mr-2" onClick={() => removeItem(item.id)}>
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </div>

                    <div className="flex justify-between items-end mt-4">
                      <div className="font-extrabold text-xl text-slate-900">
                        {BDT}{(item.price * item.quantity).toLocaleString()}
                      </div>

                      <div className="flex items-center border border-slate-200 rounded-xl px-2 py-1 bg-white shadow-sm">
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={() => updateQuantity(item.id, -1)}>
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-10 text-center font-bold">{item.quantity}</span>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={() => updateQuantity(item.id, 1)}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="lg:col-span-1">
          <Card className="rounded-3xl border-none shadow-xl bg-white sticky top-24 overflow-hidden">
            <div className="h-2 bg-orange-600 w-full" />
            <CardContent className="p-8 space-y-6">
              <h2 className="text-2xl font-bold text-slate-900">Summary</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between text-slate-500 font-medium">
                  <span>Subtotal</span>
                  <span className="text-slate-900">{BDT}{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-500 font-medium">
                  <span>Delivery Fee</span>
                  <span className="text-green-600">{BDT}{deliveryFee.toLocaleString()}</span>
                </div>
                <Separator className="bg-slate-100" />
                <div className="flex justify-between items-center pt-2">
                  <span className="text-lg font-bold text-slate-900">Grand Total</span>
                  <span className="text-3xl font-black text-orange-600">{BDT}{total.toLocaleString()}</span>
                </div>
              </div>

              <Button 
                onClick={handleCheckout}
                className="w-full bg-orange-600 hover:bg-orange-700 h-14 rounded-2xl text-lg font-bold shadow-lg shadow-orange-100 transition-all active:scale-[0.98]"
              >
                Proceed to Checkout
              </Button>

              <div className="flex items-center gap-2 justify-center text-slate-400 text-xs">
                Secure Checkout Powered by FoodHub
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}