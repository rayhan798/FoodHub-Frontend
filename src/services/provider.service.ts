export const providersService = {
  async getProviders(options?: RequestInit) {
    try {
      const res = await fetch("/api/providers", {
        method: "GET",
        ...options,
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch providers: ${res.statusText}`);
      }

      const data = await res.json();
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: error.message || "Unknown error" };
    }
  },

  async getProviderById(id: string, options?: RequestInit) {
    try {
      const res = await fetch(`/api/providers/${id}`, {
        method: "GET",
        ...options,
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch provider ${id}: ${res.statusText}`);
      }

      const data = await res.json();
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: error.message || "Unknown error" };
    }
  },
};
