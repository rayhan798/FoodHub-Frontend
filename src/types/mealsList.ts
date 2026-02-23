import { Meal } from "@/services/meal.service";

export interface ExtendedMeal extends Meal {
  category?: {
    id: string;
    name: string;
  };
  createdAt?: string;
}

export type SortOption = "newest" | "price-low" | "price-high";