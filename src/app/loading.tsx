"use client";

import { motion } from "framer-motion";
import { UtensilsCrossed } from "lucide-react";

export default function Loading() {
  return (
    <div 
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm"
      role="alert" 
      aria-busy="true" 
      aria-label="Loading FoodHub content"
    >
      {/* 1. Logo Animation with Glow */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ 
          scale: [1, 1.1, 1],
          rotate: [0, 5, -5, 0],
          opacity: 1 
        }}
        transition={{ 
          duration: 2, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
        className="relative flex items-center justify-center"
      >
        {/* Background Glow Effect */}
        <div className="absolute h-28 w-28 bg-orange-400 rounded-full blur-[40px] opacity-20 animate-pulse" />
        
        <div className="relative bg-orange-600 p-5 rounded-[2rem] shadow-2xl shadow-orange-200 border-4 border-white">
          <UtensilsCrossed className="h-12 w-12 text-white" />
        </div>
      </motion.div>

      {/* 2. Brand Name & Dots Animation */}
      <motion.div 
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mt-8 flex flex-col items-center"
      >
        <h1 className="text-3xl font-black tracking-tighter text-slate-900">
          Food<span className="text-orange-600">Hub</span>
        </h1>
        
        {/* Dots Loading Animation */}
        <div className="flex gap-1.5 mt-3">
          {[0, 1, 2].map((dot) => (
            <motion.div
              key={dot}
              animate={{ 
                scale: [1, 1.5, 1],
                opacity: [0.3, 1, 0.3] 
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: dot * 0.2,
              }}
              className="h-2 w-2 bg-orange-600 rounded-full"
            />
          ))}
        </div>
      </motion.div>

      {/* 3. Dynamic Text Message */}
      <motion.p
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2.5, repeat: Infinity }}
        className="mt-6 text-sm font-semibold text-slate-500 uppercase tracking-widest"
      >
        Preparing your experience...
      </motion.p>
      
      {/* 4. Elegant Progress Bar */}
      <div className="mt-8 w-56 h-1 bg-slate-100 rounded-full overflow-hidden relative">
        <motion.div 
          initial={{ left: "-100%" }}
          animate={{ left: "100%" }}
          transition={{ 
            duration: 1.8, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="absolute h-full w-1/2 bg-gradient-to-r from-transparent via-orange-500 to-transparent"
        />
      </div>

      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 5 }} 
        className="absolute bottom-10 text-xs text-slate-400 text-center px-6"
      >
        Taking too long? Check your internet connection.
      </motion.p>
    </div>
  );
}