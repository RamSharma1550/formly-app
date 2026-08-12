"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { FormDetail } from "@/types/form";
import { Question, QuestionType } from "@/types/question";
import { api } from "@/lib/api";
import { QuestionList } from "@/components/builder/QuestionList";
import { QuestionEditor } from "@/components/builder/QuestionEditor";
import { LivePreview } from "@/components/builder/LivePreview";
import { SettingsTab } from "@/components/builder/SettingsTab";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import {
  ArrowLeft,
  Globe,
  Share2,
  BarChart3,
  Check,
  Eye,
  Sliders,
  Sparkles,
  Loader2,
  ExternalLink
} from "lucide-react";

export default function FormBuilderPage() {
  const params = useParams();
  const formId = Number(params.id);
  const router = useRouter();
  const toast = useToast();

  const [form, setForm] = useState<FormDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedQuestionId, setSelectedQuestionId] = useState<number | null>(null);
  const [savingQuestion, setSavingQuestion] = useState(false);
  const [activeTab, setActiveTab] = useState<"builder" | "settings">("builder");
  const [copied, setCopied] = useState(false);
  const [publishing, setPublishing] = useState(false);

  const loadForm = async () => {
    try {
      setLoading(true);
      const data = await api.getForm(formId);
      setForm(data);
      if (data.questions.length > 0) {
        setSelectedQuestionId(data.questions[0].id);
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to load form builder.");
      router.push("/forms");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (formId) {
      loadForm();
    }
  }, [formId]);

  const handleUpdateTitle = async (newTitle: string) => {
    if (!form || !newTitle.trim()) return;
    try {
      const updated = await api.updateForm(form.id, { title: newTitle.trim() });
      setForm((prev) => (prev ? { ...prev, title: updated.title } : null));
    } catch (err: any) {
      toast.error(err.message || "Failed to update title.");
    }
  };

  const DEFAULT_TITLES: Record<QuestionType, string> = {
    short_text: "What is your name?",
    long_text: "Tell us more about yourself.",
    multiple_choice: "Choose an option",
    dropdown: "Select an option from the list",
    email: "What is your email address?",
    number: "Enter a number",
    yes_no: "Would you recommend us?",
    rating: "How would you rate your experience?",
  };

  const handleAddQuestion = async (type: QuestionType) => {
    if (!form) return;
    try {
      const defaultTitle = DEFAULT_TITLES[type] || "New Question";
      const newQ = await api.createQuestion(form.id, { type, title: defaultTitle });
      setForm((prev) => (prev ? { ...prev, questions: [...prev.questions, newQ] } : null));
      setSelectedQuestionId(newQ.id);
      toast.success("Question added.");
    } catch (err: any) {
      toast.error(err.message || "Failed to add question.");
    }
  };

  const handleUpdateQuestion = async (questionId: number, updates: Partial<Question>) => {
    if (!form) return;
    try {
      setSavingQuestion(true);
      const updated = await api.updateQuestion(questionId, updates);
      setForm((prev) =>
        prev
          ? {
              ...prev,
              questions: prev.questions.map((q) => (q.id === questionId ? { ...q, ...updated } : q)),
            }
          : null
      );
    } catch (err: any) {
      toast.error(err.message || "Unable to save question.");
    } finally {
      setSavingQuestion(false);
    }
  };

  const handleDeleteQuestion = async (questionId: number) => {
    if (!form) return;
    try {
      await api.deleteQuestion(questionId);
      const remaining = form.questions.filter((q) => q.id !== questionId);
      setForm((prev) => (prev ? { ...prev, questions: remaining } : null));
      if (selectedQuestionId === questionId) {
        setSelectedQuestionId(remaining.length > 0 ? remaining[0].id : null);
      }
      toast.info("Question deleted.");
    } catch (err: any) {
      toast.error(err.message || "Failed to delete question.");
    }
  };

  const handleReorderQuestions = async (newOrderedQuestions: Question[]) => {
    if (!form) return;
    // Optimistic UI update
    setForm((prev) => (prev ? { ...prev, questions: newOrderedQuestions } : null));

    try {
      const payload = newOrderedQuestions.map((q, idx) => ({ id: q.id, order_index: idx }));
      await api.reorderQuestions(form.id, payload);
    } catch (err: any) {
      toast.error("Failed to persist reorder to server.");
      loadForm(); // Revert on failure
    }
  };

  const handlePublishToggle = async () => {
    if (!form) return;
    try {
      setPublishing(true);
      let updated: FormDetail;
      if (form.status === "published") {
        const res = await api.unpublishForm(form.id);
        updated = { ...form, ...res };
        toast.info("Form unpublished to draft.");
      } else {
        const res = await api.publishForm(form.id);
        updated = { ...form, ...res };
        toast.success("Form published live!");
      }
      setForm(updated);
    } catch (err: any) {
      toast.error(err.message || "Failed to update publish status.");
    } finally {
      setPublishing(false);
    }
  };

  const handleCopyPublicLink = () => {
    if (!form?.public_slug) return;
    const url = `${window.location.origin}/f/${form.public_slug}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success("Public link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading || !form) {
    return (
      <div className="h-screen bg-slate-50 flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-slate-900 animate-spin mb-3" />
        <p className="text-sm font-semibold text-slate-700">Loading Form Builder...</p>
      </div>
    );
  }

  const selectedQuestion = form.questions.find((q) => q.id === selectedQuestionId) || null;
  const publicUrl = form.public_slug ? `/f/${form.public_slug}` : null;

  return (
    <div className="h-screen flex flex-col bg-white overflow-hidden select-none">
      {/* Builder Header Bar */}
      <header className="h-16 border-b border-slate-200 px-6 flex items-center justify-between shrink-0 bg-white z-20">
        <div className="flex items-center gap-4">
          <Link
            href="/forms"
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            title="Back to forms"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>

          <div className="flex items-center gap-3">
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              onBlur={(e) => handleUpdateTitle(e.target.value)}
              className="text-base font-bold text-slate-900 bg-transparent border border-transparent hover:border-slate-300 focus:border-slate-900 rounded-lg px-2 py-1 focus:outline-none transition-colors"
            />
            <Badge status={form.status} />
          </div>
        </div>

        {/* Builder View Tabs */}
        <div className="hidden md:flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200/80">
          <button
            onClick={() => setActiveTab("builder")}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === "builder"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Create & Edit
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === "settings"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Settings
          </button>
        </div>

        {/* Top Actions */}
        <div className="flex items-center gap-3">
          <Link
            href={`/forms/${form.id}/responses`}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors"
          >
            <BarChart3 className="w-4 h-4 text-slate-500" />
            <span>Responses ({form.response_count || 0})</span>
          </Link>

          {form.status === "published" && publicUrl && (
            <>
              <a
                href={publicUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                <span>Test Form</span>
              </a>

              <button
                onClick={handleCopyPublicLink}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4 text-slate-500" />}
                <span className="hidden sm:inline">Share Link</span>
              </button>
            </>
          )}

          <Button
            onClick={handlePublishToggle}
            loading={publishing}
            variant={form.status === "published" ? "outline" : "primary"}
            size="sm"
            icon={<Globe className="w-3.5 h-3.5" />}
          >
            {form.status === "published" ? "Unpublish" : "Publish"}
          </Button>
        </div>
      </header>

      {/* Main Workspace Body */}
      {activeTab === "settings" ? (
        <SettingsTab form={form} onPublishToggle={handlePublishToggle} />
      ) : (
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 h-[calc(100vh-4rem)] overflow-hidden">
          {/* Left Sidebar: Question List (3 cols) */}
          <div className="md:col-span-3 h-full overflow-hidden border-r border-slate-200">
            <QuestionList
              questions={form.questions}
              selectedQuestionId={selectedQuestionId}
              onSelectQuestion={(q) => setSelectedQuestionId(q.id)}
              onAddQuestion={handleAddQuestion}
              onDeleteQuestion={handleDeleteQuestion}
              onReorderQuestions={handleReorderQuestions}
            />
          </div>

          {/* Center: Question Editor (5 cols) */}
          <div className="md:col-span-5 h-full overflow-hidden border-r border-slate-200">
            <QuestionEditor
              question={selectedQuestion}
              onUpdateQuestion={handleUpdateQuestion}
              saving={savingQuestion}
            />
          </div>

          {/* Right: Live Preview (4 cols) */}
          <div className="hidden lg:block md:col-span-4 h-full overflow-hidden">
            <LivePreview
              formTitle={form.title}
              questions={form.questions}
              selectedQuestionId={selectedQuestionId}
            />
          </div>
        </div>
      )}
    </div>
  );
}
