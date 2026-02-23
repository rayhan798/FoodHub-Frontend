import { OrderDetail } from "@/types/customerOrderDetails";

export function useOrderDetails(order: OrderDetail) {
  const getImageUrl = (path?: string) => {
    if (!path || path.trim() === "" || path.includes("undefined")) {
      return "https://placehold.co/150x150?text=Food";
    }
    if (path.startsWith("http")) return path;
    
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    const cleanPath = path.startsWith("/") ? path : `/${path}`;

    if (!cleanPath.includes("uploads")) {
      return `${backendUrl}/uploads${cleanPath}`;
    }
    return `${backendUrl}${cleanPath}`;
  };

  const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case "DELIVERED":
        return "bg-green-100 text-green-700";
      case "PENDING":
        return "bg-amber-100 text-amber-700";
      case "CANCELLED":
      case "CANCELED":
        return "bg-red-100 text-red-700";
      default:
        return "bg-blue-100 text-blue-700";
    }
  };

  const displayPhone = order.customer?.phone || order.phone || "Not available";
  const displayAddress = order.deliveryAddress || order.address || "No address provided";
  const displayTotal = order.totalPrice || order.total || 0;
  const orderDate = order.createdAt || order.date || new Date().toISOString();
  const itemsList = order.items || [];
  const subtotal = Number(displayTotal) - (order.deliveryFee || 0);

  return {
    getImageUrl,
    getStatusColor,
    displayPhone,
    displayAddress,
    displayTotal,
    orderDate,
    itemsList,
    subtotal,
  };
}