import { getToken } from "./auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

interface FetchOptions extends RequestInit {
  token?: string;
}

export async function apiFetch<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { token: customToken, headers, ...rest } = options;

  const token = customToken || getToken();

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...headers,
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => null);
    if (res.status === 401 && typeof window !== "undefined") {
    }
    throw new Error(error?.message || "Something went wrong with the API");
  }

  return res.json();
}