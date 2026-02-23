"use client";

import { Bell, Search, UserCircle, Menu, LogOut, Settings, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/context";

export default function AdminHeader() {

  const { user, logout, isLoading } = useAuth();

  return (
    <header className="h-16 border-b bg-white flex items-center justify-between px-6 sticky top-0 z-30 shadow-sm">
      <div className="flex items-center gap-4 flex-1">
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5 text-slate-600" />
        </Button>

        <div className="relative w-full max-w-md hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input 
            placeholder="Search for anything..." 
            className="pl-10 bg-slate-50 border-none focus-visible:ring-orange-500 rounded-full" 
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="relative text-slate-500 hover:text-orange-600 hover:bg-orange-50 rounded-full">
          <Bell className="h-5 w-5" />
          <span className="absolute top-2.5 right-2.5 h-2 w-2 bg-orange-600 rounded-full border-2 border-white"></span>
        </Button>
        
        <div className="h-8 w-[1px] bg-slate-200 mx-2 hidden sm:block"></div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-3 p-1 pr-3 hover:bg-slate-50 rounded-full transition-all outline-none">
              <div className="h-9 w-9 rounded-full bg-orange-100 flex items-center justify-center border-2 border-white shadow-sm overflow-hidden">

                {user?.image ? (
                  <img src={user.image} alt={user.name} className="h-full w-full object-cover" />
                ) : (
                  <UserCircle className="h-7 w-7 text-orange-600" />
                )}
              </div>
              <div className="text-left hidden md:block">
                <p className="text-sm font-bold text-slate-900 leading-tight">
                  {isLoading ? "Loading..." : user?.name || "Admin Hub"}
                </p>
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">
                  {user?.role || "Super Admin"}
                </p>
              </div>
            </button>
          </DropdownMenuTrigger>
          
          <DropdownMenuContent align="end" className="w-56 mt-2">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <Bell className="mr-2 h-4 w-4" />
              <span>Notifications</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            
    
            <DropdownMenuItem 
              onClick={() => logout()} 
              className="cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-600"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}