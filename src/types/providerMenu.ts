export interface Category {
  id?: string;
  name: string;
}

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string | Category;
  description?: string;
  imageUrl?: string;
  status: "AVAILABLE" | "OUT_OF_STOCK";
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export const CATEGORIES = [
  "Burger", "Pizza", "Fast Food", "Italian", "Asian", 
  "Healthy", "Sushi", "Bakery", "Desserts", "Drinks", 
  "Mexican", "Sea Food",
];