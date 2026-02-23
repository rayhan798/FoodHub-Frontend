import type { ReactNode } from "react";
import Navbar from "@/components/layout/Navbar"; 
import Footer from "@/components/layout/Footer";
import { AuthProvider } from "@/features/auth/context";

export default function PublicLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <AuthProvider>
      <div className="flex min-h-screen flex-col bg-white">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-8 md:px-6">
          <div className="animate-in fade-in duration-500">
            {children}
          </div>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}