// src/app/api/orders/route.ts
import { NextResponse } from "next/server";
import { orderService } from "@/services/order.service";

export async function GET() {
  try {
    // আপনার সার্ভিস থেকে ডাটা ফেচ করা
    const { data, error } = await orderService.getOrders();

    if (error) {
      return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err) {
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}