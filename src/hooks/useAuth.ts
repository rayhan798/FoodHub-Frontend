import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { Roles } from "@/constants/roles";
import { useForm } from "@tanstack/react-form";
import * as z from "zod";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export function useAuth() {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const handleGoogleLogin = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: window.location.origin,
    });
  };

  const form = useForm({
    defaultValues: { email: "", password: "" },
    validators: { onSubmit: formSchema },
    onSubmit: async ({ value }) => {
      setIsPending(true);
      const toastId = toast.loading("Logging in...");
      try {
        const { data, error } = await authClient.signIn.email({ ...value });

        if (error) {
          toast.error(error.message, { id: toastId });
          return;
        }

        const userRole = (data?.user as any)?.role;
        toast.success("Logged in successfully!", { id: toastId });

        // Role-based routing logic
        switch (userRole) {
          case Roles.ADMIN:
            router.push("/admin");
            break;
          case Roles.PROVIDER:
            router.push("/provider/dashboard");
            break;
          default:
            router.push("/");
        }
      } catch (err) {
        toast.error("Something went wrong, please try again.", { id: toastId });
      } finally {
        setIsPending(false);
      }
    },
  });

  return { form, isPending, handleGoogleLogin };
}