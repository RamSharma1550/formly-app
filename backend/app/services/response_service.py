import datetime
from typing import List, Optional
from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.models.form import Form
from app.models.question import Question
from app.models.response import Response, Answer
from app.schemas.response import ResponseSubmitRequest, SubmissionResponse, AnswerResponse, SubmissionSummaryResponse
from app.utils.validation import validate_answer_for_question


def submit_public_response(db: Session, slug: str, payload: ResponseSubmitRequest) -> Response:
    form = db.query(Form).filter(Form.public_slug == slug).first()
    if not form:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Form not found")

    if form.status != "published":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This form is currently not published and cannot accept responses."
        )

    questions_map = {q.id: q for q in form.questions}
    answers_map = {a.question_id: a.answer for a in payload.answers}

    # Validate all questions
    for q_id, q in questions_map.items():
        user_answer = answers_map.get(q_id)
        is_valid, err_msg = validate_answer_for_question(q, user_answer)
        if not is_valid:
            raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=err_msg)

    # Verify no unknown question IDs passed
    for a in payload.answers:
        if a.question_id not in questions_map:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Question ID {a.question_id} does not belong to this form."
            )

    # Atomic transaction
    try:
        response = Response(
            form_id=form.id,
            submitted_at=datetime.datetime.utcnow()
        )
        db.add(response)
        db.flush()

        for a in payload.answers:
            if a.answer is not None and str(a.answer).strip() != "":
                answer_obj = Answer(
                    response_id=response.id,
                    question_id=a.question_id,
                    answer_text=str(a.answer).strip()
                )
                db.add(answer_obj)

        db.commit()
        db.refresh(response)
        return response
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to record response: {str(e)}"
        )


def get_form_responses(db: Session, form_id: int) -> List[SubmissionSummaryResponse]:
    form = db.query(Form).filter(Form.id == form_id).first()
    if not form:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Form not found")

    responses = db.query(Response).filter(Response.form_id == form_id).order_by(Response.submitted_at.desc()).all()

    summaries = []
    for resp in responses:
        # Determine primary answer for table preview (e.g. name or email or first answer)
        primary = "No responses provided"
        if resp.answers:
            # find first non-empty answer text
            for ans in resp.answers:
                if ans.answer_text:
                    primary = ans.answer_text
                    break
        summaries.append(SubmissionSummaryResponse(
            id=resp.id,
            submitted_at=resp.submitted_at,
            primary_answer=primary
        ))
    return summaries


def get_individual_response(db: Session, form_id: int, response_id: int) -> SubmissionResponse:
    resp = db.query(Response).filter(Response.id == response_id, Response.form_id == form_id).first()
    if not resp:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Response not found")

    answers_list = []
    for ans in resp.answers:
        q = ans.question
        answers_list.append(AnswerResponse(
            id=ans.id,
            question_id=ans.question_id,
            question_title=q.title if q else "Deleted question",
            question_type=q.type if q else "unknown",
            answer_text=ans.answer_text
        ))

    return SubmissionResponse(
        id=resp.id,
        form_id=resp.form_id,
        submitted_at=resp.submitted_at,
        answers=answers_list
    )
