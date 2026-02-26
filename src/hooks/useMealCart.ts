import { env } from "@/env";
import { toast } from "react-hot-toast";
import { Meal, CartItem } from "@/types/mealCart";

export const useCart = (meal: Meal) => {
  const baseUrl = env.NEXT_PUBLIC_API_URL.replace("/api", "");

  const getFinalSrc = () => {
    if (!meal?.imageUrl) return "/placeholder-food.jpg";


    if (meal.imageUrl.startsWith("http")) {
      return meal.imageUrl;
    }

   
    const formattedImagePath = meal.imageUrl.replace(/\\/g, "/");
    return `${baseUrl}/${formattedImagePath.replace(/^\//, "")}`;
  };

  const finalSrc = getFinalSrc();

  const addToCart = () => {
    try {
      const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");
      const isExist = existingCart.find((item: CartItem) => item.id === meal.id);

      if (isExist) {
        toast.success(`${meal.name} is already in cart!`);
        return;
      }

      const cartItem: CartItem = {
        id: meal.id,
        name: meal.name,
        price: Number(meal.price),
        image: finalSrc,
        providerName: meal.provider?.name || "Local Provider",
        quantity: 1,
      };

      const newCart = [...existingCart, cartItem];
      localStorage.setItem("cart", JSON.stringify(newCart));

      toast.success(`${meal.name} added to cart! 🛒`);
      
      window.dispatchEvent(new Event("cart-updated"));
    } catch (error) {
      toast.error("Failed to add to cart");
    }
  };

  return { finalSrc, addToCart };
};