from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.response import SubmissionSummaryResponse, SubmissionResponse
from app.schemas.stats import FormStatsResponse
from app.services import response_service, stats_service

router = APIRouter(prefix="/api/forms/{form_id}", tags=["Responses & Stats"])


@router.get("/responses", response_model=List[SubmissionSummaryResponse], summary="List all responses for form")
def list_responses(form_id: int, db: Session = Depends(get_db)):
    return response_service.get_form_responses(db, form_id)


@router.get("/responses/{response_id}", response_model=SubmissionResponse, summary="Get detailed individual response")
def get_response_detail(form_id: int, response_id: int, db: Session = Depends(get_db)):
    return response_service.get_individual_response(db, form_id, response_id)


@router.get("/stats", response_model=FormStatsResponse, summary="Get statistical breakdown for questions")
def get_form_stats(form_id: int, db: Session = Depends(get_db)):
    return stats_service.calculate_form_stats(db, form_id)
