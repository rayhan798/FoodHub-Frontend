import { env } from "@/env";
import { UserStatus, ApiResponse } from "../types/adminUsers";

const BASE_URL = `${env.NEXT_PUBLIC_API_URL}/admin/users`;

export const userService = {
  async getAll(): Promise<ApiResponse> {
    const res = await fetch(BASE_URL, { credentials: "include" });
    return res.json();
  },

  async updateStatus(userId: string, status: UserStatus): Promise<ApiResponse> {
    const res = await fetch(`${BASE_URL}/${userId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
      credentials: "include",
    });
    return res.json();
  }
};