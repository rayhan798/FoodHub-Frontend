"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { UtensilsCrossed, ArrowLeft, Home } from "lucide-react";
import { useRouter } from "next/navigation"; 

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 text-center overflow-hidden">
 
      <motion.div
        initial={{ y: 0 }}
        animate={{ y: [-20, 0, -20] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="relative mb-8"
      >
        <div className="h-32 w-32 bg-orange-100 rounded-full flex items-center justify-center shadow-xl shadow-orange-100/50 border-4 border-white">
          <UtensilsCrossed className="h-16 w-16 text-orange-600" />
        </div>

        <motion.div 
          animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute -top-1 -right-1 h-5 w-5 bg-orange-500 rounded-full border-2 border-white"
        />
        <motion.div 
          animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
          className="absolute bottom-2 -left-2 h-4 w-4 bg-orange-300 rounded-full border-2 border-white"
        />
      </motion.div>

      {/* 404 Text Animation with subtle pulse */}
      <motion.h1
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-[10rem] md:text-[12rem] font-black text-slate-200/60 select-none leading-none"
      >
        404
      </motion.h1>

      {/* Content Section */}
      <div className="relative -mt-16 md:-mt-20 space-y-4 px-2">
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight"
        >
          Oops! Hungry for a dead link?
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-slate-500 max-w-md mx-auto text-lg leading-relaxed"
        >
          This page seems to have been removed from our menu. Let&apos;s get you back to something delicious!
        </motion.p>
      </div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-10 flex flex-col sm:flex-row gap-4 items-center"
      >
        <Button
          asChild
          size="lg"
          className="bg-orange-600 hover:bg-orange-700 text-white px-10 rounded-2xl font-bold shadow-lg shadow-orange-200 transition-all hover:scale-105 active:scale-95 flex items-center h-12"
        >
          <Link href="/">
            <Home className="mr-2 h-5 w-5" /> Back to Home
          </Link>
        </Button>
        
        <Button
          variant="outline"
          size="lg"
          onClick={() => router.back()} 
          className="rounded-2xl px-10 border-slate-200 hover:bg-slate-100 transition-all hover:scale-105 active:scale-95 h-12 flex items-center"
        >
          <ArrowLeft className="mr-2 h-5 w-5" /> Go Back
        </Button>
      </motion.div>

      {/* Subtle background branding */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ delay: 0.8 }}
        className="absolute bottom-10 flex items-center gap-2 select-none"
      >
        <span className="font-black tracking-tighter text-2xl text-slate-400">Food<span className="text-orange-500">Hub</span></span>
      </motion.div>
    </div>
  );
}