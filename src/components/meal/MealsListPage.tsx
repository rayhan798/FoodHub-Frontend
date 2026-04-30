"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import MealCard from "@/components/meal/MealCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Loader2 } from "lucide-react";
import { mealService, Meal } from "@/services/meal.service";

interface ExtendedMeal extends Meal {
  category?: {
    id: string;
    name: string;
  };
  createdAt?: string;
}

// BDT Symbol constant
const BDT = "৳";

const SIDEBAR_CATEGORIES = [
  "Burger",
  "Pizza",
  "Fast Food",
  "Italian",
  "Asian",
  "Healthy",
  "Sushi",
  "Bakery",
  "Desserts",
  "Drinks",
  "Mexican",
  "Sea Food"
];

function BrowseMealsContent() {
  const [allMeals, setAllMeals] = useState<ExtendedMeal[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<number[]>([0, 1000]);
  const [sortBy, setSortBy] = useState<string>("newest");

  const searchParams = useSearchParams();
  const categoryFromUrl = searchParams.get("category");

  useEffect(() => {
    if (categoryFromUrl) {
      setSelectedCategories([categoryFromUrl]);
    }
  }, [categoryFromUrl]);

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        setLoading(true);
        const { data: res } = await mealService.getMeals({});

        if (res && Array.isArray(res)) {
          setAllMeals(res as ExtendedMeal[]);
        } else if (res && typeof res === "object" && "data" in res) {
          const mealData = (res as { data: ExtendedMeal[] }).data;
          setAllMeals(mealData);
        }
      } catch (error: unknown) {
        console.error("Error fetching meals:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMeals();
  }, []);

  const filteredMeals = useMemo(() => {
    return allMeals
      .filter((meal: ExtendedMeal) => {
        const matchesSearch = meal.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase());

        const mealCatName =
          typeof meal.category === "object" && meal.category !== null
            ? (meal.category.name ?? "")
            : (meal.category ?? "");

        const matchesCategory =
          selectedCategories.length === 0 ||
          selectedCategories.includes(mealCatName || "");

        const matchesPrice =
          meal.price >= priceRange[0] && meal.price <= priceRange[1];

        return matchesSearch && matchesCategory && matchesPrice;
      })
      .sort((a: ExtendedMeal, b: ExtendedMeal) => {
        if (sortBy === "price-low") return a.price - b.price;
        if (sortBy === "price-high") return b.price - a.price;
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });
  }, [allMeals, searchQuery, selectedCategories, priceRange, sortBy]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category],
    );
  };

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategories([]);
    setPriceRange([0, 1000]);
    setSortBy("newest");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Filters */}
        <aside className="w-full md:w-64 space-y-8">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="text-lg font-bold mb-4 text-slate-800">Categories</h3>
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {SIDEBAR_CATEGORIES.map((cat) => (
                <div key={cat} className="flex items-center space-x-2">
                  <Checkbox
                    id={cat}
                    checked={selectedCategories.includes(cat)}
                    onCheckedChange={() => handleCategoryChange(cat)}
                    className="data-[state=checked]:bg-orange-600 data-[state=checked]:border-orange-600"
                  />
                  <label
                    htmlFor={cat}
                    className="text-sm font-medium text-slate-600 cursor-pointer hover:text-orange-600 transition-colors"
                  >
                    {cat}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Price Filter */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="text-lg font-bold mb-4 text-slate-800">Price Range</h3>
            <Slider
              min={0}
              max={1000}
              step={10}
              value={priceRange}
              onValueChange={(value: number[]) => setPriceRange(value)}
              className="mb-6"
            />
            <div className="flex justify-between items-center text-sm">
              <span className="bg-slate-100 px-2 py-1 rounded text-slate-600 font-mono">{BDT}{priceRange[0]}</span>
              <span className="text-slate-400">to</span>
              <span className="bg-orange-50 px-2 py-1 rounded text-orange-600 font-bold font-mono">{BDT}{priceRange[1]}</span>
            </div>
          </div>

          <Button
            variant="ghost"
            className="w-full text-slate-500 hover:text-red-500 hover:bg-red-50 transition-all gap-2"
            onClick={resetFilters}
          >
            Reset All Filters
          </Button>
        </aside>

        {/* Main Content */}
        <main className="flex-1 space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Find your favorite meal..."
                className="pl-10 rounded-xl bg-slate-50 border-none focus-visible:ring-orange-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <Select value={sortBy} onValueChange={(value) => setSortBy(value)}>
              <SelectTrigger className="w-full sm:w-[180px] rounded-xl border-slate-200">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
              <Loader2 className="h-12 w-12 text-orange-600 animate-spin" />
              <p className="text-slate-400">Gathering the best meals for you...</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMeals.map((meal) => (
                  <MealCard key={meal.id} meal={meal} />
                ))}
              </div>

              {filteredMeals.length === 0 && (
                <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
                  <h3 className="text-xl font-bold text-slate-800">No meals found</h3>
                  <p className="text-slate-500 mt-1">Try adjusting your filters.</p>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default function BrowseMealsPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-20"><Loader2 className="animate-spin text-orange-600" /></div>}>
      <BrowseMealsContent />
    </Suspense>
  );
}