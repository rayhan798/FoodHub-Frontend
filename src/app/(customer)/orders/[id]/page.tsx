import { orderService } from "@/services/order.service";
import OrderDetails, {
  OrderDetail,
  OrderItem,
} from "@/components/customer/OrderDetails";
import SuccessModal from "@/components/customer/SuccessModal";
import { notFound } from "next/navigation";

interface RawOrderItem {
  id?: string;
  price?: number | string;
  quantity?: number;
  meal?: {
    name: string;
    imageUrl?: string | null;
  };
}

export default async function OrderDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (id === "success") return <SuccessModal />;

  const { data: order, error } = await orderService.getOrderById(id);

  if (error || !order) notFound();

  const grandTotal = Number(order.totalPrice || order.total || 0);
  const deliveryFee = 5;
  const subtotal = grandTotal - deliveryFee;

  const orderDetail: OrderDetail = {
    id: order.id,
    status: order.status,
    date: order.createdAt || order.date || new Date().toISOString(),

    items: (order.orderItems || []).map(
      (item: RawOrderItem, index: number): OrderItem => ({
        id: item.id || String(index),
        name: item.meal?.name || "Delicious Meal",
        image: item.meal?.imageUrl ?? "",
        price: Number(item.price || 0),
        quantity: item.quantity || 1,
      }),
    ),

    subtotal: subtotal > 0 ? subtotal : grandTotal,
    deliveryFee: deliveryFee,
    total: grandTotal,
    address: order.deliveryAddress || order.address || "Not specified",
    phone: order.customer?.phone || order.phone || "No contact info",
    paymentMethod:
      order.paymentMethod?.replace(/_/g, " ") || "CASH ON DELIVERY",
  };

  return (
    <div className="min-h-screen bg-slate-50/50">
      <OrderDetails order={orderDetail} />
    </div>
  );
}
