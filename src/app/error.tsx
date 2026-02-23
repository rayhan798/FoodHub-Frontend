"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCcw, Home } from "lucide-react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application Error:", error);
  }, [error]);

  const handleReset = () => {
    reset();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4 overflow-hidden relative">
      
      {/* Background Decorative Circles */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none -z-10 opacity-30">
        <div className="absolute top-1/4 left-10 w-24 h-24 bg-orange-200 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-10 w-32 h-32 bg-blue-200 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ 
          type: "spring", 
          stiffness: 260, 
          damping: 20,
          delay: 0.1 
        }}
        className="relative mb-8"
      >
        <div className="h-32 w-32 bg-orange-100 rounded-full flex items-center justify-center shadow-2xl shadow-orange-200 border-4 border-white">
          <AlertTriangle className="h-16 w-16 text-orange-600" />
        </div>
        
        {/* Floating Emojis */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-2 -right-2 bg-white p-2 rounded-full shadow-md text-xl"
        >
          🍕
        </motion.div>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-2 -left-2 bg-white p-2 rounded-full shadow-md text-xl"
        >
          🍔
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-center space-y-4 max-w-md"
      >
        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
          Oops! Something went wrong.
        </h2>
        <p className="text-slate-500 text-lg leading-relaxed">
          Don&apos;t worry, it&apos;s likely a temporary glitch. Our chefs are working hard to fix it! 👨‍🍳
        </p>
        
        {/* Optional: Error ID (Digest) for tracking */}
        {error.digest && (
          <p className="text-[10px] text-slate-300 font-mono mt-2 uppercase tracking-widest">
            Error ID: {error.digest}
          </p>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="flex flex-col sm:flex-row gap-4 mt-10"
      >
        <Button
          onClick={handleReset}
          size="lg"
          className="bg-orange-600 hover:bg-orange-700 text-white rounded-2xl px-8 h-12 shadow-lg shadow-orange-200 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
        >
          <RefreshCcw className="h-4 w-4" /> Try Again
        </Button>

        <Button
          variant="outline"
          size="lg"
          asChild
          className="rounded-2xl px-8 h-12 border-slate-200 hover:bg-slate-100 flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
        >
          <Link href="/">
            <Home className="h-4 w-4" /> Back to Home
          </Link>
        </Button>
      </motion.div>

      {/* Developer Context (Only visible during local development) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-12 p-4 bg-red-50 border border-red-100 rounded-lg max-w-2xl overflow-auto">
          <p className="text-red-600 text-xs font-mono">{error.message}</p>
        </div>
      )}
    </div>
  );
}