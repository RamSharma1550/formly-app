"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { api } from "@/lib/api";
import { FormDetail } from "@/types/form";
import { SubmissionSummary, ResponseDetail, FormStats } from "@/types/response";
import { ResponseTable } from "@/components/responses/ResponseTable";
import { ResponseDetailModal } from "@/components/responses/ResponseDetailModal";
import { QuestionStats } from "@/components/responses/QuestionStats";
import { useToast } from "@/components/ui/Toast";
import { ArrowLeft, BarChart3, List, Edit3, Loader2 } from "lucide-react";

export default function ResponsesPage() {
  const params = useParams();
  const formId = Number(params.id);
  const router = useRouter();
  const toast = useToast();

  const [form, setForm] = useState<FormDetail | null>(null);
  const [responses, setResponses] = useState<SubmissionSummary[]>([]);
  const [stats, setStats] = useState<FormStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"list" | "stats">("list");

  const [selectedResponse, setSelectedResponse] = useState<ResponseDetail | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const [formData, respData, statsData] = await Promise.all([
        api.getForm(formId),
        api.getResponses(formId),
        api.getStats(formId),
      ]);
      setForm(formData);
      setResponses(respData);
      setStats(statsData);
    } catch (err: any) {
      toast.error(err.message || "Failed to load responses data.");
      router.push("/forms");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (formId) {
      loadData();
    }
  }, [formId]);

  const handleViewResponseDetail = async (responseId: number) => {
    try {
      const detail = await api.getResponse(formId, responseId);
      setSelectedResponse(detail);
      setDetailModalOpen(true);
    } catch (err: any) {
      toast.error("Unable to load response details.");
    }
  };

  if (loading || !form) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-slate-900 animate-spin mb-3" />
        <p className="text-sm font-semibold text-slate-700">Loading Responses...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-10 space-y-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
          <div className="flex items-center gap-4">
            <Link
              href={`/forms/${form.id}/builder`}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
              title="Back to builder"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold text-slate-900">{form.title}</h1>
                <span className="text-xs font-bold bg-slate-200 text-slate-700 px-2.5 py-0.5 rounded-full">
                  {responses.length} Total Submissions
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">View submitted responses and question analytics.</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={`/forms/${form.id}/builder`}
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-colors"
            >
              <Edit3 className="w-4 h-4" /> Edit Builder
            </Link>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          <button
            onClick={() => setActiveTab("list")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "list"
                ? "bg-slate-900 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <List className="w-4 h-4" /> Submissions List ({responses.length})
          </button>
          <button
            onClick={() => setActiveTab("stats")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "stats"
                ? "bg-slate-900 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <BarChart3 className="w-4 h-4" /> Question Statistics
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "list" ? (
          <ResponseTable responses={responses} onViewDetail={handleViewResponseDetail} />
        ) : stats ? (
          <QuestionStats stats={stats} />
        ) : (
          <div className="p-8 text-center text-slate-500 text-sm">No statistics available.</div>
        )}
      </main>

      <ResponseDetailModal
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        response={selectedResponse}
      />
    </div>
  );
}
