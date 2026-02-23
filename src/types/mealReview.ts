export interface ReviewPayload {
  mealId: string;
  rating: number;
  comment: string;
}

export interface ReviewFormProps {
  mealId: string;
  onSuccess?: () => void;
}