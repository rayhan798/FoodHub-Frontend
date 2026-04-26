import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getOrders, getOrderById, createOrder } from "./service";
import { Order } from "./types";

export function useOrders() {
  return useQuery<Order[], Error>({
    queryKey: ["orders"],
    queryFn: getOrders,
  });
}

export function useOrder(id: string) {
  return useQuery<Order, Error>({
    queryKey: ["order", id],
    queryFn: () => getOrderById(id),
    enabled: !!id,
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createOrder,
    onSuccess: () => {
      // অর্ডার তৈরি হলে লিস্ট রিফ্রেশ করবে
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}