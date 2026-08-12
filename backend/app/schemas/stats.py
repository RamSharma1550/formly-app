from typing import List, Dict, Any, Optional
from pydantic import BaseModel


class QuestionStatItem(BaseModel):
    question_id: int
    question_title: str
    question_type: str
    total_answers: int
    option_counts: Optional[Dict[str, int]] = None
    yes_no_counts: Optional[Dict[str, int]] = None
    rating_average: Optional[float] = None
    number_average: Optional[float] = None
    recent_answers: Optional[List[str]] = None


class FormStatsResponse(BaseModel):
    form_id: int
    total_responses: int
    question_stats: List[QuestionStatItem]
