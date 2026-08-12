from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.question import QuestionCreate, QuestionUpdate, QuestionResponse, QuestionReorderRequest
from app.services import question_service

router = APIRouter(tags=["Questions"])


@router.post("/api/forms/{form_id}/questions", response_model=QuestionResponse, status_code=status.HTTP_201_CREATED, summary="Add question to form")
def add_question(form_id: int, question_in: QuestionCreate, db: Session = Depends(get_db)):
    return question_service.create_question(db, form_id, question_in)


@router.put("/api/questions/{question_id}", response_model=QuestionResponse, summary="Update question details")
def update_question(question_id: int, question_in: QuestionUpdate, db: Session = Depends(get_db)):
    return question_service.update_question(db, question_id, question_in)


@router.delete("/api/questions/{question_id}", status_code=status.HTTP_204_NO_CONTENT, summary="Delete question")
def delete_question(question_id: int, db: Session = Depends(get_db)):
    question_service.delete_question(db, question_id)
    return None


@router.put("/api/forms/{form_id}/questions/reorder", response_model=List[QuestionResponse], summary="Batch reorder questions")
def reorder_questions(form_id: int, reorder_in: QuestionReorderRequest, db: Session = Depends(get_db)):
    return question_service.reorder_questions(db, form_id, reorder_in)
