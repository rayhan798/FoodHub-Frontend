import MealCard from "@/components/meal/MealCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getFeaturedMealsData } from "@/lib/featuredMeals-logic";
import { FeaturedMealsProps } from "@/types/homeFeaturedMeals";

const FeaturedMeals = async ({ limit = 3 }: FeaturedMealsProps) => {
  const { meals, error, hasMeals } = await getFeaturedMealsData(limit);

  if (error || !hasMeals) {
    return (
      <section className="py-16 container mx-auto px-4">
        <div className="text-center bg-slate-50 py-12 rounded-3xl border-2 border-dashed">
          <p className="text-slate-500 font-medium">
            No featured meals available right now.
          </p>
          {error && (
            <p className="text-xs text-red-400 mt-2">{error.message}</p>
          )}
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white container mx-auto px-4">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 leading-tight">
            Featured Meals
          </h2>
          <p className="text-slate-500 mt-2">
            Chef's special selections for you today
          </p>
        </div>
        <Button
          variant="link"
          className="text-orange-600 font-bold hover:no-underline"
          asChild
        >
          <Link href="/meals">View All Meals &rarr;</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {meals.map((meal) => (
          <MealCard key={meal.id} meal={meal} />
        ))}
      </div>
    </section>
  );
};

export default FeaturedMeals;