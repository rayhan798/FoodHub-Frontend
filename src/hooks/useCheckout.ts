import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { createOrderAction } from "@/hooks/order";

export function useCheckout() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  
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
      if (items.length === 0) {
        router.push("/cart");
      } else {
        Promise.resolve().then(() => setCartItems(items));
      }
    } else {
      router.push("/meals");
    }
    Promise.resolve().then(() => setLoading(false));
  }, [router]);

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const deliveryFee = cartItems.length > 0 ? 5.00 : 0;
  const total = subtotal + deliveryFee;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handlePlaceOrder = async () => {
    if (!formData.firstName || !formData.address || !formData.phone || !formData.city) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Mapping over all items to handle multi-item orders properly
      const orderPromises = cartItems.map(item => {
        const payload = {
          mealId: item.id,
          quantity: item.quantity,
          address: `${formData.address}, ${formData.city}`,
        };
        return createOrderAction(payload);
      });

      const results = await Promise.all(orderPromises);
      const firstError = results.find(res => res?.error);

      if (firstError) {
        toast.error(firstError.error);
        setIsSubmitting(false);
        return;
      }

      toast.success("Order placed successfully!");
      localStorage.removeItem("cart");
      window.dispatchEvent(new Event("cart-updated"));
      router.push("/orders/success");
      
    } catch (error) {
      toast.error("An unexpected error occurred.");
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    cartItems,
    subtotal,
    deliveryFee,
    total,
    isSubmitting,
    loading,
    handleInputChange,
    handlePlaceOrder
  };
}