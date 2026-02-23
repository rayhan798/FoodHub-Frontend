import { useState, useMemo } from "react";
import { useAuth } from "@/features/auth/context";
import { toast } from "react-hot-toast";

export const useProviderHeader = () => {
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

  return { user, isLoading, isLoggingOut, displayImage, handleLogout };
};