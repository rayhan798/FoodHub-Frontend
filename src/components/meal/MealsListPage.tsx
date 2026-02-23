"use client";

import { Suspense } from "react";
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
import { SIDEBAR_CATEGORIES, PRICE_LIMITS } from "@/constants/meals";
import { useBrowseMeals } from "@/hooks/useMealsList";
import { ExtendedMeal, SortOption } from "@/types/mealsList";

function BrowseMealsContent() {
  const {
    loading,
    searchQuery,
    setSearchQuery,
    selectedCategories,
    setSelectedCategories,
    priceRange,
    setPriceRange,
    sortBy,
    setSortBy,
    filteredMeals,
    resetFilters,
  } = useBrowseMeals();

  const handleCategoryChange = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category],
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full md:w-64 space-y-8">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="text-lg font-bold mb-4 text-slate-800">
              Categories
            </h3>
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

          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="text-lg font-bold mb-4 text-slate-800">
              Price Range
            </h3>
            <Slider
              min={PRICE_LIMITS.MIN}
              max={PRICE_LIMITS.MAX}
              step={PRICE_LIMITS.STEP}
              value={priceRange}
              onValueChange={setPriceRange}
              className="mb-6"
            />
            <div className="flex justify-between items-center text-sm">
              <span className="bg-slate-100 px-2 py-1 rounded text-slate-600 font-mono">
                ${priceRange[0]}
              </span>
              <span className="text-slate-400">to</span>
              <span className="bg-orange-50 px-2 py-1 rounded text-orange-600 font-bold font-mono">
                ${priceRange[1]}
              </span>
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

            <Select
              value={sortBy}
              onValueChange={(value) => setSortBy(value as SortOption)}
            >
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
              <p className="text-slate-400">
                Gathering the best meals for you...
              </p>
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
                  <h3 className="text-xl font-bold text-slate-800">
                    No meals found
                  </h3>
                  <p className="text-slate-500 mt-1">
                    Try adjusting your filters.
                  </p>
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
    <Suspense
      fallback={
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-orange-600" />
        </div>
      }
    >
      <BrowseMealsContent />
    </Suspense>
  );
}
