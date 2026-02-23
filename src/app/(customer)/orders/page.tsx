import OrdersList from "@/components/customer/OrdersList";
import { orderService } from "@/services/order.service";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function OrdersPage() {
  const { data: orders, error } = await orderService.getOrders();

  if (error) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-800">
          Something went wrong
        </h2>
        <p className="text-slate-500 mb-6">
          {typeof error === "string"
            ? error
            : (error as any)?.message || "An unexpected error occurred"}
        </p>
        <Button asChild className="bg-orange-600 hover:bg-orange-700">
          <Link href="/meals">Try Ordering Again</Link>
        </Button>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="bg-slate-50 rounded-full h-20 w-20 flex items-center justify-center mx-auto mb-6">
          <ShoppingBag className="h-10 w-10 text-slate-300" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800">No orders yet</h2>
        <p className="text-slate-500 mb-8">
          Looks like you haven't placed any orders yet.
        </p>
        <Button
          asChild
          className="bg-orange-600 hover:bg-orange-700 rounded-xl px-8"
        >
          <Link href="/meals">Browse Meals</Link>
        </Button>
      </div>
    );
  }

  return <OrdersList orders={orders} />;
}
