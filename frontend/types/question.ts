export type QuestionType =
  | "short_text"
  | "long_text"
  | "multiple_choice"
  | "dropdown"
  | "email"
  | "number"
  | "yes_no"
  | "rating";

export interface QuestionOption {
  id?: number;
  label: string;
  value: string;
  order_index?: number;
}

export interface Question {
  id: number;
  form_id: number;
  type: QuestionType;
  title: string;
  description?: string | null;
  required: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
  options: QuestionOption[];
}

export interface QuestionCreatePayload {
  type: QuestionType;
  title?: string;
  description?: string;
  required?: boolean;
  order_index?: number;
  options?: { label: string; value: string; order_index?: number }[];
}

export interface QuestionUpdatePayload {
  title?: string;
  description?: string | null;
  required?: boolean;
  type?: QuestionType;
  order_index?: number;
  options?: { id?: number; label: string; value: string; order_index?: number }[];
}
