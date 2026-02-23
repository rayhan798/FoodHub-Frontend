"use server";

import { cookies, headers } from "next/headers"; 
import { revalidatePath } from "next/cache";

export async function updateOrderStatusAction(orderId: string, status: string) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

    const allHeaders = await headers();

    const res = await fetch(`${apiUrl}/orders/${orderId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Cookie": allHeaders.get("cookie") || "", 
      },
      body: JSON.stringify({ status }),
      cache: "no-store",
    });

    if (res.status === 401) {
      return { success: false, error: "Unauthorized! Please login again." };
    }

    const result = await res.json();
    if (!res.ok) return { success: false, error: result.message || "Update failed" };

    revalidatePath("/provider/orders");
    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: "Connection error to server" };
  }
}