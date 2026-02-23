import { useState } from "react";
import { toast } from "react-hot-toast";
import { env } from "@/env";
import { ReviewFormProps, ReviewPayload } from "@/types/mealReview";

export const useReviewForm = (mealId: string, onSuccess?: () => void) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) return toast.error("Please select a rating!");

    setIsSubmitting(true);
    try {
      const payload: ReviewPayload = {
        mealId,
        rating,
        comment: comment.trim(),
      };

      const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok) {
        const errorMsg = result.errors?.map((err: any) => err.message).join(", ") 
                        || result.message 
                        || "Failed to submit review";
        throw new Error(errorMsg);
      }

      toast.success("Review submitted successfully!");
      setRating(0);
      setComment("");

      if (onSuccess) {
        setTimeout(onSuccess, 500);
      }
    } catch (error: any) {
      toast.error(error.message || "Something went wrong!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    rating,
    setRating,
    hover,
    setHover,
    comment,
    setComment,
    isSubmitting,
    submitReview,
  };
};