import { useState, useEffect, useCallback, useMemo } from "react";
import { toast } from "sonner";
import { Category, CategoryFormData } from "../types/adminCategories";

const API_BASE_URL = "http://localhost:5000/api/categories";

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<CategoryFormData>({
    name: "",
    status: "ACTIVE",
  });

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(API_BASE_URL);
      const result = await response.json();

      if (result.success && Array.isArray(result.data)) {
        setCategories(result.data);
      } else if (Array.isArray(result)) {
        setCategories(result);
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      toast.error("Failed to connect to backend server");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const generateSlug = (name: string): string =>
    name.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-');

  const filteredCategories = useMemo(() => {
    const list = Array.isArray(categories) ? categories : [];
    return list.filter((cat) =>
      cat?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [categories, searchTerm]);

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingCategory(null);
    setFormData({ name: "", status: "ACTIVE" });
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      toast.error("Category name is required");
      return;
    }

    setIsSubmitting(true);
    try {
      const url = editingCategory 
        ? `${API_BASE_URL}/${editingCategory.id}` 
        : API_BASE_URL;
      
      const method = editingCategory ? "PUT" : "POST"; 

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          status: formData.status,
          slug: generateSlug(formData.name)
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        toast.success(result.message || "Operation successful");
        fetchCategories(); 
        handleCloseDialog();
      } else {
        throw new Error(result.message || "Failed to save data");
      }
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteCategory = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, { method: "DELETE" });
      const result = await response.json();

      if (response.ok && result.success) {
        setCategories(prev => prev.filter(c => c.id !== id));
        toast.success("Category deleted successfully");
      } else {
        toast.error(result.message || "Delete failed");
      }
    } catch (error) {
      toast.error("Could not reach the server");
    }
  };

  const handleEdit = (cat: Category) => {
    setEditingCategory(cat);
    setFormData({ name: cat.name, status: cat.status });
    setIsDialogOpen(true);
  };

  return {
    categories,
    loading,
    searchTerm,
    setSearchTerm,
    isDialogOpen,
    setIsDialogOpen,
    editingCategory,
    isSubmitting,
    formData,
    setFormData,
    filteredCategories,
    handleSubmit,
    deleteCategory,
    handleEdit,
    handleCloseDialog,
  };
}