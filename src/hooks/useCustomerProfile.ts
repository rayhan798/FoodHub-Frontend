import { useState, useMemo } from "react";
import { useAuth } from "@/features/auth/context";

export type EditableProfile = {
  name: string;
  phone: string;
  address: string;
  image?: string;
};

export function useProfileData() {
  const { user, isLoading } = useAuth();
  const [refreshKey, setRefreshKey] = useState(0);

  const profile = useMemo(() => {
    if (!user) return { name: "", phone: "", address: "", image: undefined };

    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(`profile-${user.email}`);
      if (saved) return JSON.parse(saved) as EditableProfile;
    }

    return {
      name: user.name || "",
      phone: "",
      address: "",
      image: user.image,
    };
  }, [user, refreshKey]);

  const triggerRefresh = () => setRefreshKey((prev) => prev + 1);

  return {
    user,
    isLoading,
    profile,
    triggerRefresh,
    storageKey: user ? `profile-${user.email}` : "",
  };
}