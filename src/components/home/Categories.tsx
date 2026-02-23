"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCategories } from "@/hooks/useHomeCategories";

const Categories = () => {
  const router = useRouter();
  const { displayCategories, loading, getIcon } = useCategories();

  const handleCategoryClick = (categoryName: string | undefined) => {
    if (!categoryName) return;
    router.push(`/meals?category=${encodeURIComponent(categoryName)}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-12 w-12 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <section className="py-20 container mx-auto px-4">
      <div className="flex flex-col items-center mb-12 text-center">
        <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">
          Popular Categories
        </h2>
        <div className="h-1.5 w-24 bg-orange-500 mt-4 rounded-full"></div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
        {displayCategories.map((cat) => (
          <Card
            key={cat.id}
            className="group relative overflow-hidden border-slate-100 bg-white hover:border-orange-500 hover:shadow-2xl transition-all duration-500 cursor-pointer rounded-3xl"
            onClick={() => handleCategoryClick(cat.name)}
          >
            <CardContent className="p-10 flex flex-col items-center justify-center">
              <div className="text-6xl mb-6 group-hover:scale-125 transition-transform duration-500 ease-out">
                {getIcon(cat.name)}
              </div>
              
              <p className="font-bold text-xl text-slate-700 group-hover:text-orange-600 transition-colors text-center">
                {cat.name}
              </p>

              <div className="w-0 group-hover:w-10 h-1 bg-orange-500 mt-2 transition-all duration-500 rounded-full"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default Categories;