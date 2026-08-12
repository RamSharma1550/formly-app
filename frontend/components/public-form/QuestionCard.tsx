"use client";

import React from "react";
import { Question } from "@/types/question";
import { Check, ArrowRight, Star, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuestionCardProps {
  question: Question;
  index: number;
  totalQuestions: number;
  value: string;
  onChange: (val: string) => void;
  onNext: () => void;
  isLast: boolean;
  error?: string | null;
  submitting?: boolean;
}

export function QuestionCard({
  question,
  index,
  totalQuestions,
  value,
  onChange,
  onNext,
  isLast,
  error,
  submitting = false,
}: QuestionCardProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && question.type !== "long_text") {
      e.preventDefault();
      onNext();
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto px-6 py-8 flex flex-col justify-center min-h-[60vh]">
      {/* Number Badge */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-sm font-extrabold text-sky-400 tracking-wider">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="text-slate-600 font-bold">→</span>
        {question.required && (
          <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
            Required
          </span>
        )}
      </div>

      {/* Question Title */}
      <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight tracking-tight mb-3">
        {question.title}
      </h2>

      {/* Description / Help Text */}
      {question.description && (
        <p className="text-sm text-slate-400 mb-6 leading-relaxed">
          {question.description}
        </p>
      )}

      {/* Answer Control inputs */}
      <div className="mt-2 space-y-4">
        {question.type === "short_text" && (
          <input
            type="text"
            autoFocus
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your answer here..."
            className="w-full bg-slate-900/90 border-b-2 border-sky-500/80 focus:border-sky-400 px-4 py-3.5 text-lg text-white placeholder:text-slate-600 focus:outline-none transition-colors rounded-t-lg"
          />
        )}

        {question.type === "long_text" && (
          <textarea
            rows={4}
            autoFocus
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Type your detailed answer here... (Shift + Enter for new lines)"
            className="w-full bg-slate-900/90 border-2 border-slate-800 focus:border-sky-400 p-4 text-base text-white placeholder:text-slate-600 focus:outline-none transition-colors rounded-2xl resize-none"
          />
        )}

        {question.type === "email" && (
          <input
            type="email"
            autoFocus
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="name@example.com"
            className="w-full bg-slate-900/90 border-b-2 border-sky-500/80 focus:border-sky-400 px-4 py-3.5 text-lg text-white placeholder:text-slate-600 focus:outline-none transition-colors rounded-t-lg"
          />
        )}

        {question.type === "number" && (
          <input
            type="number"
            autoFocus
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="e.g. 42"
            className="w-full bg-slate-900/90 border-b-2 border-sky-500/80 focus:border-sky-400 px-4 py-3.5 text-lg text-white placeholder:text-slate-600 focus:outline-none transition-colors rounded-t-lg"
          />
        )}

        {question.type === "multiple_choice" && (
          <div className="space-y-2.5">
            {(question.options || []).map((opt, i) => {
              const selected = value === opt.value || value === opt.label;
              const keyChar = String.fromCharCode(65 + i);

              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    onChange(opt.value || opt.label);
                  }}
                  className={cn(
                    "w-full flex items-center justify-between p-4 rounded-2xl border text-left transition-all group cursor-pointer",
                    selected
                      ? "bg-sky-500/20 border-sky-400 text-white shadow-lg shadow-sky-500/10"
                      : "bg-slate-900/80 border-slate-800 text-slate-200 hover:border-slate-700 hover:bg-slate-900"
                  )}
                >
                  <div className="flex items-center gap-3.5">
                    <span
                      className={cn(
                        "w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center border transition-colors",
                        selected
                          ? "bg-sky-500 text-slate-950 border-sky-400"
                          : "bg-slate-800 text-slate-400 border-slate-700 group-hover:text-white"
                      )}
                    >
                      {keyChar}
                    </span>
                    <span className="text-base font-medium">{opt.label}</span>
                  </div>
                  {selected && <Check className="w-5 h-5 text-sky-400 shrink-0" />}
                </button>
              );
            })}
          </div>
        )}

        {question.type === "dropdown" && (
          <div className="relative">
            <select
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="w-full bg-slate-900/90 border-2 border-slate-800 focus:border-sky-400 text-white p-4 rounded-2xl text-base font-semibold appearance-none cursor-pointer focus:outline-none"
            >
              <option value="" disabled>
                Select an option...
              </option>
              {(question.options || []).map((opt, i) => (
                <option key={i} value={opt.value || opt.label} className="bg-slate-900 text-white">
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {question.type === "yes_no" && (
          <div className="grid grid-cols-2 gap-4">
            {["Yes", "No"].map((choice) => {
              const selected = value.toLowerCase() === choice.toLowerCase();
              return (
                <button
                  key={choice}
                  type="button"
                  onClick={() => onChange(choice)}
                  className={cn(
                    "p-5 rounded-2xl border text-center font-extrabold text-lg transition-all cursor-pointer",
                    selected
                      ? "bg-sky-500/20 border-sky-400 text-white shadow-lg shadow-sky-500/10"
                      : "bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900"
                  )}
                >
                  {choice}
                </button>
              );
            })}
          </div>
        )}

        {question.type === "rating" && (
          <div className="flex items-center justify-between gap-2 sm:gap-3">
            {[1, 2, 3, 4, 5].map((ratingNum) => {
              const selected = value === String(ratingNum);
              return (
                <button
                  key={ratingNum}
                  type="button"
                  onClick={() => onChange(String(ratingNum))}
                  className={cn(
                    "flex-1 h-14 sm:h-16 rounded-2xl border font-extrabold text-lg sm:text-xl flex items-center justify-center transition-all cursor-pointer",
                    selected
                      ? "bg-amber-500/20 border-amber-400 text-amber-300 shadow-lg shadow-amber-500/10 scale-105"
                      : "bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white"
                  )}
                >
                  {ratingNum}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Validation Error Message */}
      {error && (
        <div className="mt-3 flex items-center gap-2 text-rose-400 text-xs font-semibold animate-fade-in bg-rose-500/10 p-3 rounded-xl border border-rose-500/20">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Next / Submit Button Action */}
      <div className="mt-8 flex items-center gap-4">
        <button
          type="button"
          onClick={onNext}
          disabled={submitting}
          className="px-6 py-3 bg-sky-500 text-slate-950 hover:bg-sky-400 font-extrabold text-sm rounded-xl flex items-center gap-2 shadow-lg shadow-sky-500/20 transition-all cursor-pointer active:scale-95 disabled:opacity-50"
        >
          {submitting ? (
            <span>Submitting...</span>
          ) : isLast ? (
            <>
              <span>Submit</span>
              <Check className="w-4 h-4" />
            </>
          ) : (
            <>
              <span>OK</span>
              <Check className="w-4 h-4" />
            </>
          )}
        </button>

        <span className="text-xs text-slate-500 font-medium hidden sm:inline-block">
          Press <kbd className="px-1.5 py-0.5 bg-slate-900 border border-slate-800 text-slate-300 rounded font-mono text-[10px]">Enter ↵</kbd>
        </span>
      </div>
    </div>
  );
}
