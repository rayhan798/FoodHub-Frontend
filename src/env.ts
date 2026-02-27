import { createEnv } from "@t3-oss/env-nextjs";
import * as z from "zod";

export const env = createEnv({
  server: {
    BACKEND_URL: z.string().url({ message: "BACKEND_URL must be a valid URL" }),
    FRONTEND_URL: z.string().url({ message: "FRONTEND_URL must be a valid URL" }),
    API_URL: z.string().url({ message: "API_URL must be a valid URL" }),
    AUTH_URL: z.string().url({ message: "AUTH_URL must be a valid URL" }),
  },
  client: {
    NEXT_PUBLIC_API_URL: z.string().url(),
    NEXT_PUBLIC_TEST: z.string(),
  },
  runtimeEnv: {
    BACKEND_URL: process.env.BACKEND_URL,
    FRONTEND_URL: process.env.FRONTEND_URL,
    API_URL: process.env.API_URL,
    AUTH_URL: process.env.AUTH_URL,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_TEST: process.env.NEXT_PUBLIC_TEST,
  },
});
