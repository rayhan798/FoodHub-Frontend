"use server";

import { cookies } from "next/headers";
import { revalidateTag } from "next/cache";
import { env } from "@/env";

export async function createOrderAction(orderData: { 
  mealId: string; 
  quantity: number; 
  address: string 
}) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value; 

    const res = await fetch(`${env.API_URL}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cookie": cookieStore.toString(), 
      },
      body: JSON.stringify(orderData),
    });

    const result = await res.json();

    if (!res.ok) {
      return { error: result.message || "Failed to create order", success: false };
    }

    revalidateTag("orders", "default");
    
    return { data: result.data, success: true };
  } catch (err: any) {
    return { error: err.message || "Connection failed", success: false };
  }
}