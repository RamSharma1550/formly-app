"use client";

import React, { useState } from "react";
import { Question, QuestionType } from "@/types/question";
import { QuestionItem, QUESTION_TYPE_ICONS } from "./QuestionItem";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Plus, X } from "lucide-react";
import { Modal } from "@/components/ui/Modal";

interface QuestionListProps {
  questions: Question[];
  selectedQuestionId: number | null;
  onSelectQuestion: (question: Question) => void;
  onAddQuestion: (type: QuestionType) => void;
  onDeleteQuestion: (questionId: number) => void;
  onReorderQuestions: (newQuestions: Question[]) => void;
}

const QUESTION_TYPES: { type: QuestionType; label: string; description: string }[] = [
  { type: "short_text", label: "Short Text", description: "Single line input for name, title, etc." },
  { type: "long_text", label: "Long Text", description: "Multi-line text area for feedback or details." },
  { type: "multiple_choice", label: "Multiple Choice", description: "Select one choice from vertical list." },
  { type: "dropdown", label: "Dropdown", description: "Select from a compact dropdown list." },
  { type: "email", label: "Email", description: "Validated email input field." },
  { type: "number", label: "Number", description: "Numeric values like age, years, quantity." },
  { type: "yes_no", label: "Yes / No", description: "Simple binary choice buttons." },
  { type: "rating", label: "Rating", description: "1 to 5 star/number rating scale." },
];

export function QuestionList({
  questions,
  selectedQuestionId,
  onSelectQuestion,
  onAddQuestion,
  onDeleteQuestion,
  onReorderQuestions,
}: QuestionListProps) {
  const [addModalOpen, setAddModalOpen] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = questions.findIndex((q) => q.id === active.id);
      const newIndex = questions.findIndex((q) => q.id === over.id);
      const newOrdered = arrayMove(questions, oldIndex, newIndex).map((q, idx) => ({
        ...q,
        order_index: idx,
      }));
      onReorderQuestions(newOrdered);
    }
  };

  const handleSelectType = (type: QuestionType) => {
    onAddQuestion(type);
    setAddModalOpen(false);
  };

  return (
    <div className="w-full flex flex-col h-full bg-slate-50 border-r border-slate-200">
      <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-white">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">Questions</h2>
          <p className="text-xs text-slate-400 font-medium">{questions.length} questions in sequence</p>
        </div>
        <button
          onClick={() => setAddModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" /> Add
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {questions.length === 0 ? (
          <div className="text-center py-12 px-4">
            <p className="text-sm font-medium text-slate-500">No questions yet</p>
            <p className="text-xs text-slate-400 mt-1 mb-4">Add your first question to start building</p>
            <button
              onClick={() => setAddModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-colors"
            >
              <Plus className="w-4 h-4" /> Add Question
            </button>
          </div>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={questions.map((q) => q.id)} strategy={verticalListSortingStrategy}>
              {questions.map((q, idx) => (
                <QuestionItem
                  key={q.id}
                  question={q}
                  index={idx}
                  isSelected={q.id === selectedQuestionId}
                  onSelect={() => onSelectQuestion(q)}
                  onDelete={onDeleteQuestion}
                />
              ))}
            </SortableContext>
          </DndContext>
        )}
      </div>

      {/* Add Question Modal */}
      <Modal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="Select Question Type"
        description="Choose a question type to insert into your form."
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto pr-1">
          {QUESTION_TYPES.map((t) => (
            <button
              key={t.type}
              onClick={() => handleSelectType(t.type)}
              className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-200 hover:border-slate-900 hover:bg-slate-50 text-left transition-all group"
            >
              <div className="p-2 rounded-lg bg-slate-100 group-hover:bg-slate-900 group-hover:text-white transition-colors shrink-0">
                {QUESTION_TYPE_ICONS[t.type]}
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">{t.label}</h4>
                <p className="text-xs text-slate-500 mt-0.5">{t.description}</p>
              </div>
            </button>
          ))}
        </div>
      </Modal>
    </div>
  );
}
