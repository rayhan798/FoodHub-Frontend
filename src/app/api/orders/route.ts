import { NextResponse } from "next/server";
import { orderService } from "@/services/order.service";

export async function GET() {
  try {
    const { data, error } = await orderService.getOrders();

    if (error) {

      const errorMessage = (error as any)?.message || "Failed to fetch orders";
      
      return NextResponse.json(
        { success: false, message: errorMessage }, 
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (err) {
    const catchMessage = err instanceof Error ? err.message : "Internal Server Error";
    
    return NextResponse.json(
      { success: false, message: catchMessage }, 
      { status: 500 }
    );
  }
}