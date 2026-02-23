import { betterAuth } from "better-auth";
import { toNextJsHandler } from "better-auth/next-js";

const auth = betterAuth({

  secret: process.env.BETTER_AUTH_SECRET!,

  // 🔐 cookie config
  cookie: {
    secure: process.env.NODE_ENV === "production",
  },

  // 🧠 user fields
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "customer",
      },
    },
  },
});

const handler = toNextJsHandler(auth);

// 3. Export the handlers
export { handler as GET, handler as POST };

// (Optional) Export the auth instance for server-side session checks elsewhere
export { auth };