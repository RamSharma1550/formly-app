from datetime import datetime
from typing import List, Optional, Literal
from pydantic import BaseModel, ConfigDict
from app.schemas.question import QuestionResponse

FormStatus = Literal["draft", "published"]


class FormBase(BaseModel):
    title: str
    description: Optional[str] = None


class FormCreate(FormBase):
    title: str = "Untitled form"
    description: Optional[str] = None


class FormUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None


class FormResponse(FormBase):
    id: int
    creator_id: int
    status: FormStatus
    public_slug: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    published_at: Optional[datetime] = None
    response_count: Optional[int] = 0

    model_config = ConfigDict(from_attributes=True)


class FormDetailResponse(FormResponse):
    questions: List[QuestionResponse] = []

    model_config = ConfigDict(from_attributes=True)


class PublicFormResponse(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    public_slug: str
    questions: List[QuestionResponse] = []

    model_config = ConfigDict(from_attributes=True)
