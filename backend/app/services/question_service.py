import datetime
from typing import List, Optional
from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.models.form import Form
from app.models.question import Question, QuestionOption
from app.schemas.question import QuestionCreate, QuestionUpdate, QuestionReorderRequest

DEFAULT_QUESTION_TITLES = {
    "short_text": "What is your name?",
    "long_text": "Tell us more about yourself.",
    "multiple_choice": "Choose an option",
    "dropdown": "Select an option from the list",
    "email": "What is your email address?",
    "number": "Enter a number",
    "yes_no": "Would you recommend us?",
    "rating": "How would you rate your experience?"
}


def create_question(db: Session, form_id: int, question_in: QuestionCreate) -> Question:
    form = db.query(Form).filter(Form.id == form_id).first()
    if not form:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Form not found")

    # Determine next order index
    max_order = db.query(Question).filter(Question.form_id == form_id).count()
    order_index = question_in.order_index if question_in.order_index is not None else max_order

    title = question_in.title or DEFAULT_QUESTION_TITLES.get(question_in.type, "New Question")

    question = Question(
        form_id=form_id,
        type=question_in.type,
        title=title,
        description=question_in.description,
        required=question_in.required or False,
        order_index=order_index
    )
    db.add(question)
    db.flush()

    # Default options for choice types if none provided
    options_data = question_in.options or []
    if not options_data and question_in.type in ["multiple_choice", "dropdown"]:
        options_data = [
            QuestionOption(label="Option 1", value="Option 1", order_index=0),
            QuestionOption(label="Option 2", value="Option 2", order_index=1),
        ]
        if question_in.type == "multiple_choice":
            options_data.append(QuestionOption(label="Option 3", value="Option 3", order_index=2))
        for opt in options_data:
            opt.question_id = question.id
            db.add(opt)
    else:
        for idx, opt_in in enumerate(options_data):
            opt = QuestionOption(
                question_id=question.id,
                label=opt_in.label,
                value=opt_in.value,
                order_index=opt_in.order_index if opt_in.order_index is not None else idx
            )
            db.add(opt)

    form.updated_at = datetime.datetime.utcnow()
    db.commit()
    db.refresh(question)
    return question


def update_question(db: Session, question_id: int, question_in: QuestionUpdate) -> Question:
    question = db.query(Question).filter(Question.id == question_id).first()
    if not question:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Question not found")

    if question_in.title is not None:
        question.title = question_in.title
    if question_in.description is not None:
        question.description = question_in.description
    if question_in.required is not None:
        question.required = question_in.required
    if question_in.type is not None:
        question.type = question_in.type
    if question_in.order_index is not None:
        question.order_index = question_in.order_index

    # Update options if provided
    if question_in.options is not None:
        # Delete existing options
        db.query(QuestionOption).filter(QuestionOption.question_id == question_id).delete()
        for idx, opt_in in enumerate(question_in.options):
            opt = QuestionOption(
                question_id=question.id,
                label=opt_in.label,
                value=opt_in.value or opt_in.label,
                order_index=opt_in.order_index if opt_in.order_index is not None else idx
            )
            db.add(opt)

    question.updated_at = datetime.datetime.utcnow()
    question.form.updated_at = datetime.datetime.utcnow()

    db.commit()
    db.refresh(question)
    return question


def delete_question(db: Session, question_id: int) -> bool:
    question = db.query(Question).filter(Question.id == question_id).first()
    if not question:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Question not found")

    form = question.form
    db.delete(question)
    db.flush()

    # Reindex remaining questions
    remaining = db.query(Question).filter(Question.form_id == form.id).order_by(Question.order_index).all()
    for idx, q in enumerate(remaining):
        q.order_index = idx

    form.updated_at = datetime.datetime.utcnow()
    db.commit()
    return True


def reorder_questions(db: Session, form_id: int, reorder_in: QuestionReorderRequest) -> List[Question]:
    form = db.query(Form).filter(Form.id == form_id).first()
    if not form:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Form not found")

    item_map = {item.id: item.order_index for item in reorder_in.questions}

    questions = db.query(Question).filter(Question.form_id == form_id).all()
    for q in questions:
        if q.id in item_map:
            q.order_index = item_map[q.id]
            q.updated_at = datetime.datetime.utcnow()

    form.updated_at = datetime.datetime.utcnow()
    db.commit()

    return db.query(Question).filter(Question.form_id == form_id).order_by(Question.order_index).all()
