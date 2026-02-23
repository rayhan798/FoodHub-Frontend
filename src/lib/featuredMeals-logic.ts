import { mealService, Meal } from "@/services/meal.service";

export async function getFeaturedMealsData(limit: number) {
  const { data: mealsData, error } = await mealService.getMeals(
    
    {
     
      limit: limit.toString(),
    },
    { revalidate: 60 }
  );

  const meals: Meal[] = Array.isArray(mealsData) ? mealsData : [];
  const displayedMeals = meals.slice(0, limit);

  return {
    meals: displayedMeals,
    error,
    hasMeals: displayedMeals.length > 0,
  };
}