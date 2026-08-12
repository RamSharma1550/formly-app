"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import { FormDetail } from "@/types/form";
import { PublicFormView } from "@/components/public-form/PublicFormView";
import { Loader2, GlobeLock, Sparkles } from "lucide-react";
import Link from "next/link";

export default function PublicFormPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [form, setForm] = useState<FormDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPublicForm() {
      if (!slug) return;
      try {
        setLoading(true);
        setError(null);
        const data = await api.getPublicForm(slug);
        setForm(data);
      } catch (err: any) {
        setError(err.message || "This form is unavailable or not published.");
      } finally {
        setLoading(false);
      }
    }
    loadPublicForm();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6">
        <Loader2 className="w-8 h-8 text-sky-400 animate-spin mb-3" />
        <p className="text-sm font-semibold text-slate-300">Loading Form...</p>
      </div>
    );
  }

  if (error || !form) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 text-slate-400 flex items-center justify-center mb-4">
          <GlobeLock className="w-8 h-8 text-amber-400" />
        </div>
        <h1 className="text-2xl font-extrabold mb-2">Form Unavailable</h1>
        <p className="text-slate-400 text-sm max-w-sm mb-6">
          {error || "The form you are looking for does not exist or has been set to draft mode."}
        </p>
        <Link
          href="/forms"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-semibold hover:text-white transition-colors"
        >
          <Sparkles className="w-4 h-4 text-sky-400" /> Go to Creator Dashboard
        </Link>
      </div>
    );
  }

  return <PublicFormView form={form} />;
}
