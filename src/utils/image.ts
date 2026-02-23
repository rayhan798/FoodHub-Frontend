import { env } from "@/env";

export const getImageUrl = (imagePath: string | undefined): string | undefined => {
  if (!imagePath) return undefined;
  if (imagePath.startsWith("http") || imagePath.startsWith("data:")) return imagePath;
  
  const baseUrl = env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");
  return imagePath.startsWith("uploads/")
    ? `${baseUrl}/${imagePath}`
    : `${baseUrl}/uploads/${imagePath}`;
};