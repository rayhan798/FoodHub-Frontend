import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Roles } from "@/constants/roles";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import * as z from "zod";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export function useRegister() {
  const [role, setRole] = useState<string>(Roles.CUSTOMER);
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const handleGoogleLogin = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: window.location.origin,
    });
  };

  const form = useForm({
    defaultValues: { name: "", email: "", password: "" },
    validators: { onSubmit: formSchema },
    onSubmit: async ({ value }) => {
      setIsPending(true);
      const toastId = toast.loading("Creating your account...");
      try {
        const { error } = await authClient.signUp.email({
          ...value,
          role,
        } as any);

        if (error) {
          toast.error(error.message, { id: toastId });
          return;
        }

        toast.success("Account Created! Redirecting to login...", { id: toastId });
        
        // Short delay for better UX
        setTimeout(() => {
          router.push("/login");
        }, 1500);

      } catch (err) {
        toast.error("Something went wrong, please try again.", { id: toastId });
      } finally {
        setIsPending(false);
      }
    },
  });

  return { form, role, setRole, isPending, handleGoogleLogin };
}