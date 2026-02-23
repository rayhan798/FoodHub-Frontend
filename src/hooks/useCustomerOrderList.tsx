import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, XCircle, ShoppingBag } from "lucide-react";
import { Order, OrderStatus } from "@/types/customerOrderList";

export function useOrderHelpers() {
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

  const filterOrders = (orders: Order[], filterStatus?: string) => {
    if (!filterStatus || filterStatus === "all") return orders;
    return orders.filter((o) => o.status.toUpperCase() === filterStatus.toUpperCase());
  };

  return { getStatusBadge, getStatusIcon, filterOrders };
}