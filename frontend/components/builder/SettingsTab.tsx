"use client";

import React, { useState } from "react";
import { FormDetail } from "@/types/form";
import { Badge } from "@/components/ui/Badge";
import { useToast } from "@/components/ui/Toast";
import { Globe, Copy, Check, Palette, Sparkles, Sliders, Webhook } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface SettingsTabProps {
  form: FormDetail;
  onPublishToggle: () => Promise<void>;
}

export function SettingsTab({ form, onPublishToggle }: SettingsTabProps) {
  const [copied, setCopied] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const toast = useToast();

  const publicUrl =
    typeof window !== "undefined" && form.public_slug
      ? `${window.location.origin}/f/${form.public_slug}`
      : form.public_slug
      ? `/f/${form.public_slug}`
      : "";

  const handleCopyLink = () => {
    if (!publicUrl) return;
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    toast.success("Public link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePublishClick = async () => {
    try {
      setPublishing(true);
      await onPublishToggle();
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="flex-1 p-6 md:p-10 max-w-4xl mx-auto overflow-y-auto space-y-8 bg-white">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Form Settings & Publishing</h2>
        <p className="text-sm text-slate-500 mt-1">
          Manage publishing status, share links, and configuration options.
        </p>
      </div>

      {/* Publishing Card */}
      <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-base font-bold text-slate-900">Publishing Status</h3>
            <Badge status={form.status} />
          </div>
          <p className="text-xs text-slate-600 max-w-lg">
            {form.status === "published"
              ? "Your form is currently published and accepting public submissions."
              : "Your form is currently in draft mode. Publish it to make it accessible to respondents."}
          </p>
          {form.status === "published" && publicUrl && (
            <div className="mt-3 flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={publicUrl}
                className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs text-slate-700 w-72 font-mono"
              />
              <button
                onClick={handleCopyLink}
                className="p-2 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1.5"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-500" />}
                Copy Link
              </button>
            </div>
          )}
        </div>

        <Button
          onClick={handlePublishClick}
          loading={publishing}
          variant={form.status === "published" ? "outline" : "primary"}
          icon={<Globe className="w-4 h-4" />}
        >
          {form.status === "published" ? "Unpublish Form" : "Publish Form Now"}
        </Button>
      </div>

      {/* Placeholder settings with Coming Soon tags */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-200">
        <div className="p-5 rounded-2xl border border-slate-200 bg-white space-y-3 opacity-80">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Palette className="w-5 h-5 text-indigo-500" />
              <h4 className="text-sm font-bold text-slate-900">Custom Theme & Branding</h4>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-500 border">
              Coming Soon
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Customize background colors, typography, brand logo, and button styles.
          </p>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200 bg-white space-y-3 opacity-80">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sliders className="w-5 h-5 text-amber-500" />
              <h4 className="text-sm font-bold text-slate-900">Advanced Logic Jumps</h4>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-500 border">
              Coming Soon
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Branch questions conditionally based on respondent choices and answers.
          </p>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200 bg-white space-y-3 opacity-80">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Webhook className="w-5 h-5 text-emerald-500" />
              <h4 className="text-sm font-bold text-slate-900">Webhooks & Integrations</h4>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-500 border">
              Coming Soon
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Send submission payloads directly to Slack, Zapier, or custom HTTP endpoints.
          </p>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200 bg-white space-y-3 opacity-80">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-sky-500" />
              <h4 className="text-sm font-bold text-slate-900">AI Form Generation</h4>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-500 border">
              Coming Soon
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Generate form questions automatically from text prompts or documents.
          </p>
        </div>
      </div>
    </div>
  );
}
