import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  providerName: string;
}

export function useCart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Load cart on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart");
      }
    }
    setLoading(false);
  }, []);

  const updateStorage = (updatedItems: CartItem[]) => {
    setCartItems(updatedItems);
    localStorage.setItem("cart", JSON.stringify(updatedItems));
    // Trigger event for other components (like Navbar) to listen to
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

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const deliveryFee = cartItems.length > 0 ? 5.00 : 0;
  const total = subtotal + deliveryFee;

  return { cartItems, loading, updateQuantity, removeItem, subtotal, deliveryFee, total };
}