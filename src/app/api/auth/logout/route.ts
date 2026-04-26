// src/app/api/auth/logout/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = await cookies(); // ✅ await লাগবে

  cookieStore.set("token", "", {
    maxAge: 0,
    path: "/", // 🔥 খুব important
  });

  return NextResponse.json({ success: true });
}
