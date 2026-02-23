import { useMutation } from "@tanstack/react-query";
import { login, register } from "./service";
import { AuthResponse, LoginPayload, RegisterPayload } from "./types";

export function useLogin() {
  return useMutation<AuthResponse, Error, LoginPayload>({
    mutationFn: login,
  });
}

export function useRegister() {
  return useMutation<AuthResponse, Error, RegisterPayload>({
    mutationFn: register,
  });
}