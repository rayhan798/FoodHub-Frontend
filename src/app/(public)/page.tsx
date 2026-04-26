import Hero from "@/components/home/Hero";
import Categories from "@/components/home/Categories";
import FeaturedMeals from "@/components/home/FeaturedMeals";
import HowItWorks from "@/components/home/HowItWorks"; 

export default async function HomePage() {
  return (
    <>
      <Hero />
      <HowItWorks /> {/* এটি হিরো সেকশনের নিচে দিলে ভালো দেখাবে */}
      <Categories />
      <FeaturedMeals />
    </>
  );
}