import React from "react";
import Navbar from "../../components/layout/Navbar"; 
import Footer from "../../components/layout/Footer"; 

export default function CartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <header className="sticky top-0 z-50 w-full">
        <Navbar />
      </header>

      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {children}
        </div>
      </main>

      <footer className="mt-auto border-t border-slate-200">
        <Footer />
      </footer>
    </div>
  );
}