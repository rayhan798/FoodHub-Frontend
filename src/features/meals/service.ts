import { Meal } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export async function getMeals(): Promise<Meal[]> {
  const res = await fetch(`${API_URL}/meals`);

  if (!res.ok) {
    throw new Error("Failed to fetch meals");
  }

  return res.json();
}

export async function getMealById(id: string): Promise<Meal> {
  const res = await fetch(`${API_URL}/meals/${id}`);

  if (!res.ok) {
    throw new Error("Failed to fetch meal details");
  }

  return res.json();
}

export async function getMealsByProvider(providerId: string): Promise<Meal[]> {

  const res = await fetch(`${API_URL}/providers/${providerId}/meals`);

  if (!res.ok) {
    throw new Error("Failed to fetch provider meals");
  }

  return res.json();
}