import { cookies } from "next/headers";
import { env } from "@/env";

export async function createOrderAction(orderData: {
  mealId: string;
  quantity: number;
  address: string;
}) {
  try {
    const cookieStore = await cookies();

    const cookieHeader = cookieStore
      .getAll()
      .map((c) => `${c.name}=${c.value}`)
      .join("; ");

    const res = await fetch(`${env.API_URL}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader,
      },
      body: JSON.stringify(orderData),
      cache: "no-store",
    });

    const result = await res.json();

    if (!res.ok) {
      return {
        success: false,
        error: result.message || "Failed",
      };
    }

    return {
      success: true,
      data: result.data,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message,
    };
  }
}