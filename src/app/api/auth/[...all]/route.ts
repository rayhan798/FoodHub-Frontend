import { betterAuth } from "better-auth";
import { toNextJsHandler } from "better-auth/next-js";

const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET!,

  cookie: {
    secure: process.env.NODE_ENV === "production",
  },

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

export const {
  GET,
  POST,
  PUT,
  PATCH,
  DELETE
} = toNextJsHandler(auth);

// optional
export { auth };