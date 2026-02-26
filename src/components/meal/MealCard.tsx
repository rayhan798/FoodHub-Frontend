"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart, Eye, Utensils } from "lucide-react";
import { Meal } from "@/types/mealCart";
import { useCart } from "@/hooks/useMealCart";
import { env } from "@/env";

interface MealCardProps {
  meal: Meal;
}

const MealCard = ({ meal }: MealCardProps) => {
  const { finalSrc, addToCart } = useCart(meal);

  if (!meal) return null;

  const getImageUrl = (src: string | undefined | null) => {
    if (!src) return "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=500"; // Fallback
    if (src.startsWith("http")) return src;
    
    const baseUrl = env.NEXT_PUBLIC_API_URL.replace("/api", "");
    return `${baseUrl}/${src.replace(/\\/g, "/").replace(/^\//, "")}`;
  };

  const imagePath = getImageUrl(finalSrc);

  return (
    <Card className="group flex flex-col h-full overflow-hidden rounded-2xl border-none bg-white shadow-md hover:shadow-xl transition-all duration-300">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
        <Image
          src={imagePath}
          alt={meal.name || "Meal"}
          fill
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          unoptimized={true} 
        />

        {/* Price Badge */}
        <div className="absolute top-3 right-3 z-10 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full shadow-lg">
          <span className="text-sm font-extrabold text-orange-600">
            ${Number(meal.price || 0).toFixed(2)}
          </span>
        </div>
      </div>

      <CardContent className="flex flex-col flex-1 p-5">
        <div className="mb-4 flex-1">
          <h3 className="text-lg font-bold text-slate-800 line-clamp-2 leading-tight group-hover:text-orange-600 transition-colors">
            {meal.name || "Unknown Meal"}
          </h3>
          <p className="text-sm text-slate-500 flex items-center gap-1 mt-2">
            <span className="w-4 h-[1px] bg-orange-300"></span>
            {meal.provider?.name || "Local Provider"}
          </p>
        </div>

        {/* Buttons Section */}
        <div className="flex gap-2 mt-auto">
          <Button
            asChild
            variant="outline"
            className="flex-1 h-10 rounded-xl border-slate-200 hover:bg-orange-50 hover:text-orange-600 transition-all text-xs sm:text-sm font-bold"
          >
            <Link
              href={`/meals/${meal.id}`}
              className="flex items-center justify-center gap-2"
            >
              <Eye className="h-4 w-4" /> Details
            </Link>
          </Button>
          <Button
            onClick={addToCart}
            className="flex-1 h-10 rounded-xl bg-orange-600 hover:bg-orange-700 shadow-md shadow-orange-100 transition-all flex items-center justify-center gap-2 text-xs sm:text-sm font-bold"
          >
            <ShoppingCart className="h-4 w-4" /> Add
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MealCard;