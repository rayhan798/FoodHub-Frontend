import MealCard from "@/components/meal/MealCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { mealService, Meal } from "@/services/meal.service";

interface FeaturedMealsProps {
  limit?: number;
}

const FeaturedMeals = async ({ limit = 3 }: FeaturedMealsProps) => {
  /**
   * ১. এপিআই ফেচিং:
   * 'isFeatured' কে অনেক সময় এপিআই প্যারামিটারে স্ট্রিং হিসেবে চায়, 
   * কিন্তু সার্ভিসে boolean ডিফাইন থাকলে (isFeatured: true) দিন।
   */
  const { data: responseData, error } = await mealService.getMeals(
    {
      isFeatured: true, // Type error ফিক্স করতে সরাসরি boolean ব্যবহার করুন
      limit: limit.toString(),
    },
    { revalidate: 60 }
  );

  /**
   * ২. টাইপ এরর ফিক্সিং (Property 'data' does not exist):
   * responseData কে 'any' অথবা নির্দিষ্ট ইন্টারফেসে কাস্ট করে নিলে 
   * 'data' প্রপার্টি অ্যাক্সেস করা সম্ভব হবে।
   */
  const result = responseData as any;
  let meals: Meal[] = [];

  if (Array.isArray(result)) {
    // যদি এপিআই সরাসরি অ্যারে রিটার্ন করে
    meals = result;
  } else if (result && result.data && Array.isArray(result.data)) {
    // যদি এপিআই { success: true, data: [...] } ফরম্যাটে পাঠায়
    meals = result.data;
  }

  // ৩. এরর হ্যান্ডলিং বা এম্পটি স্টেট
  if (error || meals.length === 0) {
    return (
      <section className="py-16 container mx-auto px-4">
        <div className="text-center bg-slate-50 py-12 rounded-3xl border-2 border-dashed border-slate-200">
          <p className="text-slate-500 font-medium">No featured meals available right now.</p>
          {error && <p className="text-xs text-red-400 mt-2">{error.message}</p>}
        </div>
      </section>
    );
  }

  // স্লাইস করে লিমিট সেট করা
  const displayedMeals = meals.slice(0, limit);

  return (
    <section className="py-16 bg-white container mx-auto px-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 leading-tight">Featured Meals</h2>
          <p className="text-slate-500 mt-2">
            Chef's special selections for you today
          </p>
        </div>
        <Button variant="link" className="text-orange-600 font-bold hover:no-underline px-0" asChild>
          <Link href="/meals">View All Meals &rarr;</Link>
        </Button>
      </div>

      {/* ৪. মিল কার্ড গ্রিড */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {displayedMeals.map((meal) => (
          <MealCard key={meal.id} meal={meal} />
        ))}
      </div>
    </section>
  );
};

export default FeaturedMeals;