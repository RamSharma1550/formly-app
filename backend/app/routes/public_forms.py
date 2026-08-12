from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.form import PublicFormResponse
from app.schemas.response import ResponseSubmitRequest, SubmissionResponse
from app.services import form_service, response_service

router = APIRouter(prefix="/api/public/forms", tags=["Public Forms"])


@router.get("/{slug}", response_model=PublicFormResponse, summary="Get public form by slug for respondents (no auth)")
def get_public_form(slug: str, db: Session = Depends(get_db)):
    form = form_service.get_form_by_slug(db, slug)
    if not form or form.status != "published":
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Form not found or is currently not published."
        )
    return form


@router.post("/{slug}/responses", response_model=SubmissionResponse, status_code=status.HTTP_201_CREATED, summary="Submit response to published form")
def submit_response(slug: str, payload: ResponseSubmitRequest, db: Session = Depends(get_db)):
    resp = response_service.submit_public_response(db, slug, payload)
    return response_service.get_individual_response(db, resp.form_id, resp.id)
