import { NextRequest, NextResponse } from "next/server";
import { userService } from "./services/user.service";
import { Roles } from "./constants/roles";

// ✅ ফাংশনের নাম 'middleware' থেকে পরিবর্তন করে 'proxy' করুন
export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // ১. API রুটগুলোকে প্রক্সি থেকে ছাড় দিন (ডাটা শো না হওয়ার প্রধান সমাধান)
  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  let isAuthenticated = false;
  let isAdmin = false;
  let isProvider = false;

  const { data } = await userService.getSession();

  if (data?.user) {
    isAuthenticated = true;
    isAdmin = data.user.role === Roles.ADMIN;
    isProvider = data.user.role === Roles.PROVIDER;
  }

  //* User is not authenticated at all
  if (!isAuthenticated) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  //* Admin logic: Admin can only visit admin routes
  if (isAdmin && !pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  //* Provider logic: Provider can only visit provider routes
  if (isProvider && !pathname.startsWith("/provider")) {
    return NextResponse.redirect(new URL("/provider/dashboard", request.url));
  }

  //* Customer logic: Customer cannot visit admin or provider routes
  if (!isAdmin && !isProvider && (pathname.startsWith("/admin") || pathname.startsWith("/provider"))) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

// ✅ কনফিগারেশন আগের মতোই থাকবে
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/cart",
    "/checkout",
    "/orders/:path*",
    "/profile",
    "/provider/:path*",
    "/admin/:path*",
  ],
};