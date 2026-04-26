import { useState, useEffect, useMemo, ChangeEvent } from "react";
import { env } from "@/env";
import { toast } from "sonner";

/* ================= TYPES ================= */
export interface Category {
  id?: string;
  name: string;
}

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string | Category;
  description?: string;
  imageUrl?: string;
  status: "AVAILABLE" | "OUT_OF_STOCK";
}

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

/* ✅ Image Compression Helper */
const compressImage = (file: File): Promise<File | Blob> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 1024;
        const MAX_HEIGHT = 1024;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: "image/jpeg",
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              reject(new Error("Image compression failed"));
            }
          },
          "image/jpeg",
          0.7
        );
      };
    };
    reader.onerror = (error) => reject(error);
  });
};

export const useMenuManager = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"ALL" | "AVAILABLE" | "OUT_OF_STOCK">("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  const [newItem, setNewItem] = useState({ 
    name: "", 
    price: "", 
    category: "", 
    description: "",
    image: null as File | null 
  });

  // const baseUrl = env.NEXT_PUBLIC_API_URL.replace('/api', '');
  const baseUrl = env.NEXT_PUBLIC_API_URL.replace(/\/api$/, '').replace(/\/+$/, '');

  /* =====================================================
      ✅ FETCH MENU 
  ===================================================== */
  const fetchMenu = async () => {
    try {
      setLoading(true);
      setFetchError(null);
      const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/meals/getMeals`, {
        method: "GET",
        credentials: "include", 
      });
      
      const result: ApiResponse<MenuItem[]> = await res.json();
      if (!res.ok) throw new Error(result.message || "Failed to fetch menu");
      
      setMenuItems(result.data || []);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Could not load menu items";
      setFetchError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      const toastId = toast.loading("Optimizing large image...");
      try {
        const compressed = await compressImage(file);
        setNewItem(prev => ({ ...prev, image: compressed as File }));
        toast.success("Image optimized", { id: toastId });
      } catch (err) {
        toast.error("Optimization failed", { id: toastId });
        setNewItem(prev => ({ ...prev, image: file }));
      }
    } else {
      setNewItem(prev => ({ ...prev, image: file }));
    }
  };

  /* =====================================================
      ✅ SAVE / UPDATE MEAL (With Approved Status Check)
  ===================================================== */
  const handleSave = async () => {
    if (!newItem.name.trim()) return toast.error("Meal name is required");
    if (!newItem.category) return toast.error("Category is required");
    if (!newItem.price || isNaN(Number(newItem.price)) || Number(newItem.price) <= 0) {
      return toast.error("Please enter a valid price");
    }

    setIsSubmitting(true);
    const toastId = toast.loading(editingItem ? "Updating meal..." : "Adding meal...");

    try {
      const formData = new FormData();
      formData.append("name", newItem.name.trim());
      formData.append("price", newItem.price.toString());
      formData.append("category", newItem.category.trim());
      formData.append("description", newItem.description || "");
      if (newItem.image) formData.append("image", newItem.image);

      const url = editingItem 
        ? `${env.NEXT_PUBLIC_API_URL}/meals/${editingItem.id}` 
        : `${env.NEXT_PUBLIC_API_URL}/meals`;
      
      const res = await fetch(url, {
        method: editingItem ? "PATCH" : "POST",
        credentials: "include",
        body: formData,
      });

      const result = await res.json();
      
      if (!res.ok) {
        /* ✅ এখানে ব্যাকএন্ডের "Provider not approved by admin" মেসেজটি ধরা পড়বে */
        throw new Error(result.message || "Failed to save meal");
      }

      toast.success(editingItem ? "Meal updated!" : "Meal added!", { id: toastId });
      closeModal();
      fetchMenu(); 
    } catch (error: any) {
      /* ✅ ইউজারকে অ্যালার্ট মেসেজ দেখাবে */
      toast.error(error.message || "Something went wrong", { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditModal = (item: MenuItem) => {
    setEditingItem(item);
    setNewItem({
      name: item.name,
      price: item.price.toString(),
      category: typeof item.category === 'object' ? item.category.name : (item.category || ""),
      description: item.description || "",
      image: null
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (isSubmitting) return; 
    setIsModalOpen(false);
    setEditingItem(null);
    setNewItem({ name: "", price: "", category: "", description: "", image: null });
  };

  /* =====================================================
      ✅ TOGGLE STATUS
  ===================================================== */
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
      
      setMenuItems(prev => prev.map(item => 
        item.id === id ? { ...item, status: newStatus as any } : item
      ));
      toast.success(`Marked as ${newStatus.toLowerCase().replace('_', ' ')}`);
    } catch (error: any) {
      toast.error(error.message || "Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  /* =====================================================
      ✅ DELETE MEAL
  ===================================================== */
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
      
      setMenuItems(prev => prev.filter(item => item.id !== id));
      toast.success("Meal deleted successfully", { id: toastId });
    } catch (error: any) {
      toast.error(error.message, { id: toastId });
    }
  };

  /* =====================================================
      ✅ FILTERED ITEMS
  ===================================================== */
  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      const matchSearch = (item.name || "").toLowerCase().includes(search.toLowerCase());
      const matchFilter = filter === "ALL" ? true : item.status === filter;
      return matchSearch && matchFilter;
    });
  }, [menuItems, search, filter]);

  return {
    menuItems, loading, fetchError, search, setSearch, filter, setFilter,
    isModalOpen, setIsModalOpen, isSubmitting, updatingId, editingItem,
    newItem, setNewItem, baseUrl, fetchMenu, handleImageChange, handleSave,
    openEditModal, closeModal, toggleStatus, handleDelete, filteredItems
  };
};