"use client";

import React from "react";
import { ArrowLeft } from "lucide-react";

interface ProgressHeaderProps {
  currentIndex: number;
  totalQuestions: number;
  onPrevious: () => void;
  canGoPrevious: boolean;
}

export function ProgressHeader({
  currentIndex,
  totalQuestions,
  onPrevious,
  canGoPrevious,
}: ProgressHeaderProps) {
  const percentage = Math.round(((currentIndex + 1) / totalQuestions) * 100);

  return (
    <div className="fixed top-0 left-0 right-0 z-40 px-6 py-4 flex items-center justify-between pointer-events-none">
      <div className="pointer-events-auto">
        {canGoPrevious && (
          <button
            onClick={onPrevious}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700/60 backdrop-blur-md text-xs font-semibold transition-all"
          >
            <ArrowLeft className="w-4 h-4" /> Previous
          </button>
        )}
      </div>

      <div className="flex items-center gap-4 pointer-events-auto bg-slate-900/80 px-4 py-2 rounded-2xl border border-slate-800 backdrop-blur-md shadow-xl">
        <div className="w-24 sm:w-36 bg-slate-800 h-2 rounded-full overflow-hidden">
          <div
            className="bg-sky-500 h-full transition-all duration-300 ease-out"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <span className="text-xs font-bold text-slate-300 font-mono">
          {currentIndex + 1} / {totalQuestions}
        </span>
      </div>
    </div>
  );
}
