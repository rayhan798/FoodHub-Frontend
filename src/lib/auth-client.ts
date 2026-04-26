import { createAuthClient } from "better-auth/react";

// ✅ বিল্ড এবং রানটাইম উভয় ক্ষেত্রেই Absolute URL নিশ্চিত করার ফাংশন
const getBaseUrl = () => {
  // ✅ FIRST PRIORITY → backend API URL (FIXED)
  if (process.env.NEXT_PUBLIC_API_URL) {
    return `${process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "")}/auth`;
  }

  // ❗ fallback (local dev)
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return `${process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "")}/api/auth`;
  }
  
  if (typeof window !== "undefined") {
    return `${window.location.origin}/api/auth`;
  }

  // বিল্ড টাইম fallback
  return "http://localhost:3000/api/auth";
};

export const authClient = createAuthClient({
  baseURL: getBaseUrl(),
  fetchOptions: {
    // এটি ক্রস-ডোমেইন সেশন এবং কুকি হ্যান্ডেল করার জন্য অত্যন্ত জরুরি
    credentials: "include",
  },
  plugins: [
    {
      id: "next-cookies-request",
      fetchPlugins: [
        {
          id: "next-cookies-request-plugin",
          name: "next-cookies-request-plugin",
          hooks: {
            async onRequest(ctx) {
              // সার্ভার সাইড (SSR/Actions) থেকে কল হলে কুকিগুলো ম্যানুয়ালি ইনজেক্ট করবে
              if (typeof window === "undefined") {
                const { cookies } = await import("next/headers");
                const cookieStore = await cookies();
                ctx.headers.set("cookie", cookieStore.toString());
              }
              return ctx;
            },
          },
        },
      ],
    },
  ],
});

// গুগল সাইন-ইন হেল্পার ফাংশন
export const signInWithGoogle = async () => {
  return await authClient.signIn.social({
    provider: "google",
    callbackURL: `${
      process.env.NEXT_PUBLIC_APP_URL ||
      (typeof window !== "undefined" ? window.location.origin : "")
    }/private`,
  });
};