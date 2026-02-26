"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Minus, Plus, ShoppingCart, ArrowLeft, Star, Loader2, MessageSquare, Store } from "lucide-react";
import MealReviewForm from "@/components/meal/MealReviewForm";
import { useMealDetails } from "@/hooks/useMealDetails";
import { getFinalImageUrl, calculateAverageRating } from "@/lib/mealDetails-utils";

export default function MealDetailsPage({ id }: { id: string }) {
  const { meal, loading, quantity, setQuantity, addToCart, fetchMealDetails } = useMealDetails(id);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] space-y-4">
      <div className="relative">
        <Loader2 className="h-14 w-14 animate-spin text-orange-600" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Star className="h-4 w-4 text-orange-400 fill-current" />
        </div>
      </div>
      <p className="text-slate-500 font-bold animate-pulse uppercase tracking-widest text-xs">Preparing perfection...</p>
    </div>
  );

  if (!meal) return (
    <div className="container mx-auto px-4 py-32 text-center">
      <div className="bg-slate-50 inline-flex p-6 rounded-full mb-6">
        <Loader2 className="h-10 w-10 text-slate-200" />
      </div>
      <h2 className="text-3xl font-black text-slate-800">Meal not found!</h2>
      <p className="text-slate-500 mt-2 mb-8">The dish you're looking for might have been removed.</p>
      <Button asChild size="lg" className="bg-orange-600 rounded-2xl px-10">
        <Link href="/meals">Back to Menu</Link>
      </Button>
    </div>
  );

  const finalSrc = getFinalImageUrl(meal.imageUrl);

  return (
    <div className="container mx-auto px-4 py-10 max-w-7xl">
      {/* Navigation */}
      <nav className="mb-10">
        <Link 
          href="/meals" 
          className="inline-flex items-center text-sm font-bold text-slate-500 hover:text-orange-600 transition-colors group"
        >
          <div className="h-8 w-8 rounded-full border border-slate-200 flex items-center justify-center mr-3 group-hover:border-orange-200 group-hover:bg-orange-50">
            <ArrowLeft className="h-4 w-4" />
          </div>
          BACK TO MENU
        </Link>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-24 items-start">
        {/* Left: Image Section */}
        <div className="lg:col-span-6 sticky top-28">
          <div className="relative aspect-[4/5] lg:aspect-square overflow-hidden rounded-[3rem] bg-slate-50 shadow-2xl shadow-slate-200/50 border border-slate-100 group">
            <Image 
              src={finalSrc} 
              alt={meal.name} 
              fill 
              className="object-cover transition-transform duration-1000 group-hover:scale-110" 
              priority 
              // unoptimized={true} // যদি next.config এ ডোমেইন সেট করা থাকে তবে এটি লাগবে না
            />
            {/* Overlay Gradient for Badge Visibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>

        {/* Right: Info Section */}
        <div className="lg:col-span-6 flex flex-col space-y-8">
          <div className="space-y-4">
            <Badge className="bg-orange-50 text-orange-600 border border-orange-100 px-5 py-2 rounded-full capitalize text-xs font-black tracking-widest">
              {meal.category?.name || "General"}
            </Badge>
            <h1 className="text-5xl lg:text-6xl font-black text-slate-900 leading-[1.1] tracking-tight">{meal.name}</h1>
            
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center text-amber-500 font-black text-base">
                <Star className="h-5 w-5 fill-current mr-1.5" />
                <span className="text-slate-900">{calculateAverageRating(meal)}</span>
                <span className="text-slate-400 font-medium ml-1">({meal.reviews?.length || 0})</span>
              </div>
              <div className="h-4 w-[1px] bg-slate-200" />
              <div className="text-slate-500 font-bold flex items-center gap-2">
                <Store size={18} className="text-orange-500" />
                {meal.provider?.name || "Local Kitchen"}
              </div>
            </div>
          </div>

          <div className="text-5xl font-black text-orange-600 flex items-baseline gap-2">
            <span className="text-2xl">$</span>
            {(Number(meal.price || 0) * quantity).toFixed(2)}
          </div>

          <div className="bg-slate-50/50 p-6 rounded-3xl border border-slate-100 italic">
            <p className="text-slate-600 leading-relaxed text-lg">
              {meal.description || "Indulge in our chef's special creation, made with fresh local ingredients and authentic flavors."}
            </p>
          </div>

          <div className="pt-4 space-y-8">
            <div className="flex items-center justify-between bg-white border border-slate-100 p-3 rounded-[2rem] shadow-sm max-w-[200px]">
              <span className="font-black text-slate-400 text-xs uppercase pl-4">Qty</span>
              <div className="flex items-center gap-1">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-10 w-10 rounded-full hover:bg-orange-50 hover:text-orange-600"
                  onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-8 text-center font-black text-xl text-slate-800">{quantity}</span>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-10 w-10 rounded-full hover:bg-orange-50 hover:text-orange-600"
                  onClick={() => setQuantity((prev) => prev + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={addToCart} 
                className="flex-1 bg-orange-600 hover:bg-orange-700 h-20 rounded-[2rem] text-xl font-black shadow-2xl shadow-orange-200 transition-all active:scale-95 group"
              >
                <ShoppingCart className="mr-3 h-6 w-6 group-hover:animate-bounce" /> ADD TO CART
              </Button>
              <Button 
                variant="outline" 
                className="h-20 px-10 rounded-[2rem] border-2 border-slate-100 font-black hover:bg-slate-50 hover:border-slate-200 transition-all uppercase tracking-widest text-xs" 
                asChild
              >
                <Link href={`/providers/${meal.providerId}`}>Visit Store</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 pt-20 border-t border-slate-100">
        <div className="lg:col-span-7 space-y-12">
          <div className="flex items-center justify-between">
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Real Reviews</h2>
            <div className="bg-slate-900 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
              Verified Feedback
            </div>
          </div>
          
          <div className="space-y-8">
            {meal.reviews && meal.reviews.length > 0 ? (
              [...meal.reviews].reverse().map((review) => (
                <div key={review.id} className="bg-white p-10 rounded-[3rem] border border-slate-50 shadow-sm hover:shadow-xl hover:shadow-slate-100/50 transition-all duration-500">
                  <div className="flex justify-between items-start mb-8">
                    <div className="flex items-center gap-5">
                      <div className="h-14 w-14 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-600 font-black text-xl border border-orange-100 shadow-inner">
                        {review.customer?.name?.[0] || "U"}
                      </div>
                      <div>
                        <p className="font-black text-slate-900 text-xl">{review.customer?.name}</p>
                        <div className="flex items-center gap-1 mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={14} className={i < review.rating ? "fill-orange-500 text-orange-500" : "text-slate-200"} />
                          ))}
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-tighter">
                      {new Date(review.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  <div className="relative pl-8">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-100 rounded-full" />
                    <p className="text-slate-600 text-lg font-medium leading-relaxed italic">
                      "{review.comment || "An exceptional taste experience that I would highly recommend to everyone."}"
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-24 bg-slate-50/50 rounded-[4rem] border-4 border-dashed border-slate-100">
                <MessageSquare size={48} className="mx-auto text-slate-200 mb-4" />
                <p className="text-slate-400 font-black uppercase tracking-widest text-sm">Be the first to review!</p>
              </div>
            )}
          </div>
        </div>

        {/* Form Section */}
        <div className="lg:col-span-5">
          <div className="sticky top-28 bg-white p-10 rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-100">
            <h3 className="text-3xl font-black text-slate-900 mb-2">Taste it?</h3>
            <p className="text-slate-500 mb-8 font-medium">Share your experience with the community.</p>
            <MealReviewForm mealId={id} onSuccess={fetchMealDetails} />
          </div>
        </div>
      </div>
    </div>
  );
}