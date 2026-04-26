import { getToken } from "./auth";

const API_URL =
  (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api").replace(/\/$/, "");

interface FetchOptions extends RequestInit {
  token?: string;
}

export async function apiFetch<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { token: customToken, headers, ...rest } = options;

  // অটোমেটিক টোকেন ম্যানেজমেন্ট
  const token = customToken || getToken();

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...rest,

    // ✅ VERY IMPORTANT (Better Auth / cookie support)
    credentials: "include",

    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...headers,
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => null);

    // যদি টোকেন এক্সপায়ার হয়ে যায় (401), তাহলে লগআউট করানো ভালো
    if (res.status === 401 && typeof window !== "undefined") {
      // window.location.href = "/login";
    }

    throw new Error(error?.message || "Something went wrong with the API");
  }

  return res.json();
}