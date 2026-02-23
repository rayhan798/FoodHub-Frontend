import { useState, useEffect } from "react";
import { toast } from "sonner";
import { 
  Users, Store, DollarSign, ShoppingBag, AlertCircle, LucideIcon 
} from "lucide-react";
import { DashboardStat, ProviderRequest, RawStat, RawProvider } from "../types/adminDashboard";

const CONFIG_MAP: Record<string, { icon: LucideIcon, color: string }> = {
  "Total Revenue": { icon: DollarSign, color: "text-emerald-600" },
  "Active Customers": { icon: Users, color: "text-blue-600" },
  "Food Providers": { icon: Store, color: "text-orange-600" },
  "Total Orders": { icon: ShoppingBag, color: "text-purple-600" },
};

export function useAdminOverview() {
  const [stats, setStats] = useState<DashboardStat[]>([]);
  const [providers, setProviders] = useState<ProviderRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:5000/api/admin/overview");
        
        if (!response.ok) throw new Error("Failed to connect to the server");
        
        const result = await response.json();

        if (result.success) {
          const mappedStats: DashboardStat[] = result.data.stats.map((s: RawStat) => ({
            ...s,
            icon: CONFIG_MAP[s.label]?.icon || AlertCircle,
            color: CONFIG_MAP[s.label]?.color || "text-slate-600"
          }));

          const mappedProviders: ProviderRequest[] = (result.data.providers || []).map((p: RawProvider) => ({
            id: p.id,
            name: p.restaurantName || p.name || "Unknown Shop",
            owner: p.user?.name || p.owner || "Unknown Owner",
            status: p.status || p.user?.status || "PENDING"
          }));

          setStats(mappedStats);
          setProviders(mappedProviders);
        } else {
          toast.error(result.message || "Failed to load data");
        }
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return { stats, providers, loading };
}