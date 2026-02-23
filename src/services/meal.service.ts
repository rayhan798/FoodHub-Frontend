import { env } from "@/env";

const API_URL = env.NEXT_PUBLIC_API_URL || env.API_URL;

interface ServiceOptions {
  cache?: RequestCache;
  revalidate?: number;
}

interface GetMealsParams {
  isFeatured?: boolean;
  search?: string;
  page?: string;
  limit?: string;
}

export interface Meal {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
  provider: { name: string };
  description?: string;
  isFeatured?: boolean;
  status?: "AVAILABLE" | "OUT_OF_STOCK";
}

interface ServiceResponse<T> {
  data: T | null;
  error: { message: string } | null;
}

export const mealService = {
  getMeals: async function (params?: GetMealsParams, options?: ServiceOptions): Promise<ServiceResponse<Meal[]>> {
    try {
      if (!API_URL) throw new Error("API_URL is not defined");

      const url = new URL(`${API_URL}/meals`);

      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            url.searchParams.append(key, String(value));
          }
        });
      }

      const config: RequestInit = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      if (options?.cache) config.cache = options.cache;
      if (options?.revalidate) config.next = { revalidate: options.revalidate };
      config.next = { ...config.next, tags: ["meals"] };

      if (typeof window === "undefined") {
        const { cookies } = await import("next/headers");
        const cookieStore = await cookies();
        (config.headers as Record<string, string>)["Cookie"] = cookieStore.toString();
      }

      const res = await fetch(url.toString(), config);
      const result = await res.json();

      return { data: result.data, error: null };
    } catch (err) {
      return { data: null, error: { message: "Something Went Wrong" } };
    }
  },

  getMealById: async function (id: string, options?: ServiceOptions): Promise<ServiceResponse<Meal>> {
    try {
      if (!API_URL) throw new Error("API_URL is not defined");
      
      const config: RequestInit = {
        headers: { "Content-Type": "application/json" },
      };

      if (options?.cache) config.cache = options.cache;
      if (options?.revalidate) config.next = { revalidate: options.revalidate };

      if (typeof window === "undefined") {
        const { cookies } = await import("next/headers");
        const cookieStore = await cookies();
        (config.headers as Record<string, string>)["Cookie"] = cookieStore.toString();
      }

      const res = await fetch(`${API_URL}/meals/${id}`, config);
      const result = await res.json();

      return { data: result.data, error: null };
    } catch (err) {
      return { data: null, error: { message: "Something Went Wrong" } };
    }
  },

  createMeal: async function (mealData: FormData | Partial<Meal>): Promise<ServiceResponse<Meal>> {
    try {
      if (!API_URL) throw new Error("API_URL is not defined");

      const headers: Record<string, string> = {};

      if (!(mealData instanceof FormData)) {
        headers["Content-Type"] = "application/json";
      }

      if (typeof window === "undefined") {
        const { cookies } = await import("next/headers");
        const cookieStore = await cookies();
        headers["Cookie"] = cookieStore.toString();
      }

      const res = await fetch(`${API_URL}/meals`, {
        method: "POST",
        headers,
        body: mealData instanceof FormData ? mealData : JSON.stringify(mealData),
      });

      const result = await res.json();
      return { data: result.data, error: null };
    } catch (err) {
      return { data: null, error: { message: "Something Went Wrong" } };
    }
  },

  updateMeal: async function (id: string, updateData: Partial<Meal>): Promise<ServiceResponse<Meal>> {
    try {
      if (!API_URL) throw new Error("API_URL is not defined");

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (typeof window === "undefined") {
        const { cookies } = await import("next/headers");
        const cookieStore = await cookies();
        headers["Cookie"] = cookieStore.toString();
      }

      const res = await fetch(`${API_URL}/meals/${id}`, {
        method: "PATCH",
        headers,
        body: JSON.stringify(updateData),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Failed to update");

      return { data: result.data, error: null };
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Update Failed";
      return { data: null, error: { message: errorMessage } };
    }
  },

  deleteMeal: async function (id: string): Promise<ServiceResponse<{ success: boolean }>> {
    try {
      if (!API_URL) throw new Error("API_URL is not defined");

      const headers: Record<string, string> = {};

      if (typeof window === "undefined") {
        const { cookies } = await import("next/headers");
        const cookieStore = await cookies();
        headers["Cookie"] = cookieStore.toString();
      }

      const res = await fetch(`${API_URL}/meals/${id}`, {
        method: "DELETE",
        headers,
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Failed to delete");

      return { data: result.data, error: null };
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Delete Failed";
      return { data: null, error: { message: errorMessage } };
    }
  },
};