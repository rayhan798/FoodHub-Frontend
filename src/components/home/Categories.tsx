"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { env } from "@/env";
import { Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

/* ================= TYPES ================= */
interface Category {
  id: string;
  name: string;
  slug: string;
}

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const getIcon = (name: string | undefined) => {
    if (!name) return "🍽️";
    const icons: Record<string, string> = {
      Burger: "🍔",
      Pizza: "🍕",
      Healthy: "🥗",
      Sushi: "🍣",
      Bakery: "🥐",
      Drinks: "🥤",
      Desserts: "🍰",
      Asian: "🥢",
      Italian: "🍝",
      FastFood: "🍟",
      Mexican: "🌮",
      Seafood: "🍤",
      Steak: "🥩",
      Salad: "🥣",
      Chicken: "🍗",
      Pasta: "🍝"
    };
    const key = name.replace(/\s+/g, "");
    return icons[key] || "🍽️";
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/categories`, {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) throw new Error("Failed to fetch categories");

        const result = await res.json();
        setCategories(result.data || []);
      } catch (err) {
        console.error("Category Fetch Error:", err);
        toast.error("Popular categories loaded");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

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

  // ৫টি কার্ডের ২ লাইন করার জন্য ১০টি ক্যাটাগরি ফিক্সড লজিক
  const displayCategories = categories.length > 0 
    ? categories.slice(0, 10) 
    : [
        { id: "1", name: "Burger", slug: "burger" },
        { id: "2", name: "Pizza", slug: "pizza" },
        { id: "3", name: "Healthy", slug: "healthy" },
        { id: "4", name: "Asian", slug: "asian" },
        { id: "5", name: "Fast Food", slug: "fast-food" },
        { id: "6", name: "Desserts", slug: "desserts" },
        { id: "7", name: "Italian", slug: "italian" },
        { id: "8", name: "Sushi", slug: "sushi" },
        { id: "9", name: "Bakery", slug: "bakery" },
        { id: "10", name: "Drinks", slug: "drinks" },
      ];

  return (
    <section className="py-20 container mx-auto px-4">
      <div className="flex flex-col items-center mb-12 text-center">
        <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">
          Popular Categories
        </h2>
        <div className="h-1.5 w-24 bg-orange-500 mt-4 rounded-full"></div>
      </div>

      {/* মেইন ফিক্স: 
          - lg:grid-cols-5 (ডেক্সটপে ৫টি কলাম)
          - md:p-10 (কার্ডগুলো বড় দেখানোর জন্য প্যাডিং বাড়ানো হয়েছে)
          - gap-8 (কার্ডগুলোর মাঝে সুন্দর দূরত্ব)
      */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
        {displayCategories.map((cat) => (
          <Card
            key={cat.id}
            className="group relative overflow-hidden border-slate-100 bg-white hover:border-orange-500 hover:shadow-2xl transition-all duration-500 cursor-pointer rounded-3xl"
            onClick={() => handleCategoryClick(cat.name)}
          >
            <CardContent className="p-10 flex flex-col items-center justify-center">
              {/* আইকন সাইজ বড় করা হয়েছে (text-6xl) */}
              <div className="text-6xl mb-6 group-hover:scale-125 transition-transform duration-500 ease-out">
                {getIcon(cat.name)}
              </div>
              
              {/* টেক্সট সাইজ বড় করা হয়েছে (text-xl) */}
              <p className="font-bold text-xl text-slate-700 group-hover:text-orange-600 transition-colors text-center">
                {cat.name}
              </p>
              
              {/* নিচের ছোট ডেকোরেশন লাইন */}
              <div className="w-0 group-hover:w-10 h-1 bg-orange-500 mt-2 transition-all duration-500 rounded-full"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default Categories;