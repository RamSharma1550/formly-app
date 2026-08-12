export interface AnswerSubmitPayload {
  question_id: number;
  answer?: string;
}

export interface ResponseSubmitPayload {
  answers: AnswerSubmitPayload[];
}

export interface AnswerDetail {
  id: number;
  question_id: number;
  question_title?: string;
  question_type?: string;
  answer_text?: string | null;
}

export interface ResponseDetail {
  id: number;
  form_id: number;
  submitted_at: string;
  answers: AnswerDetail[];
}

export interface SubmissionSummary {
  id: number;
  submitted_at: string;
  primary_answer?: string | null;
}

export interface QuestionStatItem {
  question_id: number;
  question_title: string;
  question_type: string;
  total_answers: number;
  option_counts?: Record<string, number> | null;
  yes_no_counts?: Record<string, number> | null;
  rating_average?: number | null;
  number_average?: number | null;
  recent_answers?: string[] | null;
}

export interface FormStats {
  form_id: number;
  total_responses: number;
  question_stats: QuestionStatItem[];
}
