export interface Category {
  id: string;
  name: string;
  slug: string;
  status: "ACTIVE" | "INACTIVE";
  itemCount?: number;
  _count?: {
    meals: number;
  };
}

export interface CategoryFormData {
  name: string;
  status: "ACTIVE" | "INACTIVE";
}