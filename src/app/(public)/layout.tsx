import type { ReactNode } from "react";
import Navbar from "@/components/layout/Navbar"; // পাথ ঠিক করা হয়েছে (@ ইউজ করা ভালো)
import Footer from "@/components/layout/Footer";
import { AuthProvider } from "@/features/auth/context";

/**
 * এই লেআউটটি শুধুমাত্র হোম পেজ, মিলস পেজ এবং কাস্টমারদের জন্য।
 * এটি অ্যাডমিন বা প্রোভাইডার ড্যাশবোর্ডের সাথে কনফ্লিক্ট করবে না 
 * যদি আপনি Route Group (ফোল্ডার নামের আগে ব্র্যাকেট) ব্যবহার করেন।
 */
export default function PublicLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <AuthProvider>
      <div className="flex min-h-screen flex-col bg-white">
        {/* গ্লোবাল নেভিগেশন - এখানে শুধু পাবলিক মেম্বারদের আইটেম থাকবে */}
        <Navbar />

        {/* মেইন কন্টেন্ট এরিয়া */}
        <main className="flex-1 container mx-auto px-4 py-8 md:px-6">
          <div className="animate-in fade-in duration-500">
            {children}
          </div>
        </main>

        {/* ফুটার */}
        <Footer />
      </div>
    </AuthProvider>
  );
}