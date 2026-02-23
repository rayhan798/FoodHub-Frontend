export interface Meal {
  id: string;
  name: string;
  description?: string;
  price: number;
  image: string;
  isFeatured?: boolean;
  category?: string;
  // Add other properties based on your API
}

export interface MealResponse {
  data: Meal[] | null;
  error?: {
    message: string;
  };
}

export interface FeaturedMealsProps {
  limit?: number;
}