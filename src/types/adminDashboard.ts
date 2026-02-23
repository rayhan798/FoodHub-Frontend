import { LucideIcon } from "lucide-react";

export interface DashboardStat {
  label: string;
  value: string;
  trend: string;
  trendUp: boolean;
  icon: LucideIcon;
  color: string;
}

export interface ProviderRequest {
  id: string;
  name: string;
  owner: string;
  status: string;
}

export interface RawStat {
  label: string;
  value: string;
  trend: string;
  trendUp: boolean;
}

export interface RawProvider {
  id: string;
  restaurantName?: string;
  name?: string;
  owner?: string;
  status?: string;
  user?: {
    name?: string;
    status?: string;
  };
}