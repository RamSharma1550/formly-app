"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { api } from "@/lib/api";
import { ResponseDetail } from "@/types/response";
import { formatDate } from "@/lib/utils";
import { ArrowLeft, Loader2, Calendar } from "lucide-react";

export default function IndividualResponsePage() {
  const params = useParams();
  const formId = Number(params.id);
  const responseId = Number(params.responseId);
  const router = useRouter();

  const [response, setResponse] = useState<ResponseDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDetail() {
      try {
        setLoading(true);
        const data = await api.getResponse(formId, responseId);
        setResponse(data);
      } catch {
        router.push(`/forms/${formId}/responses`);
      } finally {
        setLoading(false);
      }
    }
    if (formId && responseId) {
      loadDetail();
    }
  }, [formId, responseId]);

  if (loading || !response) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-slate-900 animate-spin mb-3" />
        <p className="text-sm font-semibold text-slate-700">Loading Response #{responseId}...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto p-6 md:p-10 space-y-8">
        <div className="flex items-center gap-4">
          <Link
            href={`/forms/${formId}/responses`}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">Submission #{response.id}</h1>
            <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-1">
              <Calendar className="w-3.5 h-3.5" />
              Submitted on {formatDate(response.submitted_at)}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 space-y-6 shadow-sm">
          {response.answers.map((ans, idx) => (
            <div key={ans.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-sky-600 font-mono">Q{idx + 1}.</span>
                <h4 className="text-base font-bold text-slate-900">{ans.question_title}</h4>
              </div>
              <p className="text-sm text-slate-800 bg-white p-4 rounded-xl border border-slate-200 font-medium">
                {ans.answer_text ? ans.answer_text : <span className="text-slate-400 italic">No answer provided</span>}
              </p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
