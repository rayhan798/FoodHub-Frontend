import { createAuthClient } from "better-auth/react";

const getBaseUrl = () => {
  if (typeof window !== "undefined") {
    return `${window.location.origin}/api/auth`;
  }
  return `${(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000").replace(/\/$/, "")}/api/auth`;
};

export const authClient = createAuthClient({
  baseURL: getBaseUrl(),
  fetchOptions: {
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
              if (typeof window === "undefined") {
                try {
                  const { cookies } = await import("next/headers");
                  const cookieStore = await cookies();
                  ctx.headers.set("cookie", cookieStore.toString());
                } catch (e) {
                  console.error("Error accessing cookies in server-side:", e);
                }
              }
              return ctx;
            },
          },
        },
      ],
    },
  ],
});

export const signInWithGoogle = async () => {
  const callbackPath = "/profile";
  
  return await authClient.signIn.social({
    provider: "google",
    callbackURL: `${
      process.env.NEXT_PUBLIC_APP_URL || 
      (typeof window !== "undefined" ? window.location.origin : "")
    }${callbackPath}`,
  });
};