export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface OrderDetail {
  id: string;
  status: string;
  createdAt?: string;
  date?: string;
  items: OrderItem[];
  totalPrice?: number;
  total?: number;
  subtotal?: number;
  deliveryFee?: number;
  deliveryAddress?: string;
  address?: string;
  customer?: {
    phone?: string;
  };
  phone?: string;
  paymentMethod?: string;
}

export interface OrderDetailsProps {
  order: OrderDetail;
}