"use client";

import React from "react";
import { ResponseDetail } from "@/types/response";
import { Modal } from "@/components/ui/Modal";
import { formatDate } from "@/lib/utils";
import { Calendar, User } from "lucide-react";

interface ResponseDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  response: ResponseDetail | null;
}

export function ResponseDetailModal({ isOpen, onClose, response }: ResponseDetailModalProps) {
  if (!response) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Submission #${response.id}`}
      description={`Submitted on ${formatDate(response.submitted_at)}`}
    >
      <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-1">
        {response.answers.length === 0 ? (
          <p className="text-sm text-slate-500 italic">No answers recorded for this submission.</p>
        ) : (
          response.answers.map((ans, idx) => (
            <div key={ans.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-sky-600 font-mono">Q{idx + 1}.</span>
                <h4 className="text-sm font-bold text-slate-900">{ans.question_title}</h4>
              </div>
              <p className="text-sm text-slate-800 bg-white p-3 rounded-lg border border-slate-200 font-medium">
                {ans.answer_text ? ans.answer_text : <span className="text-slate-400 italic">No answer provided</span>}
              </p>
            </div>
          ))
        )}
      </div>
    </Modal>
  );
}
