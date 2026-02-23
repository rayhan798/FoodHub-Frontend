"use client";

import { Star, Send, Loader2 } from "lucide-react";
import { useAuth } from "@/features/auth/context";
import Link from "next/link";
import { useReviewForm } from "@/hooks/useMealReviewForm";
import { ReviewFormProps } from "@/types/mealReview";

export default function MealReviewForm({ mealId, onSuccess }: ReviewFormProps) {
  const { user } = useAuth();
  const {
    rating,
    setRating,
    hover,
    setHover,
    comment,
    setComment,
    isSubmitting,
    submitReview,
  } = useReviewForm(mealId, onSuccess);

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
      <h3 className="text-lg font-bold text-slate-900 mb-4">How was the meal?</h3>

      <form onSubmit={submitReview} className="space-y-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
                className="transition-transform active:scale-90 focus:outline-none"
              >
                <Star
                  size={32}
                  className={`${
                    (hover || rating) >= star
                      ? "fill-orange-500 text-orange-500"
                      : "text-slate-200"
                  } transition-colors duration-200`}
                />
              </button>
            ))}
          </div>
          {rating > 0 && (
            <span className="text-xs font-semibold text-orange-600">
              You rated: {rating} {rating === 1 ? "star" : "stars"}
            </span>
          )}
        </div>

        <div className="relative">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write your feedback..."
            disabled={!user || isSubmitting}
            className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-orange-500 h-32 text-sm disabled:opacity-50 resize-none transition-all outline-none"
          />
          {!user && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-50/50 rounded-2xl backdrop-blur-[1px]">
              <Link
                href="/login"
                className="px-4 py-2 bg-white shadow-sm border rounded-full text-orange-600 font-bold hover:bg-orange-50 transition-colors"
              >
                Login to review
              </Link>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !user || rating === 0}
          className="w-full py-4 bg-orange-600 hover:bg-orange-700 text-white rounded-2xl font-bold flex items-center justify-center gap-2 disabled:bg-slate-300 disabled:cursor-not-allowed transition-all"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin h-5 w-5" /> Submitting...
            </>
          ) : (
            <>
              <Send size={18} /> Submit Review
            </>
          )}
        </button>
      </form>
    </div>
  );
}