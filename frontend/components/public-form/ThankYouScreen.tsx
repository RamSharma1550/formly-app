"use client";

import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Sparkles } from "lucide-react";

export function ThankYouScreen() {
  return (
    <div className="fixed inset-0 z-50 bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center select-none">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="w-20 h-20 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mb-6 shadow-2xl shadow-emerald-500/20"
      >
        <CheckCircle2 className="w-10 h-10" />
      </motion.div>

      <motion.h1
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-3"
      >
        Thank You!
      </motion.h1>

      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.3 }}
        className="text-slate-400 text-sm sm:text-base max-w-md mb-8"
      >
        Your response has been submitted successfully. We appreciate your time and feedback!
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.3 }}
        className="flex items-center gap-2 text-xs text-slate-500 font-medium px-4 py-2 rounded-full border border-slate-800 bg-slate-900"
      >
        <Sparkles className="w-4 h-4 text-amber-400" />
        Powered by Formly
      </motion.div>
    </div>
  );
}
