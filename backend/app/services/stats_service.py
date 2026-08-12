from typing import List, Dict, Any
from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.models.form import Form
from app.models.question import Question
from app.models.response import Response, Answer
from app.schemas.stats import FormStatsResponse, QuestionStatItem


def calculate_form_stats(db: Session, form_id: int) -> FormStatsResponse:
    form = db.query(Form).filter(Form.id == form_id).first()
    if not form:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Form not found")

    total_responses = db.query(Response).filter(Response.form_id == form_id).count()
    questions = db.query(Question).filter(Question.form_id == form_id).order_by(Question.order_index).all()

    question_stats: List[QuestionStatItem] = []

    for q in questions:
        answers = db.query(Answer).filter(Answer.question_id == q.id).all()
        answer_texts = [a.answer_text for a in answers if a.answer_text is not None and a.answer_text.strip() != ""]
        total_answers = len(answer_texts)

        stat_item = QuestionStatItem(
            question_id=q.id,
            question_title=q.title,
            question_type=q.type,
            total_answers=total_answers
        )

        if q.type in ["multiple_choice", "dropdown"]:
            counts: Dict[str, int] = {opt.label: 0 for opt in q.options}
            # Also keep track of raw values if label doesn't match
            for text in answer_texts:
                matched = False
                for opt in q.options:
                    if text == opt.value or text == opt.label:
                        counts[opt.label] = counts.get(opt.label, 0) + 1
                        matched = True
                        break
                if not matched:
                    counts[text] = counts.get(text, 0) + 1
            stat_item.option_counts = counts

        elif q.type == "yes_no":
            yes_count = sum(1 for t in answer_texts if t.lower() == "yes")
            no_count = sum(1 for t in answer_texts if t.lower() == "no")
            stat_item.yes_no_counts = {"Yes": yes_count, "No": no_count}

        elif q.type == "rating":
            ratings = []
            for t in answer_texts:
                try:
                    ratings.append(int(t))
                except ValueError:
                    pass
            if ratings:
                stat_item.rating_average = round(sum(ratings) / len(ratings), 2)

        elif q.type == "number":
            numbers = []
            for t in answer_texts:
                try:
                    numbers.append(float(t))
                except ValueError:
                    pass
            if numbers:
                stat_item.number_average = round(sum(numbers) / len(numbers), 2)

        elif q.type in ["short_text", "long_text", "email"]:
            stat_item.recent_answers = answer_texts[-10:]  # last 10 text responses

        question_stats.append(stat_item)

    return FormStatsResponse(
        form_id=form.id,
        total_responses=total_responses,
        question_stats=question_stats
    )
