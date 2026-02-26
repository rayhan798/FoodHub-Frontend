export interface Review {
  id: string;
  rating: number;
  comment?: string;
  createdAt: string;
  customer?: {
    name: string;
  };
}


export interface ProviderInfo {
  id: string;
  name: string;
}

export interface MealDetail {
  id: string;
  name: string;
  price: number;
  description?: string;
  imageUrl?: string;
  category?: { name: string };
  providerId: string;
  provider?: ProviderInfo; 
  averageRating?: string | number;
  reviews?: Review[];
}