import { useState, useEffect } from "react";
import { env } from "@/env";
import { toast } from "react-hot-toast";
import { Category } from "@/types/homeCategory";

const FALLBACK_CATEGORIES: Category[] = [
  { id: "1", name: "Burger", slug: "burger" },
  { id: "2", name: "Pizza", slug: "pizza" },
  { id: "3", name: "Healthy", slug: "healthy" },
  { id: "4", name: "Asian", slug: "asian" },
  { id: "5", name: "Fast Food", slug: "fast-food" },
  { id: "6", name: "Desserts", slug: "desserts" },
  { id: "7", name: "Italian", slug: "italian" },
  { id: "8", name: "Sushi", slug: "sushi" },
  { id: "9", name: "Bakery", slug: "bakery" },
  { id: "10", name: "Drinks", slug: "drinks" },
];

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const getIcon = (name: string | undefined) => {
    if (!name) return "🍽️";
    const icons: Record<string, string> = {
      Burger: "🍔",
      Pizza: "🍕",
      Healthy: "🥗",
      Sushi: "🍣",
      Bakery: "🥐",
      Drinks: "🥤",
      Desserts: "🍰",
      Asian: "🥢",
      Italian: "🍝",
      FastFood: "🍟",
      Mexican: "🌮",
      Seafood: "🍤",
      Steak: "🥩",
      Salad: "🥣",
      Chicken: "🍗",
      Pasta: "🍝",
    };
    const key = name.replace(/\s+/g, "");
    return icons[key] || "🍽️";
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/categories`, {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) throw new Error("Failed to fetch categories");

        const result = await res.json();
        setCategories(result.data || []);
      } catch (err) {
        console.error("Category Fetch Error:", err);
        toast.error("Using popular categories");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const displayCategories = categories.length > 0 
    ? categories.slice(0, 10) 
    : FALLBACK_CATEGORIES;

  return { displayCategories, loading, getIcon };
}