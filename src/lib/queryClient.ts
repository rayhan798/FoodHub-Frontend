import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // ৫ মিনিট পর্যন্ত ডাটা ফ্রেশ থাকবে
      retry: 1, // একবার রিট্রাই করবে যদি ফেইল হয়
      refetchOnWindowFocus: false, // অন্য ট্যাবে গিয়ে ফিরে আসলে অটো রিফ্রেস হবে না
     
    },
    mutations: {
      retry: 0, // মিউটেশন (POST/PUT/DELETE) ফেইল হলে অটো রিট্রাই করবে না
    },
  },
});