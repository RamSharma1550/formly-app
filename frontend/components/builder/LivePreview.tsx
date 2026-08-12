"use client";

import React, { useState } from "react";
import { Question } from "@/types/question";
import { Star, Check, ArrowRight } from "lucide-react";

interface LivePreviewProps {
  formTitle: string;
  questions: Question[];
  selectedQuestionId: number | null;
}

export function LivePreview({ formTitle, questions, selectedQuestionId }: LivePreviewProps) {
  const activeQuestion = questions.find((q) => q.id === selectedQuestionId) || questions[0];

  if (!activeQuestion) {
    return (
      <div className="w-full h-full bg-slate-900 text-slate-400 flex flex-col items-center justify-center p-6 text-center">
        <p className="text-sm font-medium">Live Preview Panel</p>
        <p className="text-xs text-slate-500 mt-1">Add a question to preview the respondent view.</p>
      </div>
    );
  }

  const currentIndex = questions.findIndex((q) => q.id === activeQuestion.id);
  const total = questions.length;

  return (
    <div className="w-full h-full bg-slate-950 text-white flex flex-col justify-between p-6 overflow-hidden relative selection:bg-sky-500 selection:text-white">
      {/* Top Header Mockup */}
      <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800/80 pb-4">
        <span className="font-bold tracking-wider text-slate-300 uppercase truncate max-w-[180px]">
          {formTitle || "Untitled form"}
        </span>
        <span className="bg-slate-800 px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wider text-sky-400">
          PREVIEW MODE
        </span>
      </div>

      {/* Center Question View */}
      <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full py-8">
        {/* Question Counter */}
        <div className="flex items-center gap-2 mb-3 text-sky-400 font-semibold text-xs tracking-wider">
          <span>{String(currentIndex + 1).padStart(2, "0")}</span>
          <span className="text-slate-600">/</span>
          <span className="text-slate-500">{String(total).padStart(2, "0")}</span>
          {activeQuestion.required && (
            <span className="ml-2 text-[10px] bg-rose-500/20 text-rose-300 px-1.5 py-0.5 rounded uppercase font-bold">
              Required
            </span>
          )}
        </div>

        {/* Question Title */}
        <h3 className="text-xl font-extrabold text-slate-50 mb-2 leading-snug">
          {activeQuestion.title || "Untitled Question"}
        </h3>

        {/* Description */}
        {activeQuestion.description && (
          <p className="text-xs text-slate-400 mb-6 leading-relaxed">
            {activeQuestion.description}
          </p>
        )}

        {/* Question Inputs Mockup */}
        <div className="mt-2 space-y-4">
          {activeQuestion.type === "short_text" && (
            <input
              type="text"
              disabled
              placeholder="Type your answer here..."
              className="w-full bg-slate-900 border-b-2 border-sky-500 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none"
            />
          )}

          {activeQuestion.type === "long_text" && (
            <textarea
              rows={3}
              disabled
              placeholder="Type your answer here..."
              className="w-full bg-slate-900 border-b-2 border-sky-500 p-4 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none resize-none rounded-t-lg"
            />
          )}

          {activeQuestion.type === "email" && (
            <input
              type="email"
              disabled
              placeholder="name@example.com"
              className="w-full bg-slate-900 border-b-2 border-sky-500 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none"
            />
          )}

          {activeQuestion.type === "number" && (
            <input
              type="number"
              disabled
              placeholder="42"
              className="w-full bg-slate-900 border-b-2 border-sky-500 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none"
            />
          )}

          {activeQuestion.type === "multiple_choice" && (
            <div className="space-y-2">
              {(activeQuestion.options || []).map((opt, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800 text-sm font-medium text-slate-200"
                >
                  <span className="w-6 h-6 rounded-lg bg-slate-800 text-xs text-sky-400 font-bold flex items-center justify-center border border-slate-700">
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span>{opt.label}</span>
                </div>
              ))}
            </div>
          )}

          {activeQuestion.type === "dropdown" && (
            <select disabled className="w-full bg-slate-900 border border-slate-800 text-slate-300 p-3 rounded-xl text-sm font-medium">
              <option>Select an option...</option>
              {(activeQuestion.options || []).map((opt, i) => (
                <option key={i}>{opt.label}</option>
              ))}
            </select>
          )}

          {activeQuestion.type === "yes_no" && (
            <div className="grid grid-cols-2 gap-3">
              <button disabled className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-sm font-bold text-slate-200 hover:border-sky-500">
                Yes
              </button>
              <button disabled className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-sm font-bold text-slate-200 hover:border-sky-500">
                No
              </button>
            </div>
          )}

          {activeQuestion.type === "rating" && (
            <div className="flex items-center justify-between gap-2">
              {[1, 2, 3, 4, 5].map((num) => (
                <button
                  key={num}
                  disabled
                  className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 font-bold text-sm flex items-center justify-center hover:border-amber-400 hover:text-amber-400"
                >
                  {num}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Enter key hint button mockup */}
        <div className="mt-8 flex items-center gap-3">
          <button disabled className="px-5 py-2.5 bg-sky-500 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-2 shadow-lg shadow-sky-500/20">
            <span>OK</span>
            <Check className="w-4 h-4" />
          </button>
          <span className="text-[11px] text-slate-500 font-medium">Press Enter ↵</span>
        </div>
      </div>

      {/* Footer mockup progress bar */}
      <div className="border-t border-slate-800/80 pt-4 flex items-center justify-between text-[11px] text-slate-500">
        <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden mr-4">
          <div
            className="bg-sky-500 h-full transition-all duration-300"
            style={{ width: `${Math.round(((currentIndex + 1) / total) * 100)}%` }}
          />
        </div>
        <span className="shrink-0 font-medium">{Math.round(((currentIndex + 1) / total) * 100)}%</span>
      </div>
    </div>
  );
}
