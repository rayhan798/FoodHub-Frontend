import { env } from "@/env";

export const getFinalImageUrl = (path: string | null | undefined) => {
  if (!path) return "/placeholder-food.jpg";
  if (path.startsWith("http")) return path; 
  
  const baseUrl = env.NEXT_PUBLIC_API_URL.replace("/api", "");
  return `${baseUrl}/${path.replace(/\\/g, "/").replace(/^\//, "")}`;
};

export const calculateAverageRating = (meal: any) => {
  if (!meal.reviews || meal.reviews.length === 0) return "0.0";
  const sum = meal.reviews.reduce((acc: number, r: any) => acc + r.rating, 0);
  return (sum / meal.reviews.length).toFixed(1);
};