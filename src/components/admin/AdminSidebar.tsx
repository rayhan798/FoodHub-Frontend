"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  UtensilsCrossed, 
  Tags, 
  Users, 
  LogOut,
  ShoppingBag
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/features/auth/context"; 

const routes = [
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
  const { logout } = useAuth(); 

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-white border-r shadow-sm">
      <div className="px-6 py-2 flex-1">
        <Link href="/admin" className="flex items-center mb-10">
          <div className="relative w-8 h-8 mr-3 bg-orange-600 rounded-lg flex items-center justify-center">
             <UtensilsCrossed className="text-white h-5 w-5" />
          </div>
          <h1 className="text-xl font-bold text-orange-600">
            Admin Hub
          </h1>
        </Link>

        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-orange-600 hover:bg-orange-50 rounded-xl transition",
                pathname === route.href ? "text-orange-600 bg-orange-50" : "text-slate-500"
              )}
            >
              <div className="flex items-center flex-1">
                <route.icon className={cn("h-5 w-5 mr-3", pathname === route.href ? "text-orange-600" : "text-slate-400")} />
                {route.label}
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="px-6 mt-auto">
        <button 
          type="button"
          onClick={() => logout()} 
          className="flex items-center w-full p-3 text-sm font-medium text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition group"
        >
          <LogOut className="h-5 w-5 mr-3 text-slate-400 group-hover:text-red-600 transition-colors" />
          Logout
        </button>
      </div>
    </div>
  );
}