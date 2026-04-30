"use server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function updateOrderStatusAction(
  orderId: string,
  status: string
) {
  try {
    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

    const cookieStore = await cookies();

    const cookieHeader = cookieStore
      .getAll()
      .map((c) => `${c.name}=${c.value}`)
      .join("; ");

    console.log("COOKIE SENT:", cookieHeader); 

    const res = await fetch(`${apiUrl}/orders/${orderId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader,
      },
      body: JSON.stringify({ status }),
      cache: "no-store",
    });

    const result = await res.json();

    console.log("STATUS UPDATE RESULT:", result); 

    if (res.status === 401) {
      return {
        success: false,
        error: "Unauthorized! Please login again.",
      };
    }

    if (!res.ok) {
      return {
        success: false,
        error: result.message || "Update failed",
      };
    }

    revalidatePath("/provider/orders");

    return { success: true };
  } catch (err) {
    console.error("STATUS UPDATE ERROR:", err);

    return {
      success: false,
      error: "Connection error to server",
    };
  }
}