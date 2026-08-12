"use client";

import React from "react";
import { SubmissionSummary } from "@/types/response";
import { formatDate } from "@/lib/utils";
import { Eye, Calendar, UserCheck } from "lucide-react";

interface ResponseTableProps {
  responses: SubmissionSummary[];
  onViewDetail: (responseId: number) => void;
}

export function ResponseTable({ responses, onViewDetail }: ResponseTableProps) {
  if (responses.length === 0) {
    return (
      <div className="text-center py-16 px-4 bg-white rounded-2xl border border-slate-200">
        <UserCheck className="w-10 h-10 text-slate-300 mx-auto mb-3" />
        <h4 className="text-base font-bold text-slate-800">No Responses Submitted Yet</h4>
        <p className="text-xs text-slate-400 mt-1">
          Share your published form link to start collecting responses.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-6 py-4">Submission #</th>
              <th className="px-6 py-4">Primary Preview</th>
              <th className="px-6 py-4">Submitted At</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
            {responses.map((resp, idx) => (
              <tr key={resp.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="px-6 py-4 font-mono font-bold text-slate-900">
                  #{resp.id}
                </td>
                <td className="px-6 py-4 max-w-xs truncate font-medium text-slate-800">
                  {resp.primary_answer || "No response text"}
                </td>
                <td className="px-6 py-4 text-xs text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    {formatDate(resp.submitted_at)}
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => onViewDetail(resp.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-900 hover:text-white text-slate-700 text-xs font-semibold transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" /> View Answer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
