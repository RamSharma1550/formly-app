"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Form } from "@/types/form";
import { Badge } from "@/components/ui/Badge";
import { formatRelativeTime } from "@/lib/utils";
import { useToast } from "@/components/ui/Toast";
import {
  MoreVertical,
  Edit3,
  Copy,
  Trash2,
  ExternalLink,
  BarChart3,
  Globe,
  GlobeLock,
  Share2,
  Check
} from "lucide-react";

interface FormCardProps {
  form: Form;
  onRename: (form: Form) => void;
  onDuplicate: (formId: number) => void;
  onDelete: (form: Form) => void;
  onPublishToggle: (form: Form) => void;
}

export function FormCard({ form, onRename, onDuplicate, onDelete, onPublishToggle }: FormCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const toast = useToast();

  const publicUrl = typeof window !== "undefined" && form.public_slug
    ? `${window.location.origin}/f/${form.public_slug}`
    : `/f/${form.public_slug}`;

  const copyShareLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!form.public_slug) return;
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    toast.success("Public link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
    setMenuOpen(false);
  };

  return (
    <div className="group relative bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-2.5">
            <Badge status={form.status} />
            <span className="text-xs text-slate-500 font-medium">
              Updated {formatRelativeTime(form.updated_at)}
            </span>
          </div>

          {/* Action Menu dropdown */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <MoreVertical className="w-5 h-5" />
            </button>

            {menuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 mt-1 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-20 text-sm font-medium text-slate-700 animate-fade-in">
                  <Link
                    href={`/forms/${form.id}/builder`}
                    className="flex items-center gap-2 px-4 py-2 hover:bg-slate-50 transition-colors"
                    onClick={() => setMenuOpen(false)}
                  >
                    <Edit3 className="w-4 h-4 text-slate-500" /> Edit Builder
                  </Link>
                  <Link
                    href={`/forms/${form.id}/responses`}
                    className="flex items-center gap-2 px-4 py-2 hover:bg-slate-50 transition-colors"
                    onClick={() => setMenuOpen(false)}
                  >
                    <BarChart3 className="w-4 h-4 text-slate-500" /> View Responses
                  </Link>
                  <button
                    onClick={() => { setMenuOpen(false); onRename(form); }}
                    className="w-full flex items-center gap-2 px-4 py-2 hover:bg-slate-50 text-left transition-colors"
                  >
                    <Edit3 className="w-4 h-4 text-slate-500" /> Rename
                  </button>
                  <button
                    onClick={() => { setMenuOpen(false); onDuplicate(form.id); }}
                    className="w-full flex items-center gap-2 px-4 py-2 hover:bg-slate-50 text-left transition-colors"
                  >
                    <Copy className="w-4 h-4 text-slate-500" /> Duplicate
                  </button>
                  <button
                    onClick={() => { setMenuOpen(false); onPublishToggle(form); }}
                    className="w-full flex items-center gap-2 px-4 py-2 hover:bg-slate-50 text-left transition-colors"
                  >
                    {form.status === "published" ? (
                      <>
                        <GlobeLock className="w-4 h-4 text-amber-500" /> Unpublish
                      </>
                    ) : (
                      <>
                        <Globe className="w-4 h-4 text-emerald-500" /> Publish Form
                      </>
                    )}
                  </button>
                  {form.status === "published" && (
                    <button
                      onClick={copyShareLink}
                      className="w-full flex items-center gap-2 px-4 py-2 hover:bg-slate-50 text-left transition-colors"
                    >
                      {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4 text-slate-500" />}
                      Copy Public Link
                    </button>
                  )}
                  <div className="my-1 border-t border-slate-100" />
                  <button
                    onClick={() => { setMenuOpen(false); onDelete(form); }}
                    className="w-full flex items-center gap-2 px-4 py-2 hover:bg-rose-50 text-rose-600 text-left transition-colors"
                  >
                    <Trash2 className="w-4 h-4" /> Delete Form
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        <Link href={`/forms/${form.id}/builder`} className="block group-hover:text-brand-600 transition-colors">
          <h3 className="text-lg font-bold text-slate-900 line-clamp-1 mb-1.5">{form.title}</h3>
          <p className="text-sm text-slate-500 line-clamp-2 min-h-[2.5rem]">
            {form.description || "No description provided."}
          </p>
        </Link>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
        <Link
          href={`/forms/${form.id}/responses`}
          className="flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-slate-900 transition-colors"
        >
          <BarChart3 className="w-4 h-4 text-slate-400" />
          <span>{form.response_count || 0} responses</span>
        </Link>

        <div className="flex items-center gap-2">
          {form.status === "published" && form.public_slug && (
            <a
              href={`/f/${form.public_slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              title="Open public form"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
          <Link
            href={`/forms/${form.id}/builder`}
            className="px-3 py-1.5 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-colors"
          >
            Edit Form
          </Link>
        </div>
      </div>
    </div>
  );
}
