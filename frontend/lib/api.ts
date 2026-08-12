import { Form, FormDetail, FormCreatePayload, FormUpdatePayload } from "@/types/form";
import { Question, QuestionCreatePayload, QuestionUpdatePayload } from "@/types/question";
import { ResponseSubmitPayload, ResponseDetail, SubmissionSummary, FormStats } from "@/types/response";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function fetchAPI<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  try {
    const res = await fetch(url, { ...options, headers });
    if (!res.ok) {
      let errorDetail = `HTTP Error ${res.status}`;
      try {
        const errorJson = await res.json();
        if (errorJson && errorJson.detail) {
          errorDetail = typeof errorJson.detail === "string" ? errorJson.detail : JSON.stringify(errorJson.detail);
        }
      } catch {
        // Fallback
      }
      throw new Error(errorDetail);
    }
    if (res.status === 204) {
      return {} as T;
    }
    return (await res.json()) as T;
  } catch (err: any) {
    console.error(`API fetch error [${endpoint}]:`, err);
    throw err;
  }
}

export const api = {
  // Forms
  getForms: () => fetchAPI<Form[]>("/api/forms"),
  getForm: (id: number) => fetchAPI<FormDetail>(`/api/forms/${id}`),
  createForm: (data: FormCreatePayload) =>
    fetchAPI<Form>("/api/forms", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateForm: (id: number, data: FormUpdatePayload) =>
    fetchAPI<Form>(`/api/forms/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  deleteForm: (id: number) =>
    fetchAPI<void>(`/api/forms/${id}`, {
      method: "DELETE",
    }),
  duplicateForm: (id: number) =>
    fetchAPI<Form>(`/api/forms/${id}/duplicate`, {
      method: "POST",
    }),
  publishForm: (id: number) =>
    fetchAPI<Form>(`/api/forms/${id}/publish`, {
      method: "POST",
    }),
  unpublishForm: (id: number) =>
    fetchAPI<Form>(`/api/forms/${id}/unpublish`, {
      method: "POST",
    }),

  // Questions
  createQuestion: (formId: number, data: QuestionCreatePayload) =>
    fetchAPI<Question>(`/api/forms/${formId}/questions`, {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateQuestion: (id: number, data: QuestionUpdatePayload) =>
    fetchAPI<Question>(`/api/questions/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  deleteQuestion: (id: number) =>
    fetchAPI<void>(`/api/questions/${id}`, {
      method: "DELETE",
    }),
  reorderQuestions: (formId: number, questions: { id: number; order_index: number }[]) =>
    fetchAPI<Question[]>(`/api/forms/${formId}/questions/reorder`, {
      method: "PUT",
      body: JSON.stringify({ questions }),
    }),

  // Public Form
  getPublicForm: (slug: string) => fetchAPI<FormDetail>(`/api/public/forms/${slug}`),
  submitResponse: (slug: string, data: ResponseSubmitPayload) =>
    fetchAPI<ResponseDetail>(`/api/public/forms/${slug}/responses`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // Responses & Stats
  getResponses: (formId: number) => fetchAPI<SubmissionSummary[]>(`/api/forms/${formId}/responses`),
  getResponse: (formId: number, responseId: number) =>
    fetchAPI<ResponseDetail>(`/api/forms/${formId}/responses/${responseId}`),
  getStats: (formId: number) => fetchAPI<FormStats>(`/api/forms/${formId}/stats`),
};
