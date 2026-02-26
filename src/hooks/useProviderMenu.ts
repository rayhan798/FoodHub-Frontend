import { useState, useEffect, useMemo } from "react";
import { toast } from "react-hot-toast";
import { env } from "@/env";
import { MenuItem, ApiResponse } from "../types/providerMenu";

export const useMenu = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"ALL" | "AVAILABLE" | "OUT_OF_STOCK">(
    "ALL",
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  const [newItem, setNewItem] = useState({
    name: "",
    price: "",
    category: "",
    description: "",
    image: null as File | null,
  });

  const fetchMenu = async () => {
    try {
      setLoading(true);
      setFetchError(null);
      const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/meals`, {
        method: "GET",
        credentials: "include",
      });
      
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Failed to fetch menu");
      
      setMenuItems(result.data || []);
    } catch (err: any) {
      const msg = err.message || "Could not load menu items";
      setFetchError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  const handleSave = async () => {
    // Client side validation
    if (!newItem.name.trim()) return toast.error("Meal name is required");
    if (!newItem.category) return toast.error("Category is required");
    if (!newItem.price || isNaN(Number(newItem.price)) || Number(newItem.price) <= 0) {
      return toast.error("Please enter a valid price");
    }

    setIsSubmitting(true);
    const toastId = toast.loading(
      editingItem ? "Updating meal..." : "Adding meal...",
    );

    try {
      const formData = new FormData();
      formData.append("name", newItem.name.trim());
      formData.append("price", newItem.price.toString());
      formData.append("category", newItem.category.trim());
      formData.append("description", newItem.description || "");

      if (newItem.image) {
        formData.append("image", newItem.image);
      }

      const url = editingItem
        ? `${env.NEXT_PUBLIC_API_URL}/meals/${editingItem.id}`
        : `${env.NEXT_PUBLIC_API_URL}/meals`;

      const res = await fetch(url, {
        method: editingItem ? "PATCH" : "POST",
        credentials: "include",
        body: formData,
      });

      // এই অংশটি খুব গুরুত্বপূর্ণ
      const result = await res.json();

      if (!res.ok) {
        // ব্যাকএন্ড যদি সরাসরি message ফিল্ডে এরর পাঠায় সেটি ধরবে
        // আপনার টার্মিনালে দেখা মেসেজটি "Access Denied" এখানে ধরা পড়বে
        const errorMsg = result.message || "Access Denied: Admin approval required.";
        throw new Error(errorMsg);
      }

      toast.success(editingItem ? "Meal updated!" : "Meal added!", {
        id: toastId,
      });
      closeModal();
      fetchMenu();
    } catch (error: any) {
      console.error("Save Error:", error.message);
      // এখানে টোস্টটি স্পষ্টভাবে দেখানো হচ্ছে
      toast.error(error.message, { 
        id: toastId,
        duration: 5000 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this meal?")) return;
    const toastId = toast.loading("Deleting...");
    try {
      const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/meals/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Delete failed");
      
      setMenuItems((prev) => prev.filter((item) => item.id !== id));
      toast.success("Meal deleted successfully", { id: toastId });
    } catch (error: any) {
      toast.error(error.message || "Action failed", { id: toastId });
    }
  };

  const toggleStatus = async (id: string, currentStatus: string) => {
    if (updatingId) return;
    setUpdatingId(id);
    const newStatus = currentStatus === "AVAILABLE" ? "OUT_OF_STOCK" : "AVAILABLE";

    try {
      const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/meals/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status: newStatus }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Failed to update status");

      setMenuItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status: newStatus as any } : item,
        ),
      );
      toast.success(`Marked as ${newStatus.toLowerCase().replace("_", " ")}`);
    } catch (error: any) {
      toast.error(error.message || "Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const openEditModal = (item: MenuItem) => {
    setEditingItem(item);
    setNewItem({
      name: item.name,
      price: item.price.toString(),
      category:
        typeof item.category === "object"
          ? (item.category as any).name
          : item.category || "",
      description: item.description || "",
      image: null,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (isSubmitting) return;
    setIsModalOpen(false);
    setEditingItem(null);
    setNewItem({
      name: "",
      price: "",
      category: "",
      description: "",
      image: null,
    });
  };

  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      const matchSearch = (item.name || "")
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchFilter = filter === "ALL" ? true : item.status === filter;
      return matchSearch && matchFilter;
    });
  }, [menuItems, search, filter]);

  return {
    menuItems,
    loading,
    fetchError,
    search,
    setSearch,
    filter,
    setFilter,
    isModalOpen,
    setIsModalOpen,
    isSubmitting,
    updatingId,
    editingItem,
    newItem,
    setNewItem,
    filteredItems,
    fetchMenu,
    handleSave,
    handleDelete,
    toggleStatus,
    openEditModal,
    closeModal,
  };
};