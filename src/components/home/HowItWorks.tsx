import { ShoppingBag, Truck, Utensils } from "lucide-react";

const steps = [
  {
    id: 1,
    title: "Choose Your Meal",
    description: "Select from a wide variety of delicious meals from your local chefs.",
    icon: <ShoppingBag className="h-8 w-8 text-orange-600" />,
  },
  {
    id: 2,
    title: "Fast Delivery",
    description: "Our delivery partners ensure your food reaches you hot and fresh.",
    icon: <Truck className="h-8 w-8 text-orange-600" />,
  },
  {
    id: 3,
    title: "Enjoy Your Food",
    description: "Sit back and enjoy your healthy, homemade meal with your family.",
    icon: <Utensils className="h-8 w-8 text-orange-600" />,
  },
];

const HowItWorks = () => {
  return (
    <section className="py-20 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900">How It Works</h2>
          <div className="h-1.5 w-20 bg-orange-500 mx-auto mt-4 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {steps.map((step) => (
            <div key={step.id} className="relative text-center group">
              <div className="bg-white w-20 h-20 rounded-3xl shadow-lg flex items-center justify-center mx-auto mb-6 group-hover:bg-orange-50 group-hover:scale-110 transition-all duration-300">
                {step.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">{step.title}</h3>
              <p className="text-slate-600 leading-relaxed max-w-xs mx-auto">
                {step.description}
              </p>
              {step.id !== 3 && (
                <div className="hidden lg:block absolute top-10 left-[65%] w-full h-[2px] border-t-2 border-dashed border-slate-200 -z-10"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;