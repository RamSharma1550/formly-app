"use client";

import React, { useState, useEffect, useCallback } from "react";
import { FormDetail } from "@/types/form";
import { QuestionCard } from "./QuestionCard";
import { ProgressHeader } from "./ProgressHeader";
import { ThankYouScreen } from "./ThankYouScreen";
import { AnimatePresence, motion } from "framer-motion";
import { api } from "@/lib/api";
import { useToast } from "@/components/ui/Toast";

interface PublicFormViewProps {
  form: FormDetail;
}

export function PublicFormView({ form }: PublicFormViewProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [direction, setDirection] = useState<"forward" | "backward">("forward");
  const [validationError, setValidationError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const toast = useToast();

  const questions = form.questions || [];
  const currentQuestion = questions[currentIndex];

  // Client Validation function
  const validateCurrentQuestion = (val: string): string | null => {
    if (!currentQuestion) return null;

    const trimmed = (val || "").trim();

    if (currentQuestion.required && !trimmed) {
      return "This question is required. Please enter an answer.";
    }

    if (!trimmed) return null;

    if (currentQuestion.type === "email") {
      const emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
      if (!emailRegex.test(trimmed)) {
        return "Please enter a valid email address.";
      }
    }

    if (currentQuestion.type === "number") {
      if (isNaN(Number(trimmed))) {
        return "Please enter a valid numeric value.";
      }
    }

    if (currentQuestion.type === "rating") {
      const r = Number(trimmed);
      if (isNaN(r) || r < 1 || r > 5) {
        return "Please select a rating between 1 and 5.";
      }
    }

    return null;
  };

  const handleAnswerChange = (val: string) => {
    setValidationError(null);
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: val,
    }));
  };

  const handleNext = async () => {
    if (!currentQuestion) return;

    const currentVal = answers[currentQuestion.id] || "";
    const err = validateCurrentQuestion(currentVal);

    if (err) {
      setValidationError(err);
      return;
    }

    setValidationError(null);

    // If last question -> submit
    if (currentIndex === questions.length - 1) {
      await handleSubmitForm();
    } else {
      setDirection("forward");
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setValidationError(null);
      setDirection("backward");
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleSubmitForm = async () => {
    try {
      setSubmitting(true);
      const payloadAnswers = questions.map((q) => ({
        question_id: q.id,
        answer: answers[q.id] || "",
      }));

      await api.submitResponse(form.public_slug!, { answers: payloadAnswers });
      setSubmitted(true);
    } catch (err: any) {
      toast.error(err.message || "Failed to submit response. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Global Keyboard Navigation
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (submitted || submitting) return;

      if (e.key === "Enter" && currentQuestion?.type !== "long_text") {
        e.preventDefault();
        handleNext();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        handlePrevious();
      }
    },
    [currentIndex, answers, currentQuestion, submitted, submitting]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  if (submitted) {
    return <ThankYouScreen />;
  }

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
        <p className="text-sm font-medium text-slate-400">This form currently has no questions.</p>
      </div>
    );
  }

  const slideVariants = {
    enter: (dir: "forward" | "backward") => ({
      y: dir === "forward" ? 60 : -60,
      opacity: 0,
    }),
    center: {
      y: 0,
      opacity: 1,
    },
    exit: (dir: "forward" | "backward") => ({
      y: dir === "forward" ? -60 : 60,
      opacity: 0,
    }),
  };

  return (
    <div className="relative min-h-screen bg-slate-950 text-white overflow-hidden flex flex-col justify-between select-none">
      <ProgressHeader
        currentIndex={currentIndex}
        totalQuestions={questions.length}
        onPrevious={handlePrevious}
        canGoPrevious={currentIndex > 0}
      />

      <main className="flex-1 flex items-center justify-center relative w-full my-12">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentQuestion.id}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="w-full"
          >
            <QuestionCard
              question={currentQuestion}
              index={currentIndex}
              totalQuestions={questions.length}
              value={answers[currentQuestion.id] || ""}
              onChange={handleAnswerChange}
              onNext={handleNext}
              isLast={currentIndex === questions.length - 1}
              error={validationError}
              submitting={submitting}
            />
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="p-6 text-center text-[11px] text-slate-600 font-medium">
        Formly • Conversational Web Forms
      </footer>
    </div>
  );
}
