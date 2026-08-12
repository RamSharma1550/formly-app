from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.form import FormCreate, FormUpdate, FormResponse, FormDetailResponse
from app.services import form_service

router = APIRouter(prefix="/api/forms", tags=["Forms"])


@router.get("", response_model=List[FormResponse], summary="List all forms for the default creator")
def list_forms(db: Session = Depends(get_db)):
    forms = form_service.get_forms(db, creator_id=1)
    result = []
    for f in forms:
        f_resp = FormResponse.model_validate(f)
        f_resp.response_count = len(f.responses)
        result.append(f_resp)
    return result


@router.post("", response_model=FormResponse, status_code=status.HTTP_201_CREATED, summary="Create a new form")
def create_form(form_in: FormCreate, db: Session = Depends(get_db)):
    form = form_service.create_form(db, form_in, creator_id=1)
    res = FormResponse.model_validate(form)
    res.response_count = 0
    return res


@router.get("/{form_id}", response_model=FormDetailResponse, summary="Get form details with questions")
def get_form(form_id: int, db: Session = Depends(get_db)):
    form = form_service.get_form_by_id(db, form_id)
    if not form:
        from fastapi import HTTPException
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Form not found")
    res = FormDetailResponse.model_validate(form)
    res.response_count = len(form.responses)
    return res


@router.put("/{form_id}", response_model=FormResponse, summary="Update form title or description")
def update_form(form_id: int, form_in: FormUpdate, db: Session = Depends(get_db)):
    form = form_service.update_form(db, form_id, form_in)
    res = FormResponse.model_validate(form)
    res.response_count = len(form.responses)
    return res


@router.delete("/{form_id}", status_code=status.HTTP_204_NO_CONTENT, summary="Delete form and cascade all data")
def delete_form(form_id: int, db: Session = Depends(get_db)):
    form_service.delete_form(db, form_id)
    return None


@router.post("/{form_id}/duplicate", response_model=FormResponse, status_code=status.HTTP_201_CREATED, summary="Duplicate form")
def duplicate_form(form_id: int, db: Session = Depends(get_db)):
    new_form = form_service.duplicate_form(db, form_id)
    res = FormResponse.model_validate(new_form)
    res.response_count = 0
    return res


@router.post("/{form_id}/publish", response_model=FormResponse, summary="Publish form and generate public slug")
def publish_form(form_id: int, db: Session = Depends(get_db)):
    form = form_service.publish_form(db, form_id)
    res = FormResponse.model_validate(form)
    res.response_count = len(form.responses)
    return res


@router.post("/{form_id}/unpublish", response_model=FormResponse, summary="Unpublish form back to draft")
def unpublish_form(form_id: int, db: Session = Depends(get_db)):
    form = form_service.unpublish_form(db, form_id)
    res = FormResponse.model_validate(form)
    res.response_count = len(form.responses)
    return res
