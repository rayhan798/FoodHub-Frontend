import { betterAuth } from "better-auth";
import { toNextJsHandler } from "better-auth/next-js"; // এটি যোগ করা হয়েছে

// ১. আগে auth অবজেক্টটি কনফিগার করুন
const auth = betterAuth({
  // 🔑 secret (env থেকে)
  secret: process.env.BETTER_AUTH_SECRET!,

  // 🔐 cookie config
  cookie: {
    secure: process.env.NODE_ENV === "production",
  },

  // 🧠 user fields (role রাখার জন্য)
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

// ২. Better Auth কে Next.js এর উপযোগী হ্যান্ডলারে রূপান্তর করে এক্সপোর্ট করুন
export const { GET, POST } = toNextJsHandler(auth);