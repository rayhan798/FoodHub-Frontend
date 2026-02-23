import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

const Hero = () => {
  return (
    <section className="relative bg-slate-50 py-12 md:py-20 lg:py-28 overflow-hidden">

      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-orange-100 rounded-full blur-3xl opacity-50"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row items-center gap-10 lg:gap-16">

          <div className="flex-1 space-y-6 text-center md:text-left">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
              Freshly Made <br /> 
              <span className="text-orange-600">Home-Cooked</span> Meals
            </h1>
            <p className="text-base md:text-lg text-slate-600 max-w-lg mx-auto md:mx-0 leading-relaxed">
              Discover talented local providers making delicious meals just for you. 
              Healthy, affordable, and delivered straight to your doorstep.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-2">
              <Button size="lg" className="bg-orange-600 hover:bg-orange-700 text-white text-lg px-10 py-7 rounded-full transition-all hover:shadow-lg hover:shadow-orange-200 active:scale-95" asChild>
                <Link href="/meals">Order Now</Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-10 py-7 rounded-full border-2 hover:bg-slate-100 transition-all active:scale-95" asChild>
                <Link href="/#how-it-works">How it Works</Link>
              </Button>
            </div>
          </div>

          <div className="flex-1 relative w-full h-[350px] md:h-[450px] lg:h-[500px]">
            <div className="absolute -inset-4 bg-orange-300 rounded-full blur-3xl opacity-20 animate-pulse"></div>
            
            <div className="relative w-full h-full group">
              <Image 
                src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070" 
                alt="Delicious Home Cooked Food"
                fill
                priority
                className="object-cover rounded-[2rem] shadow-2xl relative z-10 transition-transform duration-700 group-hover:scale-[1.02]"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-orange-600/10 to-transparent rounded-[2rem] z-20 pointer-events-none"></div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;