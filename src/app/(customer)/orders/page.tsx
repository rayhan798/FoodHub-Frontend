import OrdersList from "@/components/customer/OrdersList";
import { orderService } from "@/services/order.service";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function OrdersPage() {
  // ১. সার্ভিস থেকে ডাটা ফেচ করা
  // ✅ সার্ভিস এখন options গ্রহণ করতে পারে, তাই টাইপস্ক্রিপ্ট আর এরর দেবে না
  const { data: orders, error } = await orderService.getOrders({
    cache: "no-store", 
  });

  // ২. এরর হ্যান্ডলিং
  if (error) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-800">Something went wrong</h2>
        <p className="text-slate-500 mb-6">{error.message}</p>
        <Button asChild className="bg-orange-600 hover:bg-orange-700">
          <Link href="/meals">Try Ordering Again</Link>
        </Button>
      </div>
    );
  }

  // ৩. ডাটা না থাকলে হ্যান্ডলিং
  if (!orders || orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="bg-slate-50 rounded-full h-20 w-20 flex items-center justify-center mx-auto mb-6">
          <ShoppingBag className="h-10 w-10 text-slate-300" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800">No orders yet</h2>
        <p className="text-slate-500 mb-8">Looks like you haven't placed any orders yet.</p>
        <Button asChild className="bg-orange-600 hover:bg-orange-700 rounded-xl px-8">
          <Link href="/meals">Browse Meals</Link>
        </Button>
      </div>
    );
  }

  // ৪. সাকসেস স্টেট
  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>
      <OrdersList orders={orders} />
    </div>
  );
}