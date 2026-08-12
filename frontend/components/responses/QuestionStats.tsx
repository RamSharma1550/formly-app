"use client";

import React from "react";
import { FormStats, QuestionStatItem } from "@/types/response";
import { Star, BarChart2, MessageSquare, CheckCircle } from "lucide-react";

interface QuestionStatsProps {
  stats: FormStats;
}

export function QuestionStats({ stats }: QuestionStatsProps) {
  if (stats.question_stats.length === 0) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 text-sm">
        No questions available for stats.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {stats.question_stats.map((qStat, idx) => (
        <div key={qStat.question_id} className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-slate-900 text-white text-xs font-bold flex items-center justify-center font-mono">
                {idx + 1}
              </span>
              <h3 className="text-base font-bold text-slate-900">{qStat.question_title}</h3>
            </div>
            <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
              {qStat.total_answers} answers
            </span>
          </div>

          {/* Multiple choice / Dropdown Stats */}
          {qStat.option_counts && (
            <div className="space-y-2.5 mt-3">
              {Object.entries(qStat.option_counts).map(([optionLabel, count]) => {
                const percentage =
                  qStat.total_answers > 0 ? Math.round((count / qStat.total_answers) * 100) : 0;

                return (
                  <div key={optionLabel} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold text-slate-700">
                      <span>{optionLabel}</span>
                      <span>
                        {count} ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div
                        className="bg-sky-500 h-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Yes / No Stats */}
          {qStat.yes_no_counts && (
            <div className="grid grid-cols-2 gap-4 mt-3">
              {Object.entries(qStat.yes_no_counts).map(([key, count]) => {
                const percentage =
                  qStat.total_answers > 0 ? Math.round((count / qStat.total_answers) * 100) : 0;
                const isYes = key.toLowerCase() === "yes";

                return (
                  <div
                    key={key}
                    className={`p-4 rounded-xl border text-center ${
                      isYes ? "bg-emerald-50 border-emerald-200" : "bg-rose-50 border-rose-200"
                    }`}
                  >
                    <span className={`text-sm font-extrabold ${isYes ? "text-emerald-700" : "text-rose-700"}`}>
                      {key}
                    </span>
                    <div className={`text-2xl font-black mt-1 ${isYes ? "text-emerald-800" : "text-rose-800"}`}>
                      {count} <span className="text-xs font-normal">({percentage}%)</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Rating Stats */}
          {qStat.question_type === "rating" && (
            <div className="flex items-center gap-4 p-4 rounded-xl bg-amber-50 border border-amber-200 mt-3">
              <Star className="w-8 h-8 text-amber-500 fill-amber-400 shrink-0" />
              <div>
                <div className="text-2xl font-black text-amber-900">
                  {qStat.rating_average ? `${qStat.rating_average} / 5` : "N/A"}
                </div>
                <p className="text-xs text-amber-700 font-medium">Average Rating Score</p>
              </div>
            </div>
          )}

          {/* Number Stats */}
          {qStat.question_type === "number" && (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 mt-3">
              <div className="text-2xl font-black text-slate-900">
                {qStat.number_average !== null && qStat.number_average !== undefined
                  ? qStat.number_average
                  : "N/A"}
              </div>
              <p className="text-xs text-slate-500 font-medium">Average Numeric Value</p>
            </div>
          )}

          {/* Text responses list */}
          {qStat.recent_answers && qStat.recent_answers.length > 0 && (
            <div className="mt-3 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Recent Answers</h4>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {qStat.recent_answers.map((ansText, i) => (
                  <div key={i} className="p-3 bg-slate-50 rounded-xl text-xs font-medium text-slate-800 border border-slate-200">
                    "{ansText}"
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
