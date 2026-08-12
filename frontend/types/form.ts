import { Question } from "./question";

export type FormStatus = "draft" | "published";

export interface Form {
  id: number;
  creator_id: number;
  title: string;
  description?: string | null;
  status: FormStatus;
  public_slug?: string | null;
  created_at: string;
  updated_at: string;
  published_at?: string | null;
  response_count?: number;
}

export interface FormDetail extends Form {
  questions: Question[];
}

export interface FormCreatePayload {
  title: string;
  description?: string;
}

export interface FormUpdatePayload {
  title?: string;
  description?: string;
}
