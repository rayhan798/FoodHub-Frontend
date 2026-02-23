"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useMemo, useEffect, useCallback } from "react";
import { useAuth } from "@/features/auth/context";
import { env } from "@/env";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Menu,
  UtensilsCrossed,
  LogOut,
  X,
  Loader2,
  User as UserIcon,
  ShoppingCart,
  Search,
} from "lucide-react";

const getImageUrl = (imagePath: string | undefined): string | undefined => {
  if (!imagePath) return undefined;
  if (imagePath.startsWith("http") || imagePath.startsWith("data:"))
    return imagePath;
  const baseUrl = env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");
  return imagePath.startsWith("uploads/")
    ? `${baseUrl}/${imagePath}`
    : `${baseUrl}/uploads/${imagePath}`;
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { user, logout, isLoading } = useAuth();

  const [isMounted, setIsMounted] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const handleCartUpdate = useCallback(() => {
    if (typeof window !== "undefined") {
      try {
        const cart = JSON.parse(localStorage.getItem("cart") || "[]");
        setCartCount(Array.isArray(cart) ? cart.length : 0);
      } catch (error) {
        console.error("Error parsing cart:", error);
        setCartCount(0);
      }
    }
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setIsMounted(true);
      handleCartUpdate();
    }, 0);

    window.addEventListener("storage", handleCartUpdate);
    window.addEventListener("cart-updated", handleCartUpdate);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("storage", handleCartUpdate);
      window.removeEventListener("cart-updated", handleCartUpdate);
    };
  }, [handleCartUpdate]);

  const displayImage = useMemo(() => {
    if (!user) return undefined;
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(`profile-${user.email}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.image || user.image;
      }
    }
    return user.image;
  }, [user]);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/meals", label: "Meals" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 gap-4">
        {/* Logo & Links */}
        <div className="flex items-center gap-6 shrink-0">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="bg-orange-600 p-1.5 rounded-lg group-hover:rotate-12 transition-transform shadow-lg shadow-orange-200">
              <UtensilsCrossed className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">
              Food<span className="text-orange-600">Hub</span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-bold text-slate-600 hover:text-orange-600 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-md relative group hidden md:block">
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400 group-focus-within:text-orange-600 transition-colors" />
          <Input
            placeholder="Search for delicious meals..."
            className="pl-10 rounded-2xl bg-slate-100 border-none focus:bg-white focus:ring-2 focus:ring-orange-100 transition-all outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 lg:gap-4 shrink-0">
          <Link
            href="/cart"
            className="relative p-2.5 hover:bg-slate-100 rounded-full transition-colors group"
          >
            <ShoppingCart className="h-6 w-6 text-slate-700 group-hover:text-orange-600 transition-colors" />
            {isMounted && cartCount > 0 && (
              <span className="absolute top-1 right-1 bg-orange-600 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full border-2 border-white shadow-sm">
                {cartCount}
              </span>
            )}
          </Link>

          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin text-orange-600" />
          ) : user ? (
            <div className="flex items-center gap-3">
              <Link
                href="/profile"
                className="relative h-9 w-9 rounded-full overflow-hidden border-2 border-orange-100 bg-orange-50 flex items-center justify-center hover:ring-4 hover:ring-orange-50 transition-all"
              >
                {displayImage ? (
                  <Image
                    src={getImageUrl(displayImage)!}
                    alt="User"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <UserIcon className="h-5 w-5 text-orange-600" />
                )}
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl hidden sm:flex font-bold"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button
              className="bg-orange-600 hover:bg-orange-700 text-white rounded-xl shadow-md font-bold px-6 h-10 transition-all"
              asChild
            >
              <Link href="/login">Join</Link>
            </Button>
          )}

          <button
            className="md:hidden p-2 text-gray-600 hover:bg-slate-100 rounded-lg transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t p-4 space-y-4 bg-white animate-in slide-in-from-top duration-300">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search meals..."
              className="pl-10 rounded-xl bg-slate-100 border-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="font-bold p-3 hover:bg-orange-50 hover:text-orange-600 rounded-xl text-slate-700"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {user && (
            <Button
              onClick={logout}
              variant="destructive"
              className="w-full rounded-xl font-bold h-12"
            >
              <LogOut className="h-4 w-4 mr-2" /> Logout
            </Button>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
