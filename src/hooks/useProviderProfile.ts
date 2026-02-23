import { useState, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";
import { env } from "@/env";

export function useProviderProfile(id: string, authUser: any) {
  const [provider, setProvider] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [editData, setEditData] = useState({ address: "", phone: "", description: "" });

  const fetchProfile = useCallback(async () => {
    if (!id || id === "undefined") return;
    try {
      const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/providers/${id}?t=${Date.now()}`, {
        cache: 'no-store'
      });
      if (!res.ok) throw new Error("Kitchen not found");
      const result = await res.json();
      setProvider(result.data);
      setEditData({
        address: result.data.address || "",
        phone: result.data.phone || "",
        description: result.data.description || ""
      });
    } catch (err) {
      toast.error("Failed to load kitchen profile");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchProfile(); }, [fetchProfile]);

  const handleUpdate = async () => {
    if (!editData.address.trim() || !editData.phone.trim()) {
      toast.error("Address and Phone are required");
      return;
    }

    setUpdating(true);
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/providers/profile`, {
        method: "PATCH",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify(editData),
      });

      if (res.ok) {
        toast.success("Profile updated!");
        setProvider((prev: any) => ({ ...prev, ...editData }));
        setIsEditing(false);
      } else {
        throw new Error("Update failed");
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setUpdating(false);
    }
  };

  const isOwner = provider?.userId === authUser?.id;

  return {
    provider,
    loading,
    isEditing,
    setIsEditing,
    editData,
    setEditData,
    updating,
    handleUpdate,
    isOwner
  };
}