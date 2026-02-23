import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { mealService } from "@/services/meal.service";
import { ExtendedMeal, SortOption } from "@/types/mealsList";

export function useBrowseMeals() {
  const [allMeals, setAllMeals] = useState<ExtendedMeal[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<number[]>([0, 1000]);
  const [sortBy, setSortBy] = useState<SortOption>("newest");

  const searchParams = useSearchParams();
  const categoryFromUrl = searchParams.get("category");

  useEffect(() => {
    if (categoryFromUrl) setSelectedCategories([categoryFromUrl]);
  }, [categoryFromUrl]);

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        setLoading(true);
        const { data: res } = await mealService.getMeals({});
        
        // আপনার অরিজিনাল ডাটা হ্যান্ডলিং লজিক
        if (res && Array.isArray(res)) {
          setAllMeals(res as ExtendedMeal[]);
        } else if (res && typeof res === "object" && "data" in res) {
          setAllMeals((res as any).data);
        }
      } catch (error) {
        console.error("Error fetching meals:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMeals();
  }, []);

  const filteredMeals = useMemo(() => {
    return allMeals
      .filter((meal) => {
        const matchesSearch = meal.name.toLowerCase().includes(searchQuery.toLowerCase());
        const mealCatName = typeof meal.category === "object" ? meal.category?.name : meal.category;
        const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(mealCatName || "");
        const matchesPrice = meal.price >= priceRange[0] && meal.price <= priceRange[1];
        
        return matchesSearch && matchesCategory && matchesPrice;
      })
      .sort((a, b) => {
        if (sortBy === "price-low") return a.price - b.price;
        if (sortBy === "price-high") return b.price - a.price;
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });
  }, [allMeals, searchQuery, selectedCategories, priceRange, sortBy]);

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategories([]);
    setPriceRange([0, 1000]);
    setSortBy("newest");
  };

  return {
    loading, searchQuery, setSearchQuery, selectedCategories, setSelectedCategories,
    priceRange, setPriceRange, sortBy, setSortBy, filteredMeals, resetFilters
  };
}