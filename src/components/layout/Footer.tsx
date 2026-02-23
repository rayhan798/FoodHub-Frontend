import Link from "next/link";
import {
  UtensilsCrossed,
  Facebook,
  Twitter,
  Instagram,
  Github,
  Heart,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-slate-50 border-t border-slate-200">
      <div className="container mx-auto px-4 py-8 md:py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="col-span-1 space-y-3">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="bg-orange-600 p-1.5 rounded-lg group-hover:rotate-12 transition-transform shadow-sm">
                <UtensilsCrossed className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900">
                Food<span className="text-orange-600">Hub</span>
              </span>
            </Link>
            <p className="text-sm text-slate-600 leading-relaxed max-w-xs">
              Delicious meals from local providers, delivered fresh to your doorstep.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-slate-900 mb-3 uppercase tracking-wider text-xs">
              Quick Links
            </h3>
            <ul className="space-y-1.5 text-sm text-slate-600">
              <li>
                <Link href="/meals" className="hover:text-orange-600 transition-colors">
                  Browse Meals
                </Link>
              </li>
              <li>
                <Link href="/providers" className="hover:text-orange-600 transition-colors">
                  Our Providers
                </Link>
              </li>
              <li>
                <Link href="/#how-it-works" className="hover:text-orange-600 transition-colors">
                  How it Works
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-slate-900 mb-3 uppercase tracking-wider text-xs">
              Support
            </h3>
            <ul className="space-y-1.5 text-sm text-slate-600">
              <li>
                <Link href="#" className="hover:text-orange-600 transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-orange-600 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-orange-600 transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-slate-900 mb-3 uppercase tracking-wider text-xs">
              Stay Updated
            </h3>
            <div className="flex gap-2 mt-2">
              <input
                type="email"
                placeholder="Email"
                className="bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-sm w-full focus:outline-none focus:ring-1 focus:ring-orange-500"
              />
              <button className="bg-orange-600 text-white px-4 py-1.5 rounded-lg text-sm font-bold hover:bg-orange-700 transition">
                Join
              </button>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <p className="text-xs text-slate-500 font-medium">
              © {new Date().getFullYear()} FoodHub Inc. All rights reserved.
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5 flex items-center justify-center md:justify-start gap-1">
              Designed & Developed by
              <a
                href="https://www.facebook.com/RxUnknownCreations7"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-slate-600 hover:text-orange-600 transition-colors"
              >
                Rayhan
              </a>
              <Heart className="h-3 w-3 text-red-500 fill-red-500" />
            </p>
          </div>

          <div className="flex space-x-5 text-slate-400">
            <Link href="https://www.facebook.com/RxUnknownCreations7" className="hover:text-orange-600 transition-colors">
              <Facebook className="h-4 w-4" />
            </Link>
            <Link href="https://www.instagram.com/rx__rayhan__7" className="hover:text-orange-600 transition-colors">
              <Instagram className="h-4 w-4" />
            </Link>
            <Link href="https://github.com/rayhan798" className="hover:text-orange-600 transition-colors">
              <Github className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;