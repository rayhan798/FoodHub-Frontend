import { useQuery } from "@tanstack/react-query";
import {
  getMeals,
  getMealById,
  getMealsByProvider,
} from "./service";
import { Meal } from "./types";

export function useMeals() {
  return useQuery<Meal[], Error>({
    queryKey: ["meals"],
    queryFn: getMeals,
  });
}

export function useMeal(id: string) {
  return useQuery<Meal, Error>({
    queryKey: ["meal", id],
    queryFn: () => getMealById(id),
    enabled: !!id,
  });
}

export function useProviderMeals(providerId: string) {
  return useQuery<Meal[], Error>({
    queryKey: ["provider-meals", providerId],
    queryFn: () => getMealsByProvider(providerId),
    enabled: !!providerId,
  });
}