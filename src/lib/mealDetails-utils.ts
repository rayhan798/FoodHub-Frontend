import { env } from "@/env";
import { MealDetail } from "@/types/mealDetails";

export const getFinalImageUrl = (imageUrl?: string) => {
  const baseUrl = env.NEXT_PUBLIC_API_URL.replace("/api", "");
  return imageUrl
    ? `${baseUrl}/${imageUrl.replace(/\\/g, "/")}`
    : "/placeholder-food.jpg";
};

export const calculateAverageRating = (meal: MealDetail | null) => {
  if (meal?.averageRating && Number(meal.averageRating) !== 0)
    return Number(meal.averageRating).toFixed(1);
  if (!meal?.reviews || meal.reviews.length === 0) return "0.0";
  
  const total = meal.reviews.reduce((acc, rev) => acc + rev.rating, 0);
  return (total / meal.reviews.length).toFixed(1);
};