"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Bell,
  User as UserIcon,
  ChevronDown,
  LogOut,
  Store,
  Loader2,
  Settings,
  CircleOff,
  Menu,
  ChefHat, 
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/features/auth/context";
import { env } from "@/env";
import { toast } from "react-hot-toast";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"; 
import ProviderSidebar from "./ProviderSidebar";


const getImageUrl = (imagePath: string | undefined): string | undefined => {
  if (!imagePath) return undefined;

  if (imagePath.startsWith("http") || imagePath.startsWith("data:")) {
    return imagePath;
  }

  const baseUrl = env.NEXT_PUBLIC_API_URL?.replace(/\/api$/, "").replace(/\/$/, "");

  const cleanPath = imagePath.startsWith("/") ? imagePath : `/${imagePath}`;
  
  if (imagePath.startsWith("uploads/")) {
    return `${baseUrl}${cleanPath}`;
  }

  return `${baseUrl}/uploads${cleanPath}`;
};

export default function ProviderHeader() {
  const { user, logout, isLoading } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const displayImage = useMemo(() => {
    if (!user) return undefined;

    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(`profile-${user.email}`);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          return parsed.image || user.image;
        } catch (e) {
          return user.image;
        }
      }
    }
    return user.image;
  }, [user]);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error("Failed to logout. Please try again.");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <header className="h-16 border-b bg-white flex items-center justify-between px-4 md:px-8 sticky top-0 z-20 shadow-sm">
      <div className="flex items-center gap-2 md:gap-4">
        <div className="lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                <Menu size={24} className="text-slate-600" />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-64">
              <ProviderSidebar />
            </SheetContent>
          </Sheet>
        </div>

        <div className="flex lg:hidden items-center gap-2 mr-2">
          <div className="h-8 w-8 bg-orange-600 rounded-lg flex items-center justify-center shadow-md">
            <ChefHat size={18} className="text-white" />
          </div>
        </div>

        <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-100">
          <span className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse"></span>
          <span className="text-xs font-bold uppercase tracking-wider">
            Kitchen Online
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3 md:gap-5">
        <button 
          className="text-slate-500 hover:text-orange-600 transition-colors relative"
          onClick={() => toast.success("You have 3 new notifications")}
        >
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 h-4 w-4 bg-orange-600 text-[10px] text-white flex items-center justify-center rounded-full border-2 border-white">
            3
          </span>
        </button>

        <div className="h-6 w-[1px] bg-slate-200"></div>

        <DropdownMenu>
          <DropdownMenuTrigger
            className="flex items-center gap-2 md:gap-3 outline-none group"
            disabled={isLoading || isLoggingOut}
          >
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-slate-900 group-hover:text-orange-600 transition-colors max-w-[150px] truncate">
                {isLoading ? "Checking session..." : user?.name || "Provider Mama"}
              </p>
              <p className="text-[10px] text-slate-500 font-medium truncate max-w-[150px]">
                {user?.email || "provider@mama.com"}
              </p>
            </div>

            <div className="h-9 w-9 rounded-full bg-slate-100 border-2 border-orange-100 flex items-center justify-center text-orange-600 overflow-hidden relative shadow-sm">
              {isLoading || isLoggingOut ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : displayImage ? (
                <Image
                  src={getImageUrl(displayImage)!}
                  alt={user?.name || "Provider"}
                  fill
                  className="object-cover"
                  sizes="36px"
                />
              ) : (
                <UserIcon size={20} />
              )}
            </div>
            <ChevronDown
              size={14}
              className="text-slate-400 group-hover:text-orange-600 transition-colors"
            />
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56 mt-2 p-1">
            <div className="px-2 py-1.5 text-xs font-semibold text-slate-400 uppercase">
              My Kitchen
            </div>
            
            <DropdownMenuItem className="cursor-pointer py-2" asChild>
              {user?.id ? (
                <Link href={`/provider/profile/${user.id}`}>
                  <Store className="mr-2 h-4 w-4 text-orange-500" />
                  View My Shop
                </Link>
              ) : (
                <button onClick={() => toast.error("Profile ID not found")}>
                  <Store className="mr-2 h-4 w-4" />
                  View My Shop
                </button>
              )}
            </DropdownMenuItem>

            <DropdownMenuItem className="cursor-pointer py-2 font-medium text-emerald-600">
              <span className="flex items-center justify-between w-full">
                <span>Earnings</span>
                <span>$1,240</span>
              </span>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem className="cursor-pointer py-2" asChild>
              <Link href="/dashboard/provider/settings">
                <Settings className="mr-2 h-4 w-4" />
                Account Settings
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem 
              className="cursor-pointer py-2 text-orange-600 font-medium"
              onClick={() => toast("Feature coming soon!")}
            >
              <CircleOff className="mr-2 h-4 w-4" />
              Go Offline
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="cursor-pointer py-2 text-red-600 focus:bg-red-50 focus:text-red-600 font-bold"
            >
              {isLoggingOut ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <LogOut className="mr-2 h-4 w-4" />
              )}
              {isLoggingOut ? "Logging out..." : "Logout"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}