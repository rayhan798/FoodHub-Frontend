"use client";

import React, { useMemo } from "react";
import { env } from "@/env";
import { toast } from "react-hot-toast";
import { useMenu } from "../../hooks/useProviderMenu";
import { CATEGORIES } from "../../types/providerMenu";
import { compressImage } from "../../lib/providerMenuImage-utils";
import {
  Loader2,
  Plus,
  MoreVertical,
  Utensils,
  Search,
  Camera,
  Trash2,
  RefreshCw,
  Pencil,
  AlertCircle,
} from "lucide-react";

// UI Components
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function ProviderMenu() {
  const {
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
  } = useMenu();

  const getFullImageUrl = (path: string | undefined | null) => {
    if (!path) return null;
    if (path.startsWith("http")) return path;
    const baseUrl = env.NEXT_PUBLIC_API_URL.replace("/api", "");
    const cleanPath = path.replace(/\\/g, "/").replace(/^\//, "");
    return `${baseUrl}/${cleanPath}`;
  };

  const previewUrl = useMemo(() => {
    if (newItem.image instanceof File) {
      return URL.createObjectURL(newItem.image);
    }
    return null;
  }, [newItem.image]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
        setNewItem({ ...newItem, image: compressed });
        toast.success("Image optimized", { id: toastId });
      } catch (err) {
        toast.error("Optimization failed, using original", { id: toastId });
        setNewItem({ ...newItem, image: file });
      }
    } else {
      setNewItem({ ...newItem, image: file });
    }
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-orange-600" />
        <p className="text-slate-500 animate-pulse font-medium">
          Fetching your kitchen menu...
        </p>
      </div>
    );

  if (fetchError)
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <p className="text-slate-800 font-semibold">{fetchError}</p>
        <Button
          onClick={fetchMenu}
          variant="outline"
          className="border-orange-500 text-orange-600"
        >
          <RefreshCw className="mr-2 h-4 w-4" /> Try Again
        </Button>
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-8 space-y-6 max-w-7xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Manage Menu
          </h1>
          <p className="text-slate-500 text-sm">
            Update your meal list and availability
          </p>
        </div>

        <Dialog
          open={isModalOpen}
          onOpenChange={(open) => !open && closeModal()}
        >
          <DialogTrigger asChild>
            <Button
              onClick={() => setIsModalOpen(true)}
              className="bg-orange-600 hover:bg-orange-700 shadow-lg shadow-orange-200"
            >
              <Plus className="h-4 w-4 mr-2" /> Add New Meal
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? "Edit Meal" : "Add New Meal"}
              </DialogTitle>
              <DialogDescription>
                {editingItem
                  ? "Update the details of your dish."
                  : "Fill in the details for your new dish."}
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              {/* Image Upload Area */}
              <div className="relative h-44 w-full border-2 border-dashed border-slate-200 rounded-xl overflow-hidden hover:bg-slate-50 transition-all">
                <Input
                  id="meal-image"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
                <Label
                  htmlFor="meal-image"
                  className="cursor-pointer flex flex-col items-center justify-center h-full w-full"
                >
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="New preview"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : editingItem?.imageUrl ? (
                    <img
                      src={getFullImageUrl(editingItem.imageUrl)!}
                      alt="Current"
                      className="absolute inset-0 w-full h-full object-cover opacity-60"
                    />
                  ) : null}

                  <div className="relative z-10 flex flex-col items-center bg-white/80 p-3 rounded-lg shadow-sm">
                    <Camera className="h-6 w-6 text-orange-600 mb-1" />
                    <span className="text-xs font-bold text-slate-700 text-center text-wrap px-2">
                      {newItem.image
                        ? (newItem.image as File).name
                        : "Click to upload photo"}
                    </span>
                  </div>
                </Label>
              </div>

              {/* Input Fields */}
              <div className="grid gap-2">
                <Label htmlFor="name">Meal Name *</Label>
                <Input
                  id="name"
                  value={newItem.name}
                  onChange={(e) =>
                    setNewItem({ ...newItem, name: e.target.value })
                  }
                  placeholder="e.g. Grilled Chicken"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="category">Category *</Label>
                  <select
                    id="category"
                    value={newItem.category}
                    onChange={(e) =>
                      setNewItem({ ...newItem, category: e.target.value })
                    }
                    className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 outline-none"
                  >
                    <option value="" disabled>
                      Select category
                    </option>
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="price">Price ($) *</Label>
                  <Input
                    id="price"
                    type="number"
                    value={newItem.price}
                    onChange={(e) =>
                      setNewItem({ ...newItem, price: e.target.value })
                    }
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="desc">Description</Label>
                <Textarea
                  id="desc"
                  value={newItem.description}
                  onChange={(e) =>
                    setNewItem({ ...newItem, description: e.target.value })
                  }
                  placeholder="Describe your meal..."
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={closeModal}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={isSubmitting}
                className="bg-orange-600 hover:bg-orange-700 min-w-[100px]"
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : editingItem ? (
                  "Update Meal"
                ) : (
                  "Save Meal"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search meals..."
            className="pl-10 bg-slate-50/50 border-none focus-visible:ring-orange-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2 bg-slate-100 p-1 rounded-lg">
          {(["ALL", "AVAILABLE", "OUT_OF_STOCK"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${filter === t ? "bg-white text-orange-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
            >
              {t.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      {/* Table Section */}
      <Card className="border-none shadow-xl shadow-slate-200/50 overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow>
                <TableHead className="pl-6">Meal Details</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right pr-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-20 text-slate-400"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <Utensils className="h-8 w-8 opacity-20" />
                      <p>No meals found.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredItems.map((item) => (
                  <TableRow
                    key={item.id}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <TableCell className="pl-6">
                      <div className="flex items-center gap-3 py-1">
                        <div className="h-12 w-12 rounded-lg bg-slate-100 flex items-center justify-center overflow-hidden border">
                          {item.imageUrl ? (
                            <img
                              src={getFullImageUrl(item.imageUrl)!}
                              alt={item.name}
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                e.currentTarget.src =
                                  "https://placehold.co/100x100?text=Food";
                              }}
                            />
                          ) : (
                            <Utensils className="h-5 w-5 text-slate-400" />
                          )}
                        </div>
                        <div className="max-w-[200px]">
                          <p className="font-semibold text-slate-900 truncate">
                            {item.name}
                          </p>
                          <p className="text-xs text-slate-400 truncate">
                            {item.description || "No description"}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="font-normal border-slate-200"
                      >
                        {typeof item.category === "object"
                          ? (item.category as any)?.name
                          : item.category || "General"}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-bold text-slate-700">
                      ${Number(item.price || 0).toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <button
                        onClick={() => toggleStatus(item.id, item.status)}
                        disabled={updatingId === item.id}
                      >
                        <Badge
                          className={
                            (item.status || "AVAILABLE") === "AVAILABLE"
                              ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                              : "bg-red-50 text-red-600 hover:bg-red-100"
                          }
                        >
                          {updatingId === item.id && (
                            <Loader2 className="h-3 w-3 animate-spin mr-1" />
                          )}
                          {(item.status || "AVAILABLE").replace("_", " ")}
                        </Badge>
                      </button>
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem
                            onClick={() => openEditModal(item)}
                            className="cursor-pointer"
                          >
                            <Pencil className="h-4 w-4 mr-2" /> Edit Meal
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDelete(item.id)}
                            className="cursor-pointer text-red-600 focus:text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" /> Delete Meal
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
