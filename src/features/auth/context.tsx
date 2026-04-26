"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export type UserRole = "customer" | "provider" | "admin";

export type UserStatus = "PENDING" | "APPROVED" | "REJECTED"; 

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus; // ✅ ইন্টারফেসে status যোগ করা হলো
  image?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter(); 

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data, error } = await authClient.getSession();
        if (error || !data?.user) {
          setUser(null);
          return;
        }

        const sessionUser = data.user as any; 

        // ২. setUser করার সময় status ফিল্ডটি সেশন থেকে নেওয়া হয়েছে
        setUser({
          id: sessionUser.id,
          name: sessionUser.name,
          email: sessionUser.email,
          role: sessionUser.role ?? "customer",
          status: sessionUser.status ?? "PENDING", // ✅ সেশন থেকে status ম্যাপ করা হলো
          image: sessionUser.image ?? undefined,
        });
      } catch {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, []);

  const logout = async () => {
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            setUser(null);
            router.refresh();
            router.push("/login");
          }
        }
      });
    } catch (error) {
      console.error("Logout error:", error);
      setUser(null);
      window.location.href = "/login";
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};