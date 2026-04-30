"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  UtensilsCrossed, 
  Tags, 
  Users, 
  LogOut,
  ShoppingBag,
  LayoutDashboard
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/features/auth/context"; 
import { toast } from "react-hot-toast";

const routes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/admin", 
  },
  {
    label: "Categories",
    icon: Tags,
    href: "/admin/categories",
  },
  {
    label: "Orders",
    icon: ShoppingBag,
    href: "/admin/orders",
  },
  {
    label: "Users",
    icon: Users,
    href: "/admin/users",
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout(); 
      
      toast.success("Logged out successfully");
      
      router.push("/login");
      router.refresh(); 
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Failed to logout. Please try again.");
    }
  };

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-white border-r shadow-sm">
      <div className="px-6 py-2 flex-1">
        {/* Logo */}
        <Link href="/admin" className="flex items-center mb-10 group">
          <div className="relative w-8 h-8 mr-3 bg-orange-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
             <UtensilsCrossed className="text-white h-5 w-5" />
          </div>
          <h1 className="text-xl font-bold text-slate-800">
            Food<span className="text-orange-600">Hub</span>
          </h1>
        </Link>

        {/* Navigation */}
        <div className="space-y-1">
          {routes.map((route) => {

            const isActive = pathname === route.href || (route.href !== "/admin" && pathname.startsWith(route.href));

            return (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all duration-200",
                  isActive ? "text-orange-600 bg-orange-50" : "text-slate-500"
                )}
              >
                <div className="flex items-center flex-1">
                  <route.icon className={cn(
                    "h-5 w-5 mr-3 transition-colors", 
                    isActive ? "text-orange-600" : "text-slate-400 group-hover:text-orange-600"
                  )} />
                  {route.label}
                </div>
                {isActive && (
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-600 ml-auto" />
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Logout Button */}
      <div className="px-4 mt-auto border-t pt-4">
        <button 
          type="button"
          onClick={handleLogout} 
          className="flex items-center w-full p-3 text-sm font-medium text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 group"
        >
          <LogOut className="h-5 w-5 mr-3 text-slate-400 group-hover:text-red-600 transition-colors" />
          Logout Account
        </button>
      </div>
    </div>
  );
}