"use client";

import { useState } from "react";
import { Star, Send, Loader2, AlertCircle } from "lucide-react"; 
import { toast } from "react-hot-toast";
import { env } from "@/env";
import Link from "next/link";
import { authClient } from "@/lib/auth-client"; 

interface ProviderReviewFormProps {
  providerId: string;
  onSuccess?: () => void;
}

export default function ProviderReviewForm({ providerId, onSuccess }: ProviderReviewFormProps) {
  const { data: session, isPending } = authClient.useSession();
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session) {
      toast.error("Please login to share your experience");
      return;
    }

    if (rating === 0) {
      toast.error("Please select a star rating!");
      return;
    }

    if (comment.trim().length < 5) {
      toast.error("Comment must be at least 5 characters long");
      return;
    }

    setIsSubmitting(true);
 
    const loadingToast = toast.loading("Sending your feedback...");

    try {
      const token = session?.session?.token;

      const payload = {
        providerId: providerId,
        rating: Number(rating),
        comment: comment.trim()
      };

      const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token ? `Bearer ${token}` : "",
        },
        credentials: "include", 
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        if (result.errors || result.message) {
          const errorMsg = Array.isArray(result.errors) 
            ? result.errors.map((err: any) => err.message).join(", ")
            : result.message;
          throw new Error(errorMsg || "Submission failed");
        }
        
        if (response.status === 401) throw new Error("Session expired. Please re-login.");
        if (response.status === 403) throw new Error("You are not authorized to review this kitchen.");
        
        throw new Error("Something went wrong at the server.");
      }

      toast.success("Thank you! Feedback submitted.", { id: loadingToast });
      setRating(0);
      setComment("");

      if (onSuccess) {
        onSuccess();
      }
      
    } catch (error: any) {
      console.error("Submit Error:", error);
      toast.error(error.message || "Failed to submit review", { id: loadingToast });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isPending) return (
    <div className="p-10 text-center bg-orange-50/30 rounded-[2.5rem] border border-dashed border-orange-200">
      <Loader2 className="animate-spin mx-auto text-orange-600 h-8 w-8" />
      <p className="mt-2 text-slate-500 font-medium">Preparing review form...</p>
    </div>
  );

  return (
    <div className="bg-orange-50/50 p-6 md:p-8 rounded-[2.5rem] border border-orange-100 shadow-sm mt-8 transition-all">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 bg-orange-100 rounded-2xl">
           <Star className="text-orange-600 fill-orange-600 h-5 w-5" />
        </div>
        <div>
          <h3 className="text-xl font-black text-slate-900 tracking-tight">Share your experience</h3>
          <p className="text-xs text-slate-500 font-medium">Your feedback helps others choose better meals.</p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Rating Stars Section */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                disabled={isSubmitting || !session}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
                className="transition-transform active:scale-90 disabled:cursor-not-allowed"
              >
                <Star
                  size={40}
                  className={`${
                    (hover || rating) >= star 
                      ? "fill-orange-500 text-orange-500" 
                      : "text-slate-200"
                  } transition-all duration-200 hover:drop-shadow-md`}
                />
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1.5 ml-1">
             {rating === 0 ? (
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                 <AlertCircle size={12} /> Tap a star to rate
               </p>
             ) : (
               <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest">
                 Excellent! {rating}/5 Stars
               </p>
             )}
          </div>
        </div>

        {/* Comment Textarea Section */}
        <div className="relative group">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Tell others about the food quality, service, and delivery..."
            disabled={!session || isSubmitting}
            className={`w-full p-6 bg-white border-2 rounded-[2.5rem] h-36 text-sm transition-all outline-none shadow-inner 
              ${isSubmitting ? 'opacity-70 bg-slate-50' : 'focus:border-orange-500 border-orange-100'}
              ${!session ? 'blur-[1px] select-none' : ''}
            `}
          />
          
          {/* Unauthenticated Overlay */}
          {!session && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/40 rounded-[2.5rem] backdrop-blur-[2px] z-10 border-2 border-dashed border-orange-200">
               <Link href="/login" className="px-8 py-3 bg-orange-600 shadow-xl shadow-orange-200 rounded-full text-white font-black hover:bg-orange-700 transition-all hover:scale-105 active:scale-95 flex items-center gap-2">
                 Login to Review
               </Link>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || !session || rating === 0}
          className="w-full md:w-fit px-12 py-4 bg-orange-600 hover:bg-orange-700 text-white rounded-[1.5rem] font-black flex items-center justify-center gap-3 disabled:bg-slate-200 disabled:text-slate-400 transition-all shadow-lg shadow-orange-100 active:scale-95"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin h-5 w-5" />
              <span>Sending...</span>
            </>
          ) : (
            <>
              <span>Submit Feedback</span> 
              <Send size={18} className="transition-transform group-hover:translate-x-1" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}