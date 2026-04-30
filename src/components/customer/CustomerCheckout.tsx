"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { 
  CreditCard, 
  Truck, 
  MapPin, 
  ChevronRight, 
  Loader2, 
  User, 
  Phone, 
  Building2, 
  ShoppingBag,
  CheckCircle2
} from "lucide-react";
import Link from "next/link";
import { toast } from "react-hot-toast";
import Image from "next/image";

/* --- BDT Symbol --- */
const BDT = "৳";

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
    paymentMethod: "cod",
  });

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      const items = JSON.parse(savedCart);
      if (!items.length) router.push("/cart");
      setCartItems(items);
    } else {
      router.push("/meals");
    }
  }, [router]);

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const deliveryFee = cartItems.length ? 50 : 0; // Adjusted for BDT context
  const total = subtotal + deliveryFee;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((p) => ({ ...p, [id]: value }));
  };

  const handlePlaceOrder = async () => {
    if (!formData.firstName || !formData.address || !formData.phone || !formData.city) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        mealId: cartItems[0].id, 
        quantity: cartItems[0].quantity,
        address: `${formData.address}, ${formData.city}`,
        phone: formData.phone,
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to place order");

      toast.success("Order placed successfully!");
      localStorage.removeItem("cart");
      window.dispatchEvent(new Event("cart-updated"));
      router.push("/orders");
    } catch (err: any) {
      toast.error(err.message || "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 mb-8 text-sm text-slate-500">
          <Link href="/cart" className="hover:text-orange-600 transition-colors">Cart</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-slate-900 font-semibold underline underline-offset-4 decoration-orange-500">Checkout</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT SIDE: SHIPPING & PAYMENT */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-none shadow-sm ring-1 ring-slate-200">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
                    <Truck size={20} />
                  </div>
                  <CardTitle className="text-xl">Shipping Information</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="grid gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input id="firstName" placeholder="John Doe" className="pl-10" onChange={handleInputChange} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input id="phone" placeholder="017XXXXXXXX" className="pl-10" onChange={handleInputChange} />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Street Address</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input id="address" placeholder="House/Road/Sector" className="pl-10" onChange={handleInputChange} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input id="city" placeholder="Area" className="pl-10" onChange={handleInputChange} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm ring-1 ring-slate-200">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                    <CreditCard size={20} />
                  </div>
                  <CardTitle className="text-xl">Payment Method</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <RadioGroup defaultValue="cod" className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Label
                    htmlFor="cod"
                    className="flex items-center justify-between p-4 bg-white border-2 border-slate-100 rounded-xl cursor-pointer hover:border-orange-200"
                  >
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="cod" id="cod" />
                      <span className="font-semibold">Cash on Delivery</span>
                    </div>
                    <CheckCircle2 className="h-5 w-5 text-orange-500" />
                  </Label>
                </RadioGroup>
              </CardContent>
            </Card>
          </div>

          {/* RIGHT SIDE: ORDER SUMMARY */}
          <div className="lg:col-span-1">
            <Card className="border-none shadow-lg ring-1 ring-slate-200 sticky top-24 overflow-hidden">
              <div className="h-1.5 bg-orange-600 w-full" />
              <CardHeader className="bg-slate-50/50 pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <ShoppingBag className="text-orange-600" size={18} />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4 mb-6">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="relative h-16 w-16 rounded-xl overflow-hidden flex-shrink-0 bg-slate-100 border border-slate-100">
                        <Image 
                          src={item.image} 
                          alt={item.name} 
                          fill 
                          className="object-cover" 
                          unoptimized={true} 
                        />
                        <div className="absolute top-0 right-0 bg-orange-600 text-white text-[10px] px-1.5 rounded-bl-lg font-bold">
                          x{item.quantity}
                        </div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-800 truncate">{item.name}</p>
                        <p className="text-xs text-slate-500">{item.providerName}</p>
                        <p className="text-sm font-semibold text-slate-700 mt-1">
                          {BDT}{(item.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator className="mb-4" />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal</span>
                    <span>{BDT}{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Delivery Fee</span>
                    <span>{BDT}{deliveryFee.toLocaleString()}</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between text-lg font-black text-slate-900">
                    <span>Total Amount</span>
                    <span className="text-orange-600">{BDT}{total.toLocaleString()}</span>
                  </div>
                </div>

                <Button
                  className="w-full mt-6 h-12 text-md font-bold bg-orange-600 hover:bg-orange-700 shadow-lg shadow-orange-100 transition-all active:scale-[0.98]"
                  onClick={handlePlaceOrder}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="animate-spin h-5 w-5" />
                      Placing Order...
                    </div>
                  ) : (
                    "Confirm Order"
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}