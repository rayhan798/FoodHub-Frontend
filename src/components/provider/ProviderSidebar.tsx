"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Utensils,
  ClipboardList,
  LogOut,
  Store,
  ChefHat,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/features/auth/context";

export default function ProviderSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const providerRoutes = [
    {
      label: "Overview",
      icon: LayoutDashboard,
      href: "/provider/dashboard",
    },
    {
      label: "My Menu",
      icon: Utensils,
      href: "/provider/menu",
    },
    {
      label: "Orders",
      icon: ClipboardList,
      href: "/provider/orders",
    },
    {
      label: "Kitchen Profile",
      icon: Store,
      href: user?.id ? `/provider/profile/${user.id}` : "#",
    },
  ];

  return (
    <div className="flex flex-col h-full bg-white border-r shadow-sm w-64">
      <div className="px-6 py-8 flex-1">
        <Link
          href="/provider/dashboard"
          className="flex items-center mb-10 pl-2"
        >
          <div className="h-9 w-9 bg-orange-600 rounded-xl flex items-center justify-center mr-3 shadow-lg shadow-orange-200">
            <ChefHat className="text-white h-5 w-5" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
            Kitchen Hub
          </span>
        </Link>

        <nav className="space-y-2">
          {providerRoutes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "group flex items-center p-3 text-sm font-medium rounded-xl transition-all duration-200",
                pathname === route.href
                  ? "bg-orange-50 text-orange-600 shadow-sm"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900",
              )}
            >
              <route.icon
                className={cn(
                  "h-5 w-5 mr-3 transition-colors",
                  pathname === route.href
                    ? "text-orange-600"
                    : "text-slate-400 group-hover:text-slate-600",
                )}
              />
              {route.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t">
        <button
          onClick={() => logout()}
          className="flex items-center w-full p-3 text-sm font-medium text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all group"
        >
          <LogOut className="h-5 w-5 mr-3 text-slate-400 group-hover:text-red-600 transition-colors" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
