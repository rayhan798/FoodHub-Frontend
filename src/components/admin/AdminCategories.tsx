"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Edit2, Trash2, Search, Utensils, Hash, Loader2 } from "lucide-react";
import { toast } from "sonner";

// আপনার এক্সপ্রেস ব্যাকএন্ডের ইউআরএল এখানে দিন 
const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/categories`;

interface Category {
  id: string;
  name: string;
  slug: string;
  status: "ACTIVE" | "INACTIVE";
  itemCount?: number;
  _count?: {
    meals: number;
  };
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    status: "ACTIVE" as "ACTIVE" | "INACTIVE",
  });

  // ১. ডাটা ফেচিং (এক্সপ্রেস ব্যাকএন্ড থেকে)
  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(API_BASE_URL);
      const result = await response.json();

      // এক্সপ্রেস সাধারণত { success: true, data: [] } পাঠায়
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

  // ২. ক্যাটাগরি তৈরি বা আপডেট (FIXED লজিক)
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
      
      const method = editingCategory ? "PUT" : "POST"; // এক্সপ্রেসের জন্য সাধারণত PUT/PATCH

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
        fetchCategories(); // লিস্ট রিফ্রেশ
        handleCloseDialog();
      } else {
        throw new Error(result.message || "Failed to save data");
      }
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
      console.error("Submit Error:", error);
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

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingCategory(null);
    setFormData({ name: "", status: "ACTIVE" });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-800">Categories</h1>
          <p className="text-slate-500">Manage your food categories and inventory.</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={(open) => {
            if(!open) handleCloseDialog();
            else setIsDialogOpen(true);
        }}>
          <DialogTrigger asChild>
            <Button className="bg-orange-600 hover:bg-orange-700 rounded-xl gap-2 h-12 px-6">
              <Plus className="h-5 w-5" /> Add New Category
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] rounded-3xl">
            <DialogHeader>
              <DialogTitle className="text-2xl">
                {editingCategory ? "Update Category" : "Create New Category"}
              </DialogTitle>
              <DialogDescription>
                Slug will be auto-generated based on the name.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Category Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Fast Food"
                  className="rounded-xl h-11"
                />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select 
                  value={formData.status} 
                  onValueChange={(val: "ACTIVE" | "INACTIVE") => 
                    setFormData({ ...formData, status: val })
                  }
                >
                  <SelectTrigger className="rounded-xl h-11">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="INACTIVE">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button 
                disabled={isSubmitting} 
                onClick={handleSubmit} 
                className="w-full bg-orange-600 hover:bg-orange-700 h-12 rounded-xl text-white font-semibold"
              >
                {isSubmitting ? (
                  <><Loader2 className="animate-spin mr-2 h-4 w-4" /> Processing...</>
                ) : (
                  editingCategory ? "Save Changes" : "Create Category"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="rounded-3xl border-slate-100 shadow-sm overflow-hidden bg-white">
        <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 rounded-xl bg-slate-50 border-none h-11"
            />
          </div>
          <div className="text-sm text-slate-500 font-medium">
            Total Results: <span className="text-orange-600">{filteredCategories.length}</span>
          </div>
        </div>

        <CardContent className="p-0">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-3">
              <Loader2 className="h-10 w-10 text-orange-600 animate-spin" />
              <p className="text-slate-400 animate-pulse">Fetching from server...</p>
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow>
                  <TableHead className="pl-8">Category Name</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Count</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right pr-8">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCategories.length > 0 ? (
                  filteredCategories.map((cat) => (
                    <TableRow key={cat.id} className="hover:bg-slate-50/40 transition-colors">
                      <TableCell className="pl-8 py-4 font-semibold text-slate-700">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600">
                            <Utensils size={18} />
                          </div>
                          {cat.name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <code className="text-[11px] bg-slate-100 text-slate-600 px-2 py-1 rounded-md">
                           {cat.slug}
                        </code>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm font-medium text-slate-600">
                          {cat.itemCount ?? cat._count?.meals ?? 0} items
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge className={cat.status === "ACTIVE" ? "bg-green-100 text-green-700 border-none hover:bg-green-100" : "bg-slate-100 text-slate-500 border-none hover:bg-slate-100"}>
                          {cat.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right pr-8">
                        <div className="flex justify-end gap-2">
                            <Button variant="outline" size="icon" onClick={() => handleEdit(cat)} className="h-9 w-9 border-slate-200 text-slate-600 hover:text-blue-600 hover:bg-blue-50">
                            <Edit2 size={15} />
                            </Button>
                            <Button variant="outline" size="icon" onClick={() => deleteCategory(cat.id)} className="h-9 w-9 border-slate-200 text-slate-600 hover:text-red-600 hover:bg-red-50">
                            <Trash2 size={15} />
                            </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-40 text-center text-slate-400">
                      No categories found in the database.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}