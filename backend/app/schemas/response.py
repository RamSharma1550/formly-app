from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, ConfigDict


class AnswerSubmit(BaseModel):
    question_id: int
    answer: Optional[str] = None


class ResponseSubmitRequest(BaseModel):
    answers: List[AnswerSubmit]


class AnswerResponse(BaseModel):
    id: int
    question_id: int
    question_title: Optional[str] = None
    question_type: Optional[str] = None
    answer_text: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class SubmissionResponse(BaseModel):
    id: int
    form_id: int
    submitted_at: datetime
    answers: List[AnswerResponse] = []

    model_config = ConfigDict(from_attributes=True)


class SubmissionSummaryResponse(BaseModel):
    id: int
    submitted_at: datetime
    primary_answer: Optional[str] = None  # e.g., first answer or email/name snippet

    model_config = ConfigDict(from_attributes=True)
