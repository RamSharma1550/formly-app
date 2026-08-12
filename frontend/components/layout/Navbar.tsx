"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, FileText } from "lucide-react";

export function Navbar() {
  return (
    <header className="h-16 bg-white border-b border-slate-200/80 px-6 flex items-center justify-between sticky top-0 z-30 backdrop-blur-md bg-white/90">
      <div className="flex items-center gap-3">
        <Link href="/forms" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-slate-900 font-sans">Formly</span>
            <span className="ml-1.5 text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">PRO</span>
          </div>
        </Link>
      </div>

      <nav className="flex items-center gap-4">
        <Link
          href="/forms"
          className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors px-3 py-1.5 rounded-lg hover:bg-slate-100"
        >
          <FileText className="w-4 h-4" />
          My Forms
        </Link>
        <div className="w-px h-6 bg-slate-200" />
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs border border-indigo-200">
            DC
          </div>
          <span className="text-sm font-medium text-slate-700 hidden sm:inline-block">Demo Creator</span>
        </div>
      </nav>
    </header>
  );
}
