export interface Meal {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
  provider?: {
    name: string;
  };
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  providerName: string;
  quantity: number;
}