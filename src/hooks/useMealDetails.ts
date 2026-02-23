import { useState, useEffect, useCallback } from "react";
import { env } from "@/env";
import { toast } from "react-hot-toast";
import { MealDetail } from "@/types/mealDetails";
import { getFinalImageUrl } from "@/lib/mealDetails-utils";

export function useMealDetails(id: string) {
  const [meal, setMeal] = useState<MealDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  const fetchMealDetails = useCallback(async () => {
    if (!id || id === "undefined") return;
    try {
      setLoading(true);
      const res = await fetch(
        `${env.NEXT_PUBLIC_API_URL}/meals/${id}?t=${Date.now()}`,
        { cache: "no-store" }
      );
      if (!res.ok) throw new Error("Meal not found");
      const result = await res.json();
      setMeal(result.data);
    } catch (err) {
      toast.error("Failed to load meal details");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchMealDetails();
  }, [fetchMealDetails]);

  const addToCart = () => {
    if (!meal) return;
    try {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      const existingItemIndex = cart.findIndex((item: any) => item.id === meal.id);
      const finalSrc = getFinalImageUrl(meal.imageUrl);

      if (existingItemIndex > -1) {
        cart[existingItemIndex].quantity += quantity;
      } else {
        cart.push({
          id: meal.id,
          name: meal.name,
          price: meal.price,
          image: finalSrc,
          providerId: meal.providerId,
          quantity,
        });
      }

      localStorage.setItem("cart", JSON.stringify(cart));
      window.dispatchEvent(new Event("cart-updated"));
      toast.success(`${quantity} x ${meal.name} added to cart!`);
    } catch (error) {
      toast.error("Could not add to cart");
    }
  };

  return { meal, loading, quantity, setQuantity, addToCart, fetchMealDetails };
}