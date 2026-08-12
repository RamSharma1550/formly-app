from datetime import datetime
from typing import List, Optional, Literal
from pydantic import BaseModel, ConfigDict

QuestionType = Literal[
    "short_text",
    "long_text",
    "multiple_choice",
    "dropdown",
    "email",
    "number",
    "yes_no",
    "rating"
]


class QuestionOptionBase(BaseModel):
    label: str
    value: str
    order_index: Optional[int] = 0


class QuestionOptionCreate(QuestionOptionBase):
    pass


class QuestionOptionResponse(QuestionOptionBase):
    id: int
    question_id: int

    model_config = ConfigDict(from_attributes=True)


class QuestionBase(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    required: Optional[bool] = False


class QuestionCreate(QuestionBase):
    type: QuestionType
    order_index: Optional[int] = None
    options: Optional[List[QuestionOptionCreate]] = []


class QuestionUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    required: Optional[bool] = None
    type: Optional[QuestionType] = None
    order_index: Optional[int] = None
    options: Optional[List[QuestionOptionCreate]] = None


class QuestionReorderItem(BaseModel):
    id: int
    order_index: int


class QuestionReorderRequest(BaseModel):
    questions: List[QuestionReorderItem]


class QuestionResponse(QuestionBase):
    id: int
    form_id: int
    type: QuestionType
    order_index: int
    created_at: datetime
    updated_at: datetime
    options: List[QuestionOptionResponse] = []

    model_config = ConfigDict(from_attributes=True)
