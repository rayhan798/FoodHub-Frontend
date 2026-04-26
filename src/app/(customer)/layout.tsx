"use client";

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
      {/* ১. গ্লোবাল হেডার/নেভবার */}
      <header className="sticky top-0 z-50 w-full">
        <Navbar />
      </header>

      {/* ২. মেইন কন্টেন্ট এরিয়া */}
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        {/* এখানে কার্ট, চেকআউট বা অর্ডার পেজ রেন্ডার হবে */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {children}
        </div>
      </main>

      {/* ৩. গ্লোবাল ফুটার */}
      <footer className="mt-auto border-t border-slate-200">
        <Footer />
      </footer>
    </div>
  );
}