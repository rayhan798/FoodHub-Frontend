export interface Meal {
  id: string;
  title: string;
  description?: string;
  price: number;
  image?: string;
  category?: string;
  providerId: string;
}