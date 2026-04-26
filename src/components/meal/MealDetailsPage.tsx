"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Minus, Plus, ShoppingCart, ArrowLeft, Star, Loader2, MessageSquare } from "lucide-react";
import Link from "next/link";
import { env } from "@/env";
import { toast } from "react-hot-toast";
import MealReviewForm from "@/components/meal/MealReviewForm";

interface MealDetailsProps {
  id: string;
}

export default function MealDetailsPage({ id }: MealDetailsProps) {
  const [meal, setMeal] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  const fetchMealDetails = useCallback(async () => {
    if (!id || id === "undefined") return;
    try {
      const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/meals/${id}?t=${Date.now()}`, {
        cache: 'no-store'
      });
      if (!res.ok) throw new Error("Meal not found");
      const result = await res.json();
      setMeal(result.data);
    } catch (err: any) {
      console.error("Fetch Error:", err);
      toast.error("Failed to load meal details");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchMealDetails();
  }, [fetchMealDetails]);

// ✅ ডাইনামিক ইমেজ ইউআরএল জেনারেটর (Fixed for Cloudinary)
 const baseUrl = env.NEXT_PUBLIC_API_URL.replace(/\/api$/, "").replace(/\/$/, "");
 
 const finalSrc = meal?.imageUrl 
   ? (meal.imageUrl.startsWith("http") 
       ? meal.imageUrl 
       : `${baseUrl}/${meal.imageUrl.replace(/\\/g, "/").replace(/^\//, "")}`)
   : "/placeholder-food.jpg";

 // ✅ Add to Cart Logic (Fixed Image Issue)
 const handleAddToCart = () => {
   if (!meal) return;

   try {
     // ১. বর্তমান কার্ট রিড করা
     const cart = JSON.parse(localStorage.getItem("cart") || "[]");

     // ২. অলরেডি কার্টে আছে কি না চেক করা
     const existingItemIndex = cart.findIndex((item: any) => item.id === meal.id);

     if (existingItemIndex > -1) {
       // ৩. থাকলে শুধুমাত্র কুয়ান্টিটি যোগ করা
       cart[existingItemIndex].quantity += quantity;
     } else {
       // ৪. না থাকলে নতুন অবজেক্ট হিসেবে পুশ করা
       cart.push({
         id: meal.id,
         name: meal.name,
         price: meal.price,
         // ✅ ফিক্স: এখানে dynamic finalSrc সেভ করা হয়েছে যা Cloudinary ও Local দুটোই চেনে
         image: finalSrc, 
         providerId: meal.providerId,
         quantity: quantity,
       });
     }

     // ৫. লোকাল স্টোরেজে আপডেট করা
     localStorage.setItem("cart", JSON.stringify(cart));
     
     // ৬. সাকসেস মেসেজ এবং ইভেন্ট ফায়ার
     toast.success(`${meal.name} added to cart! 🛒`);
     window.dispatchEvent(new Event("cart-updated"));

   } catch (error) {
     console.error("Cart Error:", error);
     toast.error("Failed to add to cart");
   }
 };

  const calculateAverageRating = () => {
    if (meal?.averageRating && Number(meal.averageRating) !== 0) return Number(meal.averageRating).toFixed(1);
    if (!meal?.reviews || meal.reviews.length === 0) return "0.0";
    const total = meal.reviews.reduce((acc: number, rev: any) => acc + rev.rating, 0);
    return (total / meal.reviews.length).toFixed(1);
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
      <Loader2 className="h-12 w-12 animate-spin text-orange-600" />
      <p className="text-slate-500 font-medium">Preparing your meal details...</p>
    </div>
  );

  if (!meal) return (
    <div className="container mx-auto px-4 py-20 text-center">
      <h2 className="text-2xl font-bold italic text-slate-400">Meal not found!</h2>
      <Button asChild className="mt-4 bg-orange-600">
        <Link href="/meals">Back to Meals</Link>
      </Button>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <Button variant="ghost" asChild className="mb-6 -ml-2 text-muted-foreground hover:text-orange-600">
        <Link href="/meals">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Meals
        </Link>
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20 items-start">
        <div className="relative aspect-square overflow-hidden rounded-[2.5rem] bg-slate-50 shadow-2xl border border-slate-100">
          <Image
            src={finalSrc}
            alt={meal.name}
            fill
            className="object-cover transition-transform hover:scale-105 duration-700"
            priority
            unoptimized={true}
          />
        </div>

        <div className="flex flex-col space-y-6">
          <div className="space-y-3">
            <Badge className="bg-orange-100 text-orange-600 border-none px-4 py-1.5 capitalize text-xs font-bold">
              {meal.category?.name || "General"}
            </Badge>
            <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight">
              {meal.name}
            </h1>
            <div className="flex items-center gap-4 text-sm font-medium">
              <div className="flex items-center text-amber-500 bg-amber-50 px-2 py-1 rounded-lg">
                <Star className="h-4 w-4 fill-current mr-1" />
                <span className="text-slate-900 font-bold">{calculateAverageRating()}</span>
              </div>
              <div className="text-slate-500 border-l pl-4 flex items-center gap-1.5">
                <MessageSquare size={14} className="text-slate-400" />
                {meal.reviews?.length || 0} reviews
              </div>
            </div>
          </div>

          <div className="text-4xl font-black text-orange-600">
            ${(Number(meal.price || 0) * quantity).toFixed(2)}
          </div>

          <p className="text-slate-600 leading-relaxed text-lg italic">
            {meal.description || "No description provided."}
          </p>

          <div className="py-4 space-y-6">
            <div className="flex items-center gap-6">
              <span className="font-bold text-slate-900 text-lg">Quantity</span>
              <div className="flex items-center border-2 border-slate-100 rounded-2xl px-2 py-1 bg-white">
                <Button variant="ghost" size="icon" onClick={() => setQuantity(prev => Math.max(1, prev - 1))}>
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center font-bold text-xl">{quantity}</span>
                <Button variant="ghost" size="icon" onClick={() => setQuantity(prev => prev + 1)}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Button 
                onClick={handleAddToCart}
                className="flex-1 bg-orange-600 hover:bg-orange-700 h-16 rounded-2xl text-lg font-bold shadow-xl shadow-orange-100 transition-all active:scale-95"
              >
                <ShoppingCart className="mr-3 h-6 w-6" /> Add to Cart
              </Button>
              <Button variant="outline" className="h-16 px-8 rounded-2xl border-2 font-bold hover:bg-slate-50 transition-colors" asChild>
                <Link href={`/providers/${meal?.providerId}`}>View Kitchen</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 pt-16 border-t border-slate-100">
        <div className="lg:col-span-2 space-y-10">
          <h2 className="text-3xl font-black text-slate-900">Customer Feedback</h2>
          <div className="grid gap-6">
            {meal.reviews && meal.reviews.length > 0 ? (
              [...meal.reviews].reverse().map((review: any) => (
                <div key={review.id} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-lg border border-slate-200 shadow-inner">
                        {review.customer?.name?.[0] || "U"}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 text-lg">{review.customer?.name}</p>
                        <div className="flex items-center gap-1 mt-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={14} className={i < review.rating ? "fill-orange-500 text-orange-500" : "text-slate-200"} />
                          ))}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-slate-400">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-slate-600 text-lg italic pl-4 border-l-4 border-orange-100">
                    "{review.comment || "No comment provided."}"
                  </p>
                </div>
              ))
            ) : (
              <div className="text-center py-20 bg-slate-50/50 rounded-[3rem] border-2 border-dashed border-slate-200 text-slate-500 font-bold">
                No reviews yet for this meal.
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-28">
            <h3 className="text-2xl font-black text-slate-900 mb-6">Add a Review</h3>
            <MealReviewForm mealId={id} onSuccess={fetchMealDetails} />
          </div>
        </div>
      </div>
    </div>
  );
}