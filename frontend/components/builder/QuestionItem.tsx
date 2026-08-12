"use client";

import React from "react";
import { Question } from "@/types/question";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  GripVertical,
  AlignLeft,
  Type,
  ListOrdered,
  ChevronDownSquare,
  Mail,
  Hash,
  ToggleLeft,
  Star,
  Trash2
} from "lucide-react";
import { cn } from "@/lib/utils";

interface QuestionItemProps {
  question: Question;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: (questionId: number) => void;
}

export const QUESTION_TYPE_ICONS: Record<string, React.ReactNode> = {
  short_text: <Type className="w-4 h-4 text-sky-500" />,
  long_text: <AlignLeft className="w-4 h-4 text-indigo-500" />,
  multiple_choice: <ListOrdered className="w-4 h-4 text-emerald-500" />,
  dropdown: <ChevronDownSquare className="w-4 h-4 text-purple-500" />,
  email: <Mail className="w-4 h-4 text-amber-500" />,
  number: <Hash className="w-4 h-4 text-orange-500" />,
  yes_no: <ToggleLeft className="w-4 h-4 text-teal-500" />,
  rating: <Star className="w-4 h-4 text-yellow-500" />,
};

export function QuestionItem({ question, index, isSelected, onSelect, onDelete }: QuestionItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: question.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={onSelect}
      className={cn(
        "group relative flex items-center gap-3 p-3.5 rounded-xl border text-sm font-medium transition-all cursor-pointer select-none",
        isDragging && "z-20 opacity-60 shadow-lg bg-slate-100 border-slate-300",
        isSelected
          ? "bg-slate-900 text-white border-slate-900 shadow-sm"
          : "bg-white text-slate-800 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
      )}
    >
      {/* Drag handle */}
      <button
        type="button"
        {...attributes}
        {...listeners}
        className={cn(
          "p-1 rounded cursor-grab active:cursor-grabbing shrink-0",
          isSelected ? "text-slate-400 hover:text-white" : "text-slate-300 hover:text-slate-600"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <GripVertical className="w-4 h-4" />
      </button>

      <span className={cn("text-xs font-semibold w-5 shrink-0", isSelected ? "text-slate-400" : "text-slate-400")}>
        {index + 1}
      </span>

      <span className="shrink-0">{QUESTION_TYPE_ICONS[question.type]}</span>

      <span className="truncate flex-1 font-medium">
        {question.title || "Untitled Question"}
      </span>

      {question.required && (
        <span
          className={cn(
            "text-[10px] font-bold uppercase px-1.5 py-0.5 rounded shrink-0",
            isSelected ? "bg-slate-800 text-amber-300" : "bg-amber-50 text-amber-700 border border-amber-200"
          )}
        >
          *Req
        </span>
      )}

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onDelete(question.id);
        }}
        className={cn(
          "p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shrink-0",
          isSelected
            ? "text-slate-400 hover:text-rose-300 hover:bg-slate-800"
            : "text-slate-400 hover:text-rose-600 hover:bg-rose-50"
        )}
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}
