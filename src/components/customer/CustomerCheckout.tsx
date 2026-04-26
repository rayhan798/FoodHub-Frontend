"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { CreditCard, Truck, MapPin, ChevronRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { createOrderAction } from "@/hooks/order"; // ✅ সার্ভার অ্যাকশন ইম্পোর্ট

export default function CheckoutPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    phone: "",
    paymentMethod: "cod"
  });

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      const items = JSON.parse(savedCart);
      if (items.length === 0) router.push("/cart");
      setCartItems(items);
    } else {
      router.push("/meals");
    }
  }, [router]);

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const deliveryFee = cartItems.length > 0 ? 5.00 : 0;
  const total = subtotal + deliveryFee;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  // ✅ প্লেস অর্ডার ফাংশন
  const handlePlaceOrder = async () => {
    if (!formData.firstName || !formData.address || !formData.phone || !formData.city) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    
    try {
      // আমরা কার্টের প্রথম আইটেমটি দিয়ে টেস্ট করছি
      const payload = {
        mealId: cartItems[0].id,
        quantity: cartItems[0].quantity,
        address: `${formData.address}, ${formData.city}`,
      };

      // সার্ভার অ্যাকশন কল
      const result = await createOrderAction(payload);

      if (result?.error) {
        toast.error(result.error);
        setIsSubmitting(false);
        return;
      }

      if (result?.success) {
        toast.success("Order placed successfully!");
        localStorage.removeItem("cart");
        window.dispatchEvent(new Event("cart-updated"));
        router.push("/orders/success");
      }
    } catch (error) {
      toast.error("An unexpected error occurred.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-10 max-w-6xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-8 text-sm text-slate-500">
        <Link href="/cart" className="hover:text-orange-600">Cart</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-slate-900 font-medium">Checkout</span>
      </div>

      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          <section className="space-y-4">
            <div className="flex items-center gap-2 font-semibold text-lg">
              <MapPin className="h-5 w-5 text-orange-600" />
              <h2>Delivery Address</h2>
            </div>
            <Card className="rounded-2xl border-slate-100">
              <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input id="firstName" value={formData.firstName} onChange={handleInputChange} placeholder="John" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" value={formData.lastName} onChange={handleInputChange} placeholder="Doe" />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="address">Street Address *</Label>
                  <Input id="address" value={formData.address} onChange={handleInputChange} placeholder="House #1, Road #1" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Input id="city" value={formData.city} onChange={handleInputChange} placeholder="Dhaka" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone *</Label>
                  <Input id="phone" value={formData.phone} onChange={handleInputChange} placeholder="017XXXXXXXX" />
                </div>
              </CardContent>
            </Card>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-2 font-semibold text-lg">
              <CreditCard className="h-5 w-5 text-orange-600" />
              <h2>Payment Method</h2>
            </div>
            <Card className="rounded-2xl border-slate-100">
              <CardContent className="p-6">
                <RadioGroup defaultValue="cod" className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Label htmlFor="cod" className="flex flex-col items-center justify-between rounded-xl border-2 p-4 cursor-pointer hover:bg-slate-50">
                    <RadioGroupItem value="cod" id="cod" className="sr-only" />
                    <Truck className="mb-2 h-6 w-6" />
                    <span className="font-bold">Cash on Delivery</span>
                  </Label>
                </RadioGroup>
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Sidebar Summary */}
        <div className="lg:col-span-1">
          <Card className="rounded-3xl border-slate-100 shadow-lg sticky top-24">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>{item.name} x{item.quantity}</span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <Separator />
              <div className="space-y-2">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Delivery</span>
                  <span>${deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xl font-bold pt-2">
                  <span>Total</span>
                  <span className="text-orange-600">${total.toFixed(2)}</span>
                </div>
              </div>
              <Button 
                onClick={handlePlaceOrder} 
                className="w-full bg-orange-600 hover:bg-orange-700 h-12 rounded-xl mt-4"
                disabled={isSubmitting}
              >
                {isSubmitting ? <Loader2 className="animate-spin" /> : "Place Order"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}