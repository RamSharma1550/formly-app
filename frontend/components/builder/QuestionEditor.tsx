"use client";

import React, { useState, useEffect, useRef } from "react";
import { Question, QuestionOption, QuestionType } from "@/types/question";
import { QUESTION_TYPE_ICONS } from "./QuestionItem";
import { Plus, Trash2, Check, Sparkles, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface QuestionEditorProps {
  question: Question | null;
  onUpdateQuestion: (questionId: number, updates: Partial<Question>) => Promise<void>;
  saving: boolean;
}

const QUESTION_TYPES: { type: QuestionType; label: string }[] = [
  { type: "short_text", label: "Short Text" },
  { type: "long_text", label: "Long Text" },
  { type: "multiple_choice", label: "Multiple Choice" },
  { type: "dropdown", label: "Dropdown" },
  { type: "email", label: "Email" },
  { type: "number", label: "Number" },
  { type: "yes_no", label: "Yes / No" },
  { type: "rating", label: "Rating" },
];

export function QuestionEditor({ question, onUpdateQuestion, saving }: QuestionEditorProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [required, setRequired] = useState(false);
  const [type, setType] = useState<QuestionType>("short_text");
  const [options, setOptions] = useState<QuestionOption[]>([]);

  // Local state sync with selected question
  useEffect(() => {
    if (question) {
      setTitle(question.title || "");
      setDescription(question.description || "");
      setRequired(question.required || false);
      setType(question.type);
      setOptions(question.options || []);
    }
  }, [question?.id]);

  // Debounced auto-save effect
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    if (!question) return;

    const timer = setTimeout(() => {
      onUpdateQuestion(question.id, {
        title,
        description: description || null,
        required,
        type,
        options: options.map((opt, idx) => ({
          ...opt,
          order_index: idx,
          value: opt.value || opt.label,
        })),
      });
    }, 600);

    return () => clearTimeout(timer);
  }, [title, description, required, type, options]);

  if (!question) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-white text-center">
        <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mb-3">
          <Sparkles className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-slate-800">No Question Selected</h3>
        <p className="text-xs text-slate-400 mt-1 max-w-xs">
          Select a question from the sidebar or click "Add" to create one.
        </p>
      </div>
    );
  }

  const handleAddOption = () => {
    const nextIdx = options.length + 1;
    const newOpt: QuestionOption = {
      label: `Option ${nextIdx}`,
      value: `Option ${nextIdx}`,
      order_index: options.length,
    };
    setOptions([...options, newOpt]);
  };

  const handleUpdateOption = (index: number, newLabel: string) => {
    const updated = [...options];
    updated[index] = { ...updated[index], label: newLabel, value: newLabel };
    setOptions(updated);
  };

  const handleDeleteOption = (index: number) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-white overflow-y-auto">
      {/* Header status bar */}
      <div className="px-6 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 sticky top-0 z-10 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-slate-200 text-slate-700">
            {QUESTION_TYPE_ICONS[type]}
          </div>
          <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
            Question #{question.order_index + 1}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {saving ? (
            <span className="inline-flex items-center gap-1.5 text-xs text-amber-600 font-medium bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" /> Saving...
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-xs text-emerald-700 font-medium bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              <Check className="w-3.5 h-3.5" /> Saved
            </span>
          )}
        </div>
      </div>

      <div className="p-6 md:p-8 space-y-6 max-w-2xl">
        {/* Question Type selector */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            Question Type
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as QuestionType)}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 text-sm font-semibold bg-white cursor-pointer"
          >
            {QUESTION_TYPES.map((t) => (
              <option key={t.type} value={t.type}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        {/* Question Title */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            Question Title <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What would you like to ask?"
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 text-base font-semibold text-slate-900 placeholder:text-slate-400"
          />
        </div>

        {/* Description / Help Text */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            Description / Help Text <span className="text-slate-400 font-normal">(Optional)</span>
          </label>
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add subtle guidance or instructions for the respondent..."
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 text-sm text-slate-700 placeholder:text-slate-400 resize-none"
          />
        </div>

        {/* Required Toggle */}
        <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-slate-50">
          <div>
            <span className="text-sm font-bold text-slate-800">Required Question</span>
            <p className="text-xs text-slate-500 mt-0.5">
              Respondents must answer before proceeding to next question
            </p>
          </div>
          <button
            type="button"
            onClick={() => setRequired(!required)}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              required ? "bg-slate-900" : "bg-slate-300"
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                required ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        {/* Dynamic Options for Multiple Choice and Dropdown */}
        {(type === "multiple_choice" || type === "dropdown") && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                Answer Options ({options.length})
              </label>
              <Button type="button" variant="outline" size="sm" onClick={handleAddOption} icon={<Plus className="w-3.5 h-3.5" />}>
                Add Option
              </Button>
            </div>

            {options.length === 0 ? (
              <div className="p-4 rounded-xl border border-dashed border-rose-300 bg-rose-50 text-rose-700 text-xs font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                At least one option is required for this question type.
              </div>
            ) : (
              <div className="space-y-2">
                {options.map((opt, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-400 w-6 text-center">{idx + 1}.</span>
                    <input
                      type="text"
                      value={opt.label}
                      onChange={(e) => handleUpdateOption(idx, e.target.value)}
                      placeholder={`Option ${idx + 1}`}
                      className="flex-1 px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 text-sm font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => handleDeleteOption(idx)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                      title="Remove option"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
